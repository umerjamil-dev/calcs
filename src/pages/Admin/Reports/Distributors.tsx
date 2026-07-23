import { useEffect, useState } from 'react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { useOrderStore } from '@/stores/useOrderStore'
import api from '@/lib/axios'

const AdminDistributorsReport = () => {
  const { users, fetchUsers } = useOrderStore()
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [distributor, setDistributor] = useState('')

  useEffect(() => {
    if (users.length === 0) fetchUsers()
  }, [fetchUsers, users.length])

  const distributors = users.filter((u) => u.role_id === 2)

  const handleDownloadPDF = async () => {
    try {
      const params = new URLSearchParams()
      if (fromDate) params.append('from_date', fromDate)
      if (toDate) params.append('to_date', toDate)
      if (distributor) params.append('distributor_id', distributor)

      const response = await api.get(`/reports/distributors/pdf?${params.toString()}`, {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'distributors-report.pdf')
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
            <h1 className="text-lg font-semibold text-slate-800">Distributor Report</h1>
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
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Distributor</label>
                <select value={distributor} onChange={(e) => setDistributor(e.target.value)} className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none focus:border-primary-main">
                  <option value="">All Distributors</option>
                  {distributors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
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

export default AdminDistributorsReport
