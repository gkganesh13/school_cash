import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Mock data for testing
const MOCK_TRANSACTIONS = {
  'STU001': [
    {
      _id: '1',
      date: '2025-03-20',
      description: 'School Fees Payment',
      amount: -500.00
    },
    {
      _id: '2',
      date: '2025-03-15',
      description: 'Canteen Payment',
      amount: -50.00
    }
  ],
  'STU002': [
    {
      _id: '3',
      date: '2025-03-18',
      description: 'Library Fee',
      amount: -30.00
    },
    {
      _id: '4',
      date: '2025-03-10',
      description: 'Sports Equipment',
      amount: -100.00
    }
  ]
};

const MOCK_BALANCES = {
  'STU001': 1500.00,
  'STU002': 800.00
};

const ParentDashboard = () => {
  const { user } = useAuth();
  const [selectedChild, setSelectedChild] = useState(user.children[0]);

  return (
    <div className="space-y-8">
      {/* Child Selector */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Parent Dashboard</h2>
          <select
            className="form-select rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={selectedChild.id}
            onChange={(e) => {
              const child = user.children.find(c => c.id === e.target.value);
              setSelectedChild(child);
            }}
          >
            {user.children.map(child => (
              <option key={child.id} value={child.id}>
                {child.name} - Grade {child.grade}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Student ID</div>
            <div className="font-medium">{selectedChild.studentId}</div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">Class</div>
            <div className="font-medium">Grade {selectedChild.grade}-{selectedChild.section}</div>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Account Balance</h3>
        <div className="text-3xl font-bold text-blue-600">
          ${MOCK_BALANCES[selectedChild.studentId].toFixed(2)}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {MOCK_TRANSACTIONS[selectedChild.studentId].map(transaction => (
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
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 text-center rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
            Make Payment
          </button>
          <button className="p-4 text-center rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
            View Payment History
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
