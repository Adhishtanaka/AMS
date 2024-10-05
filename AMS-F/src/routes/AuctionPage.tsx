// src/routes/AuctionPage.tsx
import React from 'react';
import AuctionBidding from '../components/AuctionBidding'; // Adjust path based on where AuctionBidding is stored

const AuctionPage: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Car Auction System</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <AuctionBidding />
        </div>
      </main>
    </div>
  );
};

export default AuctionPage;