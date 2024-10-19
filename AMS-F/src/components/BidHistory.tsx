import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../util/api';

interface Bid {
  bidId: number;
  userId: number;
  userName: string;
  bidTime: string;
  amount: number;
}

const BidHistory: React.FC = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const [bids, setBids] = useState<Bid[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBidHistory = async () => {
      try {
        const response = await api.get(`/api/Buyer/GetBidHistory?auctionId=${auctionId}`);
        if (Array.isArray(response.data)) {
          setBids(response.data);
        } else {
          setError('Unexpected response format');
        }
      } catch (error) {
        console.error('Error fetching bid history:', error);
        setError('Failed to fetch bid history');
      }
    };

    fetchBidHistory();
  }, [auctionId]);

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Bid History</h2>
      <ul className="space-y-4">
        {bids.map(bid => (
          <li key={bid.bidId} className="border p-4 rounded shadow">
            <p><strong>{bid.userName}</strong> - ${bid.amount}</p>
            <p>{new Date(bid.bidTime).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BidHistory;