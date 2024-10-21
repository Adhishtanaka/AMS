import { useState } from 'react';
import SellerDashboardC from '../components/SellersDashboardC';
import SellerCars from '../components/SellerCars';
import SellerAuction from '../components/SellerAuction';
import SellerHistory from '../components/SellerHistory';
import SellerTransactions from '../components/SellerTransactions';
import Footer from '../components/Footer';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'cars', label: 'Cars details' },
    { id: 'auctions', label: 'Auctions details' },
    { id: 'Transactions', label: 'Transactions' },
    { id: 'history', label: 'History' },
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <SellerDashboardC />;
      case 'cars':
        return <SellerCars />;
      case 'auctions':
        return <SellerAuction />;
      case 'history':
        return <SellerHistory />;
      case 'Transactions':
        return <SellerTransactions />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 lg:px-8">
      <header className="flex justify-between items-center h-24">
        <h1 className="text-3xl font-bold text-[#1D2945]">AMS .</h1>
      </header>

      {/* Mobile View - Dropdown Select */}
      <div className="sm:hidden mb-4">
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          {tabs.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop View - Tab List */}
      <nav className="hidden sm:block mb-4 border-b pb-4 border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
          {tabs.map(({ id, label }) => (
            <li key={id} className="me-2" role="presentation">
              <div
                className={`inline-block px-4 py-2 cursor-pointer rounded-lg ${
                  activeTab === id ? 'text-[#1D2945] bg-gray-100' : 'hover:text-gray-900 '
                }`}
                onClick={() => setActiveTab(id)}
                role="tab"
                aria-controls={id}
                aria-selected={activeTab === id}
              >
                {label}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        <div className="p-4 lg:p-8 rounded-lg">
          {renderActiveTabContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SellerDashboard;
