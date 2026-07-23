import { useEffect, useState } from 'react'
import { Plus, Search, Trash2, Users } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/Pagination'
import { useRetailerStore } from '@/stores/useRetailerStore'

const ITEMS_PER_PAGE = 10

const AdminRetailers = () => {
  const { retailers, loading, deletingId, fetchRetailers, deleteRetailer } = useRetailerStore()
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchRetailers()
  }, [fetchRetailers])

  const filteredRetailers = retailers.filter((r) => r.role_id == 3)
  const totalPages = Math.ceil(filteredRetailers.length / ITEMS_PER_PAGE)
  const paginatedRetailers = filteredRetailers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-[1620px] items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">Retailers</h1>
            <a href="/admin/retailers/add">
              <Button className="h-9 cursor-pointer gap-2 rounded-lg bg-primary-main px-4 text-sm font-medium text-white hover:bg-primary-main/90">
                <Plus size={16} />
                Add Retailer
              </Button>
            </a>
          </div>
        </header>

        <main className="mx-auto  px-6 py-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search retailers..."
                className="h-10 rounded-lg border-slate-200 pl-10"
              />
            </div>
            <p className="text-sm text-slate-500">{retailers.length} retailers found</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">#No</th>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Address</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-slate-500">Loading retailers...</td>
                    </tr>
                  ) : retailers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Users size={40} className="mb-2" />
                          <p className="text-sm">No retailers found</p>
                          <a href="/admin/retailers/add" className="mt-2 text-sm font-medium text-primary-main hover:underline">
                            Add your first retailer
                          </a>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedRetailers.map((r, i) => (
                      <tr key={r.id} className="transition-colors hover:bg-slate-50/50">
                        <td className="px-5 py-3 font-medium text-slate-800">{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                        <td className="px-5 py-3 font-medium text-slate-800">{r.name}</td>
                        <td className="px-5 py-3 text-slate-600">{r.number}</td>
                        <td className="px-5 py-3 text-slate-600">{r.email}</td>
                        <td className="px-5 py-3 text-slate-600">{r.address || '-'}</td>
                        <td className="px-5 py-3 text-slate-600">{r.status ? 'Active' : 'Inactive'}</td>
                        <td className="px-5 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => deleteRetailer(r.id)}
                            disabled={deletingId === r.id}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredRetailers.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminRetailers
