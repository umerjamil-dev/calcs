import { useAuthStore } from '@/stores'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { logo } from '@/assets'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    email,
    password,
    errors,
    isSubmitting,
    setEmail,
    setPassword,
    login,
  } = useAuthStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login()
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        className
      )}
      {...props}
    >
      <Card className="border-none shadow-xl shadow-black/5 ring-1 ring-border/60 backdrop-blur-sm">
        <CardHeader className="space-y-2">
         <div className="mx-auto flex items-center justify-start">
            <img src={logo} alt="Mal Pakistan" className="h-12 object-contain" />
          </div>
          <h1 className="text-center text-xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className={`h-11 rounded-lg transition-shadow focus-visible:ring-2 focus-visible:ring-primary/30 ${
                    errors.email ? "ring-2 ring-secondary/50" : ""
                  }`}
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-xs font-medium text-primary/80 underline-offset-4 transition-colors hover:text-primary hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className={`h-11 rounded-lg transition-shadow focus-visible:ring-2 focus-visible:ring-primary/30 ${
                    errors.password ? "ring-2 ring-secondary/50" : ""
                  }`}
                />
              </Field>

              <Field className="gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full cursor-pointer rounded-lg bg-primary-main font-medium text-white shadow-sm transition-all hover:bg-primary-main/90 active:scale-[0.98] disabled:opacity-60"
                >
                  {isSubmitting ? "Signing in..." : "Login"}
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
                    href="/signup"
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
  )
}