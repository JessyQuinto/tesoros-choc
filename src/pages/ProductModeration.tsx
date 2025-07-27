import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  Filter,
  Search,
  Star,
  MessageSquare,
  Calendar,
  User,
  Tag,
  ImageIcon,
  Package,
  DollarSign,
  MapPin,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Send,
  History,
  BarChart3
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  seller: {
    id: string;
    name: string;
    email: string;
    rating: number;
    totalProducts: number;
  };
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  tags: string[];
  stock: number;
  location: string;
  createdAt: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  moderationNotes?: string;
  rejectionReason?: string;
  culturalSignificance?: string;
  materials: string[];
  dimensions?: string;
  weight?: string;
  isFeatured: boolean;
  violations?: string[];
}

interface ModerationAction {
  id: string;
  productId: string;
  action: 'approved' | 'rejected' | 'requested_changes';
  moderatorId: string;
  moderatorName: string;
  notes: string;
  timestamp: string;
  reason?: string;
}

const ProductModeration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Máscara Tradicional Emberá',
      description: 'Máscara artesanal tallada en madera de cedro siguiendo técnicas ancestrales de la comunidad Emberá. Representa el espíritu protector del jaguar.',
      price: 285000,
      images: ['/placeholder.svg', '/placeholder.svg'],
      category: 'Arte y Decoración',
      seller: {
        id: 'seller1',
        name: 'Carmen Domicó',
        email: 'carmen.domico@email.com',
        rating: 4.8,
        totalProducts: 15
      },
      status: 'pending',
      tags: ['artesanal', 'emberá', 'madera', 'tradicional', 'cultural'],
      stock: 3,
      location: 'Resguardo Chamí, Chocó',
      createdAt: '2024-01-20T10:00:00Z',
      submittedAt: '2024-01-20T10:00:00Z',
      culturalSignificance: 'Pieza con alto valor cultural, representa tradiciones milenarias de la comunidad Emberá',
      materials: ['Cedro', 'Pigmentos naturales'],
      dimensions: '25cm x 18cm x 10cm',
      weight: '0.8kg',
      isFeatured: false
    },
    {
      id: '2',
      name: 'Collar de Chaquiras Tradicional',
      description: 'Collar elaborado con chaquiras de colores siguiendo patrones tradicionales de la cultura Emberá.',
      price: 125000,
      images: ['/placeholder.svg'],
      category: 'Joyería y Accesorios',
      seller: {
        id: 'seller2',
        name: 'Rosa Bailarín',
        email: 'rosa.bailarin@email.com',
        rating: 4.9,
        totalProducts: 23
      },
      status: 'under_review',
      tags: ['chaquiras', 'collar', 'emberá', 'joyería'],
      stock: 8,
      location: 'Baudó, Chocó',
      createdAt: '2024-01-18T14:30:00Z',
      submittedAt: '2024-01-18T14:30:00Z',
      culturalSignificance: 'Los patrones de colores tienen significado ceremonial específico',
      materials: ['Chaquiras de vidrio', 'Hilo de algodón'],
      dimensions: '45cm de largo',
      weight: '0.2kg',
      isFeatured: false,
      violations: ['Imágenes de baja calidad']
    },
    {
      id: '3',
      name: 'Cacao Orgánico Premium',
      description: 'Cacao fino de aroma cultivado en las montañas del Chocó, procesado de manera tradicional.',
      price: 45000,
      images: ['/placeholder.svg'],
      category: 'Alimentación',
      seller: {
        id: 'seller3',
        name: 'Cooperativa Cacaotera',
        email: 'info@coopchoco.com',
        rating: 4.6,
        totalProducts: 8
      },
      status: 'approved',
      tags: ['cacao', 'orgánico', 'premium', 'chocó'],
      stock: 50,
      location: 'Alto Baudó, Chocó',
      createdAt: '2024-01-15T09:00:00Z',
      submittedAt: '2024-01-15T09:00:00Z',
      reviewedAt: '2024-01-16T11:30:00Z',
      reviewedBy: 'Admin',
      moderationNotes: 'Producto de excelente calidad, cumple con estándares orgánicos',
      culturalSignificance: 'Cultivo tradicional con técnicas ancestrales',
      materials: ['Cacao fino de aroma'],
      weight: '500g',
      isFeatured: true
    }
  ]);

  const [moderationHistory, setModerationHistory] = useState<ModerationAction[]>([
    {
      id: '1',
      productId: '3',
      action: 'approved',
      moderatorId: 'admin1',
      moderatorName: 'Admin Principal',
      notes: 'Producto cumple con todos los estándares de calidad y autenticidad',
      timestamp: '2024-01-16T11:30:00Z'
    }
  ]);

  const [activeTab, setActiveTab] = useState('pending');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sellerFilter, setSellerFilter] = useState('all');
  
  const [reviewForm, setReviewForm] = useState({
    action: '' as 'approve' | 'reject' | 'request_changes',
    notes: '',
    rejectionReason: '',
    isFeatured: false,
    violations: [] as string[]
  });

  const categories = [
    'Arte y Decoración',
    'Joyería y Accesorios',
    'Textiles',
    'Alimentación',
    'Instrumentos Musicales',
    'Artículos del Hogar',
    'Medicina Tradicional'
  ];

  const commonViolations = [
    'Imágenes de baja calidad',
    'Descripción incompleta',
    'Precio no competitivo',
    'Información cultural incorrecta',
    'No cumple estándares de autenticidad',
    'Materiales no especificados',
    'Contenido inapropiado'
  ];

  const filteredProducts = products.filter(product => {
    const matchesStatus = activeTab === 'all' || product.status === activeTab;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesSeller = sellerFilter === 'all' || product.seller.id === sellerFilter;
    
    return matchesStatus && matchesSearch && matchesCategory && matchesSeller;
  });

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Product['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'under_review': return <Eye className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: Product['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobado';
      case 'rejected': return 'Rechazado';
      case 'under_review': return 'En Revisión';
      default: return 'Desconocido';
    }
  };

  const handleOpenReview = (product: Product) => {
    setSelectedProduct(product);
    setReviewForm({
      action: '' as 'approve' | 'reject' | 'request_changes',
      notes: '',
      rejectionReason: '',
      isFeatured: product.isFeatured,
      violations: product.violations || []
    });
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedProduct || !reviewForm.action) {
      toast({
        title: "Error",
        description: "Por favor selecciona una acción",
        variant: "destructive"
      });
      return;
    }

    if (reviewForm.action === 'reject' && !reviewForm.rejectionReason) {
      toast({
        title: "Error",
        description: "Por favor proporciona una razón para el rechazo",
        variant: "destructive"
      });
      return;
    }

    const updatedProduct: Product = {
      ...selectedProduct,
      status: reviewForm.action === 'approve' ? 'approved' : 
              reviewForm.action === 'reject' ? 'rejected' : 'under_review',
      reviewedAt: new Date().toISOString(),
      reviewedBy: user?.name || 'Admin',
      moderationNotes: reviewForm.notes,
      rejectionReason: reviewForm.action === 'reject' ? reviewForm.rejectionReason : undefined,
      isFeatured: reviewForm.action === 'approve' ? reviewForm.isFeatured : false,
      violations: reviewForm.violations.length > 0 ? reviewForm.violations : undefined
    };

    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));

    const moderationAction: ModerationAction = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      action: reviewForm.action === 'approve' ? 'approved' : 
              reviewForm.action === 'reject' ? 'rejected' : 'requested_changes',
      moderatorId: user?.id || 'admin',
      moderatorName: user?.name || 'Admin',
      notes: reviewForm.notes,
      timestamp: new Date().toISOString(),
      reason: reviewForm.rejectionReason
    };

    setModerationHistory(prev => [moderationAction, ...prev]);

    toast({
      title: "Revisión completada",
      description: `Producto ${reviewForm.action === 'approve' ? 'aprobado' : 
                    reviewForm.action === 'reject' ? 'rechazado' : 'marcado para cambios'} exitosamente`
    });

    setIsReviewDialogOpen(false);
  };

  const stats = {
    total: products.length,
    pending: products.filter(p => p.status === 'pending').length,
    approved: products.filter(p => p.status === 'approved').length,
    rejected: products.filter(p => p.status === 'rejected').length,
    underReview: products.filter(p => p.status === 'under_review').length
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
              <p>Esta área está reservada para administradores.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Moderación de Productos</h1>
          <p className="text-muted-foreground">
            Revisa y gestiona los productos enviados por los vendedores
          </p>
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
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Aprobados</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Rechazados</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">En Revisión</p>
                  <p className="text-2xl font-bold">{stats.underReview}</p>
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
                    placeholder="Producto o vendedor..."
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

              <div>
                <Label htmlFor="seller">Vendedor</Label>
                <Select value={sellerFilter} onValueChange={setSellerFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los vendedores</SelectItem>
                    {Array.from(new Set(products.map(p => p.seller.id))).map(sellerId => {
                      const seller = products.find(p => p.seller.id === sellerId)?.seller;
                      return seller ? (
                        <SelectItem key={sellerId} value={sellerId}>{seller.name}</SelectItem>
                      ) : null;
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setSellerFilter('all');
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Limpiar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pending">Pendientes ({stats.pending})</TabsTrigger>
            <TabsTrigger value="under_review">En Revisión ({stats.underReview})</TabsTrigger>
            <TabsTrigger value="approved">Aprobados ({stats.approved})</TabsTrigger>
            <TabsTrigger value="rejected">Rechazados ({stats.rejected})</TabsTrigger>
            <TabsTrigger value="all">Todos ({stats.total})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredProducts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay productos</h3>
                  <p className="text-muted-foreground">
                    No se encontraron productos con los filtros aplicados
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
                          {product.images.length > 0 ? (
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
                              <Badge className={getStatusColor(product.status)}>
                                {getStatusIcon(product.status)}
                                <span className="ml-1">{getStatusText(product.status)}</span>
                              </Badge>
                              {product.isFeatured && (
                                <Badge className="bg-amber-100 text-amber-800">
                                  <Star className="h-3 w-3 mr-1" />
                                  Destacado
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {product.seller.name}
                              </div>
                              <div className="flex items-center gap-1">
                                <Tag className="h-4 w-4" />
                                {product.category}
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                ${product.price.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                Stock: {product.stock}
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {product.description}
                            </p>

                            {product.violations && product.violations.length > 0 && (
                              <div className="flex items-center gap-2 mb-3">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <div className="flex flex-wrap gap-1">
                                  {product.violations.map((violation, index) => (
                                    <Badge key={index} variant="destructive" className="text-xs">
                                      {violation}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Enviado: {new Date(product.submittedAt).toLocaleDateString()}</span>
                              {product.reviewedAt && (
                                <span>Revisado: {new Date(product.reviewedAt).toLocaleDateString()}</span>
                              )}
                              {product.reviewedBy && (
                                <span>Por: {product.reviewedBy}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenReview(product)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Revisar
                            </Button>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium mb-1">Información del Vendedor</h4>
                            <div className="text-muted-foreground space-y-1">
                              <p>Email: {product.seller.email}</p>
                              <p>Rating: {product.seller.rating}/5 ⭐</p>
                              <p>Productos: {product.seller.totalProducts}</p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-1">Detalles del Producto</h4>
                            <div className="text-muted-foreground space-y-1">
                              <p>Ubicación: {product.location}</p>
                              {product.materials && <p>Materiales: {product.materials.join(', ')}</p>}
                              {product.dimensions && <p>Dimensiones: {product.dimensions}</p>}
                            </div>
                          </div>
                        </div>

                        {product.moderationNotes && (
                          <div className="mt-4 p-3 bg-muted rounded">
                            <h4 className="font-medium mb-1">Notas de Moderación</h4>
                            <p className="text-sm text-muted-foreground">{product.moderationNotes}</p>
                          </div>
                        )}

                        {product.rejectionReason && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                            <h4 className="font-medium mb-1 text-red-800">Razón del Rechazo</h4>
                            <p className="text-sm text-red-600">{product.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Revisar Producto</DialogTitle>
              <DialogDescription>
                Evalúa y decide sobre el estado del producto
              </DialogDescription>
            </DialogHeader>

            {selectedProduct && (
              <div className="space-y-6">
                {/* Product Overview */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">{selectedProduct.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{selectedProduct.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div><strong>Precio:</strong> ${selectedProduct.price.toLocaleString()}</div>
                      <div><strong>Categoría:</strong> {selectedProduct.category}</div>
                      <div><strong>Stock:</strong> {selectedProduct.stock}</div>
                      <div><strong>Ubicación:</strong> {selectedProduct.location}</div>
                      {selectedProduct.materials && (
                        <div><strong>Materiales:</strong> {selectedProduct.materials.join(', ')}</div>
                      )}
                      {selectedProduct.culturalSignificance && (
                        <div><strong>Significado Cultural:</strong> {selectedProduct.culturalSignificance}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Imágenes del Producto</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProduct.images.map((image, index) => (
                        <div key={index} className="aspect-square bg-muted rounded flex items-center justify-center">
                          <img 
                            src={image} 
                            alt={`${selectedProduct.name} ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Form */}
                <div className="space-y-4">
                  <div>
                    <Label>Acción de Moderación</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <Button
                        variant={reviewForm.action === 'approve' ? 'default' : 'outline'}
                        onClick={() => setReviewForm(prev => ({ ...prev, action: 'approve' }))}
                        className="flex items-center gap-2"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Aprobar
                      </Button>
                      <Button
                        variant={reviewForm.action === 'request_changes' ? 'default' : 'outline'}
                        onClick={() => setReviewForm(prev => ({ ...prev, action: 'request_changes' }))}
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Solicitar Cambios
                      </Button>
                      <Button
                        variant={reviewForm.action === 'reject' ? 'destructive' : 'outline'}
                        onClick={() => setReviewForm(prev => ({ ...prev, action: 'reject' }))}
                        className="flex items-center gap-2"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        Rechazar
                      </Button>
                    </div>
                  </div>

                  {reviewForm.action === 'approve' && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={reviewForm.isFeatured}
                        onCheckedChange={(checked) => setReviewForm(prev => ({ ...prev, isFeatured: checked }))}
                      />
                      <Label htmlFor="featured">Marcar como producto destacado</Label>
                    </div>
                  )}

                  {(reviewForm.action === 'request_changes' || reviewForm.action === 'reject') && (
                    <div>
                      <Label>Problemas Identificados</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {commonViolations.map((violation) => (
                          <div key={violation} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={violation}
                              checked={reviewForm.violations.includes(violation)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setReviewForm(prev => ({
                                    ...prev,
                                    violations: [...prev.violations, violation]
                                  }));
                                } else {
                                  setReviewForm(prev => ({
                                    ...prev,
                                    violations: prev.violations.filter(v => v !== violation)
                                  }));
                                }
                              }}
                              className="rounded"
                            />
                            <Label htmlFor={violation} className="text-sm">{violation}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {reviewForm.action === 'reject' && (
                    <div>
                      <Label htmlFor="rejectionReason">Razón del Rechazo *</Label>
                      <Textarea
                        id="rejectionReason"
                        value={reviewForm.rejectionReason}
                        onChange={(e) => setReviewForm(prev => ({ ...prev, rejectionReason: e.target.value }))}
                        placeholder="Explica por qué se rechaza este producto..."
                        rows={3}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="notes">Notas de Moderación</Label>
                    <Textarea
                      id="notes"
                      value={reviewForm.notes}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Comentarios adicionales para el vendedor..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmitReview}>
                <Send className="h-4 w-4 mr-2" />
                Enviar Revisión
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductModeration;
