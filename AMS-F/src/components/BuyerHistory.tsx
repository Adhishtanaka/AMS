import React, { useState, useEffect } from "react";
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import api from "../util/api";


interface AuctionDetails {
  auctionId: number;
  carTitle: string;
  initialPrice: number;
  currentPrice: number;
  img: string;
}

interface Bid {
  bidId: number;
  auctionDetails: AuctionDetails;
  amount: number;
  bidTime: string;
}

const BuyerHistory: React.FC = () => {
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBidHistory = async () => {
      try {
        const response = await api.get<Bid[]>("/Buyer/GetBidHistory");
        if (Array.isArray(response.data)) {
          setBidHistory(response.data);
        } else {
          throw new Error("Data received is not an array");
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        setError(axiosError.message || 'Failed to fetch bid history');
        console.error("Error fetching bid history:", axiosError);
      } finally {
        setLoading(false);
      }
    };

    fetchBidHistory();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const imageUrl = (auction: AuctionDetails) => {
    if (!auction || !auction.img) {
      return '/public/images/placeholder.jpg';
    }
    return `http://localhost:5000/car-images/${auction.img.split(",")[0].trim()}`;
  };

  if (loading) {
    return <div className="p-4 text-gray-600">Loading bid history...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 mb-48">
      {bidHistory.length === 0 ? (
        <div className="text-center p-4">No active bids available.</div>
      ) : (
        <div className="w-full overflow-x-auto">
          {/* Mobile View (Card Layout) */}
          <div className="lg:hidden space-y-4">
            {bidHistory.map((bid) => (
              <div key={bid.bidId} className="bg-white rounded-lg shadow p-4">
                <Link to={`/buyer/auction-details/${bid.auctionDetails.auctionId}`} className="flex flex-col space-y-2 mb-3">
                  <img
                    src={imageUrl(bid.auctionDetails)}
                    alt={bid.auctionDetails.carTitle}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/public/images/placeholder.jpg';
                    }}
                  />
                  <h3 className="font-semibold text-lg text-gray-800">{bid.auctionDetails.carTitle}</h3>
                </Link>
                <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                  <div className="space-y-1">
                    <p className="text-gray-500">Current Bid</p>
                    <p className="font-medium">{formatCurrency(bid.auctionDetails.currentPrice)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-500">Your Bid</p>
                    <p className="font-medium">{formatCurrency(bid.amount)}</p>
                  </div>
                  <div className="space-y-1 ">
                    <p className="text-gray-500">Bid Time</p>
                    <p className="font-medium text-sm">{formatDate(bid.bidTime)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View (Table Layout) */}
          <table className="hidden lg:table min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-black border-b">Car Title</th>
                <th className="px-4 py-2 text-left font-semibold text-black border-b">Current Bid</th>
                <th className="px-4 py-2 text-left font-semibold text-black border-b">Your Bid</th>
                <th className="px-4 py-2 text-left font-semibold text-black border-b">Bid Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {bidHistory.map((bid) => (
                <tr key={bid.bidId}>
                  <td className="px-4 py-2">
                    <Link to={`/buyer/auction-details/${bid.auctionDetails.auctionId}`} className="text-gray-600 flex items-center hover:underline">
                      <img
                        src={imageUrl(bid.auctionDetails)}
                        alt={bid.auctionDetails.carTitle}
                        className="w-24 h-16 object-cover rounded-lg mr-3"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/public/images/placeholder.jpg';
                        }}
                      />
                      <span>{bid.auctionDetails.carTitle}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-800">{formatCurrency(bid.auctionDetails.currentPrice)}</td>
                  <td className="px-4 py-2 text-gray-800">{formatCurrency(bid.amount)}</td>
                  <td className="px-4 py-2 text-gray-800">{formatDate(bid.bidTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BuyerHistory;
