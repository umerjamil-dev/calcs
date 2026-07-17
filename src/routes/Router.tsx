import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '@/components/protected-route'
import { Login, Signup } from '../pages/Auth'
import { AdminLogin, AdminDashboard, AdminProducts, AdminAddProduct, AdminEditProduct, AdminProductDetail, AdminBrands, AdminCategories, AdminSubcategories, AdminProductTypes, AdminEngineTypes, AdminRetailers, AdminAddRetailer, AdminDistributors, AdminAddDistributor, AdminOrders, AdminNewOrders, AdminAssignedOrders, AdminProcessingOrders, AdminShippedOrders, AdminDeliveredOrders, AdminCancelledOrders, AdminOrderDetail, AdminReceivePayment, AdminPaymentHistory, AdminOutstandingBalance, AdminNotifications, AdminNotificationDetail } from '../pages/Admin'
import { DistributorLogin, DistributorRequest } from '../pages/Distributor'

const Router = () => {
  return (
    <Routes>
      {/* Retailer */}
      <Route path='/' element={<AdminLogin />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />

      {/* Admin */}
      <Route path='/admin/login' element={<AdminLogin />} />
      <Route path='/admin/dashboard' element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path='/admin/products' element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
      <Route path='/admin/products/add' element={<ProtectedRoute><AdminAddProduct /></ProtectedRoute>} />
      <Route path='/admin/products/edit/:id' element={<ProtectedRoute><AdminEditProduct /></ProtectedRoute>} />
      <Route path='/admin/products/:id' element={<ProtectedRoute><AdminProductDetail /></ProtectedRoute>} />
      <Route path='/admin/brands' element={<ProtectedRoute><AdminBrands /></ProtectedRoute>} />
      <Route path='/admin/categories' element={<ProtectedRoute><AdminCategories /></ProtectedRoute>} />
      <Route path='/admin/subcategories' element={<ProtectedRoute><AdminSubcategories /></ProtectedRoute>} />
      <Route path='/admin/product-types' element={<ProtectedRoute><AdminProductTypes /></ProtectedRoute>} />
      <Route path='/admin/engine-types' element={<ProtectedRoute><AdminEngineTypes /></ProtectedRoute>} />
      <Route path='/admin/retailers' element={<ProtectedRoute><AdminRetailers /></ProtectedRoute>} />
      <Route path='/admin/retailers/add' element={<ProtectedRoute><AdminAddRetailer /></ProtectedRoute>} />
      <Route path='/admin/distributors' element={<ProtectedRoute><AdminDistributors /></ProtectedRoute>} />
      <Route path='/admin/distributors/add' element={<ProtectedRoute><AdminAddDistributor /></ProtectedRoute>} />
      <Route path='/admin/orders' element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
      <Route path='/admin/orders/new' element={<ProtectedRoute><AdminNewOrders /></ProtectedRoute>} />
      <Route path='/admin/orders/assigned' element={<ProtectedRoute><AdminAssignedOrders /></ProtectedRoute>} />
      <Route path='/admin/orders/processing' element={<ProtectedRoute><AdminProcessingOrders /></ProtectedRoute>} />
      <Route path='/admin/orders/shipped' element={<ProtectedRoute><AdminShippedOrders /></ProtectedRoute>} />
      <Route path='/admin/orders/delivered' element={<ProtectedRoute><AdminDeliveredOrders /></ProtectedRoute>} />
      <Route path='/admin/orders/cancelled' element={<ProtectedRoute><AdminCancelledOrders /></ProtectedRoute>} />
      <Route path='/admin/orders/:id' element={<ProtectedRoute><AdminOrderDetail /></ProtectedRoute>} />
      <Route path='/admin/payments/receive' element={<ProtectedRoute><AdminReceivePayment /></ProtectedRoute>} />
      <Route path='/admin/payments/history' element={<ProtectedRoute><AdminPaymentHistory /></ProtectedRoute>} />
      <Route path='/admin/payments/outstanding' element={<ProtectedRoute><AdminOutstandingBalance /></ProtectedRoute>} />
      <Route path='/admin/notifications' element={<ProtectedRoute><AdminNotifications /></ProtectedRoute>} />
      <Route path='/admin/notifications/:id' element={<ProtectedRoute><AdminNotificationDetail /></ProtectedRoute>} />
      
      {/* Distributor */}
      <Route path='/distributor/login' element={<DistributorLogin />} />
      <Route path='/distributor/request' element={<DistributorRequest />} />
    </Routes>
  )
}

export default Router