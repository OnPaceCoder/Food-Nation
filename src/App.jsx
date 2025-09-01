import { createTheme, MantineProvider, Notification } from '@mantine/core';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './pages/Layout';
import HomePage from './pages/HomePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NoPageFound from './pages/NoPageFound';
import Cart from './pages/user/Cart';
import Category from './pages/user/Category';
import OrderHistory from './pages/user/OrderHistory';
import Product from './pages/user/Product';
import Products from './pages/user/Products';
import ViewUsers from './pages/admin/ViewUsers';
import { AuthProvider } from '../src/context/AuthContext';
import ViewCategory from './pages/admin/ViewCategory';
import ViewProduct from './pages/admin/ViewProduct';
import Dashboard from './pages/admin/Dashboard';
import UpdateOrder from './pages/admin/UpdateOrder';
import ProtectedRoute from './components/ui/ProtectedRoute';
import Profile from './pages/user/Profile';


const theme = createTheme({
  fontFamily: 'Roboto, sans-serif',
  colorScheme: 'light'
});


function App() {



  return (
    <>
      <MantineProvider
        theme={theme} >
        <AuthProvider>


          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="cart" element={<Cart />} />
                <Route path="category" element={<Category />} />
                <Route path="orders" element={<OrderHistory />} />
                <Route path="profile" element={<Profile />} />
                <Route path="products/:id" element={<Product />} />
                <Route path="products" element={<Products />} />

                {/* Admin Routes */}
                {/* <Route path="/" element={<ProtectedRoute />}> */}
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path="dashboard/orders/:id" element={<UpdateOrder />} />
                <Route path="dashboard/users" element={< ViewUsers />} />
                <Route path="dashboard/category" element={< ViewCategory />} />
                <Route path="dashboard/product" element={< ViewProduct />} />
                <Route path="*" element={<NoPageFound />} />
              </Route>
              {/* </Route> */}
            </Routes>
          </BrowserRouter>

        </AuthProvider>



      </MantineProvider >
    </>
  )
}

export default App
