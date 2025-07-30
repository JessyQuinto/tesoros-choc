import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { sellerService } from '@/services/seller.service';
import { Product } from '@/types/product.types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  DollarSign,
  Star,
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Image as ImageIcon,
  Save,
  X,
  Upload,
  BarChart3,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';

export const ProductManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const categories = [
    'Cestería',
    'Tejidos',
    'Cerámica',
    'Madera',
    'Metal',
    'Textiles',
    'Joyería',
    'Otros'
  ];

  // Cargar productos del vendedor
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await sellerService.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleProductStatus = async (productId: string) => {
    try {
      setUpdatingStatus(productId);
      const result = await sellerService.toggleProductStatus(productId);
      
      // Actualizar el estado local
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, isActive: result.isActive }
          : product
      ));
      
      toast({
        title: "Estado actualizado",
        description: `Producto ${result.isActive ? 'activado' : 'desactivado'} exitosamente`
      });
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del producto",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setDeletingProduct(productId);
      await sellerService.deleteProduct(productId);
      
      // Remover producto de la lista local
      setProducts(prev => prev.filter(p => p.id !== productId));
      
      toast({
        title: "Producto eliminado",
        description: "El producto se ha eliminado exitosamente"
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive"
      });
    } finally {
      setDeletingProduct(null);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Activo' : 'Inactivo';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && product.isActive) || 
      (statusFilter === 'inactive' && !product.isActive);
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
    lowStock: products.filter(p => p.stock <= 5 && p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length
  };

  if (!user || user.role !== 'vendedor') {
    return (
      <div className="container-full py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
            <p>Esta área está reservada para vendedores.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-full py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-full py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Productos</h1>
            <p className="text-muted-foreground">
              Administra tu catálogo de productos artesanales
            </p>
          </div>
          <Button onClick={() => navigate('/seller/products/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Activos</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Inactivos</p>
                  <p className="text-2xl font-bold">{stats.inactive}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Stock Bajo</p>
                  <p className="text-2xl font-bold">{stats.lowStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <X className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Sin Stock</p>
                  <p className="text-2xl font-bold">{stats.outOfStock}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nombre del producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Estado</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setCategoryFilter('all');
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay productos</h3>
                <p className="text-muted-foreground mb-4">
                  {products.length === 0 
                    ? 'Comienza agregando tu primer producto artesanal'
                    : 'No se encontraron productos con los filtros aplicados'
                  }
                </p>
                <Button onClick={() => navigate('/seller/products/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Producto
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{product.name}</h3>
                            <Badge className={getStatusColor(product.isActive)}>
                              {getStatusText(product.isActive)}
                            </Badge>
                            {product.stock <= 5 && product.stock > 0 && (
                              <Badge variant="outline" className="text-orange-600">
                                Stock Bajo
                              </Badge>
                            )}
                            {product.stock === 0 && (
                              <Badge variant="destructive">
                                Sin Stock
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              ${product.price.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="h-4 w-4" />
                              Stock: {product.stock}
                            </span>
                            <span>{product.category}</span>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {product.description}
                          </p>

                          <div className="text-xs text-muted-foreground">
                            Actualizado: {new Date(product.updatedAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/seller/products/${product.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleProductStatus(product.id)}
                            disabled={updatingStatus === product.id}
                          >
                            {updatingStatus === product.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : (
                              <Switch className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={deletingProduct === product.id}
                            className="text-destructive hover:text-destructive"
                          >
                            {deletingProduct === product.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
