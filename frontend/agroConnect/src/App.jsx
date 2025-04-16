import {RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate} from 'react-router-dom'

import './App.css'
import Login from './pages/login'
import Register from './pages/register'


const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/'>
    <Route index />
    <Route path='login' element={<Login />} />
    <Route path='register' element={<Register />} />
    <Route path='farmer/:id' >
      <Route path='dashboard' />
      <Route path='listings'>
        <Route path='product/:id' />
      </Route>
      <Route path='addProduct' />
      <Route path='orders' />
    </Route>
    <Route path='consumer/:id'>
      <Route path='dashboard' />
      <Route path='search' />
      <Route path='product/:id' />
      <Route path='cart' />
      <Route path='orders' />
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
