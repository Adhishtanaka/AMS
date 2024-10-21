import React,{ useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const SellerAuction = () => {
  const [auctions, setAuctions] = useState<AuctionDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

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
      
      // Filter auctions where end date has not passed
      const filteredAuctions = auctionsWithCarTitles.filter(
        (auction) => new Date(auction.endDate) >= new Date()
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

  const deleteAuction = async (auctionId: number) => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      try {
        await api.delete(`http://localhost:5000/api/Seller/DeleteAuction?auctionId=${auctionId}`);
        fetchAuctions();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || 'An error occurred';
          handleErrorResult(errorMessage);
        } else {
          handleErrorResult('An unexpected error occurred');
        }
      }
    }
  };

  if (loading) {
    return <div>Loading auctions...</div>;
  }

  return (
    <div className="container mx-auto px-4 mb-48">
      <button
        className="mb-6 text-white bg-[#1D2945] hover:bg-[#3d517f] font-semibold p-1 px-2 rounded"
        onClick={() => navigate('/seller/create-auction')}
      >
        Create Auction
      </button>
      {auctions.length === 0 ? (
        <div>No auctions found for this seller.</div>
      ) : (
        <table className="min-w-full table-auto border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 border text-left font-semibold text-black">Auction Item</th>
              <th className="px-4 py-2 border text-left font-semibold text-black">Last Bid</th>
              <th className="px-4 py-2 border text-left font-semibold text-black">Start Date</th>
              <th className="px-4 py-2 border text-left font-semibold text-black">End Date</th>
              <th className="px-4 py-2 border text-left font-semibold text-black">Status</th>
              <th className="px-4 py-2 border text-left font-semibold text-black">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {auctions.map((auction) => (
              <tr key={auction.auctionId}>
                <td className="px-4 py-2 border">
                  <Link to={`auction-details/${auction.auctionId}`} className="text-gray-600 hover:underline">
                    {auction.carTitle}
                  </Link>
                </td>
                <td className="px-4 py-1 border text-gray-800">${auction.currentPrice !== null ? auction.currentPrice : 0}</td>
                <td className="px-4 py-1 border text-gray-800">{new Date(auction.startDate).toLocaleString()}</td>
                <td className="px-4 py-1 border text-gray-800">{new Date(auction.endDate).toLocaleString()}</td>
                <td className="px-4 py-1 border text-gray-800">{auction.status}</td>
                <td className="px-4 py-1 border text-gray-800">
                  <button
                    className="text-red-500 px-2 rounded-lg bg-gray-50 hover:text-red-600 hover:bg-red-50"
                    onClick={() => deleteAuction(auction.auctionId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SellerAuction;
