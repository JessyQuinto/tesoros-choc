import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Phone, MessageCircle, Mail, Instagram, Facebook, Twitter, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border/50 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent shadow-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">
                  Tesoros del Chocó
                </span>
                <span className="text-sm text-muted-foreground">
                  Artesanías Auténticas
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground max-w-md leading-relaxed mb-6">
              Conectamos la riqueza artesanal del Chocó con el mundo, promoviendo 
              el comercio justo y el desarrollo sostenible de nuestras comunidades.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Enlaces Rápidos</h3>
            <nav className="space-y-3">
              <Link to="/products" className="block text-muted-foreground hover:text-primary transition-colors">
                Productos
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                Acerca de Nosotros
              </Link>
              <Link to="/auth" className="block text-muted-foreground hover:text-primary transition-colors">
                Iniciar Sesión
              </Link>
              <Link to="/auth" className="block text-muted-foreground hover:text-primary transition-colors">
                Registrarse
              </Link>
            </nav>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm">info@tesoroschoco.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm">+57 314 567 8900</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-sm">+57 300 123 4567</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm">Quibdó, Chocó, Colombia</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2025 Tesoros del Chocó. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Términos de Servicio</a>
            <a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-primary transition-colors">Ayuda</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
