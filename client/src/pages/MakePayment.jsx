import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { payments, school } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MakePayment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fees, setFees] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedFee, setSelectedFee] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [feesRes, methodsRes] = await Promise.all([
        school.getFees(),
        payments.getPaymentMethods()
      ]);
      setFees(feesRes.data);
      setPaymentMethods(methodsRes.data);
    } catch (err) {
      setError('Failed to load payment information');
      console.error('Payment setup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedFee || !selectedMethod) {
      setError('Please select both fee and payment method');
      return;
    }

    try {
      setProcessing(true);
      await payments.processPayment({
        feeId: selectedFee.id,
        paymentMethodId: selectedMethod.id,
        amount: selectedFee.amount
      });
      
      // Navigate to success page or show success message
      navigate('/payment-success', {
        state: {
          amount: selectedFee.amount,
          description: selectedFee.description,
          date: new Date().toISOString()
        }
      });
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
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
      <h2 className="text-2xl font-semibold">Make Payment</h2>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Fee Selection */}
        <div>
          <h3 className="text-lg font-medium mb-4">Select Fee</h3>
          <div className="space-y-4">
            {fees.map((fee) => (
              <div
                key={fee.id}
                onClick={() => setSelectedFee(fee)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedFee?.id === fee.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{fee.description}</div>
                    <div className="text-sm text-gray-500">Due: {new Date(fee.dueDate).toLocaleDateString()}</div>
                  </div>
                  <div className="text-lg font-semibold">${fee.amount.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Selection */}
        <div>
          <h3 className="text-lg font-medium mb-4">Select Payment Method</h3>
          {paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedMethod?.id === method.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-500">
                        {method.type === 'card' ? `**** **** **** ${method.lastFour}` : method.identifier}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 mb-4">No payment methods available</p>
              <button
                onClick={() => navigate('/payment-methods')}
                className="text-blue-600 hover:text-blue-800"
              >
                Add Payment Method
              </button>
            </div>
          )}
        </div>

        {/* Payment Summary */}
        {selectedFee && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Description</span>
                <span>{selectedFee.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-semibold">${selectedFee.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date</span>
                <span>{new Date(selectedFee.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={!selectedFee || !selectedMethod || processing}
            className={`px-6 py-2 rounded-md text-white ${
              !selectedFee || !selectedMethod || processing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {processing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MakePayment;
