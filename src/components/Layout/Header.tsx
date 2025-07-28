import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { ShoppingBag, MessageCircle, User, LogOut, Menu, Settings, MapPin, Package, BarChart3, History, ChevronDown, Heart, Home, Sparkles } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'buyer': return '/buyer-dashboard';
      case 'seller': return '/seller-dashboard';
      case 'admin': return '/admin-dashboard';
      default: return '/';
    }
  };

  return (
    <header className="header-gradient border-b border-border/30 sticky top-0 z-50 safe-top">
      <div className="container-max">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          {/* Logo Mejorado - Premium */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent opacity-0 group-hover:opacity-30 blur-lg transition-all duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-gradient tracking-tight">
                Tesoros del Chocó
              </span>
              <span className="text-xs text-muted-foreground font-medium hidden sm:block">
                Artesanías Auténticas
              </span>
            </div>
          </Link>

          {/* Navigation Mejorada - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              to="/products" 
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300 relative group"
            >
              Productos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300 relative group"
            >
              Acerca
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Actions Mejoradas - Responsivo */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {user ? (
              <>
                {/* Cart Premium - Responsivo */}
                {user.role === 'buyer' && (
                  <Link to="/cart" className="relative group">
                    <div className="p-2.5 hover:bg-muted rounded-xl transition-all duration-300 hover:shadow-md">
                      <ShoppingBag className="h-5 w-5 text-foreground/70 group-hover:text-primary transition-colors" />
                      {totalItems > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-gradient-to-r from-accent to-accent-hover text-accent-foreground text-xs rounded-full flex items-center justify-center font-semibold border-0 shadow-lg">
                          {totalItems > 9 ? '9+' : totalItems}
                        </Badge>
                      )}
                    </div>
                  </Link>
                )}

                {/* Messages Premium - Hidden on mobile */}
                <Link to="/messages" className="hidden md:flex group">
                  <div className="p-2.5 hover:bg-muted rounded-xl transition-all duration-300 hover:shadow-md">
                    <MessageCircle className="h-5 w-5 text-foreground/70 group-hover:text-secondary transition-colors" />
                  </div>
                </Link>

                {/* Notificaciones */}
                <NotificationDropdown />

                {/* User Menu Premium - Responsivo */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 p-2 hover:bg-muted rounded-xl transition-all duration-300 group">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                        <span className="text-sm font-semibold text-white">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors hidden sm:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 border-0 shadow-2xl bg-card/95 backdrop-blur-md rounded-xl">
                    <DropdownMenuLabel className="px-3 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground capitalize font-medium">{user.role}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/50 my-2" />
                    
                    <DropdownMenuItem asChild className="px-3 py-2.5 text-sm rounded-lg">
                      <Link to={getDashboardLink()} className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <span className="font-medium">Panel de Control</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className="px-3 py-2.5 text-sm rounded-lg">
                      <Link to="/messages" className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        <MessageCircle className="h-4 w-4 text-secondary" />
                        <span className="font-medium">Mensajes</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className="px-3 py-2.5 text-sm rounded-lg">
                      <Link to="/reviews" className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        <Heart className="h-4 w-4 text-pink-500" />
                        <span className="font-medium">Mis Reseñas</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className="px-3 py-2.5 text-sm rounded-lg">
                      <Link to="/notifications" className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Notificaciones</span>
                      </Link>
                    </DropdownMenuItem>

                    {user.role === 'seller' && (
                      <DropdownMenuItem asChild className="px-3 py-2.5 text-sm rounded-lg">
                        <Link to="/financial-dashboard" className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 transition-colors">
                          <BarChart3 className="h-4 w-4 text-green-500" />
                          <span className="font-medium">Dashboard Financiero</span>
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {user.role === 'seller' && (
                      <DropdownMenuItem asChild className="px-3 py-2.5 text-sm rounded-lg">
                        <Link to="/orders/tracking" className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 transition-colors">
                          <Package className="h-4 w-4 text-orange-500" />
                          <span className="font-medium">Seguimiento de Pedidos</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem asChild className="px-3 py-2.5 text-sm rounded-lg">
                      <Link to="/profile/settings" className="flex items-center space-x-3 cursor-pointer hover:bg-muted/50 transition-colors">
                        <Settings className="h-4 w-4 text-accent" />
                        <span className="font-medium">Configuración</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className="bg-border/50 my-2" />
                    
                    <DropdownMenuItem 
                      className="px-3 py-2.5 text-sm text-destructive hover:text-destructive cursor-pointer rounded-lg hover:bg-destructive/10 transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      <span className="font-medium">Cerrar Sesión</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Desktop Login/Register Premium */}
                <div className="hidden sm:flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300"
                  >
                    Acceder
                  </Link>
                  <Link to="/register">
                    <Button className="btn-primary h-10 px-6 font-medium">
                      Comenzar
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {/* Mobile Menu Premium - Para pantallas pequeñas */}
            <Sheet>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2.5 hover:bg-muted rounded-xl transition-all duration-300 hover:shadow-md">
                  <Menu className="h-5 w-5 text-foreground/70" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96 border-0 bg-card/95 backdrop-blur-md p-0">
                <div className="p-6">
                  <SheetHeader className="text-left mb-8">
                    <SheetTitle className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent shadow-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-lg font-bold text-gradient">Tesoros del Chocó</span>
                        <p className="text-xs text-muted-foreground">Artesanías Auténticas</p>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="space-y-6">
                    {user ? (
                      <>
                        {/* Navigation Links Premium */}
                        <nav className="space-y-2">
                          <Link 
                            to="/" 
                            className="flex items-center space-x-3 p-3 text-foreground/80 hover:bg-muted/50 rounded-xl transition-all duration-300 group"
                          >
                            <Home className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Inicio</span>
                          </Link>
                          <Link 
                            to="/products" 
                            className="flex items-center space-x-3 p-3 text-foreground/80 hover:bg-muted/50 rounded-xl transition-all duration-300 group"
                          >
                            <Package className="h-5 w-5 text-secondary group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Productos</span>
                          </Link>
                          <Link 
                            to="/about" 
                            className="flex items-center space-x-3 p-3 text-foreground/80 hover:bg-muted/50 rounded-xl transition-all duration-300 group"
                          >
                            <MapPin className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Acerca</span>
                          </Link>
                          {user.role === 'buyer' && (
                            <>
                              <Link 
                                to="/cart" 
                                className="flex items-center justify-between p-3 text-foreground/80 hover:bg-muted/50 rounded-xl transition-all duration-300 group"
                              >
                                <div className="flex items-center space-x-3">
                                  <ShoppingBag className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                                  <span className="font-medium">Carrito</span>
                                </div>
                                {totalItems > 0 && (
                                  <Badge className="bg-gradient-to-r from-accent to-accent-hover text-accent-foreground border-0">
                                    {totalItems}
                                  </Badge>
                                )}
                              </Link>
                              <Link 
                                to="/buyer-dashboard" 
                                className="flex items-center space-x-3 p-3 text-foreground/80 hover:bg-muted/50 rounded-xl transition-all duration-300 group"
                              >
                                <Heart className="h-5 w-5 text-destructive group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Mis Favoritos</span>
                              </Link>
                            </>
                          )}
                          <Link 
                            to="/messages" 
                            className="flex items-center space-x-3 p-3 text-foreground/80 hover:bg-muted/50 rounded-xl transition-all duration-300 group"
                          >
                            <MessageCircle className="h-5 w-5 text-secondary group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Mensajes</span>
                          </Link>
                          <Link 
                            to={getDashboardLink()} 
                            className="flex items-center space-x-3 p-3 text-foreground/80 hover:bg-muted/50 rounded-xl transition-all duration-300 group"
                          >
                            <BarChart3 className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Dashboard</span>
                          </Link>
                        </nav>

                        {/* Logout Premium */}
                        <div className="pt-6 border-t border-border/30">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 p-3 w-full text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-300 group"
                          >
                            <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Cerrar Sesión</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Navigation for non-logged users */}
                        <nav className="space-y-2">
                          <Link 
                            to="/" 
                            className="flex items-center space-x-3 p-3 text-foreground/80 hover:bg-muted/50 rounded-xl transition-all duration-300 group"
                          >
                            <Home className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Inicio</span>
                          </Link>
                          <Link 
                            to="/products" 
                            className="flex items-center space-x-3 p-3 text-foreground/80 hover:bg-muted/50 rounded-xl transition-all duration-300 group"
                          >
                            <Package className="h-5 w-5 text-secondary group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Productos</span>
                          </Link>
                          <Link 
                            to="/about" 
                            className="flex items-center space-x-3 p-3 text-foreground/80 hover:bg-muted/50 rounded-xl transition-all duration-300 group"
                          >
                            <MapPin className="h-5 w-5 text-accent group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Acerca</span>
                          </Link>
                        </nav>

                        {/* Login/Register Premium */}
                        <div className="space-y-3 pt-6 border-t border-border/30">
                          <Link to="/login" className="block">
                            <Button variant="outline" className="w-full h-12 font-medium border-2 hover:border-primary">
                              Iniciar Sesión
                            </Button>
                          </Link>
                          <Link to="/register" className="block">
                            <Button className="btn-primary w-full h-12">
                              Registrarse
                            </Button>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
