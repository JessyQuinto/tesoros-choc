import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, Heart, Filter, Grid, List, ShoppingBag, Sparkles, Tag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  seller: string;
  location: string;
  rating: number;
  category: string;
  isNew?: boolean;
  featured?: boolean;
  originalPrice?: number;
}

const Products = () => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const handleToggleFavorite = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    
    toggleFavorite({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      seller: product.seller,
      location: product.location,
      rating: product.rating
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

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockProducts: Product[] = [
        {
          id: 1,
          name: "Cesta Artesanal de Palma",
          price: 45000,
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEuP2jaxW-4doOKMOeSzU81-oqhTUUrABfv3OnLUY7DP8XCeySupsCIrkGLkf8lTZvCbWeHjjUoFpgAD6UuakL6TmxaPItdItP_4v-GXV8-ht2VHazbirtOjPrU5sayYuGsDk5555ngMjo-Wp8qlo6dlPDJkxqSnD6nXiuh_jDrpVMOKidedLRWj6v_VIcYbLTrcqQ4gupup8I61Bq1HPLTVV5AAuIn1qtJLwsusK8br9jqTFAFZ1-dn_0GBH4Ul4DXodkVi7kp0M",
          seller: "María Mosquera",
          location: "Quibdó, Chocó",
          rating: 4.8,
          category: "basketry",
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
          category: "jewelry",
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
          category: "woodwork",
          isNew: true
        },
        {
          id: 4,
          name: "Tejido Embera Multicolor",
          price: 85000,
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHWGnRxuwPHhV32CFYKPnOtU3Um5pyhunvhsR71zsx7R2e87v7SgqKDDzva14nd8Z-0ZxMWQmfVdMgA-VJEYm2oDWYCTl7-nvrNYq3ZqTG3ZSCnfAcX3pT5KtA5YNuMS9MnjaGn8qIlv7FEfGagD4Yn4L1jp3DGdGoTG7gnTxsIvYN0W8n3qebetcFxPam2pTobxLCEpACHLYNNdMi-CgbOzbimJAo1aMIIbxwBZHiAr03iHaFBcqPQxyBQS_s41dI6_tM76Nyf2s",
          seller: "Luz Marina Palacios",
          location: "Tadó, Chocó",
          rating: 4.7,
          category: "textiles",
          featured: true
        },
        {
          id: 5,
          name: "Cuenco de Cerámica Negra",
          price: 35000,
          originalPrice: 45000,
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM6RwZRqNQ7a1jrtCezPe4kMZ4csRz_RJVXr76gxn5DNWtjj2KUpzRC1x8puobubG9kyh2j-vyBoB9rod7cKy8SYVy9ngMqHk8DkymJL9WlRMlgChQDmBMciXf6PYokCiBarTZXUAkDbyLYuiX4xMhIoaJQyzFFkIAOtnaF9dN-sl10nZKucY_EMun8g6PtKHSIwizNTnGPD6uFQr1kej7NQU9deEyzJrwk0lxdOqaxNQ7XhA3Iw8bziC0XgKnaVTaPOiSUByfA38",
          seller: "Roberto Mena",
          location: "Riosucio, Chocó",
          rating: 4.6,
          category: "ceramics"
        },
        {
          id: 6,
          name: "Marimba Tradicional",
          price: 450000,
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-Ve5K_RrD3UxqEMQak8uzh0biiejjGi4p3k3AJ-9WTztLwufVpZXSrp-IKL4P8H8VVE3R_nUcFQoLF0XUdobIUPzqi3BywZ3Se54M1M4koBJQ3Ib3VxXT8n0ahp7W4pMWMkxhO0Hjs-1KbbyaK6KQdXdI0lmLyAkDx4G_cHqZmN7et9B3KD9KFaO4l17XNQa-YKAjXSw0HAzDzDUmLfzeXilJgsVslPX-EkGZfd5AP4sIouU-xkeOoVR3fu5nSxgqkaBFQ3lvRts",
          seller: "Miguel Ángel Quinto",
          location: "Quibdó, Chocó",
          rating: 4.9,
          category: "instruments",
          isNew: true
        },
        {
          id: 7,
          name: "Bolso Tejido a Mano",
          price: 75000,
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzv-kgTe8Ru47elbZjBre18E8EvoLIEpBOQlKnL5XoLnRDTevYDj4Y5S9ba79pL76Olop2oZ8uML1LoWRdmH8Lgp6r9p7Hf78AvFpjuPdTuKpb06XIHJf5tEmESWKIeV6tNoCOX8U_o_IcbTDrDqbG8nQ-cNoE42BY6nWoN4jo8GJeK1v6HnnIGzEQYP1nO4wkCwrTgIovWHXRrU7mihodxnzUarzM4Y4QsNGWSp_nxP1fw6ZqMolldF6SBlB0sQ8qRm6AFMNmeAU",
          seller: "Ana Lucía Rivas",
          location: "Nuquí, Chocó",
          rating: 4.5,
          category: "textiles"
        },
        {
          id: 8,
          name: "Figura Tallada en Madera",
          price: 95000,
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcHe3bemgfbpuO4nvZ3C519hlmQ5dPTbYsrkEgrbHbNYnSzRX1Q7PfLZzFhM3H65sOx37xq7Hv9lgE1tyrAL6dqcpoI6sTrSFPBVKhSHUBOFwoH6EwtnpXs1zOo_bXLTd3NUabcfBRAXDLQTCG3ixRIkCywYDXz-a5ajy8NTYjxI7NaHK4RgDfnKk6ze425O7BCZxAnEjjvXu24DF4KKkb7A3A0bxJe6eFKjnWnGGbloDi8qf75YnhfsXRiCC7q6AIZQa4z3ubrj4",
          seller: "Carlos Hurtado",
          location: "Bahía Solano, Chocó",
          rating: 4.8,
          category: "woodwork",
          featured: true
        }
      ];
      
      setProducts(mockProducts);
      setIsLoading(false);
    };
    
    loadProducts();
  }, []);

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
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container-max py-8 sm:py-12">
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
              className="pl-14 h-14 text-lg rounded-full border-2 border-border focus:border-primary shadow-sm"
            />
          </div>
        </div>

        {/* Filters Premium */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-8 text-center">
          <p className="text-muted-foreground">
            {isLoading ? 'Cargando...' : `${sortedProducts.length} productos encontrados`}
          </p>
        </div>

        {/* Products Grid Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
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
          ) : sortedProducts.length === 0 ? (
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
            sortedProducts.map((product) => (
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
                      {product.originalPrice && (
                        <span className="bg-red-800 text-white text-xs font-bold px-2 py-1 rounded ml-1">
                          Oferta
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
                      por {product.seller} en {product.location}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        {product.originalPrice ? (
                          <div className="space-y-1">
                            <p className="text-gray-500 line-through text-sm">
                              ${product.originalPrice.toLocaleString()}
                            </p>
                            <p className="text-primary font-bold text-lg">
                              ${product.price.toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <p className="text-primary font-bold text-lg">
                            ${product.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-amber-600">
                        <Star className="h-5 w-5 fill-current mr-1" />
                        <span className="font-medium">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;
