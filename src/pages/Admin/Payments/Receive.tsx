import { useState, useEffect } from 'react'
import { CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePaymentStore } from '@/stores/usePaymentStore'
import { useOrderStore } from '@/stores/useOrderStore'

const AdminReceivePayment = () => {
  const { orders, users, fetchOrders, fetchUsers, getUserById } = useOrderStore()
  const { submitting, receivePayment } = usePaymentStore()
  const [orderId, setOrderId] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchOrders()
    if (users.length === 0) fetchUsers()
  }, [fetchOrders, fetchUsers, users.length])

  const pendingOrders = orders.filter((o) => ['delivered', 'shipped', 'confirmed', 'assigned'].includes(o.status))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId || !amount || !paymentMethod) {
      toast.error('Please fill all required fields')
      return
    }
    const success = await receivePayment({
      order_id: Number(orderId),
      amount: Number(amount),
      payment_method: paymentMethod,
      notes: notes || undefined,
    })
    if (success) {
      setOrderId('')
      setAmount('')
      setPaymentMethod('')
      setNotes('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">Receive Payment</h1>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-6 py-6">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <CreditCard size={18} className="text-slate-500" />
              <h2 className="text-sm font-semibold text-slate-800">Payment Details</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Order *</label>
                <select
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none"
                >
                  <option value="">Select Order</option>
                  {pendingOrders.map((o) => {
                    const retailer = getUserById(o.user_id)
                    return (
                      <option key={o.id} value={o.id}>
                        {o.order_number} - {retailer?.name || `User #${o.user_id}`} (Rs {Number(o.total_amount).toLocaleString('en-PK')})
                      </option>
                    )
                  })}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Amount *</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="50000"
                  className="h-10 rounded-lg border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Payment Method *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none"
                >
                  <option value="">Select Method</option>
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                  <option value="online">Online Payment</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes..."
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="h-10 w-full cursor-pointer rounded-lg bg-primary-main text-sm font-medium text-white hover:bg-primary-main/90 disabled:opacity-60"
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
