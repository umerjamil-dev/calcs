import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast'

interface DistributorSignupState {
  name: string
  number: string
  email: string
  address: string
  companyName: string
  password: string
  passwordConfirmation: string
  nic: string
  errors: Record<string, string | undefined>
  isSubmitting: boolean
  setField: (id: string, value: string) => void
  validate: () => boolean
  signup: () => Promise<void>
}

export const useDistributorSignupStore = create<DistributorSignupState>()((set, get) => ({
  name: '',
  number: '',
  email: '',
  address: '',
  companyName: '',
  password: '',
  passwordConfirmation: '',
  nic: '',
  errors: {} as Record<string, string | undefined>,
  isSubmitting: false,
  setField: (id, value) => set({ [id]: value, errors: { ...get().errors, [id]: undefined } } as any),
  validate: () => {
    const { name, number, email, address, companyName, password, passwordConfirmation, nic } = get()
    const errors: Record<string, string> = {}
    if (!name.trim()) { errors.name = 'Name is required'; toast.error('Name is required') }
    if (!number.trim()) { errors.number = 'Phone number is required'; toast.error('Phone number is required') }
    else if (!/^0\d{10}$/.test(number.replace(/-/g, ''))) { errors.number = 'Invalid phone'; toast.error('Invalid phone number') }
    if (!email) { errors.email = 'Email is required'; toast.error('Email is required') }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.email = 'Invalid email'; toast.error('Invalid email address') }
    if (!address.trim()) { errors.address = 'Address is required'; toast.error('Address is required') }
    if (!companyName.trim()) { errors.companyName = 'Company name is required'; toast.error('Company name is required') }
    if (!password) { errors.password = 'Password is required'; toast.error('Password is required') }
    if (!passwordConfirmation) { errors.passwordConfirmation = 'Please confirm your password'; toast.error('Please confirm your password') }
    else if (password !== passwordConfirmation) { errors.passwordConfirmation = 'Passwords do not match'; toast.error('Passwords do not match') }
    if (!nic.trim()) { errors.nic = 'NIC is required'; toast.error('NIC is required') }
    else if (!/^\d{5}-\d{7}-\d$/.test(nic)) { errors.nic = 'Invalid NIC'; toast.error('Invalid NIC format (XXXXX-XXXXXXX-X)') }
    set({ errors })
    return Object.keys(errors).length === 0
  },
  signup: async () => {
    if (!get().validate()) return
    set({ isSubmitting: true })
    try {
      const { name, number, email, address, companyName, password, passwordConfirmation, nic } = get()
      const res = await axios.post('https://realstatebackend.processiqtech.com/test/public/api/register', {
        name, number, email, address, password,
        password_confirmation: passwordConfirmation,
        role_id: 2,
        company_name: companyName,
        nic,
      })
      toast.success(res.data.message || 'Distributor account created!')
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      return res.data
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Distributor registration failed')
    } finally {
      set({ isSubmitting: false })
    }
  },
}))
