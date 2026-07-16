import { create } from 'zustand'
import toast from 'react-hot-toast'
import api from '@/lib/axios'

export interface LookupItem {
  id: number
  name: string
}

interface LookupState {
  items: LookupItem[]
  loading: boolean
  adding: boolean
  deletingId: number | null
  name: string
  setName: (name: string) => void
  fetchItems: (endpoint: string) => Promise<void>
  addItem: (endpoint: string) => Promise<boolean>
  deleteItem: (endpoint: string, id: number) => Promise<void>
  reset: () => void
}

export const useLookupStore = create<LookupState>()((set, get) => ({
  items: [],
  loading: false,
  adding: false,
  deletingId: null,
  name: '',

  setName: (name) => set({ name }),

  fetchItems: async (endpoint) => {
    set({ loading: true })
    try {
      const res = await api.get(endpoint)
      const data = res.data.data || res.data.items || res.data[endpoint.replace('/', '')] || res.data
      set({ items: Array.isArray(data) ? data : [] })
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to fetch ${endpoint}`)
    } finally {
      set({ loading: false })
    }
  },

  addItem: async (endpoint) => {
    const { name } = get()
    if (!name.trim()) {
      toast.error('Name is required')
      return false
    }
    set({ adding: true })
    try {
      await api.post(endpoint, { name: name.trim() })
      toast.success('Added successfully')
      set({ name: '' })
      get().fetchItems(endpoint)
      return true
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to add ${endpoint}`)
      return false
    } finally {
      set({ adding: false })
    }
  },

  deleteItem: async (endpoint, id) => {
    set({ deletingId: id })
    try {
      await api.delete(`${endpoint}/${id}`)
      toast.success('Deleted successfully')
      get().fetchItems(endpoint)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    } finally {
      set({ deletingId: null })
    }
  },

  reset: () => set({ items: [], name: '', loading: false, adding: false, deletingId: null }),
}))
