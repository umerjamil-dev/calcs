import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast'

interface AuthState {
  email: string
  password: string
  errors: { email?: string; password?: string }
  isSubmitting: boolean
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  validate: () => boolean
  login: () => Promise<void>
  reset: () => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
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
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.email = 'Invalid email address'; toast.error('Invalid email address') }

    if (!password) { errors.password = 'Password is required'; toast.error('Password is required') }
    else if (password.length < 6) { errors.password = 'Password must be at least 6 characters'; toast.error('Password must be at least 6 characters') }

    set({ errors })
    return Object.keys(errors).length === 0
  },

  login: async () => {
    if (!get().validate()) return

    set({ isSubmitting: true })
    try {
      const { email, password } = get()
      const res = await axios.post('/api/auth/login', { email, password })
      toast.success('Login successful!')
      return res.data
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      toast.error(msg)
    } finally {
      set({ isSubmitting: false })
    }
  },

  reset: () => set({ email: '', password: '', errors: {}, isSubmitting: false }),
}))
