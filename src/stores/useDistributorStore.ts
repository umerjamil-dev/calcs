import { create } from 'zustand'
import toast from 'react-hot-toast'
import api from '@/lib/axios'

export interface Distributor {
  id: number
  name: string
  number: string
  email: string
  address: string
  company_name: string | null
  status:number
  nic: string | null
  role_id: number
}

interface DistributorFormData {
  name: string
  number: string
  email: string
  address: string
  companyName: string
  nic: string
  password: string
  passwordConfirmation: string
}

interface DistributorState extends DistributorFormData {
  distributors: Distributor[]
  loading: boolean
  adding: boolean
  deletingId: number | null
  resettingId: number | null
  errors: Record<string, string | undefined>
  setField: (field: keyof DistributorFormData, value: string) => void
  fetchDistributors: () => Promise<void>
  addDistributor: () => Promise<boolean>
  deleteDistributor: (id: number) => Promise<void>
  resetPassword: (userId: number, password: string, passwordConfirmation: string) => Promise<boolean>
  resetForm: () => void
}

const initialForm: DistributorFormData = {
  name: '',
  number: '',
  email: '',
  address: '',
  companyName: '',
  nic: '',
  password: '',
  passwordConfirmation: '',
}

export const useDistributorStore = create<DistributorState>()((set, get) => ({
  ...initialForm,
  distributors: [],
  loading: false,
  adding: false,
  deletingId: null,
  resettingId: null,
  errors: {},

  setField: (field, value) =>
    set({ [field]: value, errors: { ...get().errors, [field]: undefined } } as any),

  fetchDistributors: async () => {
    set({ loading: true })
    try {
      const res = await api.get('/users')
      const data = res.data.data || res.data.users || res.data
      const list = Array.isArray(data) ? data : []
      set({ distributors: list.filter((u: any) => u.role_id === 2) })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch distributors')
    } finally {
      set({ loading: false })
    }
  },

  addDistributor: async () => {
    const data = get()
    const errors: Record<string, string | undefined> = {}

    if (!data.name.trim()) { errors.name = 'Name is required'; toast.error('Name is required') }
    if (!data.number.trim()) { errors.number = 'Phone number is required'; toast.error('Phone number is required') }
    else if (!/^0\d{10}$/.test(data.number.replace(/-/g, ''))) { errors.number = 'Invalid phone number'; toast.error('Invalid phone number') }
    if (!data.email.trim()) { errors.email = 'Email is required'; toast.error('Email is required') }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { errors.email = 'Invalid email'; toast.error('Invalid email address') }
    if (!data.address.trim()) { errors.address = 'Address is required'; toast.error('Address is required') }
    if (!data.companyName.trim()) { errors.companyName = 'Company name is required'; toast.error('Company name is required') }
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
        role_id: 2,
        name: data.name.trim(),
        number: data.number.trim(),
        email: data.email.trim(),
        address: data.address.trim(),
        company_name: data.companyName.trim(),
        nic: data.nic.trim(),
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      })
      toast.success('Distributor added successfully')
      set({ ...initialForm, errors: {} })
      return true
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add distributor')
      return false
    } finally {
      set({ adding: false })
    }
  },

  deleteDistributor: async (id) => {
    set({ deletingId: id })
    try {
      await api.delete(`/users/${id}`)
      toast.success('Distributor deleted successfully')
      get().fetchDistributors()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete distributor')
    } finally {
      set({ deletingId: null })
    }
  },

  resetPassword: async (userId, password, passwordConfirmation) => {
    set({ resettingId: userId })
    try {
      await api.post(`/users/${userId}/reset-password`, {
        password,
        password_confirmation: passwordConfirmation,
      })
      toast.success('Password reset successfully')
      return true
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password')
      return false
    } finally {
      set({ resettingId: null })
    }
  },

  resetForm: () => set({ ...initialForm, errors: {} }),
}))
