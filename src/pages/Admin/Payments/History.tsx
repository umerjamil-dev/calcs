import { useEffect, useState } from 'react'
import { CreditCard } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Pagination } from '@/components/Pagination'
import { usePaymentStore } from '@/stores/usePaymentStore'

const ITEMS_PER_PAGE = 10

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
}

const AdminPaymentHistory = () => {
  const { payments, loading, fetchPayments } = usePaymentStore()
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE)
  const paginatedPayments = payments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">Payment History</h1>
            <p className="text-sm text-slate-500">{payments.length} payments</p>
          </div>
        </header>

        <main className="mx-auto max-w-8xl px-6 py-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">#No</th>
                    <th className="px-5 py-3 font-medium">Order</th>
                    <th className="px-5 py-3 font-medium">Retailer</th>
                    <th className="px-5 py-3 font-medium">Distributor</th>
                    <th className="px-5 py-3 font-medium">Amount</th>
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-8 text-center text-slate-500">Loading payments...</td>
                    </tr>
                  ) : payments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <CreditCard size={40} className="mb-2" />
                          <p className="text-sm">No payments found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedPayments.map((p, index) => (
                      <tr key={p.id} className="transition-colors hover:bg-slate-50/50">
                        <td className="px-5 py-3 text-slate-500">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                        <td className="px-5 py-3 font-medium text-slate-800">{p.order?.order_number || `Order #${p.order_id}`}</td>
                        <td className="px-5 py-3 text-slate-600">{p.user?.name || `User #${p.user_id}`}</td>
                        <td className="px-5 py-3 text-slate-600">{p.distributor?.name || `User #${p.distributor_id}`}</td>
                        <td className="px-5 py-3 font-medium text-slate-800">Rs {Number(p.amount).toLocaleString('en-PK')}</td>
                        <td className="px-5 py-3 text-slate-600 capitalize">{p.payment_type || '-'}</td>
                        <td className="px-5 py-3 text-slate-500">{formatDate(p.created_at)}</td>
                        <td className="px-5 py-3 text-slate-500">{p.remarks || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={payments.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminPaymentHistory
