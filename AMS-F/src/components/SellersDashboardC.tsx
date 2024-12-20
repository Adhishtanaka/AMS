import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

interface Auction {
  auctionId: number;
  carTitle: string;
  initialPrice: number;
  currentPrice: number | null;
  endDate: string;
  status: string;
  buyerName: string | null;
}

const SellerDashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, auctionsRes] = await Promise.all([
          api.get<Transaction[]>('Seller/getSellerTransactions'),
          api.get<Auction[]>('Seller/GetAuctionsBySellerId')
        ]);

        // Validate the response data
        const validTransactions = transactionsRes.data?.filter(t => t && t.auctionDto) || [];
        const validAuctions = auctionsRes.data || [];

        setTransactions(validTransactions);
        setAuctions(validAuctions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred while fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Safe data transformation for chart
  const chartData = transactions
    .filter(t => t.auctionDto && t.date) // Ensure required properties exist
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(t => ({
      date: new Date(t.date).toLocaleDateString(),
      amount: (t.auctionDto?.currentPrice || 0) * 0.9
    }));

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 rounded-lg">
        <h2 className="text-red-800 text-lg font-semibold mb-2">Error Loading Dashboard</h2>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  const totalValue = transactions.reduce((sum, t) => 
    sum + (t.auctionDto?.currentPrice || 0), 0);

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-[#1D2945]">Dashboard</h1>
      <div className="bg-gray-50 p-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Auctions</h3>
            <p className="text-3xl font-bold text-gray-900">{auctions.length}</p>
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                Active: {auctions.filter(a => a.status === 'Active').length}
              </span>
              <span className="text-sm text-gray-500 ml-4">
                Completed: {auctions.filter(a => a.status === 'completed').length}
              </span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">${(totalValue*0.9).toLocaleString()}</p>
            <p className="mt-2 text-sm text-gray-500">
              Total Transactions: {transactions.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Transaction History Chart */}
          <div className="bg-white rounded-lg shadow p-6 col-span-2">
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
            <div className="h-80">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#4F46E5" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No transaction data available
                </div>
              )}
            </div>
          </div>

          {/* Recent Auctions */}
          <div className="bg-white rounded-lg shadow px-6 pt-3">
            <h3 className="text-lg font-semibold mb-4">Recent Auctions</h3>
            <div className="grid gap-4">
              {auctions.length > 0 ? (
                auctions.slice(0, 3).map((auction) => (
                  <div 
                    key={auction.auctionId} 
                    className="border-b border-gray-200 pb-4 last:border-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{auction.carTitle}</h4>
                        <p className="text-sm text-gray-500">
                          Initial Price: ${auction.initialPrice.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          End Date: {new Date(auction.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                          auction.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {auction.status}
                        </span>
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {auction.currentPrice 
                            ? `$${auction.currentPrice.toLocaleString()}` 
                            : 'No bids'}
                        </p>
                      </div>
                    </div>
                    {auction.buyerName && (
                      <p className="mt-2 text-sm text-gray-500">
                        Buyer: {auction.buyerName}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent auctions</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;