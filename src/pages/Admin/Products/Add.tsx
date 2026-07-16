import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProductFormStore } from '@/stores/useProductFormStore'
import api from '@/lib/axios'

interface LookupOption {
  id: number
  name: string
}

const AdminAddProduct = () => {
  const navigate = useNavigate()
  const store = useProductFormStore()
  const [brands, setBrands] = useState<LookupOption[]>([])
  const [categories, setCategories] = useState<LookupOption[]>([])
  const [subcategories, setSubcategories] = useState<LookupOption[]>([])
  const [productTypes, setProductTypes] = useState<LookupOption[]>([])
  const [engineTypes, setEngineTypes] = useState<LookupOption[]>([])
  const [lookupsLoading, setLookupsLoading] = useState(true)

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [b, c, s, p, e] = await Promise.all([
          api.get('/brands'),
          api.get('/categories'),
          api.get('/subcategories'),
          api.get('/product-types'),
          api.get('/engine-types'),
        ])
        const parse = (res: any) => Array.isArray(res.data) ? res.data : res.data.data || []
        setBrands(parse(b))
        setCategories(parse(c))
        setSubcategories(parse(s))
        setProductTypes(parse(p))
        setEngineTypes(parse(e))
      } finally {
        setLookupsLoading(false)
      }
    }
    fetchLookups()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await store.submitProduct()
    if (success) {
      navigate('/admin/products')
    }
  }

  const Field = ({ label, id, type = 'text', value, onChange, placeholder, error }: {
    label: string
    id: string
    type?: string
    value: string
    onChange: (v: string) => void
    placeholder?: string
    error?: string
  }) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-10 rounded-lg border-slate-200 ${error ? 'ring-2 ring-red-200' : ''}`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )

  const Select = ({ label, id, value, onChange, options, error }: {
    label: string
    id: string
    value: string
    onChange: (v: string) => void
    options: { id: string | number; name: string }[]
    error?: string
  }) => (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={lookupsLoading}
        className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition-colors focus:border-primary-main focus:ring-2 focus:ring-primary-main/20 disabled:bg-slate-100 ${error ? 'ring-2 ring-red-200' : ''}`}
      >
        <option value="">{lookupsLoading ? 'Loading...' : 'Select'}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>{opt.name}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/admin/products" className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100">
                <ArrowLeft size={16} />
              </a>
              <h1 className="text-lg font-semibold text-slate-800">Add Product</h1>
            </div>
            <Button
              type="submit"
              form="product-form"
              disabled={store.isSubmitting}
              className="h-9 cursor-pointer gap-2 rounded-lg bg-primary-main px-4 text-sm font-medium text-white hover:bg-primary-main/90 disabled:opacity-60"
            >
              <Save size={16} />
              {store.isSubmitting ? 'Saving...' : 'Save Product'}
            </Button>
          </div>
        </header>

        <main className="mx-auto px-6 py-6">
          <form id="product-form" onSubmit={handleSubmit} noValidate>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-base font-semibold text-slate-800">Product Information</h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                <Field label="Product Code *" id="p_code" value={store.p_code} onChange={(v) => store.setField('p_code', v)} placeholder="P23301" error={store.errors.p_code} />
                <Field label="Product Name *" id="name" value={store.name} onChange={(v) => store.setField('name', v)} placeholder="Shell Helix HX8 5W-30" error={store.errors.name} />
                <Field label="SKU" id="sku" value={store.sku} onChange={(v) => store.setField('sku', v)} placeholder="SKU-001" />
                <Field label="Slug" id="slug" value={store.slug} onChange={(v) => store.setField('slug', v)} placeholder="shell-helix-hx8-5w-30" />

                <Select label="Brand" id="brand_id" value={store.brand_id} onChange={(v) => store.setField('brand_id', v)} options={brands} />
                <Select label="Category" id="category_id" value={store.category_id} onChange={(v) => store.setField('category_id', v)} options={categories} />
                <Select label="Subcategory" id="subcategory_id" value={store.subcategory_id} onChange={(v) => store.setField('subcategory_id', v)} options={subcategories} />
                <Select label="Product Type" id="product_type_id" value={store.product_type_id} onChange={(v) => store.setField('product_type_id', v)} options={productTypes} />
                <Select label="Engine Type" id="engine_type_id" value={store.engine_type_id} onChange={(v) => store.setField('engine_type_id', v)} options={engineTypes} />
                <Field label="Viscosity Grade" id="viscosity_grade" value={store.viscosity_grade} onChange={(v) => store.setField('viscosity_grade', v)} placeholder="5W-30" />

                <Field label="Pack Size *" id="pack_size" type="number" value={store.pack_size} onChange={(v) => store.setField('pack_size', v)} placeholder="4.00" error={store.errors.pack_size} />
                <Field label="Pack Unit *" id="pack_unit" value={store.pack_unit} onChange={(v) => store.setField('pack_unit', v)} placeholder="L" error={store.errors.pack_unit} />
                <Field label="Price *" id="price" type="number" value={store.price} onChange={(v) => store.setField('price', v)} placeholder="3500.00" error={store.errors.price} />
                <Field label="Discount Price" id="discount_price" type="number" value={store.discount_price} onChange={(v) => store.setField('discount_price', v)} placeholder="3200.00" />
                <Field label="Stock Quantity *" id="stock_quantity" type="number" value={store.stock_quantity} onChange={(v) => store.setField('stock_quantity', v)} placeholder="100" error={store.errors.stock_quantity} />
              </div>

              <div className="mt-5 space-y-1.5">
                <label htmlFor="description" className="text-sm font-medium text-slate-700">Description</label>
                <textarea
                  id="description"
                  value={store.description}
                  onChange={(e) => store.setField('description', e.target.value)}
                  placeholder="Enter product description..."
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition-colors focus:border-primary-main focus:ring-2 focus:ring-primary-main/20"
                />
              </div>

              <div className="mt-5 space-y-3">
                <label className="text-sm font-medium text-slate-700">Gallery Images</label>
                <div className="flex flex-wrap gap-3">
                  {store.galleryPreviews.map((preview, index) => (
                    <div key={preview} className="relative h-24 w-24 overflow-hidden rounded-lg border border-slate-200">
                      <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => store.removeGalleryImage(index)}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
                    <span className="text-2xl">+</span>
                    <span className="mt-1 text-xs">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && store.addGalleryImages(e.target.files)}
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500">Click to upload images from your computer</p>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default AdminAddProduct
