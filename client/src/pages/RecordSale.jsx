import React, { useState, useEffect } from 'react';
import { vendors } from '../services/api';
import { useNavigate } from 'react-router-dom';

const RecordSale = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await vendors.getInventory();
      setInventory(response.data);
    } catch (err) {
      setError('Failed to load inventory');
      console.error('Inventory error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    const item = inventory.find(i => i.id === itemId);
    if (newQuantity > item.quantity) {
      setError(`Only ${item.quantity} ${item.name}(s) available`);
      return;
    }

    setCart(cart.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async () => {
    if (!studentId) {
      setError('Please enter a student ID');
      return;
    }

    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      setProcessing(true);
      await vendors.recordSale({
        studentId,
        items: cart.map(item => ({
          itemId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total: calculateTotal()
      });

      // Navigate to success page
      navigate('/sale-success', {
        state: {
          studentId,
          items: cart,
          total: calculateTotal(),
          date: new Date().toISOString()
        }
      });
    } catch (err) {
      setError('Failed to process sale');
      console.error('Sale error:', err);
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
    <div className="max-w-6xl mx-auto space-y-8">
      <h2 className="text-2xl font-semibold">Record Sale</h2>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inventory Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Available Items</h3>
          <div className="space-y-4">
            {inventory.map((item) => (
              <div
                key={item.id}
                className={`p-4 border rounded-lg ${
                  item.quantity === 0 ? 'opacity-50' : 'hover:border-blue-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      {item.quantity} available • ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    disabled={item.quantity === 0}
                    className={`px-3 py-1 rounded-md ${
                      item.quantity === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Cart</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Student ID</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter student ID"
            />
          </div>

          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    ${item.price.toFixed(2)} each
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                Cart is empty
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium">Total</span>
                <span className="text-2xl font-bold">
                  ${calculateTotal().toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={processing || !studentId}
                className={`w-full py-2 rounded-md text-white ${
                  processing || !studentId
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {processing ? 'Processing...' : 'Complete Sale'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordSale;
