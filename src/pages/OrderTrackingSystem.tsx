import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  Eye,
  Download,
  MessageSquare,
  Star
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  seller?: {
    name: string;
    email: string;
    phone: string;
  };
  tracking?: {
    number: string;
    carrier: string;
    url?: string;
  };
  timeline: {
    status: string;
    date: string;
    description: string;
    completed: boolean;
  }[];
  notes?: string;
}

export const OrderTrackingSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  // Datos de ejemplo - en una app real vendrían del backend
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'TC-2024-001',
      productName: 'Cesta Artesanal de Palma',
      productImage: 'https://via.placeholder.com/80',
      quantity: 1,
      price: 25000,
      total: 25000,
      status: 'delivered',
      orderDate: '2024-01-18',
      estimatedDelivery: '2024-01-22',
      actualDelivery: '2024-01-22',
      customer: {
        name: 'Ana García',
        email: 'ana.garcia@email.com',
        phone: '+57 300 123 4567',
        address: 'Calle 123 #45-67, Quibdó, Chocó'
      },
      seller: {
        name: 'María Mosquera',
        email: 'maria.mosquera@email.com',
        phone: '+57 315 987 6543'
      },
      tracking: {
        number: 'TC001234567',
        carrier: 'Envíos Chocó',
        url: 'https://envioschoco.com/track/TC001234567'
      },
      timeline: [
        { status: 'Pedido realizado', date: '2024-01-18 10:30', description: 'Pedido confirmado y pago procesado', completed: true },
        { status: 'En preparación', date: '2024-01-18 14:00', description: 'El artesano está preparando tu pedido', completed: true },
        { status: 'Enviado', date: '2024-01-20 09:15', description: 'Paquete entregado al transportador', completed: true },
        { status: 'En tránsito', date: '2024-01-21 16:30', description: 'En camino hacia tu destino', completed: true },
        { status: 'Entregado', date: '2024-01-22 11:45', description: 'Paquete entregado exitosamente', completed: true }
      ]
    },
    {
      id: '2',
      orderNumber: 'TC-2024-002',
      productName: 'Collar de Tagua',
      productImage: 'https://via.placeholder.com/80',
      quantity: 2,
      price: 15000,
      total: 30000,
      status: 'shipped',
      orderDate: '2024-01-20',
      estimatedDelivery: '2024-01-25',
      customer: {
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@email.com',
        phone: '+57 310 456 7890',
        address: 'Carrera 45 #23-12, Medellín, Antioquia'
      },
      seller: {
        name: 'José Perea',
        email: 'jose.perea@email.com',
        phone: '+57 312 654 9870'
      },
      tracking: {
        number: 'TC001234568',
        carrier: 'Envíos Nacional',
        url: 'https://enviosnacional.com/track/TC001234568'
      },
      timeline: [
        { status: 'Pedido realizado', date: '2024-01-20 15:20', description: 'Pedido confirmado y pago procesado', completed: true },
        { status: 'En preparación', date: '2024-01-21 09:00', description: 'Preparando tu collar artesanal', completed: true },
        { status: 'Enviado', date: '2024-01-22 16:30', description: 'Paquete en camino', completed: true },
        { status: 'En tránsito', date: '2024-01-23 08:15', description: 'En ruta hacia Medellín', completed: false },
        { status: 'Entregado', date: '', description: 'Pendiente de entrega', completed: false }
      ]
    }
  ]);

  // Filtrar pedidos según el rol del usuario
  const userFilteredOrders = orders.filter(order => {
    if (user?.role === 'seller') {
      // Vendedores ven todos los pedidos donde son el vendedor (simulamos con seller.name)
      return order.seller?.name === 'María Mosquera' || order.seller?.name === 'José Perea';
    } else if (user?.role === 'buyer') {
      // Compradores solo ven sus propios pedidos (simulamos con customer.name)
      return order.customer?.name === 'Ana García' || order.customer?.name === 'Carlos Rodríguez';
    }
    return false; // Admin no ve pedidos en este componente
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'preparing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmado';
      case 'preparing': return 'En Preparación';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const filteredOrders = userFilteredOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user?.role === 'seller' ? order.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) : 
                          order.seller?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    toast({
      title: "Estado actualizado",
      description: `El pedido ${orderId} ha sido actualizado a: ${getStatusText(newStatus)}`
    });
  };

  return (
    <div><div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {user?.role === 'seller' ? 'Gestión de Pedidos' : 'Mis Pedidos'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'seller' 
              ? 'Administra todos los pedidos de tus productos y mantén informados a tus clientes'
              : 'Rastrea el estado de tus compras y obtén información de entrega'
            }
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar por número de pedido o producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="preparing">En Preparación</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="delivered">Entregado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de pedidos */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={order.productImage} 
                      alt={order.productName}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                      <p className="text-muted-foreground">{order.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.role === 'seller' ? `Cliente: ${order.customer?.name}` : `Vendedor: ${order.seller?.name}`}
                      </p>
                      <p className="font-semibold text-lg text-primary">
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusText(order.status)}</span>
                      </Badge>
                      
                      {order.tracking && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Guía de seguimiento</p>
                          <p className="font-mono text-sm">{order.tracking.number}</p>
                        </div>
                      )}
                    </div>

                    {/* Timeline de seguimiento */}
                    <div className="space-y-3">
                      {order.timeline.map((step, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            step.completed ? 'bg-primary' : 'bg-muted'
                          }`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm font-medium ${
                                step.completed ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {step.status}
                              </p>
                              {step.date && (
                                <p className="text-xs text-muted-foreground">{step.date}</p>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => handleViewOrder(order)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                  
                  {order.tracking?.url && (
                    <Button variant="outline" asChild>
                      <a href={order.tracking.url} target="_blank" rel="noopener noreferrer">
                        <Truck className="h-4 w-4 mr-2" />
                        Rastrear Envío
                      </a>
                    </Button>
                  )}
                  
                  {/* Acciones específicas para VENDEDORES */}
                  {user?.role === 'seller' && (
                    <>
                      {order.status === 'pending' && (
                        <Button onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirmar Pedido
                        </Button>
                      )}
                      {order.status === 'confirmed' && (
                        <Button onClick={() => updateOrderStatus(order.id, 'preparing')}>
                          <Package className="h-4 w-4 mr-2" />
                          Marcar en Preparación
                        </Button>
                      )}
                      {order.status === 'preparing' && (
                        <Button onClick={() => updateOrderStatus(order.id, 'shipped')}>
                          <Truck className="h-4 w-4 mr-2" />
                          Marcar como Enviado
                        </Button>
                      )}
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contactar Cliente
                      </Button>
                    </>
                  )}
                  
                  {/* Acciones específicas para COMPRADORES */}
                  {user?.role === 'buyer' && (
                    <>
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contactar Vendedor
                      </Button>
                      {order.status === 'delivered' && (
                        <Button variant="outline">
                          <Star className="h-4 w-4 mr-2" />
                          Escribir Reseña
                        </Button>
                      )}
                    </>
                  )}
                  
                  {order.status === 'delivered' && (
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Factura
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dialog de detalles del pedido */}
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalles del Pedido</DialogTitle>
              <DialogDescription>
                Información completa del pedido {selectedOrder?.orderNumber}
              </DialogDescription>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Información del Producto</h4>
                    <p className="text-sm">{selectedOrder.productName}</p>
                    <p className="text-sm text-muted-foreground">Cantidad: {selectedOrder.quantity}</p>
                    <p className="text-sm text-muted-foreground">
                      Precio: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(selectedOrder.price)}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Información de Entrega</h4>
                    <p className="text-sm">{selectedOrder.customer?.address}</p>
                    <p className="text-sm text-muted-foreground">
                      Fecha estimada: {selectedOrder.estimatedDelivery}
                    </p>
                    {selectedOrder.actualDelivery && (
                      <p className="text-sm text-green-600">
                        Entregado: {selectedOrder.actualDelivery}
                      </p>
                    )}
                  </div>
                </div>

                {user?.role === 'seller' && selectedOrder.customer && (
                  <div>
                    <h4 className="font-semibold mb-2">Información del Cliente</h4>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-2">
                        <span className="font-medium">{selectedOrder.customer.name}</span>
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {selectedOrder.customer.email}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {selectedOrder.customer.phone}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {selectedOrder.customer.address}
                      </p>
                    </div>
                  </div>
                )}

                {selectedOrder.tracking && (
                  <div>
                    <h4 className="font-semibold mb-2">Información de Seguimiento</h4>
                    <p className="text-sm">Transportadora: {selectedOrder.tracking.carrier}</p>
                    <p className="text-sm font-mono">Guía: {selectedOrder.tracking.number}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div></div>
  );
};

export default OrderTrackingSystem;
