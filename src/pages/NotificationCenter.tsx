import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  BellOff, 
  Check, 
  CheckCheck, 
  Trash2, 
  Settings,
  Package,
  DollarSign,
  User,
  AlertCircle,
  Info,
  Star,
  ShoppingCart,
  TrendingUp,
  Clock,
  Eye,
  Filter,
  MessageCircle
} from 'lucide-react';

interface NotificationPreferences {
  orderUpdates: boolean;
  newMessages: boolean;
  promotions: boolean;
  productUpdates: boolean;
  paymentUpdates: boolean;
  systemUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  soundEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export const NotificationCenter = () => {
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll, unreadCount } = useNotifications();
  const { toast } = useToast();

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    orderUpdates: true,
    newMessages: true,
    promotions: false,
    productUpdates: true,
    paymentUpdates: true,
    systemUpdates: true,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    soundEnabled: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00'
    }
  });

  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filtrar notificaciones por rol y categoría
  const filteredNotifications = notifications.filter(notification => {
    // Primero filtrar por rol del usuario
    const allowedCategoriesForUser = user?.role === 'seller' 
      ? ['order', 'payment', 'review', 'inventory', 'system', 'sales'] // Vendedores
      : user?.role === 'buyer'
      ? ['order', 'payment', 'promotion', 'product', 'system', 'shipping'] // Compradores  
      : ['system']; // Admin o invitado

    // Si la notificación no es para este tipo de usuario, filtrarla
    if (!allowedCategoriesForUser.includes(notification.category)) {
      return false;
    }
    
    // Filtro básico
    if (filter === 'all') {
      return true;
    }
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    
    // Filtrar por categoría específica
    return notification.category === filter;
  });

  // Ordenar notificaciones
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    } else {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
  });

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));

    // Simular guardado
    localStorage.setItem('notification-preferences', JSON.stringify({
      ...preferences,
      [key]: value
    }));

    toast({
      title: "Preferencia actualizada",
      description: "Tu configuración de notificaciones ha sido guardada"
    });
  };

  const handleQuietHoursChange = (field: 'enabled' | 'start' | 'end', value: boolean | string) => {
    setPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value
      }
    }));
  };

  const getNotificationIcon = (category: string, type: string) => {
    const iconClass = "h-5 w-5";
    
    switch (category) {
      case 'order':
        return <Package className={iconClass} />;
      case 'product':
        return <Star className={iconClass} />;
      case 'account':
        return <User className={iconClass} />;
      case 'system':
        return type === 'error' ? <AlertCircle className={iconClass} /> : <Info className={iconClass} />;
      case 'promotion':
        return <TrendingUp className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    return `Hace ${days} días`;
  };

  // Cargar preferencias guardadas
  useEffect(() => {
    const saved = localStorage.getItem('notification-preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Centro de Notificaciones</h1>
        <p className="text-muted-foreground">
          Gestiona tus notificaciones y preferencias
        </p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">
            Notificaciones ({unreadCount > 0 && unreadCount})
          </TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
        </TabsList>

        {/* Panel de Notificaciones */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notificaciones
                  </CardTitle>
                  <CardDescription>
                    {unreadCount > 0 ? `${unreadCount} notificaciones sin leer` : 'Todas las notificaciones están leídas'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={markAllAsRead}
                    >
                      <CheckCheck className="h-4 w-4 mr-2" />
                      Marcar todo como leído
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearAll}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpiar todo
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filtros específicos por rol */}
              <div className="flex gap-4 mb-6">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="unread">Sin leer ({unreadCount})</SelectItem>
                    <SelectItem value="read">Leídas</SelectItem>
                    <SelectItem value="order">Pedidos</SelectItem>
                    
                    {/* Filtros específicos para VENDEDORES */}
                    {user?.role === 'seller' && (
                      <>
                        <SelectItem value="payment">💰 Pagos</SelectItem>
                        <SelectItem value="review">⭐ Reseñas</SelectItem>
                        <SelectItem value="inventory">📦 Inventario</SelectItem>
                      </>
                    )}
                    
                    {/* Filtros específicos para COMPRADORES */}
                    {user?.role === 'buyer' && (
                      <>
                        <SelectItem value="product">🛍️ Productos</SelectItem>
                        <SelectItem value="promotion">🎯 Promociones</SelectItem>
                      </>
                    )}
                    
                    <SelectItem value="system">⚙️ Sistema</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Más recientes</SelectItem>
                    <SelectItem value="oldest">Más antiguos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lista de Notificaciones */}
              {sortedNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay notificaciones</h3>
                  <p className="text-muted-foreground">
                    Cuando tengas nuevas notificaciones aparecerán aquí
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedNotifications.map((notification) => (
                    <div 
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-all ${
                        !notification.read 
                          ? 'bg-primary/5 border-primary/20 shadow-sm' 
                          : 'bg-background'
                      } ${getTypeColor(notification.type)}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                          {getNotificationIcon(notification.category, notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm">{notification.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                              {!notification.read && (
                                <Badge variant="secondary" className="text-xs">
                                  Nuevo
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Marcar como leído
                              </Button>
                            )}
                            
                            {notification.actionUrl && (
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                Ver detalles
                              </Button>
                            )}
                            
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => removeNotification(notification.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Panel de Preferencias */}
        <TabsContent value="preferences">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Tipos de Notificaciones
                </CardTitle>
                <CardDescription>
                  Configura qué tipo de notificaciones quieres recibir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Notificaciones comunes para todos */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Actualizaciones de pedidos</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.role === 'seller' ? 'Nuevos pedidos y cambios de estado' : 'Estados de envío y entrega'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.orderUpdates}
                    onCheckedChange={(checked) => handlePreferenceChange('orderUpdates', checked)}
                  />
                </div>

                {/* Notificaciones específicas para VENDEDORES */}
                {user?.role === 'seller' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Notificaciones de pagos</p>
                          <p className="text-sm text-muted-foreground">Pagos recibidos y retiros procesados</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.paymentUpdates}
                        onCheckedChange={(checked) => handlePreferenceChange('paymentUpdates', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Nuevas reseñas</p>
                          <p className="text-sm text-muted-foreground">Cuando los clientes califiquen tus productos</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.productUpdates}
                        onCheckedChange={(checked) => handlePreferenceChange('productUpdates', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Alertas de inventario</p>
                          <p className="text-sm text-muted-foreground">Productos con stock bajo</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.newMessages}
                        onCheckedChange={(checked) => handlePreferenceChange('newMessages', checked)}
                      />
                    </div>
                  </>
                )}

                {/* Notificaciones específicas para COMPRADORES */}
                {user?.role === 'buyer' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Nuevos productos</p>
                          <p className="text-sm text-muted-foreground">De tus vendedores favoritos y categorías de interés</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.productUpdates}
                        onCheckedChange={(checked) => handlePreferenceChange('productUpdates', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Promociones y ofertas</p>
                          <p className="text-sm text-muted-foreground">Descuentos especiales y productos destacados</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.promotions}
                        onCheckedChange={(checked) => handlePreferenceChange('promotions', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Respuestas de vendedores</p>
                          <p className="text-sm text-muted-foreground">Cuando respondan a tus reseñas</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.newMessages}
                        onCheckedChange={(checked) => handlePreferenceChange('newMessages', checked)}
                      />
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Actualizaciones de pagos</p>
                      <p className="text-sm text-muted-foreground">Confirmaciones y retiros</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.paymentUpdates}
                    onCheckedChange={(checked) => handlePreferenceChange('paymentUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Promociones y ofertas</p>
                      <p className="text-sm text-muted-foreground">Descuentos especiales</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.promotions}
                    onCheckedChange={(checked) => handlePreferenceChange('promotions', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Notificaciones del sistema</p>
                      <p className="text-sm text-muted-foreground">Mantenimiento y actualizaciones</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.systemUpdates}
                    onCheckedChange={(checked) => handlePreferenceChange('systemUpdates', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métodos de Entrega</CardTitle>
                <CardDescription>
                  Cómo quieres recibir las notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificaciones en la aplicación</p>
                    <p className="text-sm text-muted-foreground">Siempre activas</p>
                  </div>
                  <Badge variant="secondary">Activo</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificaciones por email</p>
                    <p className="text-sm text-muted-foreground">Resúmenes y actualizaciones importantes</p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificaciones push</p>
                    <p className="text-sm text-muted-foreground">Alertas inmediatas en el navegador</p>
                  </div>
                  <Switch
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificaciones por SMS</p>
                    <p className="text-sm text-muted-foreground">Solo para actualizaciones críticas</p>
                  </div>
                  <Switch
                    checked={preferences.smsNotifications}
                    onCheckedChange={(checked) => handlePreferenceChange('smsNotifications', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración Avanzada</CardTitle>
                <CardDescription>
                  Opciones adicionales de notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sonidos de notificación</p>
                    <p className="text-sm text-muted-foreground">Reproducir sonido al recibir notificaciones</p>
                  </div>
                  <Switch
                    checked={preferences.soundEnabled}
                    onCheckedChange={(checked) => handlePreferenceChange('soundEnabled', checked)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Horario silencioso</p>
                      <p className="text-sm text-muted-foreground">No recibir notificaciones en horarios específicos</p>
                    </div>
                    <Switch
                      checked={preferences.quietHours.enabled}
                      onCheckedChange={(checked) => handleQuietHoursChange('enabled', checked)}
                    />
                  </div>

                  {preferences.quietHours.enabled && (
                    <div className="grid grid-cols-2 gap-4 ml-8">
                      <div className="space-y-2">
                        <Label htmlFor="start-time">Inicio</Label>
                        <input
                          id="start-time"
                          type="time"
                          value={preferences.quietHours.start}
                          onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                          className="px-3 py-2 border rounded-md w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-time">Fin</Label>
                        <input
                          id="end-time"
                          type="time"
                          value={preferences.quietHours.end}
                          onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                          className="px-3 py-2 border rounded-md w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenter;
