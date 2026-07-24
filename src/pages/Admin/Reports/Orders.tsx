import { useEffect, useState } from 'react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { useOrderStore } from '@/stores/useOrderStore'
import { useProductStore } from '@/stores/useProductStore'
import { useReportStore } from '@/stores/useReportStore'
import api from '@/lib/axios'

const AdminOrdersReport = () => {
  const { users, orders, fetchUsers, fetchOrders } = useOrderStore()
  const { products, fetchProducts } = useProductStore()
  const { ordersFilters, setOrdersFilter, downloadOrdersPDF } = useReportStore()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    if (users.length === 0) fetchUsers()
    if (products.length === 0) fetchProducts()
    if (orders.length === 0) fetchOrders()
  }, [fetchUsers, fetchProducts, fetchOrders, users.length, products.length, orders.length])

  const retailers = users.filter((u) => u.role_id === 3)
  const distributors = users.filter((u) => u.role_id === 2)

  const filteredOrders = ordersFilters.orderNumber
    ? orders.filter((o) => o.order_number.toLowerCase().includes(ordersFilters.orderNumber.toLowerCase()))
    : []

  const generateReport = async () => {
    setPdfLoading(true)
    try {
      const params = new URLSearchParams()
      const f = ordersFilters
      if (f.fromDate) params.append('from_date', f.fromDate)
      if (f.toDate) params.append('to_date', f.toDate)
      if (f.orderNumber) params.append('order_number', f.orderNumber)
      if (f.retailer) params.append('retailer_id', f.retailer)
      if (f.distributor) params.append('distributor_id', f.distributor)
      if (f.status) params.append('status', f.status)
      if (f.product) params.append('product_id', f.product)
      const res = await api.get(`/reports/orders/pdf?${params.toString()}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      if (pdfUrl) window.URL.revokeObjectURL(pdfUrl)
      setPdfUrl(url)
    } catch {
      setPdfUrl(null)
    } finally {
      setPdfLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-[1620px] items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">Orders Report</h1>
          </div>
        </header>
        <main className="mx-auto max-w-[1620px] px-6 py-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">Filters</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">From Date</label>
                <input type="date" value={ordersFilters.fromDate} onChange={(e) => setOrdersFilter('fromDate', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">To Date</label>
                <input type="date" value={ordersFilters.toDate} onChange={(e) => setOrdersFilter('toDate', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main" />
              </div>
              <div className="relative">
                <label className="mb-1 block text-xs font-medium text-slate-600">Order Number</label>
                <input
                  type="text"
                  value={ordersFilters.orderNumber}
                  onChange={(e) => {
                    setOrdersFilter('orderNumber', e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Enter order number"
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main"
                />
                {showSuggestions && filteredOrders.length > 0 && (
                  <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                    {filteredOrders.map((o) => (
                      <div
                        key={o.id}
                        onClick={() => {
                          setOrdersFilter('orderNumber', o.order_number)
                          setShowSuggestions(false)
                        }}
                        className="cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                      >
                        {o.order_number}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Retailer</label>
                <select value={ordersFilters.retailer} onChange={(e) => setOrdersFilter('retailer', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All Retailers</option>
                  {retailers.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Distributor</label>
                <select value={ordersFilters.distributor} onChange={(e) => setOrdersFilter('distributor', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All Distributors</option>
                  {distributors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Status</label>
                <select value={ordersFilters.status} onChange={(e) => setOrdersFilter('status', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Product</label>
                <select value={ordersFilters.product} onChange={(e) => setOrdersFilter('product', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All Products</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={generateReport} disabled={pdfLoading} className="h-9 cursor-pointer rounded-lg bg-primary-main px-6 text-sm font-medium text-white hover:bg-primary-main/90 disabled:opacity-60">{pdfLoading ? 'Loading...' : 'Generate Report'}</Button>
              <Button onClick={downloadOrdersPDF} className="h-9 cursor-pointer rounded-lg border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 hover:bg-slate-50">Download PDF</Button>
            </div>
          </div>

          {pdfUrl && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <iframe src={pdfUrl} className="h-[80vh] w-full" title="Orders Report PDF" />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminOrdersReport
