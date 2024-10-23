import React, { useState } from 'react';
import ManageUsers from '../components/AdminManageUsers';
import AdminDashboard from '../components/AdminDashboard';
import CategoryManager from '../components/AdminCategoryManager';
import TransactionTable from '../components/AdminTransactions';


const Admin: React.FC = () => {

    const [selectedComponent, setSelectedComponent] = useState('Dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderComponent = () => {
        switch (selectedComponent) {
            case 'Dashboard':
                return <AdminDashboard />;
            case 'Users':
                return <ManageUsers />;
            case 'Categories':
                return <CategoryManager/>;
            case 'Transactions':
                return <TransactionTable />;
            default:
                return <AdminDashboard />;
            
        }
    
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`bg-white text-gray-800 w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:relative md:translate-x-0 transition duration-200 ease-in-out z-20 shadow-lg`}
            >
                <h1 className="text-2xl text-[#1D2945] font-semibold text-center">AMS .</h1>
                <nav>
                    {['Dashboard', 'Users','Categories','Transactions'].map((item) => (
                        <a
                            key={item}
                            href="#"
                            className={`block py-2.5 px-4 rounded transition duration-200 ${
                                selectedComponent === item ? 'bg-gray-100 text-gray-900' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => {
                                setSelectedComponent(item);
                                setIsSidebarOpen(false);
                            }}
                        >
                            {item}
                        </a>
                    ))}
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Toggle button for mobile */}
                <div className="bg-white p-4 shadow md:hidden">
                    <button
                        title='Toggle sidebar'
                        onClick={toggleSidebar}
                        className="text-gray-800 focus:outline-none focus:text-gray-600"
                    >
                        <svg 
                            className="h-6 w-6" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4 6h16M4 12h16M4 18h16" 
                            />
                        </svg>
                    </button>
                </div>

                {/* Rendered component */}
                <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {renderComponent()}
                </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-10 bg-gray-900 opacity-50 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
        </>
    );
};

export default Admin;