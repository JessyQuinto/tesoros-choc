import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield,
  Eye,
  AlertTriangle,
  Clock,
  User,
  Settings,
  ShoppingCart,
  Package,
  CreditCard,
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  MapPin,
  TrendingUp,
  TrendingDown,
  Activity,
  Lock,
  Unlock,
  Ban,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  RefreshCw,
  Database
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: 'admin' | 'seller' | 'buyer';
  action: string;
  category: 'user' | 'product' | 'order' | 'payment' | 'system' | 'security';
  description: string;
  ipAddress: string;
  userAgent: string;
  resourceId?: string;
  resourceType?: string;
  previousValue?: string;
  newValue?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType: 'failed_login' | 'suspicious_activity' | 'data_breach' | 'unauthorized_access' | 'account_locked' | 'unusual_location';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  userName?: string;
  ipAddress: string;
  location: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  resolution?: string;
}

interface SystemChange {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  changeType: 'configuration' | 'user_management' | 'content' | 'policy' | 'feature' | 'security';
  module: string;
  description: string;
  previousState: string;
  newState: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  rollbackAvailable: boolean;
}

const AuditSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: '2024-03-15T14:30:00Z',
      userId: 'admin_001',
      userName: 'Ana García',
      userRole: 'admin',
      action: 'user_status_changed',
      category: 'user',
      description: 'Cambió el estado del vendedor Carlos Ruiz de "pendiente" a "aprobado"',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      resourceId: 'user_123',
      resourceType: 'seller',
      previousValue: 'pending',
      newValue: 'approved',
      severity: 'medium'
    },
    {
      id: '2',
      timestamp: '2024-03-15T13:45:00Z',
      userId: 'seller_456',
      userName: 'María López',
      userRole: 'seller',
      action: 'product_created',
      category: 'product',
      description: 'Creó un nuevo producto: "Collar de Chaquiras Embera"',
      ipAddress: '203.45.67.89',
      userAgent: 'Mozilla/5.0 (Android 12; Mobile; rv:68.0)',
      resourceId: 'product_789',
      resourceType: 'product',
      severity: 'low'
    },
    {
      id: '3',
      timestamp: '2024-03-15T12:20:00Z',
      userId: 'buyer_789',
      userName: 'Luis Moreno',
      userRole: 'buyer',
      action: 'order_placed',
      category: 'order',
      description: 'Realizó una compra por $125,000 COP',
      ipAddress: '45.123.67.234',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X)',
      resourceId: 'order_456',
      resourceType: 'order',
      severity: 'low'
    },
    {
      id: '4',
      timestamp: '2024-03-15T11:15:00Z',
      userId: 'admin_001',
      userName: 'Ana García',
      userRole: 'admin',
      action: 'commission_rate_changed',
      category: 'system',
      description: 'Modificó la comisión de la categoría "Joyería" del 15% al 18%',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      resourceId: 'category_jewelry',
      resourceType: 'commission_config',
      previousValue: '15',
      newValue: '18',
      severity: 'high'
    },
    {
      id: '5',
      timestamp: '2024-03-15T10:30:00Z',
      userId: 'seller_123',
      userName: 'Pedro Sánchez',
      userRole: 'seller',
      action: 'payment_received',
      category: 'payment',
      description: 'Recibió pago de $85,000 COP por la venta #ORD-001',
      ipAddress: '78.234.45.123',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      resourceId: 'payment_789',
      resourceType: 'payment',
      severity: 'low'
    }
  ]);

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      timestamp: '2024-03-15T15:45:00Z',
      eventType: 'failed_login',
      severity: 'medium',
      userId: 'buyer_456',
      userName: 'Carlos Rivera',
      ipAddress: '45.67.89.123',
      location: 'Bogotá, Colombia',
      description: '5 intentos de inicio de sesión fallidos en 10 minutos',
      status: 'investigating',
      assignedTo: 'Admin Security'
    },
    {
      id: '2',
      timestamp: '2024-03-15T14:20:00Z',
      eventType: 'unusual_location',
      severity: 'high',
      userId: 'seller_789',
      userName: 'Lucía Morales',
      ipAddress: '203.45.67.89',
      location: 'Lima, Perú',
      description: 'Inicio de sesión desde ubicación inusual (último acceso desde Quibdó)',
      status: 'resolved',
      assignedTo: 'Admin Security',
      resolution: 'Usuario confirmó viaje de negocios'
    },
    {
      id: '3',
      timestamp: '2024-03-15T13:10:00Z',
      eventType: 'suspicious_activity',
      severity: 'high',
      userId: 'buyer_234',
      userName: 'Roberto Silva',
      ipAddress: '123.45.67.89',
      location: 'Cali, Colombia',
      description: 'Múltiples compras de alto valor en corto período',
      status: 'open',
      assignedTo: 'Admin Finance'
    },
    {
      id: '4',
      timestamp: '2024-03-14T22:30:00Z',
      eventType: 'account_locked',
      severity: 'medium',
      userId: 'seller_345',
      userName: 'Carmen Díaz',
      ipAddress: '67.89.123.45',
      location: 'Medellín, Colombia',
      description: 'Cuenta bloqueada automáticamente por intentos de acceso sospechosos',
      status: 'resolved',
      assignedTo: 'Admin Security',
      resolution: 'Cuenta desbloqueada después de verificación de identidad'
    }
  ]);

  const [systemChanges, setSystemChanges] = useState<SystemChange[]>([
    {
      id: '1',
      timestamp: '2024-03-15T16:00:00Z',
      adminId: 'admin_001',
      adminName: 'Ana García',
      changeType: 'configuration',
      module: 'Payment Settings',
      description: 'Activó nuevo método de pago: Nequi',
      previousState: 'inactive',
      newState: 'active',
      impact: 'medium',
      rollbackAvailable: true
    },
    {
      id: '2',
      timestamp: '2024-03-15T15:30:00Z',
      adminId: 'admin_002',
      adminName: 'Roberto Admin',
      changeType: 'policy',
      module: 'Return Policy',
      description: 'Modificó política de devoluciones para categoría "Alimentación"',
      previousState: '7 días',
      newState: 'No devoluciones',
      impact: 'high',
      rollbackAvailable: true
    },
    {
      id: '3',
      timestamp: '2024-03-15T14:15:00Z',
      adminId: 'admin_001',
      adminName: 'Ana García',
      changeType: 'user_management',
      module: 'Vendor Approval',
      description: 'Aprobó 3 nuevos vendedores en lote',
      previousState: 'pending',
      newState: 'approved',
      impact: 'medium',
      rollbackAvailable: false
    },
    {
      id: '4',
      timestamp: '2024-03-15T13:45:00Z',
      adminId: 'admin_001',
      adminName: 'Ana García',
      changeType: 'content',
      module: 'Category Management',
      description: 'Creó nueva categoría: "Instrumentos Musicales Tradicionales"',
      previousState: 'N/A',
      newState: 'created',
      impact: 'low',
      rollbackAvailable: true
    }
  ]);

  const getSeverityBadge = (severity: string) => {
    const variants = {
      'low': 'secondary',
      'medium': 'default',
      'high': 'destructive',
      'critical': 'destructive'
    } as const;
    
    return <Badge variant={variants[severity as keyof typeof variants]}>{severity.toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'open': 'destructive',
      'investigating': 'default',
      'resolved': 'secondary',
      'false_positive': 'outline'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'user': <User className="h-4 w-4" />,
      'product': <Package className="h-4 w-4" />,
      'order': <ShoppingCart className="h-4 w-4" />,
      'payment': <CreditCard className="h-4 w-4" />,
      'system': <Settings className="h-4 w-4" />,
      'security': <Shield className="h-4 w-4" />
    };
    
    return icons[category as keyof typeof icons] || <Activity className="h-4 w-4" />;
  };

  const getEventTypeIcon = (eventType: string) => {
    const icons = {
      'failed_login': <Lock className="h-4 w-4" />,
      'suspicious_activity': <AlertTriangle className="h-4 w-4" />,
      'data_breach': <Shield className="h-4 w-4" />,
      'unauthorized_access': <Ban className="h-4 w-4" />,
      'account_locked': <Lock className="h-4 w-4" />,
      'unusual_location': <MapPin className="h-4 w-4" />
    };
    
    return icons[eventType as keyof typeof icons] || <AlertCircle className="h-4 w-4" />;
  };

  const updateSecurityEventStatus = (eventId: string, status: SecurityEvent['status']) => {
    setSecurityEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, status, assignedTo: user?.name || 'Admin' }
        : event
    ));
    
    toast({
      title: "Estado actualizado",
      description: `El evento de seguridad se ha marcado como ${status}`
    });
  };

  const exportAuditLogs = () => {
    toast({
      title: "Exportando registros",
      description: "Se está generando el archivo de auditoría..."
    });
  };

  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  if (user?.role !== 'admin') {
    return (
      <div><div className="container-full py-8">
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
    <div className="min-h-screen bg-background"><div className="container-full py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sistema de Auditoría</h1>
            <p className="text-muted-foreground">
              Monitorea la actividad del sistema y detecta eventos sospechosos
            </p>
          </div>
          <Button onClick={exportAuditLogs}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Logs
          </Button>
        </div>

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">Logs de Actividad</TabsTrigger>
            <TabsTrigger value="security">Eventos de Seguridad</TabsTrigger>
            <TabsTrigger value="changes">Cambios del Sistema</TabsTrigger>
          </TabsList>

          {/* Activity Logs */}
          <TabsContent value="activity" className="space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <Input
                  placeholder="Buscar en logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="product">Producto</SelectItem>
                  <SelectItem value="order">Pedido</SelectItem>
                  <SelectItem value="payment">Pago</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                  <SelectItem value="security">Seguridad</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las severidades</SelectItem>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Crítica</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Último día</SelectItem>
                  <SelectItem value="7d">Última semana</SelectItem>
                  <SelectItem value="30d">Último mes</SelectItem>
                  <SelectItem value="90d">Últimos 3 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Activity Summary */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Eventos</p>
                      <p className="text-2xl font-bold">1,247</p>
                    </div>
                    <Activity className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Eventos Críticos</p>
                      <p className="text-2xl font-bold text-red-600">3</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                      <p className="text-2xl font-bold">89</p>
                    </div>
                    <User className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Sesiones Activas</p>
                      <p className="text-2xl font-bold">156</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Audit Logs */}
            <div className="space-y-3">
              {filteredAuditLogs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getCategoryIcon(log.category)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{log.userName}</span>
                            <Badge variant="outline">{log.userRole}</Badge>
                            {getSeverityBadge(log.severity)}
                          </div>
                          <p className="text-sm mb-2">{log.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {log.ipAddress}
                            </span>
                            {log.resourceId && (
                              <span className="flex items-center gap-1">
                                <Database className="h-3 w-3" />
                                {log.resourceType}: {log.resourceId}
                              </span>
                            )}
                          </div>
                          {log.previousValue && log.newValue && (
                            <div className="mt-2 p-2 bg-muted rounded text-sm">
                              <span className="text-red-600">Anterior: {log.previousValue}</span>
                              <span className="mx-2">→</span>
                              <span className="text-green-600">Nuevo: {log.newValue}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Security Events */}
          <TabsContent value="security" className="space-y-6">
            <div className="space-y-4">
              {securityEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getEventTypeIcon(event.eventType)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{event.eventType.replace('_', ' ').toUpperCase()}</h3>
                            {getSeverityBadge(event.severity)}
                            {getStatusBadge(event.status)}
                          </div>
                          <p className="text-sm mb-2">{event.description}</p>
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-muted-foreground">
                            <span>Usuario: {event.userName || 'N/A'}</span>
                            <span>IP: {event.ipAddress}</span>
                            <span>Ubicación: {event.location}</span>
                            <span>Fecha: {new Date(event.timestamp).toLocaleString()}</span>
                          </div>
                          {event.assignedTo && (
                            <div className="mt-2 text-sm">
                              <span className="text-muted-foreground">Asignado a: </span>
                              <span className="font-medium">{event.assignedTo}</span>
                            </div>
                          )}
                          {event.resolution && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                              <span className="font-medium text-green-800">Resolución: </span>
                              <span className="text-green-700">{event.resolution}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {event.status === 'open' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateSecurityEventStatus(event.id, 'investigating')}
                          >
                            Investigar
                          </Button>
                        )}
                        {event.status === 'investigating' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateSecurityEventStatus(event.id, 'resolved')}
                            >
                              Resolver
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updateSecurityEventStatus(event.id, 'false_positive')}
                            >
                              Falso Positivo
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* System Changes */}
          <TabsContent value="changes" className="space-y-6">
            <div className="space-y-4">
              {systemChanges.map((change) => (
                <Card key={change.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{change.module}</h3>
                          <Badge variant="outline">{change.changeType.replace('_', ' ')}</Badge>
                          {getSeverityBadge(change.impact)}
                          {change.rollbackAvailable && (
                            <Badge variant="secondary">Rollback Disponible</Badge>
                          )}
                        </div>
                        <p className="text-sm mb-2">{change.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                          <span>Admin: {change.adminName}</span>
                          <span>Fecha: {new Date(change.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="p-2 bg-muted rounded text-sm">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-muted-foreground">Estado Anterior: </span>
                              <span className="font-mono">{change.previousState}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Estado Nuevo: </span>
                              <span className="font-mono">{change.newState}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {change.rollbackAvailable && (
                          <Button size="sm" variant="outline">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Rollback
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div></div>
  );
};

export default AuditSystem;
