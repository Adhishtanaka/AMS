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
},])


ReactDOM.createRoot(document.getElementById('root')!).render(
 
 <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
  
)
