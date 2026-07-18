import { useEffect, useState } from 'react'
import { Bell, Eye } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Pagination } from '@/components/Pagination'
import { useNotificationStore } from '@/stores/useNotificationStore'

const ITEMS_PER_PAGE = 10

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    resolved: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
  }
  return map[status] || 'bg-slate-100 text-slate-700'
}

const AdminNotifications = () => {
  const { notifications, loading, fetchNotifications } = useNotificationStore()
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])
  console.log(notifications)

  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE)
  const paginatedNotifications = notifications.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">Retailer Complaints</h1>
            <p className="text-sm text-slate-500">{notifications.length} complaints</p>
          </div>
        </header>

        <main className="mx-auto px-6 py-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">#No</th>
                    <th className="px-5 py-3 font-medium">Retailer</th>
                    <th className="px-5 py-3 font-medium">Distributor</th>
                    <th className="px-5 py-3 font-medium">Description</th>
                    <th className="px-5 py-3 font-medium">Address</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-slate-500">Loading...</td>
                    </tr>
                  ) : notifications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Bell size={40} className="mb-2" />
                          <p className="text-sm">No complaints</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedNotifications.map((n, index) => (
                      <tr key={n.id} className="transition-colors hover:bg-slate-50/50">
                        <td className="px-5 py-3 text-slate-500">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                        <td className="px-5 py-3 font-medium text-slate-800">{n.retailer_name}</td>
                        <td className="px-5 py-3 font-medium text-slate-800">{n.distributor_name}</td>
                        <td className="px-5 py-3 text-slate-600">{n.description}</td>
                        <td className="px-5 py-3 text-slate-600">{n.address}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusBadge(n.status)}`}>
                            {n.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-500">{formatDate(n.created_at)}</td>
                        <td className="px-5 py-3 text-right">
                          <a
                            href={`/admin/notifications/${n.id}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100"
                          >
                            <Eye size={14} />
                          </a>
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
              totalItems={notifications.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminNotifications
