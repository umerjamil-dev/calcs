import { useEffect } from 'react'
import { Plus, Search, Trash2, Truck } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDistributorStore } from '@/stores/useDistributorStore'

const AdminDistributors = () => {
  const { distributors, loading, deletingId, fetchDistributors, deleteDistributor } = useDistributorStore()

  useEffect(() => {
    fetchDistributors()
  }, [fetchDistributors])

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">Distributors</h1>
            <a href="/admin/distributors/add">
              <Button className="h-9 cursor-pointer gap-2 rounded-lg bg-primary-main px-4 text-sm font-medium text-white hover:bg-primary-main/90">
                <Plus size={16} />
                Add Distributor
              </Button>
            </a>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search distributors..."
                className="h-10 rounded-lg border-slate-200 pl-10"
              />
            </div>
            <p className="text-sm text-slate-500">{distributors.length} distributors found</p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Phone</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Company</th>
                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-slate-500">Loading distributors...</td>
                    </tr>
                  ) : distributors.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Truck size={40} className="mb-2" />
                          <p className="text-sm">No distributors found</p>
                          <a href="/admin/distributors/add" className="mt-2 text-sm font-medium text-primary-main hover:underline">
                            Add your first distributor
                          </a>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    distributors.map((d) => (
                      <tr key={d.id} className="transition-colors hover:bg-slate-50/50">
                        <td className="px-5 py-3 font-medium text-slate-800">{d.name}</td>
                        <td className="px-5 py-3 text-slate-600">{d.number}</td>
                        <td className="px-5 py-3 text-slate-600">{d.email}</td>
                        <td className="px-5 py-3 text-slate-600">{d.company_name || '-'}</td>
                        <td className="px-5 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => deleteDistributor(d.id)}
                            disabled={deletingId === d.id}
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
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDistributors