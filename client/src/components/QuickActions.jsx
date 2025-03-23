import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaChartLine,
  FaHistory,
  FaStore,
  FaShoppingCart,
  FaFileExport,
  FaSearch,
  FaPlus,
  FaDownload,
  FaFilter
} from 'react-icons/fa';

const QuickActions = ({ type }) => {
  const navigate = useNavigate();

  const reportActions = [
    {
      icon: FaFileExport,
      label: 'Export Report',
      action: () => navigate('/vendor/reports?action=export'),
      color: 'blue'
    },
    {
      icon: FaFilter,
      label: 'Custom Report',
      action: () => navigate('/vendor/reports?action=custom'),
      color: 'green'
    },
    {
      icon: FaChartLine,
      label: 'Analytics',
      action: () => navigate('/vendor/reports?action=analytics'),
      color: 'purple'
    }
  ];

  const paymentActions = [
    {
      icon: FaHistory,
      label: 'Recent Tracks',
      action: () => navigate('/vendor/payment-tracks?filter=recent'),
      color: 'blue'
    },
    {
      icon: FaSearch,
      label: 'Search Payments',
      action: () => navigate('/vendor/payment-tracks?action=search'),
      color: 'green'
    },
    {
      icon: FaDownload,
      label: 'Export History',
      action: () => navigate('/vendor/payment-tracks?action=export'),
      color: 'purple'
    }
  ];

  const inventoryActions = [
    {
      icon: FaPlus,
      label: 'Add Item',
      action: () => navigate('/vendor/inventory?action=add'),
      color: 'blue'
    },
    {
      icon: FaStore,
      label: 'Low Stock',
      action: () => navigate('/vendor/inventory?filter=low-stock'),
      color: 'yellow'
    },
    {
      icon: FaShoppingCart,
      label: 'Record Sale',
      action: () => navigate('/vendor/record-sale'),
      color: 'green'
    }
  ];

  const getActions = () => {
    switch (type) {
      case 'reports':
        return reportActions;
      case 'payments':
        return paymentActions;
      case 'inventory':
        return inventoryActions;
      default:
        return [];
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {getActions().map((action, index) => (
        <button
          key={index}
          onClick={action.action}
          className={`flex items-center justify-center p-4 rounded-lg transition-all transform hover:scale-105 space-x-2 bg-${action.color}-50 hover:bg-${action.color}-100 text-${action.color}-700 border border-${action.color}-200`}
        >
          <action.icon className="w-5 h-5" />
          <span className="font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
