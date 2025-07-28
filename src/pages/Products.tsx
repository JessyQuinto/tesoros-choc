import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import { useProducts } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, Heart, Filter, Grid, List, ShoppingBag, Sparkles, Tag, Loader2 } from 'lucide-react';
import { Product } from '@/types/product.types';

const Products = () => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const { products, loading, error, searchProducts, getProductsByCategory, fetchProducts } = useProducts();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleToggleFavorite = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    
    toggleFavorite({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      seller: product.sellerName || 'Vendedor',
      location: '', // El backend no maneja ubicación aún
      rating: 5 // Por defecto, el backend no maneja ratings aún
    });
    
    toast({
      title: isFavorite(product.id) ? "Eliminado de favoritos" : "Agregado a favoritos",
      description: `${product.name} ${isFavorite(product.id) ? 'se eliminó de' : 'se agregó a'} tus favoritos`
    });
  };

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

  // Manejo de búsqueda
  const handleSearch = async () => {
    if (searchTerm.trim()) {
      await searchProducts(searchTerm);
    } else {
      await fetchProducts();
    }
  };

  // Manejo de cambio de categoría
  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      await fetchProducts();
    } else {
      await getProductsByCategory(category);
    }
  };

  // Filtrado local para precio y ordenamiento
  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];

    // Filtrar por rango de precios
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(p => {
        if (p === '200000+') return [200000, Infinity];
        return parseInt(p);
      });
      
      if (Array.isArray([min, max])) {
        filtered = filtered.filter(product => 
          product.price >= (min as number) && 
          product.price <= (max as number || Infinity)
        );
      }
    }

    // Ordenar productos
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'featured':
      default:
        // Los productos destacados podrían venir del backend con un flag
        break;
    }

    return filtered;
  };

  const displayProducts = getFilteredAndSortedProducts();

  // Mostrar estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">Error cargando productos: {error}</p>
            <Button onClick={fetchProducts} variant="outline">
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div><div className="container-full py-8 sm:py-12">
        {/* Hero Section Premium */}
        <div className="mb-12 text-center space-y-4">
          <Badge className="bg-gradient-to-r from-primary to-secondary text-white border-0 px-6 py-3 text-base font-medium rounded-full shadow-lg mb-6">
            <Sparkles className="w-5 h-5 mr-2" />
            Artesanías Auténticas
          </Badge>
          
          <h1 className="text-heading text-foreground mb-4">
            Tesoros del Chocó
          </h1>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Descubre la riqueza cultural del Pacífico colombiano a través de artesanías únicas, 
            creadas con técnicas ancestrales y el corazón de nuestros artesanos.
          </p>
        </div>

        {/* Search Premium */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar tesoros únicos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-14 h-14 text-lg rounded-full border-2 border-border focus:border-primary shadow-sm"
            />
            <Button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6 rounded-full"
            >
              Buscar
            </Button>
          </div>
        </div>

        {/* Filters Premium */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[200px] h-12 rounded-full border-2 border-border">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-[200px] h-12 rounded-full border-2 border-border">
                <SelectValue placeholder="Rango de precio" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px] h-12 rounded-full border-2 border-border">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex border-2 border-border rounded-full overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-none px-4"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-none px-4"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-8 text-center">
          <p className="text-muted-foreground">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Cargando productos...
              </span>
            ) : (
              `Mostrando ${displayProducts.length} productos`
            )}
          </p>
        </div>

        {/* Products Grid Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="card-premium overflow-hidden">
                <div className="aspect-square bg-muted animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded w-2/3 mb-4 animate-pulse"></div>
                  <div className="h-5 bg-muted rounded w-1/3 animate-pulse"></div>
                </CardContent>
              </Card>
            ))
          ) : displayProducts.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">No se encontraron productos</h3>
                <p className="text-muted-foreground">
                  Intenta ajustar tus filtros o buscar con otros términos
                </p>
              </div>
            </div>
          ) : (
            displayProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Image Container */}
                  <div className="relative">
                    <img 
                      src={product.images[0] || ''} 
                      alt={product.name}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2">
                      {product.isActive && (
                        <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                          Disponible
                        </span>
                      )}
                      <span className="bg-amber-700 text-white text-xs font-bold px-2 py-1 rounded ml-1">
                        {product.category}
                      </span>
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
                      onClick={(e) => handleToggleFavorite(product, e)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors ${
                          isFavorite(product.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-muted-foreground hover:text-red-500'
                        }`} 
                      />
                    </Button>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 bg-white">
                    <h3 className="text-lg font-semibold text-foreground mb-1 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      por {product.sellerName || 'Vendedor'} • Stock: {product.stock}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary font-bold text-lg">
                          ${product.price.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center text-sm text-amber-600">
                        <Star className="h-5 w-5 fill-current mr-1" />
                        <span className="font-medium">5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
