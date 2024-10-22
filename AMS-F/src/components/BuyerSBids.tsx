import React, { useState, useEffect } from "react";
import api from "../util/api";
import { handleErrorResult } from "../util/TostMessage";

interface AuctionDetails {
  auctionId: number;
  carTitle: string;
  initialPrice: number;
  currentPrice: number;
  img: string;
  endDate: string;
}

interface Bid {
  bidId: number;
  auctionDetails: AuctionDetails;
  amount: number;
  bidTime: string;
}

const BuyerSBids: React.FC = () => {
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
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
      {bidHistory.length === 0 ? (
        <div className="px-4 py-5 text-gray-500 text-center">
          No active bids available.
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {bidHistory
              .filter((bid) => {
                const auctionEndDate = new Date(bid.auctionDetails.endDate);
                return bid.auctionDetails.currentPrice === bid.amount && auctionEndDate < new Date();
              })
              .map((bid) => (
                <li
                  key={bid.bidId}
                  className="p-5 hover:bg-gray-100 transition duration-200 ease-in-out"
                >
                  <div className="flex items-start space-x-6">
                    <img
                      className="h-28 w-28 object-cover rounded-lg shadow-lg"
                      src={`http://localhost:5000/car-images/${bid.auctionDetails.img.split(",")[0]}`}
                      alt={bid.auctionDetails.carTitle}
                    />
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-[#1D2945]">
                        {bid.auctionDetails.carTitle}
                      </h3>
                      <p className="text-sm text-gray-800 mt-1">
                        Your Bid:{" "}
                        <span className="font-semibold text-green-600">
                          {formatCurrency(bid.amount)}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-3">
                        Bid Time: {formatDate(bid.bidTime)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default BuyerSBids;
