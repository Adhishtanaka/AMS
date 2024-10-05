import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Auction {
  auctionId: number;
  productId: number;
  startDate: string;
  endDate: string;
  currentPrice: number;
  status: string;
}

interface Bid {
  bidId: number;
  userId: number;
  userName: string;
  bidTime: string;
  amount: number;
}

const AuctionDetails: React.FC = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidHistory, setBidHistory] = useState<Bid[]>([]);
  const [loadingBids, setLoadingBids] = useState(true);
  const navigate = useNavigate();

  const fetchAuctionDetails = async () => {
    try {
      const response = await fetch(`/api/buyer/GetAuctionById/${auctionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch auction details');
      }
      const data = await response.json();
      setAuction(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const fetchBidHistory = async () => {
    try {
      const response = await fetch(`/api/buyer/GetBidHistory?auctionId=${auctionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch bid history');
      }
      const data = await response.json();
      setBidHistory(data);
      setLoadingBids(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoadingBids(false);
    }
  };

  useEffect(() => {
    fetchAuctionDetails();
    fetchBidHistory();
  }, [auctionId]);

  const handleBid = async () => {
    if (!auction || bidAmount <= auction.currentPrice) {
      setBidError('Bid amount must be greater than the current price.');
      return;
    }

    try {
      const response = await fetch('/api/buyer/PlaceBid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aucId: auction?.auctionId,
          amount: bidAmount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to place bid');
      }

      const result = await response.json();
      alert(result.message); // Show success message
      setBidAmount(0); // Reset bid amount
      setBidError(null); // Clear any previous errors

      // Refetch bid history after placing a bid
      await fetchBidHistory();
    } catch (err) {
      setBidError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) return <div className="text-center py-4">Loading auction details...</div>;
  if (error) return <div className="text-center text-red-500 py-4">{error}</div>;
  if (!auction) return <div className="text-center py-4">Auction not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Auction Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Auction #{auction.auctionId}</h2>
        <p className="mb-2">Product ID: {auction.productId}</p>
        <p className="mb-2">Start Date: {new Date(auction.startDate).toLocaleString()}</p>
        <p className="mb-2">End Date: {new Date(auction.endDate).toLocaleString()}</p>
        <p className="mb-2">Current Price: ${auction.currentPrice.toFixed(2)}</p>
        <p className="mb-4">Status: {auction.status}</p>

        <div className="mb-4">
          <label htmlFor="bidAmount" className="block mb-1 font-medium">Your Bid:</label>
          <input
            id="bidAmount"
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 w-full"
            min={auction.currentPrice + 0.01} // Ensure bid is greater than current price
            required
          />
          {bidError && <p className="text-red-500 text-sm">{bidError}</p>}
        </div>
        <button
          onClick={handleBid}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Place Bid
        </button>

        <button
          onClick={() => navigate('/auctions')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors ml-4"
        >
          Back to Auctions
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Bid History</h3>
        {loadingBids ? (
          <div className="text-center py-4">Loading bid history...</div>
        ) : (
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b">Bid ID</th>
                <th className="py-2 px-4 border-b">User Name</th>
                <th className="py-2 px-4 border-b">Bid Time</th>
                <th className="py-2 px-4 border-b">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bidHistory.length > 0 ? (
                bidHistory.map((bid) => (
                  <tr key={bid.bidId} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{bid.bidId}</td>
                    <td className="py-2 px-4 border-b">{bid.userName}</td>
                    <td className="py-2 px-4 border-b">{new Date(bid.bidTime).toLocaleString()}</td>
                    <td className="py-2 px-4 border-b">${bid.amount.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">No bids placed yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AuctionDetails;
