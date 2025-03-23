import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaStore, FaShoppingCart, FaHistory, FaChartLine } from 'react-icons/fa';

const VendorMenu = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/vendor/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/vendor/inventory', icon: FaStore, label: 'Inventory' },
    { path: '/vendor/record-sale', icon: FaShoppingCart, label: 'Record Sale' },
    { path: '/vendor/payment-tracks', icon: FaHistory, label: 'Payment Tracks' },
    { path: '/vendor/reports', icon: FaChartLine, label: 'Reports' }
  ];

  return (
    <nav className="bg-white shadow-md rounded-lg mb-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default VendorMenu;
