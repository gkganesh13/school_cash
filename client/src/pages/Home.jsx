import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to School Cash</h1>
        <p className="text-xl mb-8">Simplifying school payments for everyone</p>
        <Link
          to="/dashboard"
          className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
        >
          Get Started
        </Link>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Easy Payments</h3>
          <p className="text-gray-600">Make school fee payments quickly and securely</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Track Expenses</h3>
          <p className="text-gray-600">Monitor all your school-related expenses in one place</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Digital Receipts</h3>
          <p className="text-gray-600">Access your payment history and receipts anytime</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
