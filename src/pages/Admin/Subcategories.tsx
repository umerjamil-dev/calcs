import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/Pagination'
import { useSubcategoryStore } from '@/stores/useSubcategoryStore'

const ITEMS_PER_PAGE = 10

const AdminSubcategories = () => {
  const {
    subcategories,
    categories,
    loading,
    adding,
    deletingId,
    name,
    categoryId,
    setName,
    setCategoryId,
    fetchSubcategories,
    fetchCategories,
    addSubcategory,
    deleteSubcategory,
  } = useSubcategoryStore()
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchSubcategories()
    fetchCategories()
  }, [fetchSubcategories, fetchCategories])

  const totalPages = Math.ceil(subcategories.length / ITEMS_PER_PAGE)
  const paginatedSubcategories = subcategories.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await addSubcategory()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-[1620px] items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">Subcategories</h1>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-6 py-6">
          {/* Add form */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">Add New Subcategory</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none sm:w-48"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter subcategory name..."
                className="h-10 flex-1 rounded-lg border-slate-200"
              />
              <Button
                type="submit"
                disabled={adding}
                className="h-10 cursor-pointer gap-2 rounded-lg bg-primary-main px-5 text-sm font-medium text-white hover:bg-primary-main/90 disabled:opacity-60"
              >
                <Plus size={16} />
                {adding ? 'Adding...' : 'Add'}
              </Button>
            </form>
          </div>

          {/* List */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-3">
              <h3 className="text-sm font-semibold text-slate-700">All Subcategories ({subcategories.length})</h3>
            </div>
            {loading ? (
              <div className="px-5 py-8 text-center text-sm text-slate-500">Loading...</div>
            ) : subcategories.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-500">No subcategories found</div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {paginatedSubcategories.map((item, index) => (
                  <li key={item.id} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-slate-50/50">
                    <div>
                      <span className="text-sm font-medium text-slate-800">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}. {item.name}</span>
                      {item.category && (
                        <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{item.category.name}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteSubcategory(item.id)}
                      disabled={deletingId === item.id}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={subcategories.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminSubcategories
