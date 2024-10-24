import React, { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import api from "../util/api";
import { handleErrorResult } from "../util/TostMessage";
import CheckoutButton from "./CheckoutButton";

interface AuctionDetails {
  auctionId: number;
  carTitle: string;
  initialPrice: number;
  currentPrice: number;
  img: string;
  endDate: string;
  status: string;
}

interface Bid {
  bidId: number;
  auctionDetails: AuctionDetails;
  amount: number;
  bidTime: string;
}

const BuyerSBids: React.FC = () => {
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBidHistory = async () => {
      try {
        const response = await api.get<Bid[]>("/Buyer/GetBidHistory");
        if (Array.isArray(response.data)) {
          setBidHistory(response.data);
        } else {
          throw new Error("Data received is not an array");
        }
      } catch (err) {
        const error = err as AxiosError;
        setError(error.message || "Failed to fetch bid history");
        handleErrorResult("An error occurred");
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

  if (isLoading) {
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
            {bidHistory
              .filter((bid) => {
                const auctionEndDate = new Date(bid.auctionDetails.endDate);
                return (
                  bid.auctionDetails.currentPrice === bid.amount &&
                  auctionEndDate < new Date()
                );
              })
              .map((bid) => (
                <div key={bid.bidId} className="bg-white rounded-lg shadow p-4">
                  <Link
                    to={`/buyer/auction-details/${bid.auctionDetails.auctionId}`}
                    className="flex flex-col space-y-2 mb-3"
                  >
                    <img
                      src={`http://localhost:5000/car-images/${
                        bid.auctionDetails.img.split(",")[0]
                      }`}
                      alt={bid.auctionDetails.carTitle}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/public/images/placeholder.jpg";
                      }}
                    />
                    <h3 className="font-semibold text-lg text-gray-800">
                      {bid.auctionDetails.carTitle}
                    </h3>
                  </Link>

                  <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                    <div className="space-y-1">
                      <p className="text-gray-500">Your Bid</p>
                      <p className="font-medium">
                        {formatCurrency(bid.amount)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-gray-500">End Date</p>
                      <p className="font-medium text-sm">
                        {formatDate(bid.auctionDetails.endDate)}
                      </p>
                    </div>
                  </div>

                  {/* Checkout Button in the Action Column */}
                  <div className="flex-shrink-0 mt-3">
                    {bid.auctionDetails.status === "Active" ? (
                      <CheckoutButton auc_id={bid.auctionDetails.auctionId} />
                    ) : (
                      <button
                        className="bg-gray-400 text-white font-bold py-2 px-4 rounded-lg w-full cursor-not-allowed"
                        disabled
                      >
                        Already Paid
                      </button>
                    )}
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
                  Your Bid
                </th>
                <th className="px-4 py-2 text-left font-semibold text-black border-b">
                  End Date
                </th>
                <th className="px-4 py-2 text-left font-semibold text-black border-b">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {bidHistory
                .filter((bid) => {
                  const auctionEndDate = new Date(bid.auctionDetails.endDate);
                  return (
                    bid.auctionDetails.currentPrice === bid.amount &&
                    auctionEndDate < new Date()
                  );
                })
                .map((bid) => (
                  <tr key={bid.bidId}>
                    <td className="px-4 py-2">
                      <Link
                        to={`/buyer/auction-details/${bid.auctionDetails.auctionId}`}
                        className="text-gray-600 flex items-center hover:underline"
                      >
                        <img
                          src={`http://localhost:5000/car-images/${
                            bid.auctionDetails.img.split(",")[0]
                          }`}
                          alt={bid.auctionDetails.carTitle}
                          className="w-24 h-16 object-cover rounded-lg mr-3"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/public/images/placeholder.jpg";
                          }}
                        />
                        <span>{bid.auctionDetails.carTitle}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-gray-800">
                      {formatCurrency(bid.amount)}
                    </td>
                    <td className="px-4 py-2 text-gray-800">
                      {formatDate(bid.auctionDetails.endDate)}
                    </td>
                    <td className="px-4 py-2 text-gray-800">
                    {bid.auctionDetails.status === "Active" ? (
                      <CheckoutButton auc_id={bid.auctionDetails.auctionId} />
                    ) : (
                      <button
                        className="bg-gray-400 text-white font-bold py-2 px-4 rounded-lg w-full cursor-not-allowed"
                        disabled
                      >
                        Already Paid
                      </button>
                    )}
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

export default BuyerSBids;
