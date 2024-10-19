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
      await api.post('http://localhost:5000/api/Buyer/PlaceBid', {
        aucId: bid.aucId,
        amount: amount,
      });
      handleSuccessResult('Bid placed successfully');
      setAmount(0); // Reset the input after successful bid
    } catch (error) {
      handleErrorResult('Failed to place bid. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col gap-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder={`Enter bid amount (min $${(bid.current_amount + 1).toLocaleString()})`}
            min={bid.current_amount + 1}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#1D2945] transition duration-300"
          />
          
          <button
            onClick={handleBid}
            disabled={amount <= bid.current_amount || isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
              isLoading
                ? 'bg-[#1D2945] opacity-75 cursor-not-allowed'
                : 'bg-[#1D2945] hover:bg-opacity-90 transition duration-300'
            }`}
          >
            {isLoading ? 'Placing Bid...' : 'Place Bid'}
          </button>
        </div>

        {amount <= bid.current_amount && amount !== 0 && (
          <p className="text-red-600 text-sm mt-2">Bid must be higher than the current amount.</p>
        )}
      </div>
    </div>
  );
};

export default BidForm;