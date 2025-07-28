import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Eye,
  Edit,
  Search,
  Filter,
  RefreshCw,
  MessageSquare,
  MapPin,
  User,
  Phone,
  Mail
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    department: string;
  };
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  total: number;
  commission: number;
  netAmount: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  sellerId: string;
}

export const OrderManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'TC-2024-001',
      customer: {
        name: 'María González',
        email: 'maria.gonzalez@email.com',
        phone: '+57 300 123 4567',
        address: 'Carrera 15 #32-45, Apto 302',
        city: 'Bogotá',
        department: 'Cundinamarca'
      },
      items: [
        {
          id: '1',
          name: 'Cesta Artesanal de Palma',
          quantity: 2,
          price: 45000,
          image: '/placeholder.svg'
        }
      ],
      status: 'confirmed',
      paymentStatus: 'paid',
      total: 90000,
      commission: 13500,
      netAmount: 76500,
      createdAt: '2024-01-25T10:30:00Z',
      updatedAt: '2024-01-25T11:15:00Z',
      notes: 'Cliente solicita entrega antes del viernes',
      estimatedDelivery: '2024-01-28T00:00:00Z',
      sellerId: user?.id || ''
    },
    {
      id: '2',
      orderNumber: 'TC-2024-002',
      customer: {
        name: 'Carlos Restrepo',
        email: 'carlos.restrepo@email.com',
        phone: '+57 310 987 6543',
        address: 'Calle 80 #25-10',
        city: 'Medellín',
        department: 'Antioquia'
      },
      items: [
        {
          id: '2',
          name: 'Collar Wayuu Tradicional',
          quantity: 1,
          price: 65000,
          image: '/placeholder.svg'
        }
      ],
      status: 'preparing',
      paymentStatus: 'paid',
      total: 65000,
      commission: 9750,
      netAmount: 55250,
      createdAt: '2024-01-23T15:45:00Z',
      updatedAt: '2024-01-24T09:20:00Z',
      trackingNumber: 'TK123456789',
      estimatedDelivery: '2024-01-26T00:00:00Z',
      sellerId: user?.id || ''
    },
    {
      id: '3',
      orderNumber: 'TC-2024-003',
      customer: {
        name: 'Ana López',
        email: 'ana.lopez@email.com',
        phone: '+57 320 555 1234',
        address: 'Av. El Dorado #45-67',
        city: 'Bogotá',
        department: 'Cundinamarca'
      },
      items: [
        {
          id: '3',
          name: 'Máscara Ceremonial',
          quantity: 1,
          price: 120000,
          image: '/placeholder.svg'
        }
      ],
      status: 'pending',
      paymentStatus: 'pending',
      total: 120000,
      commission: 18000,
      netAmount: 102000,
      createdAt: '2024-01-25T09:15:00Z',
      updatedAt: '2024-01-25T09:15:00Z',
      sellerId: user?.id || ''
    }
  ]);

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  // Actualización automática de pedidos
  useEffect(() => {
    const interval = setInterval(() => {
      addNotification({
        title: 'Nuevo Pedido',
        message: 'Has recibido un nuevo pedido. Revisa tu panel de gestión.',
        type: 'info',
        category: 'order',
        userId: user?.id || ''
      });
    }, 600000); // Cada 10 minutos

    return () => clearInterval(interval);
  }, [addNotification, user?.id]);

  // Función para actualizar estado del pedido
  const updateOrderStatus = (orderId: string, newStatusValue: string, trackingNum?: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          const updatedOrder = {
            ...order,
            status: newStatusValue as Order['status'],
            updatedAt: new Date().toISOString(),
            ...(trackingNum && { trackingNumber: trackingNum })
          };
          return updatedOrder;
        }
        return order;
      })
    );

    addNotification({
      title: `Pedido ${orders.find(o => o.id === orderId)?.orderNumber} Actualizado`,
      message: `El estado del pedido ha cambiado a: ${getStatusLabel(newStatusValue)}`,
      type: 'success',
      category: 'order',
      userId: user?.id || ''
    });

    toast({
      title: "Estado Actualizado",
      description: `El pedido ha sido actualizado a: ${getStatusLabel(newStatusValue)}`
    });
  };

  // Función para agregar comentario
  const addComment = (orderId: string, message: string) => {
    console.log('Nuevo comentario para pedido', orderId, ':', message);
    setNewComment('');
    
    toast({
      title: "Comentario Agregado",
      description: "El comentario ha sido guardado exitosamente"
    });
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmado', 
      preparing: 'Preparando',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-orange-100 text-orange-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendiente',
      paid: 'Pagado',
      failed: 'Fallido',
      refunded: 'Reembolsado'
    };
    return labels[status as keyof typeof labels] || status;
  };

  // Filtrar pedidos por rol del usuario
  const roleFilteredOrders = orders.filter(order => {
    if (user?.role === 'seller') {
      // Vendedores solo ven pedidos donde ellos son el vendedor
      return order.sellerId === user?.id;
    } else if (user?.role === 'buyer') {
      // Compradores solo ven pedidos donde ellos son el cliente (simulamos con email)
      return order.customer.email === user?.email;
    } else if (user?.role === 'admin') {
      // Administradores pueden ver todos los pedidos
      return true;
    }
    return false;
  });

  // Filtrar pedidos por criterios adicionales
  const filteredOrders = roleFilteredOrders
    .filter(order => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesSearch = searchTerm === '' || 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Estadísticas de pedidos (basadas en los pedidos del usuario)
  const orderStats = {
    total: roleFilteredOrders.length,
    pending: roleFilteredOrders.filter(o => o.status === 'pending').length,
    confirmed: roleFilteredOrders.filter(o => o.status === 'confirmed').length,
    shipped: roleFilteredOrders.filter(o => o.status === 'shipped').length,
    delivered: roleFilteredOrders.filter(o => o.status === 'delivered').length
  };

  if (user?.role !== 'seller' && user?.role !== 'admin' && user?.role !== 'buyer') {
    return (
      <div className="min-h-screen bg-background"><div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
              <p>Esta área está reservada para vendedores, compradores y administradores.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background"><div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {user?.role === 'seller' ? 'Gestión de Pedidos' : 
               user?.role === 'buyer' ? 'Mis Pedidos' : 
               'Administración de Pedidos'}
            </h1>
            <p className="text-muted-foreground">
              {user?.role === 'seller' ? 'Administra los pedidos de tus productos' :
               user?.role === 'buyer' ? 'Revisa el estado de tus compras' :
               'Supervisión completa de todos los pedidos'}
            </p>
          </div>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orderStats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{orderStats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{orderStats.confirmed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enviados</CardTitle>
              <Truck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{orderStats.shipped}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregados</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{orderStats.delivered}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número de pedido, cliente o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
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
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
            <CardDescription>
              Gestiona el estado y seguimiento de todos tus pedidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Productos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.orderNumber}</p>
                        {order.trackingNumber && (
                          <p className="text-xs text-muted-foreground">
                            Tracking: {order.trackingNumber}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                        <p className="text-xs text-muted-foreground">{order.customer.city}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="text-sm">
                            {item.name} (x{item.quantity})
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${order.total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString('es-ES')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Detalles del Pedido {order.orderNumber}</DialogTitle>
                            <DialogDescription>
                              Información completa y gestión del pedido
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedOrder && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Información del Cliente */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Información del Cliente
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <Label>Nombre completo</Label>
                                    <p className="font-medium">{selectedOrder.customer.name}</p>
                                  </div>
                                  <div>
                                    <Label>Email</Label>
                                    <p className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      {selectedOrder.customer.email}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Teléfono</Label>
                                    <p className="flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      {selectedOrder.customer.phone}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Dirección</Label>
                                    <p className="flex items-start gap-2">
                                      <MapPin className="h-4 w-4 mt-0.5" />
                                      <span>
                                        {selectedOrder.customer.address}<br />
                                        {selectedOrder.customer.city}, {selectedOrder.customer.department}
                                      </span>
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Gestión del Pedido */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <Edit className="h-5 w-5" />
                                    Gestión del Pedido
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div>
                                    <Label htmlFor="status">Estado del pedido</Label>
                                    <Select
                                      value={newStatus || selectedOrder.status}
                                      onValueChange={setNewStatus}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pendiente</SelectItem>
                                        <SelectItem value="confirmed">Confirmado</SelectItem>
                                        <SelectItem value="preparing">Preparando</SelectItem>
                                        <SelectItem value="shipped">Enviado</SelectItem>
                                        <SelectItem value="delivered">Entregado</SelectItem>
                                        <SelectItem value="cancelled">Cancelado</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label htmlFor="tracking">Número de seguimiento</Label>
                                    <Input
                                      id="tracking"
                                      placeholder="TK123456789"
                                      value={trackingNumber || selectedOrder.trackingNumber || ''}
                                      onChange={(e) => setTrackingNumber(e.target.value)}
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor="comment">Agregar comentario</Label>
                                    <Textarea
                                      id="comment"
                                      placeholder="Escribir nota interna o mensaje para el cliente..."
                                      value={newComment}
                                      onChange={(e) => setNewComment(e.target.value)}
                                    />
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => {
                                        if (newStatus && newStatus !== selectedOrder.status) {
                                          updateOrderStatus(selectedOrder.id, newStatus, trackingNumber);
                                          setNewStatus('');
                                          setTrackingNumber('');
                                        }
                                      }}
                                      disabled={!newStatus || newStatus === selectedOrder.status}
                                    >
                                      Actualizar Estado
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        if (newComment.trim()) {
                                          addComment(selectedOrder.id, newComment);
                                        }
                                      }}
                                      disabled={!newComment.trim()}
                                    >
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Agregar Comentario
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Productos del Pedido */}
                              <Card className="lg:col-span-2">
                                <CardHeader>
                                  <CardTitle className="text-lg flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Productos del Pedido
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Producto</TableHead>
                                        <TableHead>Cantidad</TableHead>
                                        <TableHead className="text-right">Precio unitario</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedOrder.items.map((item) => (
                                        <TableRow key={item.id}>
                                          <TableCell>
                                            <div className="flex items-center gap-3">
                                              <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded-md"
                                              />
                                              <span className="font-medium">{item.name}</span>
                                            </div>
                                          </TableCell>
                                          <TableCell>{item.quantity}</TableCell>
                                          <TableCell className="text-right">
                                            ${item.price.toLocaleString()}
                                          </TableCell>
                                          <TableCell className="text-right font-medium">
                                            ${(item.price * item.quantity).toLocaleString()}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                  
                                  <div className="mt-4 space-y-2 text-right">
                                    <div className="flex justify-between">
                                      <span>Subtotal:</span>
                                      <span>${selectedOrder.total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                      <span>Comisión de plataforma (15%):</span>
                                      <span>-${selectedOrder.commission.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                                      <span>Total a recibir:</span>
                                      <span className="text-green-600">
                                        ${selectedOrder.netAmount.toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
