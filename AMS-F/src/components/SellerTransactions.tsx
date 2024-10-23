import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get<Transaction[]>('/Seller/getSellerTransactions');
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



  const formatPrice = (price: number | null): string => {
    if (price === null) return 'N/A';
    return `$${price.toLocaleString()}`;
  };

  const imageUrl = (auction: AuctionDto) => {
    if (!auction || !auction.img) {
      return '/public/images/placeholder.jpg';
    }
    return `http://localhost:5000/car-images/${auction.img.split(",")[0].trim()}`;
  };

  if (loading) {
    return <div className="p-4 text-gray-600">Loading transactions...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 mb-48">
      {transactions.length === 0 ? (
        <div className="text-center p-4">No transactions found.</div>
      ) : (
        <div className="w-full overflow-x-auto">
          {/* Mobile View (Card Layout) */}
          <div className="lg:hidden space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.transactionID} className="bg-white rounded-lg shadow p-4">
                <Link
                  to={`/seller/auction-details/${transaction.auctionDto.auctionId}`}
                  className="flex flex-col space-y-2 mb-3"
                >
                  <img
                    src={imageUrl(transaction.auctionDto)}
                    alt={transaction.auctionDto.carTitle}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/public/images/placeholder.jpg';
                    }}
                  />
                  <h3 className="font-semibold text-lg text-gray-800">
                    {transaction.auctionDto.carTitle}
                  </h3>
                </Link>

                <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                  <div className="space-y-1">
                    <p className="text-gray-500">Final Bid</p>
                    <p className="font-medium">
                      {formatPrice(transaction.auctionDto.currentPrice)}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-gray-500">Status</p>
                    <p className="font-medium">{transaction.auctionDto.status}</p>
                  </div>

                  <div className="space-y-1 ">
                    <p className="text-gray-500">End Date</p>
                    <p className="font-medium text-sm">
                      {new Date(transaction.auctionDto.endDate).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-1 ">
                    <p className="text-gray-500">Transaction Date</p>
                    <p className="font-medium text-sm">
                      {new Date(transaction.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View (Table Layout) */}
          <table className="hidden lg:table min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-black border-b">
                  Auction Item
                </th>
                <th className="px-4 py-2 text-left font-semibold text-black border-b">
                  Final Bid
                </th>
                <th className="px-4 py-2 text-left font-semibold text-black border-b">
                  End Date
                </th>
                <th className="px-4 py-2 text-left font-semibold text-black border-b">
                  Transaction Date
                </th>
                <th className="px-4 py-2 text-left font-semibold text-black border-b">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {transactions.map((transaction) => (
                <tr key={transaction.transactionID}>
                  <td className="px-4 py-2">
                    <Link
                      to={`/seller/auction-details/${transaction.auctionDto.auctionId}`}
                      className="text-gray-600 flex items-center hover:underline"
                    >
                      <img
                        src={imageUrl(transaction.auctionDto)}
                        alt={transaction.auctionDto.carTitle}
                        className="w-24 h-16 object-cover rounded-lg mr-3"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/public/images/placeholder.jpg';
                        }}
                      />
                      <span>{transaction.auctionDto.carTitle}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {formatPrice(transaction.auctionDto.currentPrice)}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {new Date(transaction.auctionDto.endDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {new Date(transaction.date).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {transaction.auctionDto.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
