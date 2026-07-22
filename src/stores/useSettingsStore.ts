import { create } from 'zustand'
import toast from 'react-hot-toast'
import api from '@/lib/axios'

export interface UserProfile {
  id: number
  name: string
  email: string
  number: string
  roles: number
  company_name?: string | null
  address?: string | null
}

interface SettingsState {
  user: UserProfile | null
  loading: boolean
  updating: boolean
  changingPassword: boolean
  fetchProfile: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>
  changePassword: (data: { current_password: string; password: string; password_confirmation: string }) => Promise<boolean>
}

export const useSettingsStore = create<SettingsState>()((set, get) => ({
  user: null,
  loading: false,
  updating: false,
  changingPassword: false,

  fetchProfile: async () => {
    set({ loading: true })
    try {
      const res = await api.get('/profile/1')
      const data = res.data.data || res.data.user || res.data
      set({ user: data })
    } catch {
      set({ user: null })
    } finally {
      set({ loading: false })
    }
  },

  
  updateProfile: async (data) => {
    set({ updating: true })
    try {
      const res = await api.post('/profile', data)
      const updated = res.data.user || res.data.data || { ...get().user, ...data }
      localStorage.setItem('user', JSON.stringify(updated))
      set({ user: updated as UserProfile })
      toast.success('Profile updated successfully')
      return true
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
      return false
    } finally {
      set({ updating: false })
    }
  },

  changePassword: async (data) => {
    if (data.password !== data.password_confirmation) {
      toast.error('Password confirmation does not match')
      return false
    }
    if (data.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return false
    }
    set({ changingPassword: true })
    try {
      await api.post('/change-password', data)
      toast.success('Password changed successfully')
      return true
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password')
      return false
    } finally {
      set({ changingPassword: false })
    }
  },
}))
