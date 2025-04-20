import {RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate} from 'react-router-dom'

import './App.css'
import Login from './pages/login'
import Register from './pages/register'
import FarmerProfile from './pages/farmerProfile'
import EditProduct from './pages/editProduct'
import FarmerDashboard from './pages/farmerDashboard'
import AddProduct from './pages/farmerAddProduct'
import FarmerProduct from './pages/farmerProduct'
import FarmerOrder from './pages/farmerOrder'
import OrderDetails from './pages/OrderDetails'
import EditFarmerProfile from './pages/editFarmerProfile'
import FarmerHeroPage from './pages/hero'
import Template from './components/template'
import Search from './pages/search'
import SideNavbarConsumer from './components/sideNavbarConsumer'
import ConsumerDashboard from './pages/consumerDashboard'
import ConsumerProfile from './pages/consumerProfile'
import EditConsumerProfile from './pages/editConsumerProfile'
import Cart from './pages/cart'
import ConsumerOrder from './pages/consumerOrder'


const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<Template />} >
    <Route index element={<FarmerHeroPage/>} />
    <Route path='login' element={<Login />} />
    <Route path='register' element={<Register />} />
    <Route path='farmer' element={<FarmerProfile/>}>
      <Route path='dashboard' element={<FarmerDashboard />} />
      <Route path='editFarmerProfile/:id' element={<EditFarmerProfile />} />
      <Route path='products' element={<FarmerProduct />} />
      <Route path='addProduct' element={<AddProduct />} />
      <Route path='editProduct/:id' element={<EditProduct />} />
      <Route path='orders' element={<FarmerOrder />} />
      <Route path='orders/:id' element={<OrderDetails />} />
    </Route>
    <Route path='consumer' element={<ConsumerProfile />} >
      <Route path='dashboard' element={<ConsumerDashboard />} />
      <Route path='editConsumerProfile' element={<EditConsumerProfile />} />
      <Route path='search' element={<Search />} />
      <Route path='product/:id' />
      <Route path='cart' element={<Cart />} />
      <Route path='orders' element={<ConsumerOrder />} />
      <Route path='orders/:id' element={<OrderDetails />} />
    </Route>

  

  </Route>
))

function App() {
  
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
