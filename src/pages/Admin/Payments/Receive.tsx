import { useState, useEffect } from 'react'
import { CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePaymentStore } from '@/stores/usePaymentStore'
import { useOrderStore } from '@/stores/useOrderStore'

const AdminReceivePayment = () => {
  const { users, fetchUsers } = useOrderStore()
  const { submitting, receivePayment, retailerPaymentInfo, fetchRetailerPaymentInfo } = usePaymentStore()
  const [retailerId, setRetailerId] = useState('')
//   const [distributorId, setDistributorId] = useState('') 
  const [orderId, setOrderId] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (users.length === 0) fetchUsers()
  }, [fetchUsers, users.length])

  const retailers = users.filter((u) => u.role_id === 3)

  const handleRetailerChange = (id: string) => {
    setRetailerId(id)
    setOrderId('')
    setAmount('')
    if (id) {
      fetchRetailerPaymentInfo(Number(id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!retailerId  || !orderId || !amount || !paymentMethod) {
      toast.error('Please fill all required fields')
      return
    }
    const success = await receivePayment({
      order_id: Number(orderId),
      amount: Number(amount),
      payment_method: paymentMethod,
      date: paymentDate,
      notes: notes || undefined,
    })
    if (success) {
      setRetailerId('')
    //   setDistributorId('')
      setOrderId('')
      setAmount('')
      setPaymentMethod('')
      setNotes('')
      setPaymentDate(new Date().toISOString().split('T')[0])
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-[1620px] items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">Receive Payment</h1>
          </div>
        </header>

        <main className="mx-auto max-w-8xl px-6 py-6">
          <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
              <CreditCard size={16} className="text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-800">Payment Details</h2>
            </div>

            <div className="space-y-3 p-5">
              {/* Row 1: Retailer & Distributor */}
              <div className="grid grid-cols-1 gap-3 ">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Retailer *</label>
                  <select
                    value={retailerId}
                    onChange={(e) => handleRetailerChange(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800 outline-none"
                  >
                    <option value="">Select Retailer</option>
                    {retailers.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                {/* <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Distributor *</label>
                  <select
                    value={distributorId}
                    onChange={(e) => setDistributorId(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800 outline-none"
                  >
                    <option value="">Select Distributor</option>
                    {distributors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div> */}
              </div>

              {/* Retailer Payment Summary */}
              {retailerPaymentInfo && retailerId && (
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <p className="text-xs text-slate-500">Total Orders</p>
                      <p className="text-sm font-semibold text-slate-800">Rs {retailerPaymentInfo.total_order_amount.toLocaleString('en-PK')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Previous Payments</p>
                      <p className="text-sm font-semibold text-green-600">Rs {Number(retailerPaymentInfo.previous_payments).toLocaleString('en-PK')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Outstanding</p>
                      <p className="text-sm font-semibold text-red-600">Rs {retailerPaymentInfo.outstanding_balance.toLocaleString('en-PK')}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Row 2: Date & Order */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Date *</label>
                  <Input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="h-9 rounded-lg border-slate-200 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Order *</label>
                  <select
                    value={orderId}
                    onChange={(e) => { setOrderId(e.target.value); if (e.target.value) setAmount(retailerPaymentInfo?.orders.find(o => o.id === Number(e.target.value))?.total_amount || '') }}
                    disabled={!retailerPaymentInfo}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800 outline-none disabled:bg-slate-50 disabled:text-slate-400"
                  >
                    <option value="">{retailerPaymentInfo ? 'Select Order' : 'Select retailer first'}</option>
                    {retailerPaymentInfo?.orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.order_number} - Rs {Number(o.total_amount).toLocaleString('en-PK')} ({o.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Amount & Payment Method */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Amount *</label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="h-9 rounded-lg border-slate-200 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-800 outline-none"
                  >
                    <option value="">Select Method</option>
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                    <option value="online">Online Payment</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes..."
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-800 outline-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="h-9 w-full cursor-pointer rounded-lg bg-primary-main text-sm font-medium text-white hover:bg-primary-main/90 disabled:opacity-60"
              >
                {submitting ? 'Processing...' : 'Receive Payment'}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default AdminReceivePayment
