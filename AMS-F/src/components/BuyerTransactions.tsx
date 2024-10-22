import React, { useState, useEffect } from 'react';
import { AxiosError } from 'axios';
import api from '../util/api';

interface AuctionDto {
  auctionId: number;
  productId: number;
  initialPrice: number;
  startDate: string;
  endDate: string;
  sellerId: number;
  sellerName: string;
  buyerId: number | null;
  buyerName: string | null;
  currentPrice: number | null;
  carTitle: string;
  img: string;
  modelName: string;
  manufacturerName: string;
  year: number;
  status: string;
}

interface Transaction {
  transactionID: number;
  aucID: number;
  auctionDto: AuctionDto;
  date: string;
}

interface TransactionTableProps {
  className?: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ className = '' }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get<Transaction[]>('Buyer/getBuyersTransactions');
        setTransactions(response.data);
        setLoading(false);
      } catch (err) {
        const error = err as AxiosError;
        setError(error.message || 'Failed to fetch transactions');
        setLoading(false);
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price: number | null): string => {
    if (price === null) return 'N/A';
    return `$${price.toLocaleString()}`;
  };

  if (loading) {
    return <div className="p-4 text-gray-600">Loading transactions...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className={`w-full max-w-4xl mx-auto p-4 ${className}`}>
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car 
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            
              {transactions.map((transaction) => (
                <a href={`/buyer/auction-details/${transaction.auctionDto.auctionId}`}>
                <tr 
                  key={transaction.transactionID}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.auctionDto.carTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(transaction.auctionDto.currentPrice)}
                  </td>
                </tr>  </a>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;