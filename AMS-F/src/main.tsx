import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import './index.css'
import Login from './routes/login';
import Register from './routes/register';
import Error from './routes/error';
import Admin from './routes/Admin';
import Nav from './components/navbar';
import Contact from './routes/contact';
import { ToastContainer } from 'react-toastify';
import SellerDashboard from './routes/SellerDashboard';
import SellerAddCar from './routes/SellerAddCar';
import SellerCarDetail from './routes/SellerCarDetails';


const queryClient = new QueryClient()

const router = createBrowserRouter([{
  path: "*",
  element: <Error/>
},  {
  path: "/login",
  element: <Login/>,
},
{
  path: "/Register",
  element: <Register/>,
},
{
  path: "/Admin",
  element: <Admin/>,
},
{
  path: "/navbar",
  element: <Nav/>,
},
{
  path: "/contact",
  element: <Contact/>,
},
{
  path: "/contact",
  element: <Contact/>,
},
{
  path: "/seller",
  element: <SellerDashboard/>,
},
{
  path: "/seller/add-car",
  element: <SellerAddCar/>,
},{
  path: "/car-details/:carId", 
  element: <SellerCarDetail />,
},
])

ReactDOM.createRoot(document.getElementById('root')!).render(
 
 <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ToastContainer />
    </QueryClientProvider>
  </React.StrictMode>,
  
)
