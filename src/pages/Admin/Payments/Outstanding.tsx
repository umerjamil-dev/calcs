import { useEffect, useState } from 'react'
import { Wallet, ChevronDown, ChevronRight } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Pagination } from '@/components/Pagination'
import { usePaymentStore } from '@/stores/usePaymentStore'

const ITEMS_PER_PAGE = 10

const statusBadgeClasses = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-emerald-50 text-emerald-700'
    case 'accepted':
    case 'processing':
      return 'bg-blue-50 text-blue-700'
    case 'pending':
      return 'bg-amber-50 text-amber-700'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

const AdminOutstandingBalance = () => {
  const { balances, loading, fetchBalances } = usePaymentStore()
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedKeys, setExpandedKeys] = useState(new Set())

  useEffect(() => {
    fetchBalances()
  }, [fetchBalances])

  const totalPages = Math.ceil(balances.length / ITEMS_PER_PAGE)
  const paginatedBalances = balances.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-[1620px] items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">Outstanding Balances</h1>
            <p className="text-sm text-slate-500">{balances.length} records</p>
          </div>
        </header>

        <main className="mx-auto max-w-[1620px] px-6 py-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium w-10"></th>
                    <th className="px-5 py-3 font-medium">#No</th>
                    <th className="px-5 py-3 font-medium">Retailer</th>
                    <th className="px-5 py-3 font-medium">Distributor</th>
                    <th className="px-5 py-3 font-medium">Total Orders</th>
                    <th className="px-5 py-3 font-medium">Total Amount</th>
                    <th className="px-5 py-3 font-medium">Paid Amount</th>
                    <th className="px-5 py-3 font-medium">Remaining Amount</th>
                    <th className="px-5 py-3 font-medium">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="px-5 py-8 text-center text-slate-500">Loading balances...</td>
                    </tr>
                  ) : paginatedBalances.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Wallet size={40} className="mb-2" />
                          <p className="text-sm">No outstanding balances</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedBalances.map((b, index) => {
                      const key = `${b.user_id}-${b.distributor_id}`
                      const isExpanded = expandedKeys.has(key)

                      return (
                        <>
                          <tr
                            key={key}
                            className="cursor-pointer transition-colors hover:bg-slate-50/50"
                            onClick={() => toggleExpand(key)}
                          >
                            <td className="px-5 py-3 text-slate-400">
                              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </td>
                            <td className="px-5 py-3 text-slate-500">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                            <td className="px-5 py-3 font-medium text-slate-800">{b.user?.name || `User #${b.user_id}`}</td>
                            <td className="px-5 py-3 text-slate-600">{b.distributor?.name || `not assigned`}</td>
                            <td className="px-5 py-3 text-slate-600">{b.total_orders}</td>
                            <td className="px-5 py-3 text-slate-600">Rs {Number(b.total_amount).toLocaleString('en-PK')}</td>
                            <td className="px-5 py-3 text-slate-600">Rs {Number(b.total_payments).toLocaleString('en-PK')}</td>
                            <td className="px-5 py-3">
                              <span className={`font-medium ${b.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                Rs {Number(b.balance).toLocaleString('en-PK')}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-slate-500">{b.payment_status}</td>
                          </tr>

                          {isExpanded && (
                            <tr key={`${key}-detail`}>
                              <td colSpan={9} className="bg-slate-50/60 px-5 py-3">
                                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                                  <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 uppercase text-slate-400">
                                      <tr>
                                        <th className="px-4 py-2 font-medium">Order #</th>
                                        <th className="px-4 py-2 font-medium">Date</th>
                                        <th className="px-4 py-2 font-medium">Amount</th>
                                        <th className="px-4 py-2 font-medium">Paid</th>
                                        <th className="px-4 py-2 font-medium">Order Status</th>
                                        <th className="px-4 py-2 font-medium">Payment Status</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                      {b.orders.map((o) => (
                                        <tr key={o.id}>
                                          <td className="px-4 py-2 font-medium text-slate-700">{o.order_number}</td>
                                          <td className="px-4 py-2 text-slate-500">
                                            {new Date(o.order_date).toLocaleDateString('en-PK', {
                                              day: '2-digit',
                                              month: 'short',
                                              year: 'numeric',
                                            })}
                                          </td>
                                          <td className="px-4 py-2 text-slate-600">Rs {Number(o.total_amount).toLocaleString('en-PK')}</td>
                                          <td className="px-4 py-2 text-slate-600">Rs {Number(o.total_payments).toLocaleString('en-PK')}</td>
                                          <td className="px-4 py-2">
                                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusBadgeClasses(o.status)}`}>
                                              {o.status}
                                            </span>
                                          </td>
                                          <td className="px-4 py-2 text-slate-500">{o.payment_status}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
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
              totalItems={balances.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminOutstandingBalance