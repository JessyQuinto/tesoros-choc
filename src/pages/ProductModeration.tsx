import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/admin.service';
import { Product } from '@/types/product.types';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Pause, 
  Search, 
  Filter,
  Package,
  User,
  DollarSign,
  Eye,
  Flag,
  Calendar,
  Image as ImageIcon
} from 'lucide-react';

const ProductModeration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [reportedProducts, setReportedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'suspend' | null>(null);
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Cargar productos reportados
  useEffect(() => {
    loadReportedProducts();
  }, []);

  const loadReportedProducts = async () => {
    try {
      setLoading(true);
      const products = await adminService.getReportedProducts();
      setReportedProducts(products);
    } catch (error) {
      console.error('Error loading reported products:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos reportados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (product: Product, type: 'approve' | 'reject' | 'suspend') => {
    setSelectedProduct(product);
    setActionType(type);
    setReason('');
    setIsDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedProduct || !actionType) return;

    try {
      setProcessing(true);

      switch (actionType) {
        case 'approve':
          await adminService.approveProduct(selectedProduct.id, reason);
          toast({
            title: "Producto aprobado",
            description: `${selectedProduct.name} ha sido aprobado exitosamente`
          });
          break;
        case 'reject':
          await adminService.rejectProduct(selectedProduct.id, reason);
          toast({
            title: "Producto rechazado",
            description: `${selectedProduct.name} ha sido rechazado`
          });
          break;
        case 'suspend':
          await adminService.suspendProduct(selectedProduct.id, reason);
          toast({
            title: "Producto suspendido",
            description: `${selectedProduct.name} ha sido suspendido temporalmente`
          });
          break;
      }

      // Remover producto de la lista
      setReportedProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error processing action:', error);
      toast({
        title: "Error",
        description: `No se pudo procesar la acción`,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getActionTypeText = (type: 'approve' | 'reject' | 'suspend') => {
    switch (type) {
      case 'approve': return 'Aprobar';
      case 'reject': return 'Rechazar';
      case 'suspend': return 'Suspender';
    }
  };

  const getActionTypeColor = (type: 'approve' | 'reject' | 'suspend') => {
    switch (type) {
      case 'approve': return 'text-green-600 hover:text-green-700';
      case 'reject': return 'text-red-600 hover:text-red-700';
      case 'suspend': return 'text-yellow-600 hover:text-yellow-700';
    }
  };

  const filteredProducts = reportedProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

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

  if (!user || user.role !== 'admin') {
    return (
      <div className="container-full py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
            <p>Esta área está reservada para administradores.</p>
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
    <div className="container-full py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Moderación de Productos</h1>
          <p className="text-muted-foreground">
            Revisa y modera productos reportados por la comunidad
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-red-600">
            <Flag className="h-4 w-4 mr-1" />
            {reportedProducts.length} Reportados
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Reportados</p>
                <p className="text-2xl font-bold">{reportedProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Aprobados Hoy</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Rechazados Hoy</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Pause className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Suspendidos Hoy</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Buscar Producto</Label>
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
              <Flag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay productos reportados</h3>
              <p className="text-muted-foreground">
                {reportedProducts.length === 0 
                  ? 'Todos los productos han sido procesados'
                  : 'No se encontraron productos con los filtros aplicados'
                }
              </p>
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
                          <Badge variant="destructive">
                            Reportado
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            Vendedor: {product.sellerName || 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${product.price?.toLocaleString()}
                          </span>
                          <span>{product.category}</span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Reportado: {product.reportedAt ? new Date(product.reportedAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction(product, 'approve')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Aprobar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction(product, 'suspend')}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Suspender
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAction(product, 'reject')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Rechazar
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

      {/* Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType ? getActionTypeText(actionType) + ' Producto' : 'Acción'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? '¿Estás seguro de que quieres aprobar este producto?'
                : actionType === 'reject'
                ? '¿Estás seguro de que quieres rechazar este producto?'
                : '¿Estás seguro de que quieres suspender este producto?'
              }
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">{selectedProduct.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Vendedor: {selectedProduct.sellerName || 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Precio: ${selectedProduct.price?.toLocaleString()}
                </p>
              </div>

              <div>
                <Label htmlFor="reason">
                  {actionType === 'approve' 
                    ? 'Razón de aprobación (opcional)' 
                    : actionType === 'reject'
                    ? 'Razón de rechazo'
                    : 'Razón de suspensión'
                  }
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    actionType === 'approve' 
                      ? 'Mensaje de aprobación...'
                      : actionType === 'reject'
                      ? 'Explica por qué se rechaza el producto...'
                      : 'Explica por qué se suspende el producto...'
                  }
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={processing || (actionType !== 'approve' && !reason.trim())}
              className={
                actionType === 'approve' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : actionType === 'reject'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-yellow-600 hover:bg-yellow-700'
              }
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  {actionType === 'approve' ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : actionType === 'reject' ? (
                    <XCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <Pause className="h-4 w-4 mr-2" />
                  )}
                  {actionType ? getActionTypeText(actionType) : 'Confirmar'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductModeration;
