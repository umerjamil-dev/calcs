import { create } from 'zustand'
import toast from 'react-hot-toast'
import api from '@/lib/axios'

export interface OrderProduct {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: string
  total: string
  product?: {
    id: number
    p_code: string
    sku: string
    name: string
    price: string
    discount_price: string
    stock_quantity: number
    gallery_images: string[]
  }
}

export interface Order {
  id: number
  user_id: number
  distributor_id: number
  order_number: string
  total_amount: string
  status: string
  order_date: string
  delivered_at: string | null
  notes: string
  products: OrderProduct[]
}

export interface User {
  id: number
  name: string
  email: string
  number: string
  address: string
  company_name: string | null
  role_id: number
}

interface OrderState {
  orders: Order[]
  users: User[]
  loading: boolean
  updating: boolean
  fetchOrders: () => Promise<void>
  fetchUsers: () => Promise<void>
  updateOrderStatus: (id: number, status: string) => Promise<boolean>
  assignDistributor: (orderId: number, distributorId: number) => Promise<boolean>
  getUserById: (id: number) => User | undefined
}

export const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  users: [],
  loading: false,
  updating: false,

  fetchOrders: async () => {
    set({ loading: true })
    try {
      const res = await api.get('/admin/orders')
      const data = res.data.data || res.data
      set({ orders: Array.isArray(data) ? data : [] })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch orders')
    } finally {
      set({ loading: false })
    }
  },

  fetchUsers: async () => {
    try {
      const res = await api.get('/users')
      const data = res.data.data || res.data.users || res.data
      set({ users: Array.isArray(data) ? data : [] })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch users')
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ updating: true })
    try {
      await api.post(`distributor/orders/change-status`, { status: status, order_id: id })
      toast.success(`Order status updated to ${status}`)
      get().fetchOrders()
      return true
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update order status')
      return false
    } finally {
      set({ updating: false })
    }
  },

  assignDistributor: async (orderId, distributorId) => {
    set({ updating: true })
    try {
      await api.post(`admin/orders/assign`, { distributor_id: distributorId, order_id: orderId })
      toast.success('Distributor assigned successfully')
      get().fetchOrders()
      return true
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to assign distributor')
      return false
    } finally {
      set({ updating: false })
    }
  },

  getUserById: (id) => get().users.find((u) => u.id === id),
}))
