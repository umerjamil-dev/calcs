import { useEffect } from 'react'
import { Plus, Search, Trash2, Edit3, Package } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProductStore } from '@/stores/useProductStore'

const AdminProducts = () => {
  const { products, loading, deletingId, fetchProducts, deleteProduct } = useProductStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">Products</h1>
            <a href="/admin/products/add">
              <Button className="h-9 cursor-pointer gap-2 rounded-lg bg-primary-main px-4 text-sm font-medium text-white hover:bg-primary-main/90">
                <Plus size={16} />
                Add Product
              </Button>
            </a>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-6">
          {/* Search bar */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search products by name or code..."
                className="h-10 rounded-lg border-slate-200 pl-10"
              />
            </div>
            <p className="text-sm text-slate-500">{products.length} products found</p>
          </div>

          {/* Products table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Product</th>
                    <th className="px-5 py-3 font-medium">Code</th>
                    <th className="px-5 py-3 font-medium">Pack</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">Stock</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                        Loading products...
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Package size={40} className="mb-2" />
                          <p className="text-sm">No products found</p>
                          <a href="/admin/products/add" className="mt-2 text-sm font-medium text-primary-main hover:underline">
                            Add your first product
                          </a>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id} className="transition-colors hover:bg-slate-50/50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                              {p.gallery_images?.[0] ? (
                                <img src={p.gallery_images[0]} alt={p.name} className="h-full w-full object-cover" />
                              ) : (
                                <Package size={18} className="text-slate-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{p.name}</p>
                              {p.sku && <p className="text-xs text-slate-500">SKU: {p.sku}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{p.p_code}</td>
                        <td className="px-5 py-3 text-slate-600">{p.pack_size} {p.pack_unit}</td>
                        <td className="px-5 py-3 font-medium text-slate-800">Rs {Number(p.price).toLocaleString()}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${p.stock_quantity <= p.low_stock_threshold ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700'}`}>
                            {p.stock_quantity}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/admin/products/edit/${p.id}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100"
                            >
                              <Edit3 size={14} />
                            </a>
                            <button
                              type="button"
                              onClick={() => deleteProduct(p.id)}
                              disabled={deletingId === p.id}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminProducts
