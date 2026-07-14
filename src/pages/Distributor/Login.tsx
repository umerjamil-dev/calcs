import { useDistributorAuthStore } from '@/stores/useDistributorAuthStore'
import { cn } from '@/lib/utils'
import { logo } from '@/assets'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

// ── Page Component ──
const DistributorLogin = () => {
  const { email, password, errors, isSubmitting, setEmail, setPassword, login } = useDistributorAuthStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login()
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary-main p-12 lg:flex">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-main via-primary-main to-primary-700" />

        {/* Decorative shapes */}
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute right-12 top-1/3 h-32 w-32 rounded-full bg-secondary-main/15 blur-2xl" />
        <div className="absolute left-1/4 bottom-1/4 h-24 w-24 rounded-2xl rotate-12 bg-white/5" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <img src={logo} alt="Mal Pakistan" className="h-14 object-contain brightness-0 invert" />
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/80">Distributor Portal</span>
        </div>

        {/* Tagline + Features */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight text-white">
              Distributor Portal<br />Mal Pakistan
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              Place orders, track deliveries, and manage your fuel distribution operations across Pakistan.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-3">
            {[
              'Bulk order management',
              '30-day credit facility',
              'Real-time delivery tracking',
              'Digital proof of delivery',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* Stats card */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-xs text-white/50">Distributors</p>
              </div>
              <div className="border-l border-white/15 text-center">
                <p className="text-2xl font-bold text-white">30</p>
                <p className="text-xs text-white/50">Days Credit</p>
              </div>
              <div className="border-l border-white/15 text-center">
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-xs text-white/50">Support</p>
              </div>
            </div>
          </div>
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
              <h1 className="text-center text-xl font-semibold text-foreground">Distributor Login</h1>
              <p className="text-center text-sm text-muted-foreground">Sign in to your distributor account</p>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} noValidate>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input id="email" type="email" placeholder="distributor@mal.com.pk" value={email} onChange={(e) => setEmail(e.target.value)} className={`h-11 rounded-lg ${errors.email ? 'ring-2 ring-secondary-main/50' : ''}`} />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={`h-11 rounded-lg ${errors.password ? 'ring-2 ring-secondary-main/50' : ''}`} />
                  </Field>
                  <Field className="gap-3">
                    <Button type="submit" disabled={isSubmitting} className="h-11 w-full cursor-pointer rounded-lg bg-primary-main font-medium text-white hover:bg-primary-main/90 disabled:opacity-60">
                      {isSubmitting ? 'Signing in...' : 'Login as Distributor'}
                    </Button>
                    <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/70" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">
                      or
                    </span>
                  </div>
                </div>

              

                <FieldDescription className=" text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/distributor/signup"
                    className="font-medium text-secondary-main underline-offset-4 transition-colors hover:text-secondary-main/80 hover:underline"
                  >
                    Register now
                  </a>
                </FieldDescription>
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

export default DistributorLogin
