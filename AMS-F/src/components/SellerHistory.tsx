import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { handleErrorResult } from '../util/TostMessage';
import api from '../util/api';

interface Auction {
  auctionId: number;
  productId: number;
  startDate: string;
  endDate: string;
  current_Price: number;
  status: string;
  carTitle?: string;
}

interface Car {
  id: number;
  carTitle: string;
  carDescription: string;
  manufacturerId: number;
  performanceClassId: number;
  yearId: number;
  price: number;
  carTypeId: number;
  sellerId: number;
}

const SellerHistory = () =>   {
const [auctions, setAuctions] = useState<Auction[]>([]);
const [loading, setLoading] = useState<boolean>(true);


useEffect(() => {
  fetchAuctions();
}, []);

const fetchCarDetails = async (productId: number) => {
  try {
    const response = await axios.get<Car>(`http://localhost:5000/api/Public/GetCarById?carId=${productId}`);
    return response.data.carTitle;
  } catch (error) {
    console.error('Error fetching car details:', error);
    return 'Unknown Car';
  }
};

const fetchAuctions = async () => {
  try {
    setLoading(true);
    const response = await api.get<Auction[]>('http://localhost:5000/api/Seller/GetAuctionsBySellerId');
    const auctionsWithCarTitles = await Promise.all(
      response.data.map(async (auction) => ({
        ...auction,
        carTitle: await fetchCarDetails(auction.productId),
      }))
    );
    
    const filteredAuctions = auctionsWithCarTitles.filter(
      (auction) => new Date(auction.endDate) < new Date()
    );

    setAuctions(filteredAuctions);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      handleErrorResult(errorMessage);
    } else {
      handleErrorResult('An unexpected error occurred');
    }
  } finally {
    setLoading(false);
  }
};



if (loading) {
  return <div>Loading History...</div>;
}

return (
  <div className="container mx-auto px-4">
    {auctions.length === 0 ? (
      <div>No History found for this seller.</div>
    ) : (
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Car</th>
            <th className="py-2 px-4 border-b">Last Bid</th>
            <th className="py-2 px-4 border-b">Start Date</th>
            <th className="py-2 px-4 border-b">End Date</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {auctions.map((auction) => (
            <tr key={auction.auctionId}>
              <td className="py-2 px-4 border-b">
                <Link to={`auction-details/${auction.auctionId}`} className="text-blue-500 hover:underline">
                  {auction.carTitle}
                </Link>
              </td>
              <td className="py-2 px-4 border-b">${auction.current_Price}</td>
              <td className="py-2 px-4 border-b">{new Date(auction.startDate).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{new Date(auction.endDate).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">{auction.status}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
};

export default SellerHistory

