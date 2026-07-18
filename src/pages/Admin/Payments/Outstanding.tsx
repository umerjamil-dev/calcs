import { useEffect, useState } from 'react'
import { Wallet } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Pagination } from '@/components/Pagination'
import { usePaymentStore } from '@/stores/usePaymentStore'

const ITEMS_PER_PAGE = 10

const AdminOutstandingBalance = () => {
  const { balances, loading, fetchBalances } = usePaymentStore()
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchBalances()
  }, [fetchBalances])

  const totalPages = Math.ceil(balances.length / ITEMS_PER_PAGE)
  const paginatedBalances = balances.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">Outstanding Balances</h1>
            <p className="text-sm text-slate-500">{balances.length} records</p>
          </div>
        </header>

        <main className="mx-auto max-w-8xl px-6 py-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">#No</th>
                    <th className="px-5 py-3 font-medium">Retailer</th>
                    <th className="px-5 py-3 font-medium">Distributor</th>
                    <th className="px-5 py-3 font-medium">Total Orders</th>
                    <th className="px-5 py-3 font-medium">Total Amount</th>
                    <th className="px-5 py-3 font-medium">Total Payments</th>
                    <th className="px-5 py-3 font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-500">Loading balances...</td>
                    </tr>
                  ) : balances.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Wallet size={40} className="mb-2" />
                          <p className="text-sm">No outstanding balances</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedBalances.map((b, index) => (
                      <tr key={`${b.user_id}-${b.distributor_id}`} className="transition-colors hover:bg-slate-50/50">
                        <td className="px-5 py-3 text-slate-500">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                        <td className="px-5 py-3 font-medium text-slate-800">{b.user?.name || `User #${b.user_id}`}</td>
                        <td className="px-5 py-3 text-slate-600">{b.distributor?.name || `User #${b.distributor_id}`}</td>
                        <td className="px-5 py-3 text-slate-600">{b.total_orders}</td>
                        <td className="px-5 py-3 text-slate-600">Rs {Number(b.total_amount).toLocaleString('en-PK')}</td>
                        <td className="px-5 py-3 text-slate-600">Rs {Number(b.total_payments).toLocaleString('en-PK')}</td>
                        <td className="px-5 py-3">
                          <span className={`font-medium ${b.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            Rs {Number(b.balance).toLocaleString('en-PK')}
                          </span>
                        </td>
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
