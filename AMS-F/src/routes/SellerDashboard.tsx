import { useState } from 'react';
import SellerDashboardC from '../components/SellersDashboardC';
import SellerCars from '../components/SellerCars';
import SellerAuction from '../components/SellerAuction';
import SellerHistory from '../components/SellerHistory';
import Footer from '../components/Footer';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); 

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'cars', label: 'Car Info' },
    { id: 'auctions', label: 'Auctions' },
    { id: 'history', label: 'History' },
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <SellerDashboardC/>;
      case 'cars':
        return <SellerCars/>;
      case 'auctions':
        return <SellerAuction />;
      case 'history':
        return <SellerHistory />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4">
      <header className="flex justify-between items-center h-24">
        <h1 className="text-3xl font-bold text-[#1D2945]">AMS .</h1>
      </header>

      <nav className="mb-4 border-b pb-4 border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
          {tabs.map(({ id, label }) => (
            <li key={id} className="me-2" role="presentation">
              <button
                className={`inline-block px-4 py-2 rounded-lg ${
                  activeTab === id ? 'text-[#1D2945] bg-blue-50' : 'hover:text-gray-900 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(id)}
                role="tab"
                aria-controls={id}
                aria-selected={activeTab === id}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <div className="p-4 rounded-lg">
          {renderActiveTabContent()} 
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SellerDashboard;
