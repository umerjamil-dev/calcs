import { OrdersList } from '@/components/orders-list'

const AdminAssignedOrders = () => <OrdersList title="Assigned Orders" statusFilter={['confirmed', 'assigned']} />

export default AdminAssignedOrders
