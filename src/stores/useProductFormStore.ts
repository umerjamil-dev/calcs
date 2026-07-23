import { create } from 'zustand'
import toast from 'react-hot-toast'
import api from '@/lib/axios'
import type { Product } from './useProductStore'

export interface ProductFormData {
  p_code: string
  sku: string
  name: string
  slug: string
  brand_id: string
  category_id: string
  subcategory_id: string
  product_type_id: string
  engine_type_id: string
  viscosity_grade: string
  pack_size: string
  pack_unit: string
  price: string
  discount_price: string
  stock_quantity: string
  low_stock_threshold: string
  description: string
}

interface ProductFormState extends ProductFormData {
  galleryImageFiles: File[]
  galleryPreviews: string[]
  existingImageUrls: string[]
  removedExistingImages: string[]
  errors: Record<string, string | undefined>
  isSubmitting: boolean
  setField: (field: keyof ProductFormData, value: string) => void
  addGalleryImages: (files: FileList) => void
  removeGalleryImage: (index: number) => void
  validate: () => boolean
  submitProduct: () => Promise<boolean>
  updateProduct: (id: number) => Promise<boolean>
  loadProduct: (product: Product) => void
  resetForm: () => void
}

const initialState: ProductFormData = {
  p_code: '',
  sku: '',
  name: '',
  slug: '',
  brand_id: '',
  category_id: '',
  subcategory_id: '',
  product_type_id: '',
  engine_type_id: '',
  viscosity_grade: '',
  pack_size: '',
  pack_unit: 'L',
  price: '',
  discount_price: '',
  stock_quantity: '',
  low_stock_threshold: '10',
  description: '',
}

