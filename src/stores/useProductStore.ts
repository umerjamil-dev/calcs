import { create } from 'zustand'
import toast from 'react-hot-toast'
import api from '@/lib/axios'

export interface Product {
  id: number
  p_code: string
  sku: string | null
  name: string
  slug: string | null
  brand_id: number | null
  category_id: number | null
  subcategory_id: number | null
  product_type_id: number | null
  engine_type_id: number | null
  viscosity_grade: string | null
  pack_size: string
  pack_unit: string
  price: string
  discount_price: string | null
  stock_quantity: number
  low_stock_threshold: number
  description: string | null
  gallery_images: string[]
}

interface ProductState {
  products: Product[]
  loading: boolean
  deletingId: number | null
  fetchProducts: () => Promise<void>
  deleteProduct: (id: number) => Promise<void>
}

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  loading: false,
  deletingId: null,

  fetchProducts: async () => {
    set({ loading: true })
    try {
      const res = await api.get('/products')
      set({ products: res.data.products || res.data.data || res.data })
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch products')
    } finally {
      set({ loading: false })
    }
  },

  deleteProduct: async (id) => {
    set({ deletingId: id })
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted successfully')
      get().fetchProducts()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete product')
    } finally {
      set({ deletingId: null })
    }
  },
}))
