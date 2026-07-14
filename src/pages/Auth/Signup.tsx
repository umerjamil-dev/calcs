import { SignupForm } from '@/components/signup-form'
import { logo } from '@/assets'

const Signup = () => {
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
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/80">Retailer Portal</span>
        </div>

        {/* Tagline + Features */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold leading-tight text-white">
              Join Pakistan's<br />leading fuel<br />distribution network
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              Register your forecourt or company to start placing orders, track deliveries
              in real-time, and manage your commercial settlements digitally.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-3">
            {[
              'Direct order placement',
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
                <p className="text-2xl font-bold text-white">500+</p>
                <p className="text-xs text-white/50">Forecourts</p>
              </div>
              <div className="border-l border-white/15 text-center">
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-xs text-white/50">Distributors</p>
              </div>
              <div className="border-l border-white/15 text-center">
                <p className="text-2xl font-bold text-white">30</p>
                <p className="text-xs text-white/50">Days Credit</p>
              </div>
            </div>
          </div>
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
