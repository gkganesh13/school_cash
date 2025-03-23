import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ParentDashboard from './pages/ParentDashboard';
import VendorDashboard from './pages/VendorDashboard';
import PaymentMethods from './pages/PaymentMethods';
import MakePayment from './pages/MakePayment';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentHistory from './pages/PaymentHistory';
import VendorInventory from './pages/VendorInventory';
import RecordSale from './pages/RecordSale';
import SaleSuccess from './pages/SaleSuccess';
import VendorPaymentTracks from './pages/VendorPaymentTracks';
import Profile from './pages/Profile';
import VendorReports from './pages/VendorReports';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Component to handle dashboard routing based on user role
const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'parent':
      return <ParentDashboard />;
    case 'vendor':
      return <VendorDashboard />;
    default:
      return <Dashboard />;
  }
};

// Component to check if user is a vendor
const VendorRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'vendor') return <Navigate to="/dashboard" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-methods"
                element={
                  <ProtectedRoute>
                    <PaymentMethods />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/make-payment"
                element={
                  <ProtectedRoute>
                    <MakePayment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-success"
                element={
                  <ProtectedRoute>
                    <PaymentSuccess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-history"
                element={
                  <ProtectedRoute>
                    <PaymentHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Vendor Routes */}
              <Route
                path="/vendor/dashboard"
                element={
                  <VendorRoute>
                    <VendorDashboard />
                  </VendorRoute>
                }
              />
              <Route
                path="/vendor/inventory"
                element={
                  <VendorRoute>
                    <VendorInventory />
                  </VendorRoute>
                }
              />
              <Route
                path="/vendor/record-sale"
                element={
                  <VendorRoute>
                    <RecordSale />
                  </VendorRoute>
                }
              />
              <Route
                path="/vendor/sale-success"
                element={
                  <VendorRoute>
                    <SaleSuccess />
                  </VendorRoute>
                }
              />
              <Route
                path="/vendor/payment-tracks"
                element={
                  <VendorRoute>
                    <VendorPaymentTracks />
                  </VendorRoute>
                }
              />
              <Route
                path="/vendor/reports"
                element={
                  <VendorRoute>
                    <VendorReports />
                  </VendorRoute>
                }
              />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
