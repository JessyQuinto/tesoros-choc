import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/Layout/Header';
import { Search, Filter, Star, MapPin, Heart, Grid, List } from 'lucide-react';

const Products = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'textiles', label: 'Textiles' },
    { value: 'basketry', label: 'Cestería' },
    { value: 'jewelry', label: 'Joyería' },
    { value: 'woodwork', label: 'Tallado' },
    { value: 'ceramics', label: 'Cerámica' },
    { value: 'instruments', label: 'Instrumentos' }
  ];

  const priceRanges = [
    { value: 'all', label: 'Todos los precios' },
    { value: '0-50000', label: 'Hasta $50,000' },
    { value: '50000-100000', label: '$50,000 - $100,000' },
    { value: '100000-200000', label: '$100,000 - $200,000' },
    { value: '200000+', label: 'Más de $200,000' }
  ];

  const sortOptions = [
    { value: 'featured', label: 'Destacados' },
    { value: 'price-low', label: 'Precio: Menor a Mayor' },
    { value: 'price-high', label: 'Precio: Mayor a Menor' },
    { value: 'rating', label: 'Mejor Calificación' },
    { value: 'newest', label: 'Más Recientes' }
  ];

  const products = [
    {
      id: 1,
      name: "Cesta Artesanal de Palma",
      price: 45000,
      image: "/api/placeholder/300/300",
      seller: "María Mosquera",
      location: "Quibdó, Chocó",
      rating: 4.8,
      reviewCount: 24,
      category: "basketry",
      isNew: true,
      description: "Hermosa cesta tejida a mano con palma de iraca"
    },
    {
      id: 2,
      name: "Collar Wayuu Tradicional",
      price: 65000,
      image: "/api/placeholder/300/300",
      seller: "Carmen Riascos",
      location: "Istmina, Chocó",
      rating: 4.9,
      reviewCount: 18,
      category: "jewelry",
      featured: true,
      description: "Collar auténtico con diseños ancestrales wayuu"
    },
    {
      id: 3,
      name: "Máscara Ceremonial Tallada",
      price: 120000,
      image: "/api/placeholder/300/300",
      seller: "Antonio Córdoba",
      location: "Baudó, Chocó",
      rating: 5.0,
      reviewCount: 12,
      category: "woodwork",
      isNew: true,
      description: "Máscara tallada en madera con motivos espirituales"
    },
    {
      id: 4,
      name: "Tambor Embera",
      price: 95000,
      image: "/api/placeholder/300/300",
      seller: "Rosa Mena",
      location: "Riosucio, Chocó",
      rating: 4.7,
      reviewCount: 15,
      category: "instruments",
      description: "Tambor tradicional hecho con cuero de venado"
    },
    {
      id: 5,
      name: "Vasija de Barro Negro",
      price: 75000,
      image: "/api/placeholder/300/300",
      seller: "Esperanza Palacios",
      location: "Condoto, Chocó",
      rating: 4.8,
      reviewCount: 20,
      category: "ceramics",
      description: "Vasija de barro negro con técnicas ancestrales"
    },
    {
      id: 6,
      name: "Mochila Arhuaca",
      price: 85000,
      image: "/api/placeholder/300/300",
      seller: "Lucía Restrepo",
      location: "Acandí, Chocó",
      rating: 4.9,
      reviewCount: 32,
      category: "textiles",
      featured: true,
      description: "Mochila tejida con algodón natural y diseños tradicionales"
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
      if (max) {
        matchesPrice = product.price >= parseInt(min) && product.price <= parseInt(max);
      } else {
        matchesPrice = product.price >= parseInt(min);
      }
    }
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return a.isNew ? -1 : 1;
      default: return a.featured ? -1 : 1;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Productos Artesanales</h1>
          <p className="text-muted-foreground">Descubre los tesoros únicos del Chocó</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar productos, artesanos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Price Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map(range => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Mostrando {sortedProducts.length} de {products.length} productos
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' 
          ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {sortedProducts.map((product) => (
            <Card 
              key={product.id} 
              className={`overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
                viewMode === 'list' ? 'flex flex-row' : ''
              }`}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className={`object-cover ${
                    viewMode === 'list' ? 'w-full h-full' : 'w-full h-48'
                  }`}
                />
                <div className="absolute top-2 right-2">
                  <Heart className="h-6 w-6 text-white/70 hover:text-red-500 cursor-pointer transition-colors" />
                </div>
                {product.isNew && (
                  <Badge className="absolute top-2 left-2 bg-choco-green">Nuevo</Badge>
                )}
                {product.featured && (
                  <Badge className="absolute top-2 left-2 bg-choco-gold text-choco-earth">Destacado</Badge>
                )}
              </div>
              
              <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <h3 className="font-semibold mb-2 line-clamp-1">{product.name}</h3>
                {viewMode === 'list' && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <p className="text-2xl font-bold text-primary mb-2">
                  ${product.price.toLocaleString()}
                </p>
                
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {product.location}
                </div>
                
                <p className="text-sm text-muted-foreground">por {product.seller}</p>
                
                {viewMode === 'list' && (
                  <div className="mt-4">
                    <Button className="w-full">Ver Detalles</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {sortedProducts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
              <p className="text-muted-foreground mb-4">
                Intenta ajustar tus filtros de búsqueda
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange('all');
              }}>
                Limpiar Filtros
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Load More (if needed) */}
        {sortedProducts.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Cargar Más Productos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;