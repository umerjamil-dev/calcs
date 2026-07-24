import { useEffect, useState } from 'react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { useOrderStore } from '@/stores/useOrderStore'
import { useProductStore } from '@/stores/useProductStore'
import { useReportStore } from '@/stores/useReportStore'
import api from '@/lib/axios'

const AdminSalesReport = () => {
  const { users, fetchUsers } = useOrderStore()
  const { products, fetchProducts } = useProductStore()
  const { salesFilters, setSalesFilter, downloadSalesPDF } = useReportStore()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    if (users.length === 0) fetchUsers()
    if (products.length === 0) fetchProducts()
  }, [fetchUsers, fetchProducts])

  const retailers = users.filter((u) => u.role_id === 3)
  const distributors = users.filter((u) => u.role_id === 2)

  const generateReport = async () => {
    setPdfLoading(true)
    try {
      const params = new URLSearchParams()
      const f = salesFilters
      if (f.fromDate) params.append('from_date', f.fromDate)
      if (f.toDate) params.append('to_date', f.toDate)
      if (f.distributor) params.append('distributor_id', f.distributor)
      if (f.retailer) params.append('retailer_id', f.retailer)
      if (f.product) params.append('product_id', f.product)
      if (f.paymentStatus) params.append('payment_status', f.paymentStatus)
      if (f.orderStatus) params.append('order_status', f.orderStatus)
      const res = await api.get(`/reports/sales/pdf?${params.toString()}`, { responseType: 'blob' })
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
            <h1 className="text-lg font-semibold text-slate-800">Sales Report</h1>
          </div>
        </header>
        <main className="mx-auto max-w-[1620px] px-6 py-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">Filters</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">From Date</label>
                <input type="date" value={salesFilters.fromDate} onChange={(e) => setSalesFilter('fromDate', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">To Date</label>
                <input type="date" value={salesFilters.toDate} onChange={(e) => setSalesFilter('toDate', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Distributor</label>
                <select value={salesFilters.distributor} onChange={(e) => setSalesFilter('distributor', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All Distributors</option>
                  {distributors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Retailer</label>
                <select value={salesFilters.retailer} onChange={(e) => setSalesFilter('retailer', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All Retailers</option>
                  {retailers.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Product</label>
                <select value={salesFilters.product} onChange={(e) => setSalesFilter('product', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All Products</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Payment Status</label>
                <select value={salesFilters.paymentStatus} onChange={(e) => setSalesFilter('paymentStatus', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All</option>
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Order Status</label>
                <select value={salesFilters.orderStatus} onChange={(e) => setSalesFilter('orderStatus', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">Select</option>
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="assigned">Assigned</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={generateReport} disabled={pdfLoading} className="h-9 cursor-pointer rounded-lg bg-primary-main px-6 text-sm font-medium text-white hover:bg-primary-main/90 disabled:opacity-60">{pdfLoading ? 'Loading...' : 'Generate Report'}</Button>
              <Button onClick={downloadSalesPDF} className="h-9 cursor-pointer rounded-lg border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 hover:bg-slate-50">Download PDF</Button>
            </div>
          </div>

          {pdfUrl && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <iframe src={pdfUrl} className="h-[80vh] w-full" title="Sales Report PDF" />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminSalesReport
