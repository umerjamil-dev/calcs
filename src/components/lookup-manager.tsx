import { useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
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

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-6 py-6">
          {/* Add form */}
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">Add New {title.replace('Management', '').trim()}</h2>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name..."
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
              <h3 className="text-sm font-semibold text-slate-700">All {title.replace('Management', '').trim()} ({items.length})</h3>
            </div>
            {loading ? (
              <div className="px-5 py-8 text-center text-sm text-slate-500">Loading...</div>
            ) : items.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-500">No items found</div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-slate-50/50">
                    <span className="text-sm font-medium text-slate-800">{item.name}</span>
                    <button
                      type="button"
                      onClick={() => deleteItem(endpoint, item.id)}
                      disabled={deletingId === item.id}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
