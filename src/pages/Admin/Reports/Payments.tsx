import { useState } from 'react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'

const AdminPaymentsReport = () => {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [retailer, setRetailer] = useState('')
  const [distributor, setDistributor] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">Payment Report</h1>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-6">
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
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Retailer</label>
                <select value={retailer} onChange={(e) => setRetailer(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All Retailers</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Distributor</label>
                <select value={distributor} onChange={(e) => setDistributor(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All Distributors</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Payment Status</label>
                <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Payment Method</label>
                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="h-9 cursor-pointer rounded-lg bg-primary-main px-6 text-sm font-medium text-white hover:bg-primary-main/90">Generate Report</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminPaymentsReport
