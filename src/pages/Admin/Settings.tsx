import { useEffect } from 'react'
import { User, Mail, Phone, Building2, MapPin, Shield } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { useSettingsStore } from '@/stores/useSettingsStore'

const AdminSettings = () => {
  const { user, loading, fetchProfile } = useSettingsStore()

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">Settings</h1>
          </div>
        </header>

        <main className="mx-auto max-w-8xl px-6 py-6">
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-primary-main" />
              <p className="text-sm text-slate-500">Loading profile...</p>
            </div>
          ) : !user ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-500">Profile not found</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                <h2 className="text-base font-semibold text-slate-800">Profile Information</h2>
                <p className="text-xs text-slate-500">Your account details</p>
              </div>

              <div className="p-6">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-main/10 text-primary-main">
                    <User size={28} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ProfileItem icon={<Mail size={16} />} label="Email" value={user.email} />
                  <ProfileItem icon={<Phone size={16} />} label="Phone Number" value={user.number} />
                  <ProfileItem icon={<Building2 size={16} />} label="Company Name" value={user.company_name || '-'} />
                  <ProfileItem icon={<Shield size={16} />} label="Role" value={user.role_id === 1 ? 'Admin' : `Role ${user.role_id}`} />
                </div>

                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <div className="mb-1 flex items-center gap-2 text-slate-500">
                    <MapPin size={16} />
                    <span className="text-xs font-medium">Address</span>
                  </div>
                  <p className="text-sm text-slate-800">{user.address || '-'}</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

const ProfileItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-lg border border-slate-100 p-4">
    <div className="mb-1 flex items-center gap-2 text-slate-500">
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </div>
    <p className="text-sm font-semibold text-slate-800">{value}</p>
  </div>
)

export default AdminSettings
