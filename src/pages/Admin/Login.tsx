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
interface AdminAuthState {
  email: string
  password: string
  errors: { email?: string; password?: string }
  isSubmitting: boolean
  setEmail: (v: string) => void
  setPassword: (v: string) => void
  validate: () => boolean
  login: () => Promise<void>
}

const useAdminAuthStore = create<AdminAuthState>()((set, get) => ({
  email: '',
  password: '',
  errors: {},
  isSubmitting: false,
  setEmail: (email) => set({ email, errors: { ...get().errors, email: undefined } }),
  setPassword: (password) => set({ password, errors: { ...get().errors, password: undefined } }),
  validate: () => {
    const { email, password } = get()
    const errors: { email?: string; password?: string } = {}
    if (!email) { errors.email = 'Email is required'; toast.error('Email is required') }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.email = 'Invalid email'; toast.error('Invalid email address') }
    if (!password) { errors.password = 'Password is required'; toast.error('Password is required') }
    else if (password.length < 6) { errors.password = 'Min 6 characters'; toast.error('Password must be at least 6 characters') }
    set({ errors })
    return Object.keys(errors).length === 0
  },
  login: async () => {
    if (!get().validate()) return
    set({ isSubmitting: true })
    try {
      const { email, password } = get()
      await axios.post('/api/admin/login', { email, password })
      toast.success('Admin login successful!')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Admin login failed')
    } finally {
      set({ isSubmitting: false })
    }
  },
}))

// ── Page Component ──
const AdminLogin = () => {
  const { email, password, errors, isSubmitting, setEmail, setPassword, login } = useAdminAuthStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login()
  }

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
            Admin Portal<br />Mal Pakistan
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-white/70">
            Manage distributors, verify deliveries, and oversee all commercial operations from a single dashboard.
          </p>
        </div>
        <p className="relative z-10 text-xs text-white/40">© 2026 Mal Pakistan. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <div className={cn('flex w-full max-w-sm flex-col gap-6')}>
          <Card className="border-none shadow-xl shadow-black/5 ring-1 ring-border/60">
            <CardHeader className="space-y-2">
              <div className="mx-auto flex items-center justify-start">
                <img src={logo} alt="Mal Pakistan" className="h-12 object-contain" />
              </div>
              <h1 className="text-center text-xl font-semibold text-foreground">Admin Login</h1>
              <p className="text-center text-sm text-muted-foreground">Sign in to the admin panel</p>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} noValidate>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" placeholder="admin@mal.com.pk" value={email} onChange={(e) => setEmail(e.target.value)} className={`h-11 rounded-lg ${errors.email ? 'ring-2 ring-primary-main/50' : ''}`} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={`h-11 rounded-lg ${errors.password ? 'ring-2 ring-primary-main/50' : ''}`} />
                  </Field>
                  <Field className="gap-3">
                    <Button type="submit" disabled={isSubmitting} className="h-11 w-full cursor-pointer rounded-lg bg-primary-main font-medium text-white hover:bg-primary-main/90 disabled:opacity-60">
                      {isSubmitting ? 'Signing in...' : 'Login as Admin'}
                    </Button>
                    
                    
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
          <a href="/distributor/login" className="font-semibold text-primary-main underline-offset-4 hover:underline">Distributor</a>
          ?
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
