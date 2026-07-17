import { create } from 'zustand'
import toast from 'react-hot-toast'
import api from '@/lib/axios'

export interface Notification {
  id: number
  distributor_id: number
  description: string
  address: string
  status: string
  retailer_name: string
  created_at: string
  updated_at: string
  distributor_name: string
}

interface NotificationState {
  notifications: Notification[]
  loading: boolean
  fetchNotifications: () => Promise<void>
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true })
    try {
      const res = await api.get('/retailer-complaints')
      const data = res.data.data || res.data
      set({ notifications: Array.isArray(data) ? data : [] })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch notifications')
    } finally {
      set({ loading: false })
    }
  },
}))
