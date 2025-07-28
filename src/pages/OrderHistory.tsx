import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Search,
  Star,
  MessageCircle,
  Download,
  RotateCcw,
  Eye,
  ShoppingCart
} from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  seller: string;
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  createdAt: string;
  canReview?: boolean;
  canReturn?: boolean;
  canReorder?: boolean;
}

export const OrderHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock orders data for buyer
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'TC-2024-001',
      items: [
        {
          id: '1',
          productId: '1',
          productName: 'Cesta Artesanal de Palma',
          productImage: '/api/placeholder/100/100',
          quantity: 2,
          price: 45000,
          seller: 'María Mosquera'
        }
      ],
      subtotal: 90000,
      shipping: 8000,
      total: 98000,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'Tarjeta de Crédito',
      trackingNumber: 'COORD-123456789',
      deliveredAt: '2024-01-22T14:30:00Z',
      createdAt: '2024-01-18T10:30:00Z',
      canReview: true,
      canReturn: true,
      canReorder: true
    },
    {
      id: '2',
      orderNumber: 'TC-2024-002',
      items: [
        {
          id: '2',
          productId: '2',
          productName: 'Collar Wayuu Tradicional',
          productImage: '/api/placeholder/100/100',
          quantity: 1,
          price: 65000,
          seller: 'Carmen Riascos'
        }
      ],
      subtotal: 65000,
      shipping: 0,
      total: 65000,
      status: 'shipped',
      paymentStatus: 'paid',
      paymentMethod: 'PSE',
      trackingNumber: 'ENVIO-987654321',
      estimatedDelivery: '2024-01-27',
      createdAt: '2024-01-23T15:45:00Z',
      canReview: false,
      canReturn: false,
      canReorder: true
    },
    {
      id: '3',
      orderNumber: 'TC-2024-003',
      items: [
        {
          id: '3',
          productId: '3',
          productName: 'Máscara Ceremonial Tallada',
          productImage: '/api/placeholder/100/100',
          quantity: 1,
          price: 120000,
          seller: 'Antonio Córdoba'
        }
      ],
      subtotal: 120000,
      shipping: 8000,
      total: 128000,
      status: 'preparing',
      paymentStatus: 'paid',
      paymentMethod: 'Nequi',
      createdAt: '2024-01-25T09:15:00Z',
      canReview: false,
      canReturn: false,
      canReorder: true
    },
    {
      id: '4',
      orderNumber: 'TC-2024-004',
      items: [
        {
          id: '4',
          productId: '1',
          productName: 'Cesta Artesanal de Palma',
          productImage: '/api/placeholder/100/100',
          quantity: 1,
          price: 45000,
          seller: 'María Mosquera'
        }
      ],
      subtotal: 45000,
      shipping: 8000,
      total: 53000,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'Transferencia Bancaria',
      createdAt: '2024-01-25T16:20:00Z',
      canReview: false,
      canReturn: false,
      canReorder: false
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'Preparando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      case 'returned': return 'Devuelto';
      default: return 'Desconocido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'preparing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagado';
      case 'pending': return 'Pendiente';
      case 'failed': return 'Fallido';
      case 'refunded': return 'Reembolsado';
      default: return 'Desconocido';
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => 
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.seller.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleReorder = (order: Order) => {
    toast({
      title: "Productos agregados al carrito",
      description: `Se agregaron ${order.items.length} producto(s) a tu carrito`
    });
  };

  const handleReview = (item: OrderItem) => {
    toast({
      title: "Calificar producto",
      description: `Abriendo formulario de calificación para ${item.productName}`
    });
  };

  const handleReturn = (order: Order) => {
    toast({
      title: "Solicitud de devolución",
      description: "Iniciando proceso de devolución..."
    });
  };

  const handleTrackOrder = (trackingNumber: string) => {
    toast({
      title: "Rastrear pedido",
      description: `Abriendo rastreo para: ${trackingNumber}`
    });
  };

  const handleDownloadInvoice = (orderNumber: string) => {
    toast({
      title: "Descargando factura",
      description: `Descargando factura del pedido ${orderNumber}`
    });
  };

  const handleContactSeller = (seller: string) => {
    toast({
      title: "Contactar vendedor",
      description: `Abriendo chat con ${seller}`
    });
  };

  if (user?.role !== 'buyer') {
    return (
      <div className="container-full py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
            <p>Esta área está reservada para compradores.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-full py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mis Pedidos</h1>
        <p className="text-muted-foreground">
          Historial completo de tus compras y estado de los envíos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pedidos</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Entregados</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En Camino</p>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'shipped').length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Gastado</p>
                <p className="text-2xl font-bold">
                  ${orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filtrar Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por número de pedido, producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado del pedido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="confirmed">Confirmados</SelectItem>
                <SelectItem value="preparing">Preparando</SelectItem>
                <SelectItem value="shipped">Enviados</SelectItem>
                <SelectItem value="delivered">Entregados</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los períodos</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mes</SelectItem>
                <SelectItem value="quarter">Últimos 3 meses</SelectItem>
                <SelectItem value="year">Último año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No hay pedidos</h3>
              <p className="text-muted-foreground mb-6">
                {orders.length === 0 
                  ? "Aún no has realizado ninguna compra" 
                  : "No se encontraron pedidos con los filtros aplicados"
                }
              </p>
              <Button onClick={() => window.location.href = '/products'}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Ir a Comprar
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      Pedido {order.orderNumber}
                    </CardTitle>
                    <CardDescription>
                      Realizado el {new Date(order.createdAt).toLocaleDateString()} - 
                      {order.items.length} producto(s)
                    </CardDescription>
                  </div>
                  <div className="flex flex-col md:items-end gap-2">
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {getPaymentStatusText(order.paymentStatus)}
                      </Badge>
                    </div>
                    <div className="text-lg font-bold">
                      ${order.total.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.productName}</h4>
                        <p className="text-sm text-muted-foreground">por {item.seller}</p>
                        <p className="text-sm">Cantidad: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.price * item.quantity).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toLocaleString()} c/u
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Details */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2">Detalles del Pedido</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${order.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Envío:</span>
                        <span>${order.shipping.toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total:</span>
                        <span>${order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Información de Envío</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Método de pago:</strong> {order.paymentMethod}</p>
                      {order.trackingNumber && (
                        <p>
                          <strong>Número de seguimiento:</strong> 
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-sm"
                            onClick={() => handleTrackOrder(order.trackingNumber!)}
                          >
                            {order.trackingNumber}
                          </Button>
                        </p>
                      )}
                      {order.estimatedDelivery && (
                        <p><strong>Entrega estimada:</strong> {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                      )}
                      {order.deliveredAt && (
                        <p><strong>Entregado el:</strong> {new Date(order.deliveredAt).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadInvoice(order.orderNumber)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Factura
                  </Button>

                  {order.trackingNumber && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleTrackOrder(order.trackingNumber!)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Rastrear Pedido
                    </Button>
                  )}

                  {order.canReorder && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReorder(order)}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Volver a Comprar
                    </Button>
                  )}

                  {order.canReturn && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReturn(order)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Solicitar Devolución
                    </Button>
                  )}

                  {order.items.some(item => order.canReview) && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReview(order.items[0])}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Calificar Productos
                    </Button>
                  )}

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleContactSeller(order.items[0].seller)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contactar Vendedor
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
