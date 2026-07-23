import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDistributorStore } from '@/stores/useDistributorStore'

const Field = ({ label, id, type = 'text', value, onChange, placeholder, error, mask }: {
  label: string
  id: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  error?: string
  mask?: boolean
}) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`h-10 rounded-lg border-slate-200 ${error ? 'ring-2 ring-red-200' : ''} ${mask ? '[-webkit-text-security:disc]' : ''}`}
    />
    {error && <p className="text-xs text-red-600">{error}</p>}
  </div>
)

const AdminAddDistributor = () => {
  const navigate = useNavigate()
  const store = useDistributorStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await store.addDistributor()
    if (success) {
      navigate('/admin/distributors')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-[1620px] items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/admin/distributors" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100">
                <ArrowLeft size={16} />
              </a>
              <h1 className="text-lg font-semibold text-slate-800">Add Distributor</h1>
            </div>
            <Button
              type="submit"
              form="distributor-form"
              disabled={store.adding}
              className="h-9 cursor-pointer gap-2 rounded-lg bg-primary-main px-4 text-sm font-medium text-white hover:bg-primary-main/90 disabled:opacity-60"
            >
              <Save size={16} />
              {store.adding ? 'Saving...' : 'Save Distributor'}
            </Button>
          </div>
        </header>

        <main className="mx-auto px-6 py-6">
          <form id="distributor-form" onSubmit={handleSubmit} noValidate>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-base font-semibold text-slate-800">Distributor Information</h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                <Field label="Full Name *" id="name" value={store.name} onChange={(v) => store.setField('name', v)} placeholder="Ali" error={store.errors.name} />
                <Field label="Phone Number *" id="number" value={store.number} onChange={(v) => store.setField('number', v)} placeholder="03001231512" error={store.errors.number} />
                <Field label="Email *" id="email" value={store.email} onChange={(v) => store.setField('email', v)} placeholder="ati2222@test.com" error={store.errors.email} />
                <Field label="Company Name *" id="companyName" value={store.companyName} onChange={(v) => store.setField('companyName', v)} placeholder="Ali Petroleum" error={store.errors.companyName} />
                <Field label="NIC (CNIC) *" id="nic" value={store.nic} onChange={(v) => store.setField('nic', v)} placeholder="4210112345671" error={store.errors.nic} />
                <Field label="Password *" id="password" value={store.password} onChange={(v) => store.setField('password', v)} placeholder="••••••" error={store.errors.password} mask />
                <Field label="Confirm Password *" id="passwordConfirmation" value={store.passwordConfirmation} onChange={(v) => store.setField('passwordConfirmation', v)} placeholder="••••••" error={store.errors.passwordConfirmation} mask />
              </div>

              <div className="mt-5 space-y-1.5">
                <label htmlFor="address" className="text-sm font-medium text-slate-700">Address *</label>
                <textarea
                  id="address"
                  value={store.address}
                  onChange={(e) => store.setField('address', e.target.value)}
                  placeholder="Karachi"
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-primary-main focus:ring-2 focus:ring-primary-main/20"
                />
                {store.errors.address && <p className="text-xs text-red-600">{store.errors.address}</p>}
              </div>

              <input type="hidden" name="role_id" value="2" />
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default AdminAddDistributor
