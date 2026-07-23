import { useEffect, useState } from 'react'
import { Key, Users, Truck, RefreshCw } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { useRetailerStore } from '@/stores/useRetailerStore'
import { useDistributorStore } from '@/stores/useDistributorStore'
import { Button } from '@/components/ui/button'

type Tab = 'retailers' | 'distributors'

const AdminUserSettings = () => {
  const [activeTab, setActiveTab] = useState<Tab>('retailers')
  const { retailers, loading: loadingRetailers, fetchRetailers, resettingId: resettingRetailerId, resetPassword: resetRetailerPassword } = useRetailerStore()
  const { distributors, loading: loadingDistributors, fetchDistributors, resettingId: resettingDistributorId, resetPassword: resetDistributorPassword } = useDistributorStore()
  const [showResetForm, setShowResetForm] = useState<number | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    fetchRetailers()
    fetchDistributors()
  }, [fetchRetailers, fetchDistributors])

  const handleResetPassword = async (userId: number) => {
    if (!newPassword || !confirmPassword) return
    if (newPassword !== confirmPassword) return
    if (newPassword.length < 6) return

    const resetFn = activeTab === 'retailers' ? resetRetailerPassword : resetDistributorPassword
    const success = await resetFn(userId, newPassword, confirmPassword)
    if (success) {
      setShowResetForm(null)
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  const users = activeTab === 'retailers' ? retailers : distributors
  const loading = activeTab === 'retailers' ? loadingRetailers : loadingDistributors
  const resettingId = activeTab === 'retailers' ? resettingRetailerId : resettingDistributorId

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-[1620px] items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">User Settings</h1>
          </div>
        </header>

        <main className="mx-auto max-w-[1620px] px-6 py-6">
          {/* Tabs */}
          <div className="mb-6 flex gap-2 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('retailers')}
              className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'retailers'
                  ? 'border-primary-main text-primary-main'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Users size={16} />
              Retailers ({retailers.length})
            </button>
            <button
              onClick={() => setActiveTab('distributors')}
              className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'distributors'
                  ? 'border-primary-main text-primary-main'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Truck size={16} />
              Distributors ({distributors.length})
            </button>
          </div>

          {/* Users List */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {loading ? (
              <div className="p-12 text-center">
                <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-primary-main" />
                <p className="text-sm text-slate-500">Loading...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-sm text-slate-500">No {activeTab} found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">#</th>
                      <th className="px-5 py-3 font-medium">Name</th>
                      <th className="px-5 py-3 font-medium">Email</th>
                      <th className="px-5 py-3 font-medium">Phone</th>
                      <th className="px-5 py-3 font-medium">Company</th>
                      <th className="px-5 py-3 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((user, index) => (
                      <>
                        <tr key={user.id} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3 text-slate-500">{index + 1}</td>
                          <td className="px-5 py-3 font-medium text-slate-800">{user.name}</td>
                          <td className="px-5 py-3 text-slate-600">{user.email}</td>
                          <td className="px-5 py-3 text-slate-600">{user.number}</td>
                          <td className="px-5 py-3 text-slate-600">{user.company_name || '-'}</td>
                          <td className="px-5 py-3 text-right">
                            <Button
                              onClick={() => {
                                setShowResetForm(showResetForm === user.id ? null : user.id)
                                setNewPassword('')
                                setConfirmPassword('')
                              }}
                              className="h-8 cursor-pointer rounded-lg border border-primary-main/20 bg-primary-main/10 text-xs font-medium text-primary-main hover:bg-primary-main/20"
                            >
                              <Key size={12} className="mr-1" />
                              Reset Password
                            </Button>
                          </td>
                        </tr>
                        {showResetForm === user.id && (
                          <tr key={`reset-${user.id}`} className="bg-slate-50">
                            <td colSpan={6} className="px-5 py-4">
                              <div className="flex items-end gap-3">
                                <div className="flex-1">
                                  <label className="mb-1 block text-xs font-medium text-slate-600">New Password</label>
                                  <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    autoComplete="new-password"
                                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main"
                                    placeholder="Enter new password"
                                  />
                                </div>
                                <div className="flex-1">
                                  <label className="mb-1 block text-xs font-medium text-slate-600">Confirm Password</label>
                                  <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    autoComplete="new-password"
                                    className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main"
                                    placeholder="Confirm new password"
                                  />
                                </div>
                                <Button
                                  onClick={() => handleResetPassword(user.id)}
                                  disabled={resettingId === user.id || !newPassword || !confirmPassword}
                                  className="h-9 cursor-pointer rounded-lg bg-primary-main text-xs font-medium text-white hover:bg-primary-main/90 disabled:opacity-60"
                                >
                                  {resettingId === user.id ? (
                                    <RefreshCw size={12} className="animate-spin" />
                                  ) : (
                                    'Update'
                                  )}
                                </Button>
                                <Button
                                  onClick={() => {
                                    setShowResetForm(null)
                                    setNewPassword('')
                                    setConfirmPassword('')
                                  }}
                                  className="h-9 cursor-pointer rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminUserSettings
