import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { amount, description, date } = location.state || {};

  if (!amount || !description || !date) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="max-w-lg mx-auto mt-12">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-green-500 text-6xl" />
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Successful!
        </h2>
        
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully.
        </p>

        <div className="space-y-4 mb-8">
          <div className="border-t border-b py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-left">
                <p className="text-gray-600">Amount Paid</p>
                <p className="font-semibold text-lg">${amount.toFixed(2)}</p>
              </div>
              <div className="text-left">
                <p className="text-gray-600">Date</p>
                <p className="font-semibold">
                  {new Date(date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-left">
            <p className="text-gray-600">Description</p>
            <p className="font-semibold">{description}</p>
          </div>
        </div>

        <div className="space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/payment-history')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            View Payment History
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
