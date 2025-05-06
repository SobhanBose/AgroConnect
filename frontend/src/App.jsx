import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import Login from './pages/login';
import Register from './pages/register';
import FarmerProfile from './pages/farmerProfile';
import EditProduct from './pages/editProduct';
import FarmerDashboard from './pages/farmerDashboard';
import AddProduct from './pages/farmerAddProduct';
import FarmerProduct from './pages/farmerProduct';
import FarmerOrder from './pages/farmerOrder';
import OrderDetails from './pages/OrderDetails';
import EditFarmerProfile from './pages/editFarmerProfile';
import FarmerHeroPage from './pages/hero';
import Template from './components/template';
import Search from './pages/search';
import ConsumerDashboard from './pages/consumerDashboard';
import ConsumerProfile from './pages/consumerProfile';
import EditConsumerProfile from './pages/editConsumerProfile';
import Cart from './pages/cart';
import ConsumerOrder from './pages/consumerOrder';
import ProductPage from './pages/productpage';
import ProductDetails from './pages/farmerProductDetails';
import FarmerProductPage from './pages/farmerproductpage';
import AIChat from './pages/AIChat';
import NearestFarmers from './pages/nearestFarmer';
import AIAddProduct from './pages/addProductBot';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Template />} >
      <Route index element={<FarmerHeroPage />} />
      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path='search' element={<Search />} />
      <Route path='nearestFarmers' element={<NearestFarmers />} />
      <Route path='chat' element={<AIChat />} />
      <Route path='product/:id' element={<ProductPage />} />
      <Route path='farmerProduct/:id' element={<FarmerProductPage />} />

      <Route path='farmer' element={<FarmerProfile />}>
        <Route path='dashboard' element={<FarmerDashboard />} />
        <Route path='editFarmerProfile' element={<EditFarmerProfile />} />
        <Route path='addProduct' element={<AddProduct />} />
        <Route path='addProductBot' element={<AIAddProduct />} />
        <Route path='products' element={<FarmerProduct />} />
        <Route path='products/:id' element={<ProductDetails />} />
        <Route path='editProduct/:id' element={<EditProduct />} />
        <Route path='orders' element={<FarmerOrder />} />
        <Route path='orders/:id' element={<OrderDetails />} />
      </Route>

      <Route path='consumer' element={<ConsumerProfile />} >
        <Route path='dashboard' element={<ConsumerDashboard />} />
        <Route path='editConsumerProfile' element={<EditConsumerProfile />} />
        <Route path='cart' element={<Cart />} />
        <Route path='orders' element={<ConsumerOrder />} />
        <Route path='orders/:id' element={<OrderDetails />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
