import { Routes, Route } from 'react-router-dom'
import { Login, Signup } from '../pages/Auth'
import { AdminLogin } from '../pages/Admin'
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

      {/* Distributor */}
      <Route path='/distributor/login' element={<DistributorLogin />} />
      <Route path='/distributor/request' element={<DistributorRequest />} />
    </Routes>
  )
}

export default Router