export const useProductFormStore = create<ProductFormState>()((set, get) => ({
  ...initialState,
  galleryImageFiles: [],
  galleryPreviews: [],
  existingImageUrls: [],
  removedExistingImages: [],
  errors: {},
  isSubmitting: false,

  setField: (field, value) =>
    set({ [field]: value, errors: { ...get().errors, [field]: undefined } } as any),

  addGalleryImages: (files) => {
    const newFiles = Array.from(files)
    const previews = newFiles.map((file) => URL.createObjectURL(file))
    set((state) => ({
      galleryImageFiles: [...state.galleryImageFiles, ...newFiles],
      galleryPreviews: [...state.galleryPreviews, ...previews],
    }))
  },

  removeGalleryImage: (index) => {
    set((state) => {
      const newFiles = [...state.galleryImageFiles]
      const newPreviews = [...state.galleryPreviews]
      const newExisting = [...state.existingImageUrls]
      const newRemoved = [...state.removedExistingImages]
      const removedUrl = newPreviews[index]

      if (removedUrl.startsWith('blob:')) {
        URL.revokeObjectURL(removedUrl)
        newFiles.splice(index, 1)
      } else {
        // Existing server image
        newRemoved.push(removedUrl)
        const existingIndex = newExisting.indexOf(removedUrl)
        if (existingIndex > -1) newExisting.splice(existingIndex, 1)
      }

      newPreviews.splice(index, 1)
      return {
        galleryImageFiles: newFiles,
        galleryPreviews: newPreviews,
        existingImageUrls: newExisting,
        removedExistingImages: newRemoved,
      }
    })
  },

  validate: () => {
    set({ errors: {} })
    return true
  },

  submitProduct: async () => {
    if (!get().validate()) return false
    set({ isSubmitting: true })
    try {
      const data = get()
      const formData = new FormData()

      formData.append('p_code', data.p_code)
      formData.append('name', data.name)
      formData.append('pack_size', data.pack_size)
      formData.append('pack_unit', data.pack_unit)
      formData.append('price', data.price)
      formData.append('stock_quantity', data.stock_quantity)
      formData.append('low_stock_threshold', data.low_stock_threshold)

      if (data.sku.trim()) formData.append('sku', data.sku)
      if (data.slug.trim()) formData.append('slug', data.slug)
      if (data.brand_id.trim()) formData.append('brand_id', data.brand_id)
      if (data.category_id.trim()) formData.append('category_id', data.category_id)
      if (data.subcategory_id.trim()) formData.append('subcategory_id', data.subcategory_id)
      if (data.product_type_id.trim()) formData.append('product_type_id', data.product_type_id)
      if (data.engine_type_id.trim()) formData.append('engine_type_id', data.engine_type_id)
      if (data.viscosity_grade.trim()) formData.append('viscosity_grade', data.viscosity_grade)
      if (data.discount_price.trim()) formData.append('discount_price', data.discount_price)
      if (data.description.trim()) formData.append('description', data.description)

      data.galleryImageFiles.forEach((file) => {
        formData.append('gallery_images[]', file)
      })

      await api.post('/products', formData)
      toast.success('Product added successfully')
      get().resetForm()
      return true
    } catch (err: any) {
      // console.log()
      toast.error(err.response?.data?.message || 'Failed to add product')
      return false
    } finally {
      set({ isSubmitting: false })
    }
  },

  updateProduct: async (id: number) => {
    if (!get().validate()) return false
    set({ isSubmitting: true })
    try {
      const data = get()
      const formData = new FormData()

      formData.append('p_code', data.p_code)
      formData.append('name', data.name)
      formData.append('pack_size', data.pack_size)
      formData.append('pack_unit', data.pack_unit)
      formData.append('price', data.price)
      formData.append('stock_quantity', data.stock_quantity)
      formData.append('low_stock_threshold', data.low_stock_threshold)

      if (data.sku.trim()) formData.append('sku', data.sku)
      if (data.slug.trim()) formData.append('slug', data.slug)
      if (data.brand_id.trim()) formData.append('brand_id', data.brand_id)
      if (data.category_id.trim()) formData.append('category_id', data.category_id)
      if (data.subcategory_id.trim()) formData.append('subcategory_id', data.subcategory_id)
      if (data.product_type_id.trim()) formData.append('product_type_id', data.product_type_id)
      if (data.engine_type_id.trim()) formData.append('engine_type_id', data.engine_type_id)
      if (data.viscosity_grade.trim()) formData.append('viscosity_grade', data.viscosity_grade)
      if (data.discount_price.trim()) formData.append('discount_price', data.discount_price)
      if (data.description.trim()) formData.append('description', data.description)

      data.galleryImageFiles.forEach((file) => {
        formData.append('gallery_images[]', file)
      })

     data.removedExistingImages.forEach((url) => {
  formData.append('removed_images[]', url)
})

formData.append('_method', 'PUT')

await api.post(`/products/${id}`, formData)

toast.success('Product updated successfully')
      return true
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update product')
      return false
    } finally {
      set({ isSubmitting: false })
    }
  },

  loadProduct: (product) => {
    set({
      p_code: product.p_code || '',
      sku: product.sku || '',
      name: product.name || '',
      slug: product.slug || '',
      brand_id: product.brand_id?.toString() || '',
      category_id: product.category_id?.toString() || '',
      subcategory_id: product.subcategory_id?.toString() || '',
      product_type_id: product.product_type_id?.toString() || '',
      engine_type_id: product.engine_type_id?.toString() || '',
      viscosity_grade: product.viscosity_grade || '',
      pack_size: product.pack_size || '',
      pack_unit: product.pack_unit || 'L',
      price: product.price || '',
      discount_price: product.discount_price || '',
      stock_quantity: product.stock_quantity?.toString() || '',
      low_stock_threshold: product.low_stock_threshold?.toString() || '10',
      description: product.description || '',
      galleryImageFiles: [],
      galleryPreviews: product.gallery_images || [],
      existingImageUrls: product.gallery_images || [],
      removedExistingImages: [],
      errors: {},
    })
  },

  resetForm: () => {
    const state = get()
    state.galleryPreviews.forEach((url) => URL.revokeObjectURL(url))
    set({ ...initialState, galleryImageFiles: [], galleryPreviews: [], existingImageUrls: [], removedExistingImages: [], errors: {} })
  },
}))
