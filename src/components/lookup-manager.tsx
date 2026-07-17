import { useEffect } from 'react'
import { Plus, Trash2, Search, Tag } from 'lucide-react'
import { AdminSidebar } from './admin-sidebar'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useLookupStore } from '@/stores/useLookupStore'

interface LookupManagerProps {
  title: string
  endpoint: string
}

export function LookupManager({ title, endpoint }: LookupManagerProps) {
  const { items, loading, adding, deletingId, name, setName, fetchItems, addItem, deleteItem } = useLookupStore()

  useEffect(() => {
    fetchItems(endpoint)
  }, [fetchItems, endpoint])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await addItem(endpoint)
  }

  const label = title.replace('Management', '').trim()

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
            <span className="rounded-full bg-primary-main/10 px-3 py-1 text-xs font-medium text-primary-main">
              {items.length} {label}s
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Add form */}
            <section className="lg:col-span-1">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-main/10 text-primary-main">
                    <Tag size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-800">Add {label}</h2>
                    <p className="text-xs text-slate-500">Create a new {label.toLowerCase()}</p>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">Name *</label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={`Enter ${label.toLowerCase()} name...`}
                      className="h-10 rounded-lg border-slate-200 text-sm"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={adding}
                    className="h-10 w-full cursor-pointer gap-2 rounded-lg bg-primary-main text-sm font-medium text-white hover:bg-primary-main/90 disabled:opacity-60"
                  >
                    <Plus size={16} />
                    {adding ? 'Adding...' : `Add ${label}`}
                  </Button>
                </form>
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                  <p className="text-xl font-bold text-slate-800">{items.length}</p>
                  <p className="text-xs text-slate-500">Total {label}s</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                  <p className="text-xl font-bold text-green-600">{items.filter((i) => i.name).length}</p>
                  <p className="text-xs text-slate-500">Active</p>
                </div>
              </div>
            </section>

            {/* List */}
            <section className="lg:col-span-2">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
                  <h3 className="text-sm font-semibold text-slate-800">All {label}s</h3>
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="h-8 w-40 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-700 outline-none sm:w-56"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="px-5 py-12 text-center">
                    <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-primary-main" />
                    <p className="text-sm text-slate-500">Loading {label.toLowerCase()}s...</p>
                  </div>
                ) : items.length === 0 ? (
                  <div className="px-5 py-14 text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                      <Tag size={24} className="text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">No {label.toLowerCase()}s found</p>
                    <p className="mt-1 text-xs text-slate-500">Add your first {label.toLowerCase()} to get started</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-5 py-3 font-medium">#No</th>
                        <th className="px-5 py-3 font-medium">Name</th>
                        <th className="px-5 py-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item, index) => (
                        <tr key={item.id} className="transition-colors hover:bg-slate-50/50">
                          <td className="px-5 py-3 text-slate-500">{index + 1}</td>
                          <td className="px-5 py-3 font-medium text-slate-800">{item.name}</td>
                          <td className="px-5 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => deleteItem(endpoint, item.id)}
                              disabled={deletingId === item.id}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-red-500 transition-colors hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
