import { useEffect, useState } from 'react'
import { Eye, ShoppingCart } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Pagination } from '@/components/Pagination'
import { useOrderStore } from '@/stores/useOrderStore'

const ITEMS_PER_PAGE = 10

interface OrdersListProps {
  title: string
  statusFilter?: string | string[]
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-blue-50 text-blue-700',
    assigned: 'bg-indigo-50 text-indigo-700',
    processing: 'bg-purple-50 text-purple-700',
    shipped: 'bg-cyan-50 text-cyan-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
  }
  return map[status] || 'bg-slate-100 text-slate-700'
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function OrdersList({ title, statusFilter }: OrdersListProps) {
  const { orders, users, loading, fetchOrders, fetchUsers, getUserById } = useOrderStore()
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchOrders()
    if (users.length === 0) fetchUsers()
  }, [fetchOrders, fetchUsers, users.length])

  const filtered = statusFilter
    ? orders.filter((o) =>
        Array.isArray(statusFilter)
          ? statusFilter.includes(o.status)
          : o.status === statusFilter
      )
    : orders

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginatedOrders = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
 console.log(orders)
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
            <p className="text-sm text-slate-500">{filtered.length} orders</p>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">#No</th>
                    <th className="px-5 py-3 font-medium">Order No</th>
                    <th className="px-5 py-3 font-medium">Retailer</th>
                    <th className="px-5 py-3 font-medium">Distributor</th>
                    <th className="px-5 py-3 font-medium">Total Amount</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-8 text-center text-slate-500">Loading orders...</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <ShoppingCart size={40} className="mb-2" />
                          <p className="text-sm">No orders found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedOrders.map((order, index) => {
                      const retailer = getUserById(order.user_id)
                      const distributor = getUserById(order.distributor_id)
                      return (
                        <tr key={order.id} className="transition-colors hover:bg-slate-50/50">
                          <td className="px-5 py-3 text-slate-500">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                          <td className="px-5 py-3 font-medium text-slate-800">{order.order_number}</td>
                          <td className="px-5 py-3 text-slate-600">{retailer?.name || `User #${order.user_id}`}</td>
                          <td className="px-5 py-3 text-slate-600">{distributor?.name || `User #${order.distributor_id}`}</td>
                          <td className="px-5 py-3 font-medium text-slate-800">Rs {Number(order.total_amount).toLocaleString('en-PK')}</td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusBadge(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-slate-500">{formatDate(order.order_date)}</td>
                          <td className="px-5 py-3 text-right">
                            <a
                              href={`/admin/orders/${order.id}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100"
                            >
                              <Eye size={14} />
                            </a>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filtered.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
