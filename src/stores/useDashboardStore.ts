import { create } from 'zustand'
import toast from 'react-hot-toast'
import api from '@/lib/axios'

export interface DashboardStats {
  total_retailers: number
  total_distributors: number
  total_products: number
  total_orders: number
  pending_orders: number
  confirm_orders: number
  processing_orders: number
  shipped_orders: number
  delivered_orders: number
  cancelled_orders: number
  total_sales: number
  total_payments: number
  outstanding_balance: number
  today_orders: number
}

interface DashboardState {
  stats: DashboardStats
  loading: boolean
  fetchStats: () => Promise<void>
}

const initialStats: DashboardStats = {
  total_retailers: 0,
  total_distributors: 0,
  total_products: 0,
  total_orders: 0,
  pending_orders: 0,
  confirm_orders: 0,
  processing_orders: 0,
  shipped_orders: 0,
  delivered_orders: 0,
  cancelled_orders: 0,
  total_sales: 0,
  total_payments: 0,
  outstanding_balance: 0,
  today_orders: 0,
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  stats: initialStats,
  loading: false,

  fetchStats: async () => {
    set({ loading: true })
    try {
      const res = await api.get('/dashboard')
      const data = res.data.data || res.data
      set({ stats: { ...initialStats, ...data } })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch dashboard stats')
    } finally {
      set({ loading: false })
    }
  },
}))
