import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, Edit3, Trash2 } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { useProductStore } from '@/stores/useProductStore'
import api from '@/lib/axios'

interface LookupItem {
  id: number
  name: string
}

const AdminProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, loading, deletingId, fetchProducts, deleteProduct } = useProductStore()
  const [activeImage, setActiveImage] = useState(0)
  const [lookups, setLookups] = useState<Record<string, LookupItem[]>>({
    brands: [],
    categories: [],
    subcategories: [],
    'product-types': [],
    'engine-types': [],
  })

  useEffect(() => {
    if (products.length === 0) fetchProducts()

    const fetchLookups = async () => {
      try {
        const endpoints = ['brands', 'categories', 'subcategories', 'product-types', 'engine-types']
        const results = await Promise.all(
          endpoints.map(async (ep) => {
            const res = await api.get(`/${ep}`)
            const data = res.data.data || res.data.items || res.data[ep.replace('-', '_')] || res.data
            return [ep, Array.isArray(data) ? data : []]
          })
        )
        setLookups(Object.fromEntries(results))
      } catch (err) {
        // silent fail for lookups
      }
    }
    fetchLookups()
  }, [fetchProducts, products.length])

  const product = products.find((p) => p.id === Number(id))

  const getName = (items: LookupItem[], id: number | null | undefined) => {
    if (!id) return '-'
    const item = items.find((i) => i.id === id)
    return item?.name || `ID: ${id}`
  }

  const handleDelete = async () => {
    if (!product) return
    if (!window.confirm('Are you sure you want to delete this product?')) return
    await deleteProduct(product.id)
    navigate('/admin/products')
  }

  if (!product && !loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />
        <div className="lg:ml-64">
          <main className="mx-auto max-w-[1620px] px-6 py-6">
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-500">Product not found</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-[1620px] items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/admin/products')}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                <ArrowLeft size={16} />
              </button>
              <h1 className="text-lg font-semibold text-slate-800">Product Detail</h1>
            </div>
            {product && (
              <div className="flex items-center gap-2">
                <a
                  href={`/admin/products/edit/${product.id}`}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
                >
                  <Edit3 size={14} />
                  Edit
                </a>
                <Button
                  onClick={handleDelete}
                  disabled={deletingId === product.id}
                  className="h-9 cursor-pointer gap-2 rounded-lg border border-red-200 bg-white px-4 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 size={14} />
                  {deletingId === product.id ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            )}
          </div>
        </header>

        <main className="mx-auto px-6 py-6">
          {loading || !product ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-primary-main" />
              <p className="text-sm text-slate-500">Loading product...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Images */}
              <section className="lg:col-span-1">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="mb-3 text-sm font-semibold text-slate-800">Product Images</p>
                  {product.gallery_images?.length > 0 ? (
                    <>
                      <div className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        <img
                          src={product.gallery_images[activeImage]}
                          alt={`${product.name} ${activeImage + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {product.gallery_images.length > 1 && (
                          <>
                            <button
                              onClick={() => setActiveImage((prev) => (prev === 0 ? product.gallery_images.length - 1 : prev - 1))}
                              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow hover:bg-white"
                            >
                              ‹
                            </button>
                            <button
                              onClick={() => setActiveImage((prev) => (prev === product.gallery_images.length - 1 ? 0 : prev + 1))}
                              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow hover:bg-white"
                            >
                              ›
                            </button>
                          </>
                        )}
                      </div>
                      {product.gallery_images.length > 1 && (
                        <div className="mt-3 flex gap-2 overflow-x-auto">
                          {product.gallery_images.map((img, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveImage(index)}
                              className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${index === activeImage ? 'border-primary-main' : 'border-slate-200'}`}
                            >
                              <img src={img} alt={`thumb ${index + 1}`} className="h-full w-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex aspect-square items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                      <Package size={48} className="text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                    <p className="text-xl font-bold text-slate-800">{product.stock_quantity}</p>
                    <p className="text-xs text-slate-500">Stock</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                    <p className="text-xl font-bold text-primary-main">Rs {Number(product.price).toLocaleString('en-PK')}</p>
                    <p className="text-xs text-slate-500">Price</p>
                  </div>
                </div>
              </section>

              {/* Details */}
              <section className="lg:col-span-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-start justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-800">{product.name}</h2>
                      {product.sku && <p className="text-xs text-slate-500">SKU: {product.sku}</p>}
                    </div>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${product.stock_quantity <= product.low_stock_threshold ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {product.stock_quantity <= product.low_stock_threshold ? 'Low Stock' : 'In Stock'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailItem label="Product Code" value={product.p_code} />
                    
                    <DetailItem label="Brand" value={getName(lookups.brands, product.brand_id)} />
                    <DetailItem label="Category" value={getName(lookups.categories, product.category_id)} />
                    <DetailItem label="Subcategory" value={getName(lookups.subcategories, product.subcategory_id)} />
                    <DetailItem label="Product Type" value={getName(lookups['product-types'], product.product_type_id)} />
                    <DetailItem label="Engine Type" value={getName(lookups['engine-types'], product.engine_type_id)} />
                    <DetailItem label="Viscosity Grade" value={product.viscosity_grade || '-'} />
                    <DetailItem label="Pack Size" value={`${product.pack_size} ${product.pack_unit}`} />
                    <DetailItem
                      label="Discount Price"
                      value={product.discount_price ? `Rs ${Number(product.discount_price).toLocaleString('en-PK')}` : '-'}
                    />
                    <DetailItem label="Low Stock Threshold" value={product.low_stock_threshold.toString()} />
                  </div>

                  {product.description && (
                    <div className="mt-5 border-t border-slate-100 pt-4">
                      <p className="mb-1 text-xs font-medium text-slate-500">Description</p>
                      <p className="text-sm leading-relaxed text-slate-700">{product.description}</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-slate-50 p-3">
    <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
    <p className="text-sm font-semibold text-slate-800">{value}</p>
  </div>
)

export default AdminProductDetail
