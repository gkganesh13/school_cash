import React, { useState } from 'react';

const Profile = () => {
  const [user] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    studentId: 'STU123456',
    grade: '10th',
    section: 'A',
    balance: 1250.00,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Student Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Student ID</label>
                <p className="font-medium">{user.studentId}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Grade</label>
                <p className="font-medium">{user.grade}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Section</label>
                <p className="font-medium">{user.section}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Current Balance</label>
                <p className="font-medium text-blue-600">${user.balance.toFixed(2)}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600">Account Status</label>
                <p className="font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
        <div className="space-y-4">
          <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Change Password
          </button>
          <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Notification Preferences
          </button>
          <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            Payment Methods
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
