import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../util/api';

interface User {
  email: string;
  name: string;
  role: string;
  status: string;
  telephone: string;
}

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
  sellerName: string;
  currentPrice: number;
  endDate: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [usersRes, transactionsRes, auctionsRes] = await Promise.all([
          api.get<User[]>('http://localhost:5000/api/Admin/ManageAllUsers?nameFilter='),
          api.get<Transaction[]>('https://localhost:7006/api/Admin/GetAllTransactions'),
          api.get<Auction[]>('https://localhost:7006/api/Public/GetALLAuctionDetails')
        ]);

        setUsers(usersRes.data);
        setTransactions(transactionsRes.data);
        setAuctions(auctionsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const totalSellers = users.filter(user => user.role === 'Seller').length;
  const totalBuyers = users.filter(user => user.role === 'Buyer').length;
  const totalAuctions = auctions.length;
  const totalTransactionAmount = transactions.reduce((sum, t) => 
    sum + (t.auctionDto.currentPrice || 0), 0);

  // Process transaction data for the line chart
  const chartData = transactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(t => ({
      date: new Date(t.date).toLocaleDateString(),
      amount: t.auctionDto.currentPrice || 0
    }));

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Sellers</h3>
          <p className="text-3xl font-bold text-gray-900">{totalSellers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Buyers</h3>
          <p className="text-3xl font-bold text-gray-900">{totalBuyers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Auctions</h3>
          <p className="text-3xl font-bold text-gray-900">{totalAuctions}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Transaction Amount</h3>
          <p className="text-3xl font-bold text-gray-900">
            ${totalTransactionAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts and Latest Auctions Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Transaction Chart */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
          <div className="h-80">
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
          </div>
        </div>

        {/* Latest Auctions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Latest Auctions</h3>
          <div className="space-y-4">
            {auctions.slice(0, 5).map((auction) => (
              <div 
                key={auction.auctionId} 
                className="border-b border-gray-200 pb-4 last:border-0"
              >
                <h4 className="font-medium text-gray-900">{auction.carTitle}</h4>
                <p className="text-sm text-gray-500">Seller: {auction.sellerName}</p>
                <div className="mt-1 flex justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    ${auction.currentPrice?.toLocaleString() || 'No bids'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Ends: {new Date(auction.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;