import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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

const ActiveAuctions: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get('/api/Buyer/GetActiveAuctions');
        setAuctions(response.data);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Active Auctions</h2>
      <ul className="space-y-4">
        {auctions.map(auction => (
          <li key={auction.auctionId} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{auction.carTitle}</h3>
            <img src={auction.carImage} alt={auction.carTitle} className="w-48 h-auto mb-4" />
            <p>Starting Price: ${auction.startingPrice}</p>
            <p>Current Price: ${auction.currentPrice}</p>
            <p>End Date: {new Date(auction.endDate).toLocaleString()}</p>
            <div className="space-x-4">
              <Link to={`/buyer/auction/${auction.auctionId}/bid`} className="text-blue-500 hover:underline">Place Bid</Link>
              <Link to={`/buyer/auction/${auction.auctionId}/bid-history`} className="text-blue-500 hover:underline">View Bid History</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveAuctions;