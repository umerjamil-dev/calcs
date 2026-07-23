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
  updating: boolean
  fetchNotifications: () => Promise<void>
  updateNotificationStatus: (id: number, status: string) => Promise<boolean>
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],
  loading: false,
  updating: false,

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

  updateNotificationStatus: async (id: number, status: string) => {
    set({ updating: true })
    try {
      await api.put(`/retailer-complaints/${id}`, { status })
      toast.success('Status updated successfully')
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, status } : n
        ),
      }))
      return true
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status')
      return false
    } finally {
      set({ updating: false })
    }
  },
}))
