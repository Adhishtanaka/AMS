import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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

  useEffect(() => {
    axios.get(`/api/Buyer/GetBidHistory?auctionId=${auctionId}`)
      .then(response => setBids(response.data))
      .catch(error => console.error('Error fetching bid history:', error));
  }, [auctionId]);

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