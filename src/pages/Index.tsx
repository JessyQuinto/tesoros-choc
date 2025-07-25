import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Layout/Header';
import { Search, ShoppingBag, Star, MapPin, Heart } from 'lucide-react';
import heroImage from '@/assets/hero-choco.jpg';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const featuredProducts = [
    {
      id: 1,
      name: "Cesta Artesanal de Palma",
      price: 45000,
      image: "/api/placeholder/300/300",
      seller: "María Mosquera",
      location: "Quibdó, Chocó",
      rating: 4.8,
      isNew: true
    },
    {
      id: 2,
      name: "Collar Wayuu Tradicional",
      price: 65000,
      image: "/api/placeholder/300/300",
      seller: "Carmen Riascos",
      location: "Istmina, Chocó",
      rating: 4.9,
      featured: true
    },
    {
      id: 3,
      name: "Máscara Ceremonial Tallada",
      price: 120000,
      image: "/api/placeholder/300/300",
      seller: "Antonio Córdoba",
      location: "Baudó, Chocó",
      rating: 5.0,
      isNew: true
    }
  ];

  const categories = [
    { name: "Textiles", count: 45, icon: "🧵" },
    { name: "Cestería", count: 32, icon: "🧺" },
    { name: "Joyería", count: 28, icon: "💍" },
    { name: "Tallado", count: 19, icon: "🗿" },
    { name: "Cerámica", count: 15, icon: "🏺" },
    { name: "Instrumentos", count: 12, icon: "🥁" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Artesanías del Chocó" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tesoros del
              <span className="block text-choco-gold">Chocó</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Descubre la magia de las artesanías hechas a mano por nuestros campesinos. 
              Cada producto cuenta una historia de tradición y amor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/products')}
                className="bg-choco-gold hover:bg-choco-gold/90 text-choco-earth font-semibold"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Explorar Productos
              </Button>
              {!user && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/register')}
                  className="border-white text-white hover:bg-white hover:text-choco-earth"
                >
                  Únete como Vendedor
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 bg-card border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar productos, artesanos..."
                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => navigate('/products')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Categorías Populares</h2>
            <p className="text-muted-foreground">Explora nuestra colección de artesanías tradicionales</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="text-center hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate('/products')}
              >
                <CardContent className="p-6">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} productos</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Productos Destacados</h2>
            <p className="text-muted-foreground">Los tesoros más especiales de nuestros artesanos</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/products')}
              >
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Heart className="h-6 w-6 text-white/70 hover:text-red-500 cursor-pointer" />
                  </div>
                  {product.isNew && (
                    <Badge className="absolute top-2 left-2 bg-choco-green">Nuevo</Badge>
                  )}
                  {product.featured && (
                    <Badge className="absolute top-2 left-2 bg-choco-gold text-choco-earth">Destacado</Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-2">
                    ${product.price.toLocaleString()}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {product.location}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">por {product.seller}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button onClick={() => navigate('/products')}>Ver Todos los Productos</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-choco-earth to-choco-wood text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Eres Artesano del Chocó?</h2>
          <p className="text-xl mb-8 text-white/90">
            Únete a nuestra plataforma y lleva tus creaciones a todo Colombia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/register')}
            >
              Crear Cuenta de Vendedor
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-choco-earth"
              onClick={() => navigate('/about')}
            >
              Conoce Más
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
