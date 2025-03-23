import React, { useState, useEffect } from 'react';

// Mock data for testing
const MOCK_DATA = {
  balance: 1500.00,
  recentTransactions: [
    {
      _id: '1',
      date: '2025-03-20',
      description: 'School Fees Payment',
      amount: -500.00
    },
    {
      _id: '2',
      date: '2025-03-15',
      description: 'Deposit',
      amount: 2000.00
    },
    {
      _id: '3',
      date: '2025-03-10',
      description: 'Library Fee',
      amount: -50.00
    }
  ],
  upcomingPayments: [
    {
      _id: '1',
      dueDate: '2025-04-01',
      description: 'Term 2 Fees',
      amount: 1000.00
    },
    {
      _id: '2',
      dueDate: '2025-04-15',
      description: 'Sports Equipment',
      amount: 200.00
    }
  ]
};

const Dashboard = () => {
  const [data, setData] = useState({
    balance: 0,
    recentTransactions: [],
    upcomingPayments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use mock data
        setData(MOCK_DATA);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Account Overview</h2>
        <div className="text-3xl font-bold text-blue-600">
          ${data.balance.toFixed(2)}
        </div>
        <div className="text-gray-600">Current Balance</div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
          {data.recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {data.recentTransactions.map(transaction => (
                <div key={transaction._id} className="flex justify-between items-center border-b pb-4 last:border-0">
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No recent transactions</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Upcoming Payments</h3>
          {data.upcomingPayments.length > 0 ? (
            <div className="space-y-4">
              {data.upcomingPayments.map(payment => (
                <div key={payment._id} className="flex justify-between items-center border-b pb-4 last:border-0">
                  <div>
                    <div className="font-medium">{payment.description}</div>
                    <div className="text-sm text-gray-500">
                      Due: {new Date(payment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-blue-600">${payment.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming payments</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
