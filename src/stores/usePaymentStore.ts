import { create } from 'zustand'
import toast from 'react-hot-toast'
import api from '@/lib/axios'

export interface Payment {
  id: number
  order_id: number
  user_id: number
  distributor_id: number
  amount: string
  payment_type: string
  remarks: string
  created_at: string
  updated_at: string
  order?: {
    id: number
    order_number: string
    total_amount: string
  }
  user?: {
    id: number
    name: string
    number: string
  }
  distributor?: {
    id: number
    name: string
  }
}

export interface Balance {
  user_id: number
  distributor_id: number
  total_orders: number
  total_amount: string
  total_payments: string
  balance: number
  user?: {
    id: number
    name: string
    number: string
  }
  distributor?: {
    id: number
    name: string
  }
}

export interface DistributorBalance {
  id: number
  distributor_id: number
  total_orders: number
  total_earned: string
  total_received: string
  total_pending: string
  distributor?: {
    id: number
    name: string
    email: string
    number: string
    company_name: string | null
  }
}

interface PaymentState {
  payments: Payment[]
  balances: Balance[]
  distributorBalances: DistributorBalance[]
  loading: boolean
  submitting: boolean
  fetchPayments: () => Promise<void>
  fetchBalances: () => Promise<void>
  fetchDistributorBalances: () => Promise<void>
  receivePayment: (data: { order_id: number; amount: number; payment_method: string; notes?: string }) => Promise<boolean>
}

export const usePaymentStore = create<PaymentState>()((set, get) => ({
  payments: [],
  balances: [],
  distributorBalances: [],
  loading: false,
  submitting: false,

  fetchPayments: async () => {
    set({ loading: true })
    try {
      const res = await api.get('/admin/payments')
      const data = res.data.data || res.data
      set({ payments: Array.isArray(data) ? data : [] })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch payments')
    } finally {
      set({ loading: false })
    }
  },

  fetchBalances: async () => {
    set({ loading: true })
    try {
      const res = await api.get('/admin/balances')
      const data = res.data.data || res.data
      set({ balances: Array.isArray(data) ? data : [] })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch balances')
    } finally {
      set({ loading: false })
    }
  },

  fetchDistributorBalances: async () => {
    set({ loading: true })
    try {
      const res = await api.get('/admin/distributors-balance')
      const data = res.data.data || res.data
      set({ distributorBalances: Array.isArray(data) ? data : [] })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch distributor balances')
    } finally {
      set({ loading: false })
    }
  },

  receivePayment: async (data) => {
    set({ submitting: true })
    try {
      await api.post('/admin/payments', data)
      toast.success('Payment received successfully')
      get().fetchPayments()
      return true
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to receive payment')
      return false
    } finally {
      set({ submitting: false })
    }
  },
}))
