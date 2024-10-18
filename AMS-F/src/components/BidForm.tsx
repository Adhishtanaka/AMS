import React, { useState } from 'react';
import api from '../util/api';
import { handleErrorResult, handleSuccessResult } from '../util/TostMessage';

interface Bid {
  aucId: number;
  current_amount: number;
}

interface BidFormProps {
  bid: Bid;
}

const BidForm: React.FC<BidFormProps> = ({ bid }) => {
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleBid = async () => {
    if (amount <= bid.current_amount) {
      handleErrorResult('Please enter a valid bid amount.');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/api/Buyer/PlaceBid', {
        aucId: bid.aucId,
        amount: amount,
      });
      handleSuccessResult("Bid placed successfully");
      setAmount(0); // Reset the input after successful bid
    } catch (error) {
      handleErrorResult('Failed to place bid. Please try again.');
    } finally {
      setIsLoading(false);
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
        min={bid.current_amount + 1} // Ensure the minimum is greater than current amount
        className="border p-2 rounded mb-4 w-full"
      />
      <button
        onClick={handleBid}
        disabled={amount <= bid.current_amount || isLoading} // Disable if invalid or loading
        className={`bg-blue-500 text-white p-2 rounded ${isLoading ? 'opacity-50' : ''}`}
      >
        {isLoading ? 'Placing Bid...' : 'Place Bid'}
      </button>
    </div>
  );
};

export default BidForm;
