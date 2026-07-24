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

export interface BalanceOrder {
  id: number
  order_number: string
  total_amount: string | number
  total_payments: string | number
  status: string
  order_date: string
  payment_status: string
}

export interface Balance {
  user_id: number
  distributor_id: number
  total_orders: number
  total_amount: string
  payment_status: string
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
  orders: BalanceOrder[]
}

export interface DistributorBalance {
  id: number
  distributor_id: number
  total_orders: number
  total_earned: string
  total_received: string
  payment_status: string
  total_pending: string
  distributor?: {
    id: number
    name: string
    email: string
    number: string
    company_name: string | null
  }
}

export interface RetailerPaymentInfo {
  retailer: {
    id: number
    name: string
    number: string
  }
  total_order_amount: number
  previous_payments: string
  outstanding_balance: number
  orders: {
    id: number
    order_number: string
    total_amount: string
    status: string
    order_date: string
  }[]
}

interface PaymentState {
  payments: Payment[]
  balances: Balance[]
  distributorBalances: DistributorBalance[]
  retailerPaymentInfo: RetailerPaymentInfo | null
  loading: boolean
  submitting: boolean
  fetchPayments: () => Promise<void>
  fetchBalances: () => Promise<void>
  fetchDistributorBalances: () => Promise<void>
  fetchRetailerPaymentInfo: (retailerId: number) => Promise<void>
  receivePayment: (data: { order_id: number; amount: number; payment_method: string; date: string; notes?: string }) => Promise<boolean>
}

export const usePaymentStore = create<PaymentState>()((set, get) => ({
  payments: [],
  balances: [],
  distributorBalances: [],
  retailerPaymentInfo: null,
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
      const rawOrders = Array.isArray(data) ? data : []

      // Group raw per-order records into one row per retailer + distributor pair,
      // keeping each order attached so the UI can expand into order-level detail
      const grouped = new Map<string, Balance>()

      rawOrders.forEach((order: any) => {
        const key = `${order.user_id}-${order.distributor_id ?? 'none'}`
        const amount = Number(order.total_amount) || 0
        const paid = Number(order.total_payments) || 0

        if (!grouped.has(key)) {
          grouped.set(key, {
            user_id: order.user_id,
            distributor_id: order.distributor_id,
            user: order.user,
            distributor: order.distributor,
            total_orders: 0,
            total_amount: 0 as any,
            total_payments: 0 as any,
            balance: 0,
            payment_status: 'unpaid',
            orders: [],
          })
        }

        const entry = grouped.get(key)!
        entry.total_orders += 1
        entry.total_amount = (Number(entry.total_amount) + amount) as any
        entry.total_payments = (Number(entry.total_payments) + paid) as any
        entry.orders.push({
          id: order.id,
          order_number: order.order_number,
          total_amount: amount,
          total_payments: paid,
          status: order.status,
          order_date: order.order_date,
          payment_status: order.payment_status,
        })
      })

      grouped.forEach((entry) => {
        entry.balance = Number(entry.total_amount) - Number(entry.total_payments)
        entry.payment_status =
          entry.balance <= 0 ? 'paid' : Number(entry.total_payments) > 0 ? 'partial' : 'unpaid'
        // newest order first within each group
        entry.orders.sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
      })

      set({ balances: Array.from(grouped.values()) })
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

  fetchRetailerPaymentInfo: async (retailerId: number) => {
    try {
      const res = await api.post(`/payments/retailer`, { retailer_id: retailerId })
      set({ retailerPaymentInfo: res.data.data || res.data })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch retailer info')
      set({ retailerPaymentInfo: null })
    }
  },

  receivePayment: async (data) => {
    set({ submitting: true })
    try {
      await api.post('admin/payments/receive', data)
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