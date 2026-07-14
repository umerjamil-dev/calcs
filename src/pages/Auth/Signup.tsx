import { SignupForm } from '@/components/signup-form'
import { logo } from '@/assets'

const Signup = () => {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary-main p-12 lg:flex">
        {/* Decorative circles */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute right-10 bottom-20 h-40 w-40 rounded-full bg-secondary-main/10" />

        {/* Logo */}
        <div className="relative z-10">
          <img src={logo} alt="Mal Pakistan" className="h-14 object-contain brightness-0 invert" />
        </div>

        {/* Tagline */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold leading-tight text-white">
            Join Pakistan's<br />leading fuel<br />distribution network
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-white/70">
            Register your forecourt or company to start placing orders, track deliveries
            in real-time, and manage your commercial settlements digitally.
          </p>
          <ul className="space-y-3 pt-2">
            {[
              'Direct order placement',
              '30-day credit facility',
              'Real-time delivery tracking',
              'Digital proof of delivery',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                  <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-white/40">
          © 2026 Mal Pakistan. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <SignupForm className="w-full max-w-2xl" />
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          Are you a
          <a href="/distributor/signup" className="font-semibold text-primary-main underline-offset-4 hover:underline">
            Distributor
          </a>
          or
          <a href="/admin/login" className="font-semibold text-primary-main underline-offset-4 hover:underline">
            Admin
          </a>
          ?
        </div>
      </div>
    </div>
  )
}

export default Signup
