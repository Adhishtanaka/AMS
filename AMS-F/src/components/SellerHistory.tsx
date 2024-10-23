import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { handleErrorResult } from '../util/TostMessage';
import api from '../util/api';

interface AuctionDto {
  auctionId: number;
  productId: number;
  startDate: string;
  endDate: string;
  currentPrice: number | null;
  carTitle: string;
  img: string;
  modelName: string;
  manufacturerName: string;
  year: number;
  status: boolean;
}

interface Car {
  id: number;
  carTitle: string;
  carDescription: string;
  img: string; 
  modelId: number;
  performanceClassId: number;
  year: number;
  price: number;
  carTypeId: number;
  sellerId: number;
}

const SellerHistory = () =>   {
const [auctions, setAuctions] = useState<AuctionDto[]>([]);
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
    const response = await api.get<AuctionDto[]>('http://localhost:5000/api/Seller/GetAuctionsBySellerId');
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
  <div className="container mx-auto px-4 mb-48">
    {auctions.length === 0 ? (
      <div>No History found for this seller.</div>
    ) : (
      <table className="min-w-full table-auto border-collapse bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-black border-b">Auction Item</th>
            <th className="px-4 py-2 text-left font-semibold text-black border-b">Final Bid</th>
            <th className="px-4 py-2 text-left font-semibold text-black border-b">Start Date</th>
            <th className="px-4 py-2 text-left font-semibold text-black border-b">End Date</th>
            <th className="px-4 py-2 text-left font-semibold text-black border-b">Status</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-300'>
          {auctions.map((auction) => (
            <tr key={auction.auctionId}>
              <td className="px-4 py-2">
                <Link to={`auction-details/${auction.auctionId}`} className="text-gray-600 flex items-center flex-row hover:underline">
                <img 
                  src='/src/assets/image.png'
                  className="w-35 h-20 mx-3 rounded-lg"
                  />
                  {auction.carTitle}
                </Link>
              </td>
              <td className="px-4 py-1 text-gray-800">${auction.currentPrice !== null ? auction.currentPrice : 0}</td>
              <td className="px-4 py-1 text-gray-800">{new Date(auction.startDate).toLocaleString()}</td>
              <td className="px-4 py-1 text-gray-800">{new Date(auction.endDate).toLocaleString()}</td>
              <td className="px-4 py-1 text-gray-800">{auction.status}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
};

export default SellerHistory

