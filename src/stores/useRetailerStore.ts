import { create } from 'zustand'
import toast from 'react-hot-toast'
import api from '@/lib/axios'

export interface Retailer {
  id: number
  name: string
  number: string
  email: string
  address: string
  status: number
  company_name: string | null
  nic: string | null
  role_id: number
}

interface RetailerFormData {
  name: string
  number: string
  email: string
  address: string
  companyName: string
  nic: string
  password: string
  passwordConfirmation: string
}

interface RetailerState extends RetailerFormData {
  retailers: Retailer[]
  loading: boolean
  adding: boolean
  deletingId: number | null
  errors: Record<string, string | undefined>
  setField: (field: keyof RetailerFormData, value: string) => void
  fetchRetailers: () => Promise<void>
  addRetailer: () => Promise<boolean>
  deleteRetailer: (id: number) => Promise<void>
  resetForm: () => void
}

const initialForm: RetailerFormData = {
  name: '',
  number: '',
  email: '',
  address: '',
  companyName: '',
  nic: '',
  password: '',
  passwordConfirmation: '',
}

export const useRetailerStore = create<RetailerState>()((set, get) => ({
  ...initialForm,
  retailers: [],
  loading: false,
  adding: false,
  deletingId: null,
  errors: {},

  setField: (field, value) =>
    set({ [field]: value, errors: { ...get().errors, [field]: undefined } } as any),

  fetchRetailers: async () => {
    set({ loading: true })
    try {
      const res = await api.get('/users')
      const data = res.data.data || res.data.users || res.data
      const list = Array.isArray(data) ? data : []
      set({ retailers: list.filter((u: any) => u.role_id === 3) })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch retailers')
    } finally {
      set({ loading: false })
    }
  },

  addRetailer: async () => {
    const data = get()
    const errors: Record<string, string | undefined> = {}

    if (!data.name.trim()) { errors.name = 'Name is required'; toast.error('Name is required') }
    if (!data.number.trim()) { errors.number = 'Phone number is required'; toast.error('Phone number is required') }
    else if (!/^0\d{10}$/.test(data.number.replace(/-/g, ''))) { errors.number = 'Invalid phone number'; toast.error('Invalid phone number') }
    if (!data.email.trim()) { errors.email = 'Email is required'; toast.error('Email is required') }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { errors.email = 'Invalid email'; toast.error('Invalid email address') }
    if (!data.address.trim()) { errors.address = 'Address is required'; toast.error('Address is required') }
    if (!data.companyName.trim()) { errors.companyName = 'Company / Shop name is required'; toast.error('Company / Shop name is required') }
    if (!data.nic.trim()) { errors.nic = 'NIC is required'; toast.error('NIC is required') }
    else if (!/^\d{13}$/.test(data.nic.replace(/-/g, ''))) { errors.nic = 'NIC must be 13 digits'; toast.error('NIC must be 13 digits') }
    if (!data.password) { errors.password = 'Password is required'; toast.error('Password is required') }
    if (!data.passwordConfirmation) { errors.passwordConfirmation = 'Please confirm password'; toast.error('Please confirm password') }
    else if (data.password !== data.passwordConfirmation) { errors.passwordConfirmation = 'Passwords do not match'; toast.error('Passwords do not match') }

    set({ errors })
    if (Object.keys(errors).length > 0) return false

    set({ adding: true })
    try {
      await api.post('/register', {
        role_id: 3,
        name: data.name.trim(),
        number: data.number.trim(),
        email: data.email.trim(),
        address: data.address.trim(),
        company_name: data.companyName.trim(),
        nic: data.nic.trim(),
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      })
      toast.success('Retailer added successfully')
      set({ ...initialForm, errors: {} })
      return true
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add retailer')
      return false
    } finally {
      set({ adding: false })
    }
  },

  deleteRetailer: async (id) => {
    set({ deletingId: id })
    try {
      await api.delete(`/users/${id}`)
      toast.success('Retailer deleted successfully')
      get().fetchRetailers()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete retailer')
    } finally {
      set({ deletingId: null })
    }
  },

  resetForm: () => set({ ...initialForm, errors: {} }),
}))
