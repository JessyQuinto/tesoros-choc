import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Mail, Lock, Sparkles, Eye, EyeOff, ArrowRight, Mountain } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError, user } = useAuth();
  const navigate = useNavigate();

  // Handle navigation after successful login
  useEffect(() => {
    if (user) {
      if (user.role === 'seller' && !user.isApproved) {
        navigate('/pending-approval');
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'seller' && user.isApproved) {
        navigate('/seller-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      await login(email, password);
      // Navigation will be handled by useEffect when user state changes
    } catch (err) {
      // Error is handled by context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181c1f] via-[#23272b] to-[#181c1f] p-4 relative overflow-hidden">
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute -top-10 -left-10 w-60 h-60 bg-gradient-to-br from-blue-400/20 to-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-gradient-to-br from-amber-400/20 to-orange-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-md rounded-3xl shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden animate-fade-in">
        <div className="relative z-10 p-10 flex flex-col items-center">
          {/* Icono principal */}
          <div className="w-20 h-20 flex items-center justify-center rounded-full shadow-xl mb-6 bg-gradient-to-br from-blue-500 to-indigo-600">
            <Mountain className="w-12 h-12 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2 font-display">
            ¡Bienvenido de vuelta!
          </h1>
          <p className="text-base text-gray-700 dark:text-gray-200 mb-6 text-center">
            Descubre los tesoros artesanales del Chocó
          </p>
          {error && (
            <Alert variant="destructive" className="w-full border-destructive/50 bg-destructive/10 mb-4">
              <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Correo electrónico
              </Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-white/60 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:bg-gray-900/60 dark:text-white dark:border-gray-700 dark:focus:border-blue-400 transition-all duration-200"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Contraseña
              </Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 bg-white/60 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-200 text-gray-900 dark:bg-gray-900/60 dark:text-white dark:border-gray-700 dark:focus:border-blue-400 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none group"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <ArrowRight className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
              )}
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
          <div className="w-full text-center space-y-6 mt-6">
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 dark:bg-gray-900/80 text-gray-500 dark:text-gray-300 font-medium">
                  ¿Nuevo en Tesoros del Chocó?
                </span>
              </div>
            </div>
            <Link to="/register">
              <Button variant="outline" className="w-full h-12 border-blue-400 text-blue-700 hover:bg-blue-50 rounded-xl font-semibold transition-all duration-300 hover:border-blue-500">
                Crear cuenta nueva
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};