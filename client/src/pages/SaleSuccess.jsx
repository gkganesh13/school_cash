import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const SaleSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentId, items, total, date } = location.state || {};

  if (!studentId || !items || !total || !date) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Sale Completed Successfully!
          </h2>
        </div>

        <div className="space-y-6">
          {/* Sale Details */}
          <div className="border-b pb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Student ID</p>
                <p className="font-semibold">{studentId}</p>
              </div>
              <div>
                <p className="text-gray-600">Date</p>
                <p className="font-semibold">
                  {new Date(date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div>
            <h3 className="font-medium text-lg mb-3">Items Sold</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-blue-600">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4 pt-6">
            <button
              onClick={() => navigate('/record-sale')}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              New Sale
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleSuccess;
