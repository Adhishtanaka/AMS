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

const imageUrl = (auction: AuctionDto) => {
  if (!auction || !auction.img) {
    return 'http://localhost:5173/public/images/placeholder.jpg'; 
  }
  return `http://localhost:5000/car-images/${auction.img.split(",")[0].trim()}`;
};

return (
  <div className="container mx-auto px-4 mb-48">
    {auctions.length === 0 ? (
      <div className="text-center p-4">No History found for this seller.</div>
    ) : (
      <div className="w-full overflow-x-auto">
        {/* Mobile View (Card Layout) */}
        <div className="lg:hidden space-y-4">
          {auctions.map((auction) => (
            <div key={auction.auctionId} className="bg-white rounded-lg shadow p-4">
              <Link 
                to={`auction-details/${auction.auctionId}`} 
                className="flex flex-col space-y-2 mb-3"
              >
                <img
                  src={imageUrl(auction)}
                  alt={auction.carTitle}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/public/images/placeholder.jpg';
                  }}
                />
                <h3 className="font-semibold text-lg text-gray-800">
                  {auction.carTitle}
                </h3>
              </Link>

              <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                <div className="space-y-1">
                  <p className="text-gray-500">Final Bid</p>
                  <p className="font-medium">
                    ${auction.currentPrice !== null ? auction.currentPrice : 0}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium">{auction.status}</p>
                </div>

                <div className="space-y-1 col-span-2">
                  <p className="text-gray-500">Start Date</p>
                  <p className="font-medium text-sm">
                    {new Date(auction.startDate).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-1 col-span-2">
                  <p className="text-gray-500">End Date</p>
                  <p className="font-medium text-sm">
                    {new Date(auction.endDate).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View (Table Layout) */}
        <table className="hidden lg:table min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-black border-b">
                Auction Item
              </th>
              <th className="px-4 py-2 text-left font-semibold text-black border-b">
                Final Bid
              </th>
              <th className="px-4 py-2 text-left font-semibold text-black border-b">
                Start Date
              </th>
              <th className="px-4 py-2 text-left font-semibold text-black border-b">
                End Date
              </th>
              <th className="px-4 py-2 text-left font-semibold text-black border-b">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {auctions.map((auction) => (
              <tr key={auction.auctionId}>
                <td className="px-4 py-2">
                  <Link
                    to={`auction-details/${auction.auctionId}`}
                    className="text-gray-600 flex items-center hover:underline"
                  >
                    <img
                      src={imageUrl(auction)}
                      alt={auction.carTitle}
                      className="w-24 h-16 object-cover rounded-lg mr-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/public/images/placeholder.jpg';
                      }}
                    />
                    <span>{auction.carTitle}</span>
                  </Link>
                </td>
                <td className="px-4 py-2 text-gray-800">
                  ${auction.currentPrice !== null ? auction.currentPrice : 0}
                </td>
                <td className="px-4 py-2 text-gray-800">
                  {new Date(auction.startDate).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-gray-800">
                  {new Date(auction.endDate).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-gray-800">
                  {auction.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
};

export default SellerHistory

