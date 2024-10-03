import React,{ useEffect, useState } from 'react';
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
  modelId: number;
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
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-gray-800">{car.carTitle}</h1>
                <p className="text-gray-600 mb-4">{car.carDescription}</p>
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
                <a href={`/seller/car-details/${car.id}`} className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
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
