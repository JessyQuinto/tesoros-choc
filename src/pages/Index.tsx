import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Search, ShoppingBag, Star, MapPin, Heart, Sparkles, ArrowRight, Users, Package, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-choco.jpg';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const featuredProducts = [
    {
      id: 1,
      name: "Cesta Artesanal de Palma",
      price: 45000,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEuP2jaxW-4doOKMOeSzU81-oqhTUUrABfv3OnLUY7DP8XCeySupsCIrkGLkf8lTZvCbWeHjjUoFpgAD6UuakL6TmxaPItdItP_4v-GXV8-ht2VHazbirtOjPrU5sayYuGsDk5555ngMjo-Wp8qlo6dlPDJkxqSnD6nXiuh_jDrpVMOKidedLRWj6v_VIcYbLTrcqQ4gupup8I61Bq1HPLTVV5AAuIn1qtJLwsusK8br9jqTFAFZ1-dn_0GBH4Ul4DXodkVi7kp0M",
      seller: "María Mosquera",
      location: "Quibdó, Chocó",
      rating: 4.8,
      isNew: true
    },
    {
      id: 2,
      name: "Collar Wayuu Tradicional",
      price: 65000,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiYNoSLNic5jl6-U9odJs0DHlb_DH6iu8C2Yx_ACDbF1SOcf08gCkUzAMmYnAm3oIpjRYjVVKnyna3kH-qzh4yMeaWUq9IkFoPpZaxelHg4sgsEqfvOlDde3_nPTIHM_OSmzozA4ONRlu-LqoeBdSjz4RNNiaOVp8Jj45f0tApnYhQHnwBbFEP8ojXsT-SsYoRramlMrGmFxVY5Io5PMJB1PjxbuL8kZrs_9pJPuTwWMPS8TZF_68js_Wla-KU0n4hb56FiV5Gi0M",
      seller: "Carmen Riascos",
      location: "Istmina, Chocó",
      rating: 4.9,
      featured: true
    },
    {
      id: 3,
      name: "Máscara Ceremonial Tallada",
      price: 120000,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_ZHNSMDAW1me7RnXk1CSqUZgPLHOwfxYxyO3ETpijuoydbc9yPM0Ixu49EgZ2pzIFe0-ZB6u1SEhOeO9k3xkvcQsqx9ECts7u6jpOJHDiZv79sPd6Y33aTZTo4kuQ1xjIx28_YpdiRKJrhtUZr12KRIfl1xy51eW5KSVpAUcMqaawccL0Qqfkm9KVNc-NTb4MQX5YEk4vP_4jGhoaENwogHpZ2p8V3VzSFauAtoKyh2EHut7OswfpLM9XewQrm3H7I2tIOiJUBBo",
      seller: "Antonio Córdoba",
      location: "Baudó, Chocó",
      rating: 5.0,
      isNew: true
    }
  ];

  const categories = [
    { name: "Textiles", count: 45, icon: "🧵", gradient: "from-blue-50 to-indigo-100", textColor: "text-blue-600" },
    { name: "Cestería", count: 32, icon: "🧺", gradient: "from-amber-50 to-yellow-100", textColor: "text-amber-700" },
    { name: "Joyería", count: 28, icon: "💍", gradient: "from-purple-50 to-pink-100", textColor: "text-purple-600" },
    { name: "Tallado", count: 19, icon: "🗿", gradient: "from-gray-50 to-slate-100", textColor: "text-gray-600" },
    { name: "Cerámica", count: 15, icon: "🏺", gradient: "from-orange-50 to-red-100", textColor: "text-orange-600" },
    { name: "Instrumentos", count: 12, icon: "🥁", gradient: "from-green-50 to-emerald-100", textColor: "text-green-600" }
  ];

  const stats = [
    { icon: Users, value: "500+", label: "Artesanos", color: "text-primary" },
    { icon: Package, value: "1,200+", label: "Productos", color: "text-secondary" },
    { icon: TrendingUp, value: "98%", label: "Satisfacción", color: "text-accent" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section Premium - Completamente Responsivo */}
      <section className="hero-section min-h-[80vh] sm:min-h-[85vh] lg:min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        
        <div className="relative z-20 container-max space-section">
          <div className="max-w-4xl space-y-8 animate-fade-in">
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0 px-4 py-2 text-sm font-medium rounded-full shadow-lg">
                <Sparkles className="w-4 h-4 mr-2" />
                Auténtico • Artesanal • Sostenible
              </Badge>
              
              <h1 className="text-display text-gradient leading-tight">
                Tesoros del Chocó
              </h1>
              
              <p className="text-body-lg text-foreground/80 max-w-2xl leading-relaxed">
                Descubre la riqueza cultural y artesanal del Pacífico colombiano. 
                Conecta directamente con artesanos locales y lleva a tu hogar la autenticidad 
                de las tradiciones ancestrales.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Button 
                onClick={() => navigate('/products')}
                className="btn-primary h-14 px-8 text-lg group"
              >
                <Search className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                Explorar Productos
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              {!user && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={() => navigate('/auth?role=buyer')}
                    variant="outline"
                    className="h-14 px-6 text-lg border-2 border-primary/30 hover:border-primary hover:bg-primary/5 text-foreground"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Registrarse como Comprador
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/auth?role=seller')}
                    variant="secondary"
                    className="h-14 px-6 text-lg bg-secondary hover:bg-secondary/90 text-white"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Registrarse como Vendedor
                  </Button>
                </div>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/30">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${
                    index === 0 ? 'from-primary to-primary' :
                    index === 1 ? 'from-secondary to-secondary' : 'from-accent to-accent'
                  } text-white mb-2 group-hover:shadow-lg transition-all duration-300`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section Premium - Responsivo */}
      <section className="space-section bg-muted/30">
        <div className="container-max">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 py-2">
              Tradiciones Ancestrales
            </Badge>
            <h2 className="text-heading text-foreground">
              Categorías Artesanales
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Cada pieza cuenta una historia, cada artesano preserva una tradición
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={category.name} 
                className="card-product hover-lift cursor-pointer group"
                onClick={() => navigate(`/products?category=${category.name.toLowerCase()}`)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-2xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105 border border-white/50`}>
                    <span className={category.textColor}>{category.icon}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-[#333333] group-hover:text-[#e87c30] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-[#666666]">
                      {category.count} productos
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section Premium - Responsivo */}
      <section className="space-section">
        <div className="container-max">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="border-secondary/30 text-secondary bg-secondary/5 px-4 py-2">
              Selección Especial
            </Badge>
            <h2 className="text-heading text-foreground">
              Productos Destacados
            </h2>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Los mejores trabajos de nuestros artesanos, seleccionados especialmente para ti
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Image Container */}
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2">
                      {product.featured && (
                        <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                          Destacado
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-amber-700 text-white text-xs font-bold px-2 py-1 rounded ml-1">
                          Nuevo
                        </span>
                      )}
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary/90 font-medium"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                    
                    {/* Favorite Button */}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <Heart className="w-4 h-4 text-muted-foreground hover:text-red-500 transition-colors" />
                    </Button>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 bg-white">
                    <h3 className="text-lg font-semibold text-foreground mb-1 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      por {product.seller} en {product.location}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-primary font-bold text-lg">
                        ${product.price.toLocaleString()}
                      </p>
                      
                      <div className="flex items-center text-sm text-amber-600">
                        <Star className="h-5 w-5 fill-current mr-1" />
                        <span className="font-medium">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Button 
              onClick={() => navigate('/products')}
              className="btn-secondary h-14 px-8 text-lg group"
            >
              Ver Todos los Productos
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section Premium - Responsivo */}
      <section className="hero-section min-h-[60vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        
        <div className="relative z-20 container-max text-center space-y-8">
          <div className="space-y-6">
            <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0 px-6 py-3 text-base font-medium rounded-full shadow-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Únete a Nuestra Comunidad
            </Badge>
            
            <h2 className="text-heading text-foreground max-w-3xl mx-auto">
              Conecta con Artesanos Auténticos del Chocó
            </h2>
            
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Únete a nuestra plataforma y lleva tus creaciones a todo Colombia. 
              Construyamos juntos un marketplace que preserve y celebre nuestras tradiciones.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            {!user && (
              <Button 
                onClick={() => navigate('/auth')}
                className="btn-primary h-14 px-8 text-lg"
              >
                Empezar a Vender
              </Button>
            )}
            
            <Button 
              onClick={() => navigate('/about')}
              variant="outline"
              className="h-14 px-8 text-lg border-2 border-primary/30 hover:border-primary hover:bg-primary/5"
            >
              Conoce Más
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
