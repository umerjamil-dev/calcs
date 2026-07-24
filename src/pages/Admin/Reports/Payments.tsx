import { useEffect, useState } from 'react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { useOrderStore } from '@/stores/useOrderStore'
import { useReportStore } from '@/stores/useReportStore'
import api from '@/lib/axios'

const AdminPaymentsReport = () => {
  const { users, fetchUsers } = useOrderStore()
  const { paymentsFilters, setPaymentsFilter, downloadPaymentsPDF } = useReportStore()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)

  useEffect(() => {
    if (users.length === 0) fetchUsers()
  }, [fetchUsers])

  const retailers = users.filter((u) => u.role_id === 3)
  const distributors = users.filter((u) => u.role_id === 2)

  const generateReport = async () => {
    setPdfLoading(true)
    try {
      const params = new URLSearchParams()
      const f = paymentsFilters
      if (f.fromDate) params.append('from_date', f.fromDate)
      if (f.toDate) params.append('to_date', f.toDate)
      if (f.retailer) params.append('retailer_id', f.retailer)
      if (f.distributor) params.append('distributor_id', f.distributor)
      if (f.paymentStatus) params.append('payment_status', f.paymentStatus)
      if (f.paymentMethod) params.append('payment_method', f.paymentMethod)
      const res = await api.get(`/reports/payment/pdf?${params.toString()}`, { responseType: 'blob' })
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
            <h1 className="text-lg font-semibold text-slate-800">Payment Report</h1>
          </div>
        </header>
        <main className="mx-auto max-w-[1620px] px-6 py-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">Filters</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">From Date</label>
                <input type="date" value={paymentsFilters.fromDate} onChange={(e) => setPaymentsFilter('fromDate', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">To Date</label>
                <input type="date" value={paymentsFilters.toDate} onChange={(e) => setPaymentsFilter('toDate', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Retailer</label>
                <select value={paymentsFilters.retailer} onChange={(e) => setPaymentsFilter('retailer', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All Retailers</option>
                  {retailers.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Distributor</label>
                <select value={paymentsFilters.distributor} onChange={(e) => setPaymentsFilter('distributor', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All Distributors</option>
                  {distributors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Payment Status</label>
                <select value={paymentsFilters.paymentStatus} onChange={(e) => setPaymentsFilter('paymentStatus', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Payment Method</label>
                <select value={paymentsFilters.paymentMethod} onChange={(e) => setPaymentsFilter('paymentMethod', e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All</option>
                  <option value="cash">Cash</option>
                  <option value="easypaisa">EasyPaisa</option>
                  <option value="jazz_cash">Jazz Cash</option>
                  <option value="bank">Bank</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={generateReport} disabled={pdfLoading} className="h-9 cursor-pointer rounded-lg bg-primary-main px-6 text-sm font-medium text-white hover:bg-primary-main/90 disabled:opacity-60">{pdfLoading ? 'Loading...' : 'Generate Report'}</Button>
              <Button onClick={downloadPaymentsPDF} className="h-9 cursor-pointer rounded-lg border border-slate-200 bg-white px-6 text-sm font-medium text-slate-700 hover:bg-slate-50">Download PDF</Button>
            </div>
          </div>

          {pdfUrl && (
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <iframe src={pdfUrl} className="h-[80vh] w-full" title="Payment Report PDF" />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminPaymentsReport
