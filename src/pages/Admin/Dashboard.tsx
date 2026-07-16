import { useNavigate } from 'react-router-dom'
import { Bell, CalendarDays, TrendingUp, TrendingDown, Package, ShoppingCart, Users, Truck, CreditCard, Wallet, ArrowUpRight } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/admin/login')
  }

  const overview = [
    { label: 'Total Retailers', value: '520', change: '+12%', up: true, icon: Users },
    { label: 'Total Distributors', value: '54', change: '+5%', up: true, icon: Truck },
    { label: 'Total Products', value: '128', change: '+8%', up: true, icon: Package },
    { label: 'Total Orders', value: '1,245', change: '-2%', up: false, icon: ShoppingCart },
  ]

  const orders = [
    { label: 'Pending', value: 24, total: 1245 },
    { label: 'Confirmed', value: 86, total: 1245 },
    { label: 'Processing', value: 42, total: 1245 },
    { label: 'Shipped', value: 38, total: 1245 },
    { label: 'Delivered', value: 1050, total: 1245 },
    { label: 'Cancelled', value: 12, total: 1245 },
  ]

  const financials = [
    { label: 'Total Sales', value: 'Rs 4.2M', icon: Wallet },
    { label: 'Total Payments', value: 'Rs 3.8M', icon: CreditCard },
    { label: "Today's Orders", value: '47', icon: ShoppingCart },
  ]

  const recent = [
    { id: '#ORD-4521', retailer: 'Ali Petroleum', amount: 'Rs 85,000', status: 'Delivered', date: 'Today, 10:23 AM' },
    { id: '#ORD-4520', retailer: 'Karachi Fuels', amount: 'Rs 142,000', status: 'Shipped', date: 'Today, 09:15 AM' },
    { id: '#ORD-4519', retailer: 'Lahore Gas Station', amount: 'Rs 67,500', status: 'Processing', date: 'Yesterday' },
    { id: '#ORD-4518', retailer: 'Multan Traders', amount: 'Rs 210,000', status: 'Pending', date: 'Yesterday' },
    { id: '#ORD-4517', retailer: 'Faisalabad Fuels', amount: 'Rs 95,000', status: 'Cancelled', date: '2 days ago' },
  ]

  const quickActions = [
    { label: 'Add Product', path: '/admin/products/add' },
    { label: 'Add Retailer', path: '/admin/retailers/add' },
    { label: 'Add Distributor', path: '/admin/distributors/add' },
    { label: 'Receive Payment', path: '/admin/payments/receive' },
  ]

  const statusClass = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-slate-100 text-slate-700'
      case 'Shipped': return 'bg-slate-100 text-slate-700'
      case 'Processing': return 'bg-slate-100 text-slate-700'
      case 'Pending': return 'bg-slate-100 text-slate-700'
      case 'Cancelled': return 'bg-red-50 text-red-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays size={16} />
              <span>{new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-4">
              <button type="button" className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
                <Bell size={18} />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-secondary-main" />
              </button>
              <div className="hidden h-8 w-px bg-slate-200 sm:block" />
              <div className="hidden items-center gap-3 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
                  {(user.name || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-800">{user.name || 'Admin'}</p>
                  <p className="text-xs text-slate-500">{user.email || 'admin@mal.com.pk'}</p>
                </div>
              </div>
              <Button onClick={handleLogout} className="h-8 cursor-pointer rounded-lg bg-secondary-main px-4 text-sm font-medium text-white hover:bg-secondary-main/90">
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-6">
          {/* Welcome banner */}
          <div className="relative mb-6 overflow-hidden rounded-2xl bg-primary-main px-6 py-8 text-white shadow-md">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
            <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-white/5" />
            <div className="relative z-10">
              <p className="text-sm font-medium text-white/80">Admin Portal</p>
              <h1 className="mt-1 text-2xl font-bold">Welcome back, {user.name || 'Admin'}!</h1>
              <p className="mt-2 max-w-xl text-sm text-white/70">Manage your fuel distribution network, track orders, and monitor payments from one place.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {quickActions.map((a) => (
                  <a
                    key={a.label}
                    href={a.path}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
                  >
                    {a.label}
                    <ArrowUpRight size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Overview */}
          <section className="mb-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Overview</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {overview.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500">{item.label}</p>
                      <p className="mt-1 text-2xl font-bold text-slate-800">{item.value}</p>
                      <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${item.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {item.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {item.change} this month
                      </div>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <item.icon size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Order Status */}
            <section className="xl:col-span-2">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Order Status</h2>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {orders.map((o) => (
                    <div key={o.label} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-600">{o.label}</p>
                        <span className="text-xs text-slate-400">{Math.round((o.value / o.total) * 100)}%</span>
                      </div>
                      <p className="mt-1 text-xl font-bold text-slate-800">{o.value.toLocaleString()}</p>
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full rounded-full bg-slate-400" style={{ width: `${(o.value / o.total) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Financials */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Financials</h2>
              <div className="space-y-3">
                {financials.map((f) => (
                  <div key={f.label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <f.icon size={22} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">{f.label}</p>
                      <p className="text-lg font-bold text-slate-800">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Recent Orders */}
          <section className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Recent Orders</h2>
              <a href="/admin/orders" className="text-sm font-medium text-primary-main hover:underline">View All</a>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-medium">Order ID</th>
                      <th className="px-5 py-3 font-medium">Retailer</th>
                      <th className="px-5 py-3 font-medium">Amount</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recent.map((r) => (
                      <tr key={r.id} className="transition-colors hover:bg-slate-50/50">
                        <td className="px-5 py-3 font-medium text-slate-700">{r.id}</td>
                        <td className="px-5 py-3 text-slate-600">{r.retailer}</td>
                        <td className="px-5 py-3 font-medium text-slate-800">{r.amount}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(r.status)}`}>{r.status}</span>
                        </td>
                        <td className="px-5 py-3 text-right text-slate-500">{r.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
