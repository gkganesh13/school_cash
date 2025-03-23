import React, { useState } from 'react';

const Payments = () => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentPurpose, setPaymentPurpose] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement payment processing
    console.log('Processing payment:', { amount: paymentAmount, purpose: paymentPurpose });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Make a Payment</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
              Payment Purpose
            </label>
            <select
              id="purpose"
              value={paymentPurpose}
              onChange={(e) => setPaymentPurpose(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a purpose</option>
              <option value="tuition">Tuition Fees</option>
              <option value="books">Books and Supplies</option>
              <option value="activities">Extra-curricular Activities</option>
              <option value="transport">Transportation</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Process Payment
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
        <div className="space-y-4">
          <div className="flex items-center p-4 border border-gray-200 rounded-md">
            <div className="flex-1">
              <div className="font-medium">Credit/Debit Card</div>
              <div className="text-sm text-gray-500">Visa, MasterCard, American Express</div>
            </div>
            <input type="radio" name="payment-method" className="h-4 w-4 text-blue-600" checked readOnly />
          </div>
          
          <div className="flex items-center p-4 border border-gray-200 rounded-md opacity-50">
            <div className="flex-1">
              <div className="font-medium">Bank Transfer</div>
              <div className="text-sm text-gray-500">Coming soon</div>
            </div>
            <input type="radio" name="payment-method" className="h-4 w-4" disabled />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
