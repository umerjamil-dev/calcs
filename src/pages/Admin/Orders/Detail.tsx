import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, Truck, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { Button } from '@/components/ui/button'
import { useOrderStore } from '@/stores/useOrderStore'

const statusSteps = ['pending', 'accepted', 'assigned', 'processing', 'shipped', 'delivered']

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    accepted: 'bg-gray-50 text-gray-700 border-gray-200',
    assigned: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    processing: 'bg-purple-50 text-purple-700 border-purple-200',
    shipped: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    delivered: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  }
  return map[status] || 'bg-slate-100 text-slate-700 border-slate-200'
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const AdminOrderDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { orders, users, loading, updating, fetchOrders, fetchUsers, getUserById, updateOrderStatus, assignDistributor } = useOrderStore()
  const [showAssign, setShowAssign] = useState(false)
  const [selectedDistributor, setSelectedDistributor] = useState('')
  const [showStatusChange, setShowStatusChange] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [showSlipModal, setShowSlipModal] = useState(false)

  useEffect(() => {
    fetchOrders()
    if (users.length === 0) fetchUsers()
  }, [fetchOrders, fetchUsers, users.length])
 console.log("detailedorders",orders);
  const order = orders.find((o) => o.id === Number(id))
  if (!order && !loading) {

    return (
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />
        <div className="lg:ml-64">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
            <div className="mx-auto flex max-w-[1620px] items-center gap-3">
              <button onClick={() => navigate(-1)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100">
                <ArrowLeft size={16} />
              </button>
              <h1 className="text-lg font-semibold text-slate-800">Order Not Found</h1>
            </div>
          </header>
          <main className="mx-auto  px-6 py-12 text-center text-slate-500">
            The order you are looking for does not exist.
          </main>
        </div>
      </div>
    )
  }

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />
        <div className="lg:ml-64">
          <main className="mx-auto  px-6 py-12 text-center text-slate-500">Loading...</main>
        </div>
      </div>
    )
  }

  const retailer = getUserById(order.user_id)
  const distributor = getUserById(order.distributor_id)
  const distributors = users.filter((u) => u.role_id === 2)
  const currentStep = statusSteps.indexOf(order.status)
  const isCancelled = order.status === 'cancelled'
  const nextStatus = currentStep < statusSteps.length - 1 ? statusSteps[currentStep + 1] : null

  const handleAssign = async () => {
    if (!selectedDistributor) return
    const success = await assignDistributor(order.id, Number(selectedDistributor))
    if (success) {
      setShowAssign(false)
      setSelectedDistributor('')
    }
  }

  const handleStatusChange = async () => {
    if (!newStatus) return
    const success = await updateOrderStatus(order.id, newStatus)
    if (success) {
      setShowStatusChange(false)
      setNewStatus('')
    }
  }
 

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="lg:ml-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-3">
          <div className="mx-auto flex max-w-[1620px] items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100">
                <ArrowLeft size={16} />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-slate-800">{order.order_number}</h1>
                <p className="text-xs text-slate-500">{formatDate(order.order_date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusBadge(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1620px] px-6 py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left: Order Info + Products */}
            <div className="space-y-6 lg:col-span-2">
              {/* Status Timeline */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-slate-800">Status Timeline</h2>
                {isCancelled ? (
                  <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">
                    <XCircle size={20} className="text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-red-700">Order Cancelled</p>
                      <p className="text-xs text-red-600">This order has been cancelled</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Desktop: Horizontal */}
                    <div className="hidden items-center justify-between md:flex">
                      {statusSteps.map((step, i) => {
                        const isComplete = i <= currentStep
                        const isCurrent = i === currentStep
                        return (
                          <div key={step} className="flex flex-1 items-center">
                            <div className="flex flex-col items-center">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${isComplete ? 'border-primary-main bg-primary-main text-white' : 'border-slate-200 bg-white text-slate-400'} ${isCurrent ? 'ring-2 ring-primary-main/20' : ''}`}>
                                {isComplete ? <CheckCircle size={16} /> : <span className="text-xs">{i + 1}</span>}
                              </div>
                              <span className={`mt-1 text-xs capitalize ${isComplete ? 'font-medium text-slate-700' : 'text-slate-400'}`}>{step}</span>
                            </div>
                            {i < statusSteps.length - 1 && (
                              <div className={`mx-1 h-0.5 flex-1 ${i < currentStep ? 'bg-primary-main' : 'bg-slate-200'}`} />
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Mobile: Vertical */}
                    <div className="space-y-3 md:hidden">
                      {statusSteps.map((step, i) => {
                        const isComplete = i <= currentStep
                        const isCurrent = i === currentStep
                        return (
                          <div key={step} className="flex items-center gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${isComplete ? 'border-primary-main bg-primary-main text-white' : 'border-slate-200 bg-white text-slate-400'} ${isCurrent ? 'ring-2 ring-primary-main/20' : ''}`}>
                                {isComplete ? <CheckCircle size={16} /> : <span className="text-xs">{i + 1}</span>}
                              </div>
                              {i < statusSteps.length - 1 && (
                                <div className={`mt-1 h-4 w-0.5 ${i < currentStep ? 'bg-primary-main' : 'bg-slate-200'}`} />
                              )}
                            </div>
                            <span className={`text-sm capitalize ${isComplete ? 'font-medium text-slate-700' : 'text-slate-400'}`}>{step}</span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Products */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold text-slate-800">Products</h2>
                {order.products.length === 0 ? (
                  <p className="text-sm text-slate-500">No products in this order</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                          <th className="px-4 py-2 font-medium">#</th>
                          <th className="px-4 py-2 font-medium">Product</th>
                          <th className="px-4 py-2 font-medium">Code</th>
                          <th className="px-4 py-2 font-medium text-right">Qty</th>
                          <th className="px-4 py-2 font-medium text-right">Price</th>
                          <th className="px-4 py-2 font-medium text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {order.products.map((op, idx) => (
                          <tr key={op.id}>
                            <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                            <td className="px-4 py-3 font-medium text-slate-800">{op.product?.name || `Product #${op.product_id}`}</td>
                            <td className="px-4 py-3 text-slate-600">{op.product?.p_code || '-'}</td>
                            <td className="px-4 py-3 text-right text-slate-600">{op.quantity}</td>
                            <td className="px-4 py-3 text-right text-slate-600">Rs {Number(op.price).toLocaleString('en-PK')}</td>
                            <td className="px-4 py-3 text-right font-medium text-slate-800">Rs {Number(op.total).toLocaleString('en-PK')}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-slate-50">
                        <tr>
                          <td colSpan={5} className="px-4 py-3 text-right text-sm font-semibold text-slate-700">Total Amount</td>
                          <td className="px-4 py-3 text-right text-sm font-bold text-slate-800">Rs {Number(order.total_amount).toLocaleString('en-PK')}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="mb-2 text-sm font-semibold text-slate-800">Notes</h2>
                  <p className="text-sm text-slate-600">{order.notes}</p>
                </div>
              )}

              <div className='grid grid-cols-2 gap-6'>
                {/* Retailer */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <Users size={16} className="text-slate-500" />
                  <h2 className="text-sm font-semibold text-slate-800">Retailer</h2>
                </div>
                {retailer ? (
                  <div className="space-y-1.5 text-sm">
                    <p className="font-medium text-slate-800">{retailer.name}</p>
                    <p className="text-slate-600">{retailer.email}</p>
                    <p className="text-slate-600">{retailer.number}</p>
                    <p className="text-slate-600">{retailer.address || '-'}</p>
                    {retailer.company_name && <p className="text-slate-500">{retailer.company_name}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">User #{order.user_id}</p>
                )}

                {/* Customer Information - Show only if different from retailer */}
                {order.customer_name && order.customer_name !== retailer?.name && (
                  <>
                    <div className="my-3 border-t border-slate-200" />
                    <div className="mb-2 flex items-center gap-2">
                      <Users size={14} className="text-slate-500" />
                      <h3 className="text-xs font-semibold text-slate-700">Customer Information</h3>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <p className="font-medium text-slate-800"><span className="font-semibold">Customer Name:</span> {order.customer_name}</p>
                      {order.customer_number && order.customer_number !== retailer?.number && (
                        <p className="text-slate-600"><span className="font-semibold">Customer Number:</span> {order.customer_number}</p>
                      )}
                      {order.customer_address && order.customer_address !== retailer?.address && (
                        <p className="text-slate-600"><span className="font-semibold">Customer Address:</span> {order.customer_address}</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Distributor */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <Truck size={16} className="text-slate-500" />
                  <h2 className="text-sm font-semibold text-slate-800">Distributor</h2>
                </div>
                {distributor ? (
                  <div className="space-y-1.5 text-sm">
                    <p className="font-medium text-slate-800">{distributor.name}</p>
                    <p className="text-slate-600">{distributor.email}</p>
                    <p className="text-slate-600">{distributor.number}</p>
                    <p className="text-slate-600">{distributor.address || '-'}</p>
                    {distributor.company_name && <p className="text-slate-500">{distributor.company_name}</p>}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Not assigned yet</p>
                )}

                {/* Driver Information - Processing and beyond */}
                {(order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') && order.driver_name && (
                  <>
                    <div className="my-3 border-t border-slate-200" />
                    <div className="mb-2 flex items-center gap-2">
                      <Truck size={14} className="text-slate-500" />
                      <h3 className="text-xs font-semibold text-slate-700">Driver Information</h3>
                    </div>
                    <div className="space-y-1.5 text-sm">
                      <p className="font-medium text-slate-800"><span className="font-semibold">Driver Name:</span> {order.driver_name}</p>
                      <p className="text-slate-600"><span className="font-semibold">Driver Number:</span> {order.driver_number}</p>
                      <p className="text-slate-600"><span className="font-semibold">Driver Vehicle Number:</span> {order.vehicle_number}</p>
                      {order.expected_delivery && (
                        <p className="text-slate-600"><span className="font-semibold">Expected Delivery:</span> {formatDate(order.expected_delivery)}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
              </div>
            </div>

            {/* Right: Order Info + Statement Slip + Actions */}
            <div className="space-y-6">
              {/* Order Info */}
             

              {/* Statement Slip - Only for delivered orders */}
              {order.status === 'delivered' && order.statement_slip && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <Package size={16} className="text-slate-500" />
                    <h2 className="text-sm font-semibold text-slate-800">Statement Slip</h2>
                  </div>
                  <div className="rounded-lg border border-slate-200">
                    <img
                      src={order.statement_slip}
                      alt="Statement Slip"
                      className=" object-contain mx-auto h-[38vh] cursor-pointer "
                      onClick={() => setShowSlipModal(true)}
                    />
                  </div>
                </div>
              )}
 <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <Package size={16} className="text-slate-500" />
                  <h2 className="text-sm font-semibold text-slate-800">Order Info</h2>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Order Date</span>
                    <span className="font-medium text-slate-700">{formatDate(order.order_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Delivered At</span>
                    <span className="font-medium text-slate-700">{order.delivered_at ? formatDate(order.delivered_at) : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Amount</span>
                    <span className="font-bold text-slate-800">Rs {Number(order.total_amount).toLocaleString('en-PK')}</span>
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <AlertCircle size={16} className="text-slate-500" />
                  <h2 className="text-sm font-semibold text-slate-800">Actions</h2>
                </div>
                <div className="space-y-3">
                  {/* Assign Distributor - Only when accepted */}
                  {order.status === 'accepted' && (
                    <div>
                      {!showAssign ? (
                        <Button onClick={() => setShowAssign(true)} className="h-9 w-full cursor-pointer rounded-lg bg-primary-main text-sm font-medium text-white hover:bg-primary-main/90">
                          Assign Distributor
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <select
                            value={selectedDistributor}
                            onChange={(e) => setSelectedDistributor(e.target.value)}
                            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none"
                          >
                            <option value="">Select Distributor</option>
                            {distributors.map((d) => (
                              <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                          </select>
                          <div className="flex gap-2">
                            <Button onClick={handleAssign} disabled={updating || !selectedDistributor} className="h-8 flex-1 cursor-pointer rounded-lg bg-primary-main text-xs font-medium text-white hover:bg-primary-main/90 disabled:opacity-60">
                              {updating ? 'Assigning...' : 'Assign'}
                            </Button>
                            <Button onClick={() => setShowAssign(false)} className="h-8 flex-1 cursor-pointer rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* After Assignment - Distributor Working */}
                  {order.status !== 'pending' && order.status !== 'accepted' && !isCancelled && (
                    <div className="rounded-lg bg-indigo-50 p-3 text-center">
                      <p className="text-xs font-medium text-indigo-700">
                        Distributor is working on this order
                      </p>
                    </div>
                  )}

                  {/* Change Status - Only for pending to accepted */}
                  {order.status === 'pending' && (
                    <Button
                      onClick={async () => {
                        const success = await updateOrderStatus(order.id, 'accepted')
                        if (success) setNewStatus('')
                      }}
                      disabled={updating}
                      className="h-9 w-full cursor-pointer rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                      {updating ? 'Updating...' : 'Mark as Accepted'}
                    </Button>
                  )}
                  {!isCancelled && order.status === 'delivered' && (
                    <p className="text-center text-xs text-slate-400">Order completed</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Statement Slip Modal */}
      {showSlipModal && order.statement_slip && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowSlipModal(false)}
        >
          <div className="relative max-h-[90vh] max-w-5xl">
            <button
              onClick={() => setShowSlipModal(false)}
              className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-600 shadow-lg hover:bg-slate-100"
            >
              <XCircle size={20} />
            </button>
            <img
              src={order.statement_slip}
              alt="Statement Slip"
              className="max-h-[70vh] w-auto rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminOrderDetail
