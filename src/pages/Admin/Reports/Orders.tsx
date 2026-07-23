import { useEffect, useState } from 'react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { useOrderStore } from '@/stores/useOrderStore'
import { useProductStore } from '@/stores/useProductStore'
import api from '@/lib/axios'

const AdminOrdersReport = () => {
  const { users, orders, fetchUsers, fetchOrders } = useOrderStore()
  const { products, fetchProducts } = useProductStore()
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [retailer, setRetailer] = useState('')
  const [distributor, setDistributor] = useState('')
  const [status, setStatus] = useState('')
  const [product, setProduct] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (users.length === 0) fetchUsers()
    if (products.length === 0) fetchProducts()
    if (orders.length === 0) fetchOrders()
  }, [fetchUsers, fetchProducts, fetchOrders, users.length, products.length, orders.length])

  const retailers = users.filter((u) => u.role_id === 3)
  const distributors = users.filter((u) => u.role_id === 2)

  const filteredOrders = orderNumber
    ? orders.filter((o) => o.order_number.toLowerCase().includes(orderNumber.toLowerCase()))
    : []

  const handleDownloadPDF = async () => {
    try {
      const params = new URLSearchParams()
      if (fromDate) params.append('from_date', fromDate)
      if (toDate) params.append('to_date', toDate)
      if (orderNumber) params.append('order_number', orderNumber)
      if (retailer) params.append('retailer_id', retailer)
      if (distributor) params.append('distributor_id', distributor)
      if (status) params.append('status', status)
      if (product) params.append('product_id', product)

      const response = await api.get(`/reports/orders/pdf?${params.toString()}`, {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'orders-report.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error downloading PDF:', error)
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
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">To Date</label>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main" />
              </div>
              <div className="relative">
                <label className="mb-1 block text-xs font-medium text-slate-600">Order Number</label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => {
                    setOrderNumber(e.target.value)
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
                          setOrderNumber(o.order_number)
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
                <select value={retailer} onChange={(e) => setRetailer(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All Retailers</option>
                  {retailers.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Distributor</label>
                <select value={distributor} onChange={(e) => setDistributor(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All Distributors</option>
                  {distributors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
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
                <select value={product} onChange={(e) => setProduct(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All Products</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="h-9 cursor-pointer rounded-lg bg-primary-main px-6 text-sm font-medium text-white hover:bg-primary-main/90">Generate Report</Button>
              <Button onClick={handleDownloadPDF} className="h-9 cursor-pointer rounded-lg border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 hover:bg-slate-50">Download PDF</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminOrdersReport
