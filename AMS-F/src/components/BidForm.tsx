import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Bid {
  aucId: number;
  userId?: number;
  bidTime?: string;
  amount: number;
}

const BidForm: React.FC = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const [amount, setAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleBid = async () => {
    if (amount <= 0) {
      alert('Please enter a valid bid amount.');
      return;
    }

    setIsSubmitting(true);

    try {
      const bid: Bid = {
        aucId: parseInt(auctionId ?? '0', 10),
        amount: amount,
      };

      const response = await axios.post('/api/Buyer/PlaceBid', bid);
      alert(response.data.Message);
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Failed to place bid. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4">Place a Bid</h3>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Enter bid amount"
        min="0"
        className="border p-2 rounded mb-4 w-full"
      />
      <button
        onClick={handleBid}
        disabled={isSubmitting}
        className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? 'Placing Bid...' : 'Place Bid'}
      </button>
    </div>
  );
};

export default BidForm;