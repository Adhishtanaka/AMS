import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { handleErrorResult } from '../util/TostMessage';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';

interface Auction {
  auctionId: number;
  productId: number;
  startDate: string;
  endDate: string;
  current_Price: number;
  status: string;
}

interface Car {
  id: number;
  carTitle: string;
  carDescription: string;
  img: string;
  manufacturerId: number;
  performanceClassId: number;
  yearId: number;
  price: number;
  carTypeId: number;
  sellerId: number;
}

const SellerAuctionDetails = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    fetchAuctionDetails();
  }, [auctionId]);

  const fetchAuctionDetails = async () => {
    try {
      const auctionResponse = await axios.get<Auction>(`http://localhost:5000/api/Public/GetAuctionById?auctionId=${auctionId}`);
      setAuction(auctionResponse.data);

      const carResponse = await axios.get<Car>(`http://localhost:5000/api/Public/GetCarById?carId=${auctionResponse.data.productId}`);
      setCar(carResponse.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        handleErrorResult(errorMessage);
      } else {
        handleErrorResult('An unexpected error occurred');
      }
    }
  };

  if (!auction || !car) {
    return <div>Loading auction details...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container flex items-center justify-center min-h-screen p-4 mx-auto">
        <div className="max-w-xl p-6 mx-auto overflow-hidden bg-white rounded-lg shadow-lg"> {/* Reduced max width to max-w-xl */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="mb-2 text-2xl font-bold text-gray-800">{car.carTitle}</h1> {/* Adjusted text size */}
                <p className="mb-4 text-gray-600">{car.carDescription}</p>
                <p className="mb-2">
                  <strong>Auction Start Date:</strong>{' '}
                  <span className="text-gray-800">{new Date(auction.startDate).toLocaleString()}</span>
                </p>
                <p className="mb-2">
                  <strong>Auction End Date:</strong>{' '}
                  <span className="text-gray-800">{new Date(auction.endDate).toLocaleString()}</span>
                </p>
                <p className="mb-2">
                  <strong>Auction Initial Price:</strong>{' '}
                  <span className="text-gray-800">USD {car.price}</span>
                </p>
                <p className="mb-2">
                  <strong>Current Bid:</strong>{' '}
                  <span className="text-gray-800">USD {auction.current_Price}</span>
                </p>
                <p className="mb-2">
                  <strong>Auction Status:</strong>{' '}
                  <span className={`px-2 py-1 rounded ${auction.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {auction.status}
                  </span>
                </p>
              </div>
              <div className="mt-4">
                <a href={`/seller/car-details/${car.id}`} className="inline-block px-4 py-2 font-semibold text-white transition duration-200 bg-[#1D2945] rounded-lg hover:bg-[#243357]">
                  View Car Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SellerAuctionDetails;
