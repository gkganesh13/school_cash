import React, { useState, useEffect } from 'react';
import { payments } from '../services/api';

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: ''
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await payments.getPaymentMethods();
      setPaymentMethods(response.data);
    } catch (err) {
      setError('Failed to load payment methods');
      console.error('Payment methods error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMethod = async (e) => {
    e.preventDefault();
    try {
      await payments.addPaymentMethod(newMethod);
      setShowAddForm(false);
      setNewMethod({
        type: 'card',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        name: ''
      });
      fetchPaymentMethods();
    } catch (err) {
      setError('Failed to add payment method');
      console.error('Add payment method error:', err);
    }
  };

  const handleRemoveMethod = async (id) => {
    try {
      await payments.removePaymentMethod(id);
      fetchPaymentMethods();
    } catch (err) {
      setError('Failed to remove payment method');
      console.error('Remove payment method error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Payment Methods</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add New Method
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Add Payment Method</h3>
          <form onSubmit={handleAddMethod} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={newMethod.type}
                onChange={(e) => setNewMethod({ ...newMethod, type: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="card">Credit/Debit Card</option>
                <option value="bank">Bank Account</option>
                <option value="upi">UPI</option>
              </select>
            </div>

            {newMethod.type === 'card' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Card Number</label>
                  <input
                    type="text"
                    value={newMethod.cardNumber}
                    onChange={(e) => setNewMethod({ ...newMethod, cardNumber: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="**** **** **** ****"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <input
                      type="text"
                      value={newMethod.expiryDate}
                      onChange={(e) => setNewMethod({ ...newMethod, expiryDate: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="text"
                      value={newMethod.cvv}
                      onChange={(e) => setNewMethod({ ...newMethod, cvv: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="***"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Name on Card</label>
              <input
                type="text"
                value={newMethod.name}
                onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Method
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{method.name}</div>
                <div className="text-sm text-gray-500">
                  {method.type === 'card' ? `**** **** **** ${method.lastFour}` : method.identifier}
                </div>
                {method.expiryDate && (
                  <div className="text-sm text-gray-500">Expires: {method.expiryDate}</div>
                )}
              </div>
              <button
                onClick={() => handleRemoveMethod(method.id)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        {paymentMethods.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No payment methods added yet
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;
