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

interface BidDetails {
  bidId: number;
  aucId: number;
  auctionDetails: AuctionDto;
  userId: number;
  userName: string;
  bidTime: string;
  amount: number;
}

const BuyerDashboardC: React.FC = () => {

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bidHistory, setBidHistory] = useState<BidDetails[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, bidHistoryRes] = await Promise.all([
          api.get<Transaction[]>('Buyer/getBuyersTransactions'),
          api.get<BidDetails[]>('/Buyer/GetBidHistory')
        ]);

        setTransactions(transactionsRes.data);
        setBidHistory(bidHistoryRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  },[]);

  const totalSpent = transactions.reduce((sum, trans) => 
    sum + (trans.auctionDto.currentPrice || trans.auctionDto.initialPrice), 0);

  const totalBids = bidHistory.length;

  const unpaidWins = bidHistory.filter(bid => {
    const auctionEndDate = new Date(bid.auctionDetails.endDate);
    return bid.auctionDetails.currentPrice === bid.amount && 
           auctionEndDate < new Date() && 
           !transactions.some(t => t.aucID === bid.aucId);
  }).length;

  const chartData = transactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(t => ({
      date: new Date(t.date).toLocaleDateString(),
      amount: t.auctionDto.currentPrice || 0
    }));
  return (
    <> <h1 className='mb-6 text-3xl font-bold text-[#1D2945]'>Dashboard</h1>
    <div className=" bg-gray-100 p-4">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Spent</h3>
          <p className="text-3xl font-bold text-gray-900"> ${totalSpent.toLocaleString()}</p>
          
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Total Bids</h3>
          <p className="text-3xl font-bold text-gray-900">{totalBids}</p>
          
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Unpaid Wins</h3>
          <p className="text-3xl font-bold text-gray-900">{unpaidWins}</p>
          
        </div>
      </div>

      <div className="bg-white rounded-lg shadow py-3 px-6 mb-2">
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
                stroke="#EF4444" 
                strokeWidth={2}
                dot={{ fill: '#EF4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    </>
  );
};
export default BuyerDashboardC