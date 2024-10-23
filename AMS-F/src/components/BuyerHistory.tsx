import React, { useState, useEffect } from "react";
import api from "../util/api";
import { handleErrorResult } from "../util/TostMessage";

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
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchBidHistory = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<Bid[]>("/Buyer/GetBidHistory");
        if (Array.isArray(response.data)) {
          setBidHistory(response.data);
        } else {
          throw new Error("Data received is not an array");
        }
      } catch (error) {
        console.error("Error fetching bid history:", error);
        handleErrorResult( 'An error occurred');
      } finally {
        setIsLoading(false);
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

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1D2945]"></div>
      </div>
    );

    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg overflow-hidden p-2 sm:p-0">
        {bidHistory.length === 0 ? (
          <div className="px-4 py-5 text-gray-500 text-center">
            No active bids available.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse rounded-lg shadow-md table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-2 font-semibold text-left text-black border-b whitespace-nowrap">Car Title</th>
                  <th className="hidden sm:table-cell px-2 sm:px-4 py-2 font-semibold text-left text-black border-b whitespace-nowrap">Current Bid</th>
                  <th className="px-2 sm:px-4 py-2 font-semibold text-left text-black border-b whitespace-nowrap">Your Bid</th>
                  <th className="hidden sm:table-cell px-2 sm:px-4 py-2 font-semibold text-left text-black border-b whitespace-nowrap">Bid Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {bidHistory.map((bid) => (
                  <tr key={bid.bidId} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <img
                          className="w-full sm:w-28 h-28 object-cover rounded-lg shadow-lg sm:mr-4"
                          src={`http://localhost:5000/car-images/${bid.auctionDetails.img.split(",")[0]}`}
                          alt={bid.auctionDetails.carTitle}
                        />
                        <span className="text-[#1D2945] font-semibold text-sm sm:text-base">
                          {bid.auctionDetails.carTitle}
                        </span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-2 sm:px-4 py-2 text-[#1D2945] font-medium whitespace-nowrap">
                      {formatCurrency(bid.auctionDetails.currentPrice)}
                    </td>
                    <td className="px-2 sm:px-4 py-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-green-600 font-semibold text-sm sm:text-base whitespace-nowrap">
                          {formatCurrency(bid.amount)}
                        </span>
                        <span className="sm:hidden text-xs text-gray-500">
                          {formatDate(bid.bidTime)}
                        </span>
                        <span className="sm:hidden text-xs text-[#1D2945] font-medium">
                          Current: {formatCurrency(bid.auctionDetails.currentPrice)}
                        </span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-2 sm:px-4 py-2 text-gray-500 whitespace-nowrap">
                      {formatDate(bid.bidTime)}
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

export default BuyerHistory;