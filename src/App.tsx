import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { Toaster } from '@/components/ui/toaster';
import { Layout } from '@/components/Layout/Layout';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { CookieConsent } from '@/components/CookieConsent';

// Pages
import Index from './pages/Index';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import ProfileSettings from './pages/ProfileSettings';
import AddressBook from './pages/AddressBook';
import Messages from './pages/Messages';
import SupportCenter from './pages/SupportCenter';
import About from './pages/About';
import NotFound from './pages/NotFound';

// Dashboard pages
import BuyerDashboard from './pages/BuyerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Admin pages
import AdminUserManagement from './pages/AdminUserManagement';
import ProductManagement from './pages/ProductManagement';
import OrderManagement from './pages/OrderManagement';
import ProductForm from './pages/ProductForm';
import ProductModeration from './pages/ProductModeration';
import PaymentManagement from './pages/PaymentManagement';
import ContentManagement from './pages/ContentManagement';
import PlatformConfiguration from './pages/PlatformConfiguration';
import AuditSystem from './pages/AuditSystem';
import ReviewSystem from './pages/ReviewSystem';
import OrderTrackingSystem from './pages/OrderTrackingSystem';
import FinancialDashboard from './pages/FinancialDashboard';
import NotificationCenter from './pages/NotificationCenter';
import AdminReports from './pages/AdminReports';

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
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/support" element={<SupportCenter />} />

                    {/* User dashboard routes */}
                    <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
                    <Route path="/seller-dashboard" element={<SellerDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    
                    {/* Profile routes */}
                    <Route path="/profile" element={<ProfileSettings />} />
                    <Route path="/address-book" element={<AddressBook />} />
                    <Route path="/order-history" element={<OrderHistory />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/notifications" element={<NotificationCenter />} />

                    {/* Admin routes */}
                    <Route path="/admin/users" element={<AdminUserManagement />} />
                    <Route path="/admin/products" element={<ProductManagement />} />
                    <Route path="/admin/orders" element={<OrderManagement />} />
                    <Route path="/admin/products/new" element={<ProductForm />} />
                    <Route path="/admin/products/:id/edit" element={<ProductForm />} />
                    <Route path="/admin/moderation" element={<ProductModeration />} />
                    <Route path="/admin/payments" element={<PaymentManagement />} />
                    <Route path="/admin/content" element={<ContentManagement />} />
                    <Route path="/admin/configuration" element={<PlatformConfiguration />} />
                    <Route path="/admin/audit" element={<AuditSystem />} />
                    <Route path="/admin/reviews" element={<ReviewSystem />} />
                    <Route path="/admin/tracking" element={<OrderTrackingSystem />} />
                    <Route path="/admin/financial" element={<FinancialDashboard />} />
                    <Route path="/admin/reports" element={<AdminReports />} />

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