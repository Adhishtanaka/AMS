import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleErrorResult } from '../util/TostMessage';
import api from '../util/api';

interface Auction {
  auctionId: number;
  productId: number;
  startDate: string;
  endDate: string;
  productName?: string; // Assuming we want to display the product name
}

const SellerAuction = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await api.get<Auction[]>('http://localhost:5000/api/Seller/GetAuctionsBySellerId');
      setAuctions(response.data);
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
    <div className="container mx-auto px-4">
      <button
        className="mb-4 bg-blue-300 p-1 rounded"
        onClick={() => navigate('/seller/create-auction')}
      >
        Create Auction
      </button>
      {auctions.length === 0 ? (
        <div>No auctions found for this seller.</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Product</th>
              <th className="py-2 px-4 border-b">Start Date</th>
              <th className="py-2 px-4 border-b">End Date</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {auctions.map((auction) => (
              <tr key={auction.auctionId}>
                <td className="py-2 px-4 border-b">
                  <Link to={`/auction-details/${auction.auctionId}`} className="text-blue-500 hover:underline">
                    {auction.productName || `Product ${auction.productId}`}
                  </Link>
                </td>
                <td className="py-2 px-4 border-b">{new Date(auction.startDate).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{new Date(auction.endDate).toLocaleString()}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="text-red-500 hover:text-red-700"
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