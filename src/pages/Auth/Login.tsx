import { LoginForm } from "../../components/login-form"
import { logo } from "@/assets"

const Login = () => {
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
            Pakistan's trusted<br />fuel distribution<br />network
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-white/70">
            Streamlined order placement, real-time delivery tracking, and seamless
            commercial settlement — all in one platform.
          </p>
          <div className="flex gap-6 pt-4">
            <div>
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-xs text-white/60">Forecourts</p>
            </div>
            <div className="border-l border-white/20 pl-6">
              <p className="text-2xl font-bold text-white">50+</p>
              <p className="text-xs text-white/60">Distributors</p>
            </div>
            <div className="border-l border-white/20 pl-6">
              <p className="text-2xl font-bold text-white">30</p>
              <p className="text-xs text-white/60">Days Credit</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/40">
          © 2026 Mal Pakistan. All rights reserved.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <LoginForm className="w-full max-w-sm" />
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          Are you a
          <a href="/distributor/login" className="font-semibold text-primary-main underline-offset-4 hover:underline">
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

export default Login
