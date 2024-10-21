import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
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
import SellerAddAuction from './routes/SellerAddAuction';
import SellerAuctionDetails from './routes/SellerAuctionDetails';
import BidHistory from './components/BidHistory'; 
import All from './routes/AllAuctions';
import AuctionDetails from './routes/AuctionDetails';
import Home from './components/Home';
const router = createBrowserRouter([
  {
    path: "*",
    element: <Error />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/navbar",
    element: <Nav />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/seller",
    element: <SellerDashboard />,
  },
  {
    path: "/seller/add-car",
    element: <SellerAddCar />,
  },
  {
    path: "/seller/car-details/:carId",
    element: <SellerCarDetail />,
  },
  {
    path: "/seller/create-auction",
    element: <SellerAddAuction />,
  },
  {
    path: "/seller/auction-details/:auctionId",
    element: <SellerAuctionDetails />,
  },
  {
    path: "/buyer/auction/:auctionId/bid-history", 
    element: <BidHistory />,
  },
  {
    path: "/auctions",
    element: <All />,
  },{
    path: "/auction-details/:auctionId",
    element: <AuctionDetails />,
  }
  
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={router} />
    <ToastContainer />
  </>
);