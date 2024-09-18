import React, { useState } from 'react';
import Home from '../components/Home';

const SellerDashboard = () => {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div>
            <div className="mb-4 border-b pb-4 border-gray-200 dark:border-gray-700">
            <div className='flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-black'>
                <h1 className='w-full text-3xl font-bold text-[#1D2945]'>AMS .</h1>
            </div>
                {/* Updated CSS for the tab container */}
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center max-w-[1240px] mx-auto px-4" id="default-tab" role="tablist">
                    <li className="me-2" role="presentation">
                        <button
                            className={`inline-block px-4 py-3 rounded-lg ${activeTab === 'profile' ? 'text-[#1D2945] bg-blue-50' : 'hover:text-gray-900 hover:bg-gray-100'}`}
                            onClick={() => setActiveTab('profile')}
                            type="button"
                            role="tab"
                            aria-controls="profile"
                            aria-selected={activeTab === 'profile'}
                        >
                            Home
                        </button>
                    </li>
                    <li className="me-2" role="presentation">
                        <button
                            className={`inline-block px-4 py-3 rounded-lg ${activeTab === 'dashboard' ? 'text-[#1D2945] bg-blue-50' : 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'}`}
                            onClick={() => setActiveTab('dashboard')}
                            type="button"
                            role="tab"
                            aria-controls="dashboard"
                            aria-selected={activeTab === 'dashboard'}
                        >
                            Buy
                        </button>
                    </li>
                    <li className="me-2" role="presentation">
                        <button
                            className={`inline-block px-4 py-3 rounded-lg ${activeTab === 'settings' ? 'text-[#1D2945] bg-blue-50' : 'hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white'}`}
                            onClick={() => setActiveTab('settings')}
                            type="button"
                            role="tab"
                            aria-controls="settings"
                            aria-selected={activeTab === 'settings'}
                        >
                            History
                        </button>
                    </li>
                </ul>
            </div>

            <div id="default-tab-content">
                {activeTab === 'profile' && (
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                        <Home /> 
                    </div>
                )}
                {activeTab === 'dashboard' && (
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            This is Buy
                        </p>
                    </div>
                )}
                {activeTab === 'settings' && (
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="settings" role="tabpanel" aria-labelledby="settings-tab">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            This is History
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;
