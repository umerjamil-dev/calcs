import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast'

interface SignupState {
  name: string
  number: string
  email: string
  address: string
  companyName: string
  password: string
  nic: string
  errors: Record<string, string | undefined>
  isSubmitting: boolean
  setField: (field: string, value: string) => void
  validate: () => boolean
  signup: () => Promise<void>
}

export const useSignupStore = create<SignupState>()((set, get) => ({
  name: '',
  number: '',
  email: '',
  address: '',
  companyName: '',
  password: '',
  nic: '',
  errors: {} as Record<string, string | undefined>,
  isSubmitting: false,

  setField: (field, value) =>
    set({ [field]: value, errors: { ...get().errors, [field]: undefined } }),

  validate: () => {
    const { name, number, email, address, companyName, password, nic } = get()
    const errors: Record<string, string | undefined> = {}

    if (!name.trim()) { errors.name = 'Name is required'; toast.error('Name is required') }
    if (!number.trim()) { errors.number = 'Phone number is required'; toast.error('Phone number is required') }
    else if (!/^[\d\+\-\(\)\s]{7,15}$/.test(number)) { errors.number = 'Invalid phone number'; toast.error('Invalid phone number') }
    if (!email.trim()) { errors.email = 'Email is required'; toast.error('Email is required') }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.email = 'Invalid email address'; toast.error('Invalid email address') }
    if (!address.trim()) { errors.address = 'Address is required'; toast.error('Address is required') }
    if (!companyName.trim()) { errors.companyName = 'Company / Shop name is required'; toast.error('Company / Shop name is required') }
    if (!password) { errors.password = 'Password is required'; toast.error('Password is required') }
    else if (password.length < 6) { errors.password = 'Password must be at least 6 characters'; toast.error('Password must be at least 6 characters') }
    if (!nic.trim()) { errors.nic = 'NIC is required'; toast.error('NIC is required') }
    else if (!/^\d{13}$/.test(nic.replace(/-/g, ''))) { errors.nic = 'NIC must be 13 digits'; toast.error('NIC must be 13 digits') }

    set({ errors })
    return Object.keys(errors).length === 0
  },

  signup: async () => {
    if (!get().validate()) return
    set({ isSubmitting: true })
    try {
      const { name, number, email, address, companyName, password, nic } = get()
      const res = await axios.post('/api/auth/register', {
        name, number, email, address, companyName, password, nic,
      })
      toast.success('Registration successful!')
      return res.data
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(msg)
    } finally {
      set({ isSubmitting: false })
    }
  },
}))
