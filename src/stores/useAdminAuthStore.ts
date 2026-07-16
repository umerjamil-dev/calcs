import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast'

interface AdminAuthState {
  email: string
  password: string
  errors: { email?: string; password?: string }
  isSubmitting: boolean
  setEmail: (v: string) => void
  setPassword: (v: string) => void
  validate: () => boolean
  login: () => Promise<any>
}

export const useAdminAuthStore = create<AdminAuthState>()((set, get) => ({
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
      const res = await axios.post('https://realstatebackend.processiqtech.com/test/public/api/login', { email, password })
      toast.success('Admin login successful!')
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      return res.data
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Admin login failed')
    } finally {
      set({ isSubmitting: false })
    }
  },
}))
