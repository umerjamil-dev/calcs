import { Routes, Route } from 'react-router-dom'
import { Login, Signup } from '../pages/Auth'
import { AdminLogin, AdminDashboard, AdminProducts, AdminAddProduct, AdminBrands, AdminCategories, AdminSubcategories, AdminProductTypes, AdminEngineTypes, AdminRetailers, AdminAddRetailer, AdminDistributors, AdminAddDistributor } from '../pages/Admin'
import { DistributorLogin, DistributorRequest } from '../pages/Distributor'

const Router = () => {
  return (
    <Routes>
      {/* Retailer */}
      <Route path='/' element={<Login />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />

      {/* Admin */}
      <Route path='/admin/login' element={<AdminLogin />} />
      <Route path='/admin/dashboard' element={<AdminDashboard />} />
      <Route path='/admin/products' element={<AdminProducts />} />
      <Route path='/admin/products/add' element={<AdminAddProduct />} />
      <Route path='/admin/brands' element={<AdminBrands />} />
      <Route path='/admin/categories' element={<AdminCategories />} />
      <Route path='/admin/subcategories' element={<AdminSubcategories />} />
      <Route path='/admin/product-types' element={<AdminProductTypes />} />
      <Route path='/admin/engine-types' element={<AdminEngineTypes />} />
      <Route path='/admin/retailers' element={<AdminRetailers />} />
      <Route path='/admin/retailers/add' element={<AdminAddRetailer />} />
      <Route path='/admin/distributors' element={<AdminDistributors />} />
      <Route path='/admin/distributors/add' element={<AdminAddDistributor />} />

      {/* Distributor */}
      <Route path='/distributor/login' element={<DistributorLogin />} />
      <Route path='/distributor/request' element={<DistributorRequest />} />
    </Routes>
  )
}

export default Router