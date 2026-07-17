import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { useNotificationStore } from '@/stores/useNotificationStore'

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const AdminNotificationDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { notifications, fetchNotifications } = useNotificationStore()

  useEffect(() => {
    if (notifications.length === 0) fetchNotifications()
  }, [fetchNotifications, notifications.length])

  const notification = notifications.find((n) => n.id === Number(id))

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center gap-3">
            <button
              onClick={() => navigate('/admin/notifications')}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-lg font-semibold text-slate-800">Complaint Detail</h1>
          </div>
        </header>

        <main className="mx-auto  px-6 py-6">
          {!notification ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-500">Complaint not found</p>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
                <Bell size={16} className="text-slate-500" />
                <h2 className="text-sm font-semibold text-slate-800">Complaint #{notification.id}</h2>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Distributor</p>
                    <p className="text-sm font-medium text-slate-800">{notification.distributor_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Status</p>
                    <p className="text-sm font-medium text-slate-800 capitalize">{notification.status}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-slate-500">Description</p>
                    <p className="text-sm text-slate-800">{notification.description}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-medium text-slate-500">Address</p>
                    <p className="text-sm text-slate-800">{notification.address}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Created</p>
                    <p className="text-sm text-slate-800">{formatDate(notification.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">Updated</p>
                    <p className="text-sm text-slate-800">{formatDate(notification.updated_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminNotificationDetail
