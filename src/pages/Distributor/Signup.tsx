import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { logo } from '@/assets'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

// ── Zustand Store ──
interface DistributorSignupState {
  name: string
  number: string
  email: string
  address: string
  companyName: string
  password: string
  nic: string
  errors: Record<string, string>
  isSubmitting: boolean
  setField: (id: string, value: string) => void
  validate: () => boolean
  signup: () => Promise<void>
}

const useDistributorSignupStore = create<DistributorSignupState>()((set, get) => ({
  name: '',
  number: '',
  email: '',
  address: '',
  companyName: '',
  password: '',
  nic: '',
  errors: {},
  isSubmitting: false,
  setField: (id, value) => set({ [id]: value, errors: { ...get().errors, [id]: undefined } } as any),
  validate: () => {
    const { name, number, email, address, companyName, password, nic } = get()
    const errors: Record<string, string> = {}
    if (!name.trim()) { errors.name = 'Name is required'; toast.error('Name is required') }
    if (!number.trim()) { errors.number = 'Phone number is required'; toast.error('Phone number is required') }
    else if (!/^0\d{10}$/.test(number.replace(/-/g, ''))) { errors.number = 'Invalid phone'; toast.error('Invalid phone number') }
    if (!email) { errors.email = 'Email is required'; toast.error('Email is required') }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.email = 'Invalid email'; toast.error('Invalid email address') }
    if (!address.trim()) { errors.address = 'Address is required'; toast.error('Address is required') }
    if (!companyName.trim()) { errors.companyName = 'Company name is required'; toast.error('Company name is required') }
    if (!password) { errors.password = 'Password is required'; toast.error('Password is required') }
    else if (password.length < 6) { errors.password = 'Min 6 characters'; toast.error('Password must be at least 6 characters') }
    if (!nic.trim()) { errors.nic = 'NIC is required'; toast.error('NIC is required') }
    else if (!/^\d{5}-\d{7}-\d$/.test(nic)) { errors.nic = 'Invalid NIC'; toast.error('Invalid NIC format (XXXXX-XXXXXXX-X)') }
    set({ errors })
    return Object.keys(errors).length === 0
  },
  signup: async () => {
    if (!get().validate()) return
    set({ isSubmitting: true })
    try {
      const { name, number, email, address, companyName, password, nic } = get()
      await axios.post('/api/distributor/register', { name, number, email, address, companyName, password, nic })
      toast.success('Distributor account created!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Distributor registration failed')
    } finally {
      set({ isSubmitting: false })
    }
  },
}))

// ── Page Component ──
const DistributorSignup = () => {
  const { name, number, email, address, companyName, password, nic, errors, isSubmitting, setField, signup } = useDistributorSignupStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signup()
  }

  const fields = [
    { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', value: name },
    { id: 'number', label: 'Phone Number', type: 'tel', placeholder: '03XX-XXXXXXX', value: number },
    { id: 'email', label: 'Email', type: 'email', placeholder: 'distributor@mal.com.pk', value: email },
    { id: 'companyName', label: 'Company / Shop Name', type: 'text', placeholder: 'Mal Distributors', value: companyName },
    { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', value: password },
    { id: 'nic', label: 'NIC (CNIC)', type: 'text', placeholder: 'XXXXX-XXXXXXX-X', value: nic },
  ]

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary-main p-12 lg:flex">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/5" />
        <div className="relative z-10">
          <img src={logo} alt="Mal Pakistan" className="h-14 object-contain brightness-0 invert" />
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold leading-tight text-white">
            Distributor Portal<br />Mal Pakistan
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-white/70">
            Place orders, track deliveries, and manage your fuel distribution operations across Pakistan.
          </p>
          <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6 text-center">
            <div>
              <p className="text-2xl font-bold text-white">50+</p>
              <p className="text-xs text-white/60">Distributors</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">30</p>
              <p className="text-xs text-white/60">Days Credit</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-xs text-white/60">Support</p>
            </div>
          </div>
        </div>
        <p className="relative z-10 text-xs text-white/40">© 2026 Mal Pakistan. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <div className={cn('flex w-full max-w-xl flex-col gap-6')}>
          <Card className="border-none shadow-xl shadow-black/5 ring-1 ring-border/60">
            <CardHeader className="space-y-2">
              <div className="mx-auto flex items-center justify-start">
                <img src={logo} alt="Mal Pakistan" className="h-12 object-contain" />
              </div>
              <h1 className="text-center text-xl font-semibold text-foreground">Distributor Sign Up</h1>
              <p className="text-center text-sm text-muted-foreground">Register your distribution business</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} noValidate>
                <FieldGroup>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {fields.map(({ id, label, type, placeholder, value }) => (
                      <Field key={id}>
                        <FieldLabel htmlFor={id}>{label}</FieldLabel>
                        <Input
                          id={id}
                          type={type}
                          placeholder={placeholder}
                          value={value}
                          onChange={(e) => setField(id, e.target.value)}
                          className={`h-11 rounded-lg ${errors[id] ? 'ring-2 ring-secondary-main/50' : ''}`}
                        />
                      </Field>
                    ))}
                  </div>
                  <Field>
                    <FieldLabel htmlFor="address">Address</FieldLabel>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Shop #5, Main Boulevard, Lahore"
                      value={address}
                      onChange={(e) => setField('address', e.target.value)}
                      className={`h-11 rounded-lg ${errors.address ? 'ring-2 ring-secondary-main/50' : ''}`}
                    />
                  </Field>
                  <Field className="gap-3">
                    <Button type="submit" disabled={isSubmitting} className="h-11 w-full cursor-pointer rounded-lg bg-primary-main font-medium text-white hover:bg-primary-main/90 disabled:opacity-60">
                      {isSubmitting ? 'Creating...' : 'Create Account'}
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      Already have an account?
                      <a href="/distributor/login" className="font-semibold text-secondary-main hover:underline">Sign in</a>
                    </div>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          Are you a
          <a href="/login" className="font-semibold text-primary-main underline-offset-4 hover:underline">Retailer</a>
          or
          <a href="/admin/login" className="font-semibold text-primary-main underline-offset-4 hover:underline">Admin</a>
          ?
        </div>
      </div>
    </div>
  )
}

export default DistributorSignup
