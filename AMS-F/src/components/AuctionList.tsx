import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Auction {
  auctionId: number;
  carId: number;
  startDate: string;
  endDate: string;
  currentPrice: number;
  status: string;
  carTitle: string;
  carImage: string;
  startingPrice: number;
}

const AuctionList: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch('/api/buyer/GetActiveAuctions');
        if (!response.ok) {
          throw new Error('Failed to fetch auctions');
        }
        const data = await response.json();
        setAuctions(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Auctions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <div key={auction.auctionId} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{auction.carTitle}</h2>
            <p className="mb-1">Start: {new Date(auction.startDate).toLocaleString()}</p>
            <p className="mb-1">End: {new Date(auction.endDate).toLocaleString()}</p>
            <p className="mb-1">Current Price: ${auction.currentPrice.toFixed(2)}</p>
            <p className="mb-4">Status: {auction.status}</p>
            <button
              onClick={() => navigate(`/auctions/${auction.auctionId}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuctionList;
