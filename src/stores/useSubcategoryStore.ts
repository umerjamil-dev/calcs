import { create } from 'zustand'
import toast from 'react-hot-toast'
import api from '@/lib/axios'

export interface Subcategory {
  id: number
  name: string
  category_id?: number
  category?: { id: number; name: string }
}

export interface Category {
  id: number
  name: string
}

interface SubcategoryState {
  subcategories: Subcategory[]
  categories: Category[]
  loading: boolean
  adding: boolean
  deletingId: number | null
  name: string
  categoryId: string
  setName: (name: string) => void
  setCategoryId: (id: string) => void
  fetchSubcategories: () => Promise<void>
  fetchCategories: () => Promise<void>
  addSubcategory: () => Promise<boolean>
  deleteSubcategory: (id: number) => Promise<void>
  reset: () => void
}

export const useSubcategoryStore = create<SubcategoryState>()((set, get) => ({
  subcategories: [],
  categories: [],
  loading: false,
  adding: false,
  deletingId: null,
  name: '',
  categoryId: '',

  setName: (name) => set({ name }),
  setCategoryId: (categoryId) => set({ categoryId }),

  fetchSubcategories: async () => {
    set({ loading: true })
    try {
      const res = await api.get('/subcategories')
      const data = res.data.data || res.data.items || res.data.subcategories || res.data
      set({ subcategories: Array.isArray(data) ? data : [] })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch subcategories')
    } finally {
      set({ loading: false })
    }
  },

  fetchCategories: async () => {
    try {
      const res = await api.get('/categories')
      const data = res.data.data || res.data.items || res.data.categories || res.data
      set({ categories: Array.isArray(data) ? data : [] })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch categories')
    }
  },

  addSubcategory: async () => {
    const { name, categoryId } = get()
    if (!name.trim()) {
      toast.error('Name is required')
      return false
    }
    if (!categoryId.trim()) {
      toast.error('Category is required')
      return false
    }
    set({ adding: true })
    try {
      await api.post('/subcategories', {
        name: name.trim(),
        category_id: Number(categoryId),
      })
      toast.success('Subcategory added successfully')
      set({ name: '', categoryId: '' })
      get().fetchSubcategories()
      return true
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add subcategory')
      return false
    } finally {
      set({ adding: false })
    }
  },

  deleteSubcategory: async (id) => {
    set({ deletingId: id })
    try {
      await api.delete(`/subcategories/${id}`)
      toast.success('Subcategory deleted successfully')
      get().fetchSubcategories()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete subcategory')
    } finally {
      set({ deletingId: null })
    }
  },

  reset: () => set({ subcategories: [], categories: [], name: '', categoryId: '', loading: false, adding: false, deletingId: null }),
}))
