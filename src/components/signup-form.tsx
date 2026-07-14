import { useSignupStore } from '@/stores'
import { cn } from '@/lib/utils'
import { logo } from '@/assets'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const {
    name, number, email, address, companyName, password, nic,
    errors, isSubmitting, setField, signup,
  } = useSignupStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signup()
  }

  const fields = [
    { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', value: name },
    { id: 'number', label: 'Phone Number', type: 'tel', placeholder: '03XX-XXXXXXX', value: number },
    { id: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', value: email },
    { id: 'companyName', label: 'Company / Shop Name', type: 'text', placeholder: 'Mal Traders', value: companyName },
    { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••', value: password },
    { id: 'nic', label: 'NIC (CNIC)', type: 'text', placeholder: 'XXXXX-XXXXXXX-X', value: nic },
  ]

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="border-none shadow-xl shadow-black/5 ring-1 ring-border/60 backdrop-blur-sm">
        <CardHeader className="space-y-3">
          <div className="mx-auto flex items-center justify-start">
            <img src={logo} alt="Mal Pakistan" className="h-12 object-contain" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
             Retalier Create Your Account
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Register your company to get started
            </p>
          </div>
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
                      className={`h-11 rounded-lg transition-shadow focus-visible:ring-2 focus-visible:ring-primary/30 ${
                        errors[id] ? 'ring-2 ring-secondary/50' : ''
                      }`}
                    />
                  </Field>
                ))}
              </div>

              {/* Address — full width below grid */}
              <Field>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Input
                  id="address"
                  type="text"
                  placeholder="Shop #5, Main Boulevard, Lahore"
                  value={address}
                  onChange={(e) => setField('address', e.target.value)}
                  className={`h-11 rounded-lg transition-shadow focus-visible:ring-2 focus-visible:ring-primary/30 ${
                    errors.address ? 'ring-2 ring-secondary/50' : ''
                  }`}
                />
              </Field>

              <Field className="gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full cursor-pointer rounded-lg bg-primary-main font-medium text-white shadow-sm transition-all hover:bg-primary-main/90 active:scale-[0.98] disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </Button>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/70" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

               

                <FieldDescription className="pt-1 text-center text-sm">
                  Already have an account?{' '}
                  <a
                    href="/login"
                    className="font-medium text-secondary-main underline-offset-4 transition-colors hover:text-secondary-main/80 hover:underline"
                  >
                    Sign in
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
