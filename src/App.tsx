import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import CookieConsent from "@/components/CookieConsent";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleSelectionRoute } from "@/components/RoleSelectionRoute";
import { AuthRedirectHandler } from "@/components/AuthRedirectHandler";

// Pages
import Index from "./pages/Index";
import { AuthPage } from "./pages/AuthPage";
import { SelectRolePage } from "./pages/SelectRolePage";
import ForgotPassword from "./pages/ForgotPassword";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Messages from "./pages/Messages";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { ProductManagement } from "./pages/ProductManagement";
import { ProductForm } from "./pages/ProductForm";
import { OrderManagement } from "./pages/OrderManagement";
import { OrderHistory } from "./pages/OrderHistory";
import { FinancialDashboard } from "./pages/FinancialDashboard";
import { ProfileSettings } from "./pages/ProfileSettings";
import { AddressBook } from "./pages/AddressBook";
import { AdminUserManagement } from "./pages/AdminUserManagement";
import ReviewSystem from "./pages/ReviewSystem";
import NotificationCenter from "./pages/NotificationCenter";
import OrderTrackingSystem from "./pages/OrderTrackingSystem";
import AdminReports from "./pages/AdminReports";
import ContentManagement from "./pages/ContentManagement";
import SupportCenter from "./pages/SupportCenter";
import PlatformConfiguration from "./pages/PlatformConfiguration";
import AuditSystem from "./pages/AuditSystem";
import PaymentManagement from "./pages/PaymentManagement";
import ProductModeration from "./pages/ProductModeration";
import PendingApproval from "./pages/PendingApproval";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <NotificationProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <AuthRedirectHandler>
                    <Routes>
                      {/* Auth Routes */}
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/login" element={<AuthPage />} />
                      <Route path="/register" element={<AuthPage />} />
                      <Route path="/pending-approval" element={<ProtectedRoute allowedRoles={['pending_vendor']}><PendingApproval /></ProtectedRoute>} />
                      <Route path="/select-role" element={
                        <RoleSelectionRoute>
                          <SelectRolePage />
                        </RoleSelectionRoute>
                      } />
                      <Route path="/forgot-password" element={<ForgotPassword />} />

                      {/* Core Public Routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/about" element={<About />} />

                      {/* Protected Routes */}
                      <Route path="/messages" element={<ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']}><Messages /></ProtectedRoute>} />

                      {/* Dashboard Routes */}
                      <Route path="/buyer-dashboard" element={<ProtectedRoute allowedRoles={['buyer']}><BuyerDashboard /></ProtectedRoute>} />
                      <Route path="/seller-dashboard" element={<ProtectedRoute allowedRoles={['seller']}><SellerDashboard /></ProtectedRoute>} />
                      <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />

                      {/* Cart & Checkout */}
                      <Route path="/cart" element={<ProtectedRoute allowedRoles={['buyer']}><Cart /></ProtectedRoute>} />
                      <Route path="/checkout" element={<ProtectedRoute allowedRoles={['buyer']}><Checkout /></ProtectedRoute>} />
                      <Route path="/order-success" element={<ProtectedRoute allowedRoles={['buyer']}><OrderSuccess /></ProtectedRoute>} />

                      {/* Business & Profile */}
                      <Route path="/products/manage" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><ProductManagement /></ProtectedRoute>} />
                      <Route path="/products/new" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><ProductForm /></ProtectedRoute>} />
                      <Route path="/products/edit/:id" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><ProductForm /></ProtectedRoute>} />
                      <Route path="/orders/manage" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><OrderManagement /></ProtectedRoute>} />
                      <Route path="/orders/history" element={<ProtectedRoute allowedRoles={['buyer', 'seller']}><OrderHistory /></ProtectedRoute>} />
                      <Route path="/orders/tracking" element={<ProtectedRoute allowedRoles={['buyer', 'seller']}><OrderTrackingSystem /></ProtectedRoute>} />
                      <Route path="/reviews" element={<ProtectedRoute allowedRoles={['buyer', 'seller']}><ReviewSystem /></ProtectedRoute>} />
                      <Route path="/notifications" element={<ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']}><NotificationCenter /></ProtectedRoute>} />
                      <Route path="/financial-dashboard" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><FinancialDashboard /></ProtectedRoute>} />
                      <Route path="/profile/settings" element={<ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']}><ProfileSettings /></ProtectedRoute>} />
                      <Route path="/profile/addresses" element={<ProtectedRoute allowedRoles={['buyer', 'seller']}><AddressBook /></ProtectedRoute>} />

                      {/* Admin Only Routes */}
                      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUserManagement /></ProtectedRoute>} />
                      <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
                      <Route path="/admin/content" element={<ProtectedRoute allowedRoles={['admin']}><ContentManagement /></ProtectedRoute>} />
                      <Route path="/admin/support" element={<ProtectedRoute allowedRoles={['admin']}><SupportCenter /></ProtectedRoute>} />
                      <Route path="/admin/config" element={<ProtectedRoute allowedRoles={['admin']}><PlatformConfiguration /></ProtectedRoute>} />
                      <Route path="/admin/audit" element={<ProtectedRoute allowedRoles={['admin']}><AuditSystem /></ProtectedRoute>} />
                      <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={['admin']}><PaymentManagement /></ProtectedRoute>} />
                      <Route path="/admin/products" element={<ProtectedRoute allowedRoles={['admin']}><ProductModeration /></ProtectedRoute>} />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AuthRedirectHandler>
                  <CookieConsent />
                </TooltipProvider>
              </NotificationProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
