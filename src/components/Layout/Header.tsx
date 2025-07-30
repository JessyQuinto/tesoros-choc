import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from '@/contexts/CartContext';
import { NotificationDropdown } from '@/components/NotificationDropdown';
import { ShoppingBag, MessageCircle, Menu, MapPin, Package, Home, Sparkles } from 'lucide-react';

export const Header = () => {
  const { totalItems } = useCart();

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
            {/* Cart Premium - Responsivo */}
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

            {/* Messages Premium - Hidden on mobile */}
            <Link to="/messages" className="hidden md:flex group">
              <div className="p-2.5 hover:bg-muted rounded-xl transition-all duration-300 hover:shadow-md">
                <MessageCircle className="h-5 w-5 text-foreground/70 group-hover:text-secondary transition-colors" />
              </div>
            </Link>

            {/* Notificaciones */}
            <NotificationDropdown />

            {/* Desktop Login/Register Premium */}
            <div className="hidden sm:flex items-center space-x-4">
              <Link 
                to="/admin-dashboard" 
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-all duration-300"
              >
                Panel Admin
              </Link>
              <Link to="/seller-dashboard">
                <Button className="btn-primary h-10 px-6 font-medium">
                  Vendedores
                </Button>
              </Link>
            </div>

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
                        to="/messages" 
                        className="flex items-center space-x-3 p-3 text-foreground/80 hover:bg-muted/50 rounded-xl transition-all duration-300 group"
                      >
                        <MessageCircle className="h-5 w-5 text-secondary group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Mensajes</span>
                      </Link>
                      <Link 
                        to="/admin-dashboard" 
                        className="flex items-center space-x-3 p-3 text-foreground/80 hover:bg-muted/50 rounded-xl transition-all duration-300 group"
                      >
                        <Package className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Panel Admin</span>
                      </Link>
                      <Link 
                        to="/seller-dashboard" 
                        className="flex items-center space-x-3 p-3 text-foreground/80 hover:bg-muted/50 rounded-xl transition-all duration-300 group"
                      >
                        <Package className="h-5 w-5 text-secondary group-hover:scale-110 transition-transform" />
                        <span className="font-medium">Vendedores</span>
                      </Link>
                    </nav>
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