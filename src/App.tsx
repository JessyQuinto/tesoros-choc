import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/Layout/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';
import CookieConsent from '@/components/CookieConsent';

// Pages
import Index from './pages/Index';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import { OrderHistory } from './pages/OrderHistory';
import { ProfileSettings } from './pages/ProfileSettings';
import { AddressBook } from './pages/AddressBook';
import Messages from './pages/Messages';
import SupportCenter from './pages/SupportCenter';
import About from './pages/About';
import NotFound from './pages/NotFound';

// Auth pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PendingApproval } from './pages/PendingApproval';

// Dashboard pages
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Admin pages
import { AdminUserManagement } from './pages/AdminUserManagement';
import { ProductManagement } from './pages/ProductManagement';
import { OrderManagement } from './pages/OrderManagement';
import { ProductForm } from './pages/ProductForm';
import ProductModeration from './pages/ProductModeration';
import PaymentManagement from './pages/PaymentManagement';
import ContentManagement from './pages/ContentManagement';
import PlatformConfiguration from './pages/PlatformConfiguration';
import AuditSystem from './pages/AuditSystem';
import ReviewSystem from './pages/ReviewSystem';
import OrderTrackingSystem from './pages/OrderTrackingSystem';
import { FinancialDashboard } from './pages/FinancialDashboard';
import NotificationCenter from './pages/NotificationCenter';
import AdminReports from './pages/AdminReports';
import LayoutDemo from './pages/LayoutDemo';

// Components
import { ProtectedRoute } from './components/ProtectedRoute';

import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <NotificationProvider>
              <Router>
                <Layout>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/support" element={<SupportCenter />} />
                    <Route path="/layout-demo" element={<LayoutDemo />} />

                    {/* Auth routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/pending-approval" element={<PendingApproval />} />

                    {/* Protected routes - Require authentication */}
                    <Route path="/cart" element={
                      <ProtectedRoute>
                        <Cart />
                      </ProtectedRoute>
                    } />
                    <Route path="/checkout" element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    } />
                    <Route path="/order-success" element={
                      <ProtectedRoute>
                        <OrderSuccess />
                      </ProtectedRoute>
                    } />

                    {/* User dashboard routes - Role specific */}
                    <Route path="/buyer-dashboard" element={
                      <ProtectedRoute requiredRole="buyer">
                        <BuyerDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/seller-dashboard" element={
                      <ProtectedRoute requiredRole="seller" requireApproval={true}>
                        <SellerDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin-dashboard" element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Profile routes - Require authentication */}
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <ProfileSettings />
                      </ProtectedRoute>
                    } />
                    <Route path="/address-book" element={
                      <ProtectedRoute>
                        <AddressBook />
                      </ProtectedRoute>
                    } />
                    <Route path="/order-history" element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    } />
                    <Route path="/messages" element={
                      <ProtectedRoute>
                        <Messages />
                      </ProtectedRoute>
                    } />
                    <Route path="/notifications" element={
                      <ProtectedRoute>
                        <NotificationCenter />
                      </ProtectedRoute>
                    } />

                    {/* Admin routes - Require admin role */}
                    <Route path="/admin/users" element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminUserManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/products" element={
                      <ProtectedRoute requiredRole="admin">
                        <ProductManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/orders" element={
                      <ProtectedRoute requiredRole="admin">
                        <OrderManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/products/new" element={
                      <ProtectedRoute requiredRole="admin">
                        <ProductForm />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/products/:id/edit" element={
                      <ProtectedRoute requiredRole="admin">
                        <ProductForm />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/moderation" element={
                      <ProtectedRoute requiredRole="admin">
                        <ProductModeration />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/payments" element={
                      <ProtectedRoute requiredRole="admin">
                        <PaymentManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/content" element={
                      <ProtectedRoute requiredRole="admin">
                        <ContentManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/configuration" element={
                      <ProtectedRoute requiredRole="admin">
                        <PlatformConfiguration />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/audit" element={
                      <ProtectedRoute requiredRole="admin">
                        <AuditSystem />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/reviews" element={
                      <ProtectedRoute requiredRole="admin">
                        <ReviewSystem />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/tracking" element={
                      <ProtectedRoute requiredRole="admin">
                        <OrderTrackingSystem />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/financial" element={
                      <ProtectedRoute requiredRole="admin">
                        <FinancialDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/reports" element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminReports />
                      </ProtectedRoute>
                    } />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
                <Toaster />
                <CookieConsent />
              </Router>
            </NotificationProvider>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;