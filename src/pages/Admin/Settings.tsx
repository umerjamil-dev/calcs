import { useEffect, useState } from 'react'
import { User, Mail, Phone, Building2, MapPin, Shield, Lock, Eye, EyeOff } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Button } from '@/components/ui/button'

const AdminSettings = () => {
  const { user, loading, changingPassword, fetchProfile, changePassword } = useSettingsStore()
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) return
    const success = await changePassword({ current_password: currentPassword, password: newPassword, password_confirmation: confirmPassword })
    if (success) {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordForm(false)
    }
  }

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
            <>
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
                  <ProfileItem icon={<Building2 size={16} />} label="Company Name" value={user.company_name || 'Company'} />
                  <ProfileItem icon={<Shield size={16} />} label="Role" value={user.roles === 1 ? 'Admin' : 'User'} />
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

            {/* Change Password */}
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                <h2 className="text-base font-semibold text-slate-800">Change Password</h2>
                <p className="text-xs text-slate-500">Update your account password</p>
              </div>
              <div className="p-6">
                {!showPasswordForm ? (
                  <Button onClick={() => setShowPasswordForm(true)} className="h-12 cursor-pointer rounded-lg bg-primary-main text-sm font-medium text-white hover:bg-primary-main/90">
                    <Lock size={14} className="mr-2" />
                    Change Password
                  </Button>
                ) : (
                  <div className="space-y-4  grid grid-cols-3 gap-6 ">
                    <div className=''>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrent ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          autoComplete="current-password"
                          className="h-12 w-full rounded-lg border border-slate-200 px-3 pr-9 text-sm text-slate-800 outline-none focus:border-primary-main"
                          placeholder="Enter current password"
                        />
                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">New Password</label>
                      <div className="relative">
                        <input
                          type={showNew ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          autoComplete="new-password"
                          className="h-12 w-full rounded-lg border border-slate-200 px-3 pr-9 text-sm text-slate-800 outline-none focus:border-primary-main"
                          placeholder="Enter new password"
                        />
                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-600">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        className="h-12 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleChangePassword} disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword} className="h-8 cursor-pointer rounded-lg bg-primary-main text-xs font-medium text-white hover:bg-primary-main/90 disabled:opacity-60">
                        {changingPassword ? 'Updating...' : 'Update Password'}
                      </Button>
                      <Button onClick={() => { setShowPasswordForm(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword('') }} className="h-8 cursor-pointer rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50">
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </>
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
