import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star, Package, TrendingUp, Eye, Filter, History, MapPin, Settings, User, CreditCard, MessageCircle } from 'lucide-react';

const BuyerDashboard = () => {
  const { user } = useAuth();

  // Protección de acceso - Solo compradores
  if (!user || user.role !== 'buyer') {
    return (
      <div><div className="container-full py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
              <p>Esta área está reservada exclusivamente para compradores.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const recentOrders = [
    {
      id: '001',
      productName: 'Cesta Artesanal de Palma',
      seller: 'María Mosquera',
      price: 45000,
      status: 'delivered',
      orderDate: '2024-01-10',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEuP2jaxW-4doOKMOeSzU81-oqhTUUrABfv3OnLUY7DP8XCeySupsCIrkGLkf8lTZvCbWeHjjUoFpgAD6UuakL6TmxaPItdItP_4v-GXV8-ht2VHazbirtOjPrU5sayYuGsDk5555ngMjo-Wp8qlo6dlPDJkxqSnD6nXiuh_jDrpVMOKidedLRWj6v_VIcYbLTrcqQ4gupup8I61Bq1HPLTVV5AAuIn1qtJLwsusK8br9jqTFAFZ1-dn_0GBH4Ul4DXodkVi7kp0M'
    },
    {
      id: '002',
      productName: 'Collar Wayuu Tradicional',
      seller: 'Carmen Riascos',
      price: 65000,
      status: 'shipped',
      orderDate: '2024-01-12',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiYNoSLNic5jl6-U9odJs0DHlb_DH6iu8C2Yx_ACDbF1SOcf08gCkUzAMmYnAm3oIpjRYjVVKnyna3kH-qzh4yMeaWUq9IkFoPpZaxelHg4sgsEqfvOlDde3_nPTIHM_OSmzozA4ONRlu-LqoeBdSjz4RNNiaOVp8Jj45f0tApnYhQHnwBbFEP8ojXsT-SsYoRramlMrGmFxVY5Io5PMJB1PjxbuL8kZrs_9pJPuTwWMPS8TZF_68js_Wla-KU0n4hb56FiV5Gi0M'
    }
  ];

  const recommendations = [
    {
      id: 1,
      name: "Máscara Ceremonial Embera",
      price: 85000,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_ZHNSMDAW1me7RnXk1CSqUZgPLHOwfxYxyO3ETpijuoydbc9yPM0Ixu49EgZ2pzIFe0-ZB6u1SEhOeO9k3xkvcQsqx9ECts7u6jpOJHDiZv79sPd6Y33aTZTo4kuQ1xjIx28_YpdiRKJrhtUZr12KRIfl1xy51eW5KSVpAUcMqaawccL0Qqfkm9KVNc-NTb4MQX5YEk4vP_4jGhoaENwogHpZ2p8V3VzSFauAtoKyh2EHut7OswfpLM9XewQrm3H7I2tIOiJUBBo",
      seller: "Pedro Jaramillo",
      rating: 4.9,
      isNew: true
    },
    {
      id: 2,
      name: "Tambor Tradicional",
      price: 120000,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-Ve5K_RrD3UxqEMQak8uzh0biiejjGi4p3k3AJ-9WTztLwufVpZXSrp-IKL4P8H8VVE3R_nUcFQoLF0XUdobIUPzqi3BywZ3Se54M1M4koBJQ3Ib3VxXT8n0ahp7W4pMWMkxhO0Hjs-1KbbyaK6KQdXdI0lmLyAkDx4G_cHqZmN7et9B3KD9KFaO4l17XNQa-YKAjXSw0HAzDzDUmLfzeXilJgsVslPX-EkGZfd5AP4sIouU-xkeOoVR3fu5nSxgqkaBFQ3lvRts",
      seller: "Rosa Mena",
      rating: 4.8,
      featured: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Entregado';
      case 'shipped': return 'Enviado';
      case 'processing': return 'Procesando';
      default: return 'Pendiente';
    }
  };

  return (
    <div className="min-h-screen bg-background"><div className="container-full py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">¡Hola, {user?.name}!</h1>
          <p className="text-muted-foreground">Descubre los tesoros artesanales del Chocó</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mis Pedidos</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentOrders.length}</div>
              <p className="text-xs text-muted-foreground">Total de compras</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Productos guardados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reseñas</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Pendientes por calificar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ahorrado</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$15,000</div>
              <p className="text-xs text-muted-foreground">En descuentos este mes</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Acceso Rápido</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link to="/orders/history">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <History className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">Historial de Pedidos</h3>
                  <p className="text-xs text-muted-foreground">Ver todas tus compras</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/profile/addresses">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">Mis Direcciones</h3>
                  <p className="text-xs text-muted-foreground">Gestionar direcciones de envío</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/reviews">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">Mis Reseñas</h3>
                  <p className="text-xs text-muted-foreground">Calificar productos comprados</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/notifications">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">Notificaciones</h3>
                  <p className="text-xs text-muted-foreground">Centro de notificaciones</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/profile/settings">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Settings className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">Configuración</h3>
                  <p className="text-xs text-muted-foreground">Perfil y preferencias</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/products">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-medium">Explorar</h3>
                  <p className="text-xs text-muted-foreground">Descubrir productos</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Pedidos Recientes
                </CardTitle>
                <CardDescription>
                  Sigue el estado de tus compras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img 
                        src={order.image} 
                        alt={order.productName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{order.productName}</h3>
                        <p className="text-sm text-muted-foreground">por {order.seller}</p>
                        <p className="text-sm text-muted-foreground">
                          Pedido: {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${order.price.toLocaleString()}</p>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to="/orders/history">
                    <Button variant="outline" className="w-full">
                      Ver Todos los Pedidos
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recomendados para Ti</CardTitle>
                <CardDescription>
                  Basado en tus compras anteriores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendations.map((product) => (
                    <div key={product.id} className="group cursor-pointer">
                      <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                        {/* Image Container */}
                        <div className="relative">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          
                          {/* Badges */}
                          <div className="absolute top-2 left-2">
                            {product.isNew && (
                              <span className="bg-amber-700 text-white text-xs font-bold px-2 py-1 rounded">
                                Nuevo
                              </span>
                            )}
                            {product.featured && (
                              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                                Destacado
                              </span>
                            )}
                          </div>
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button 
                              className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary/90 font-medium"
                            >
                              Ver Detalles
                            </Button>
                          </div>
                          
                          {/* Favorite Button */}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                          >
                            <Heart className="w-4 h-4 text-muted-foreground hover:text-red-500 transition-colors" />
                          </Button>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 bg-white">
                          <h3 className="text-lg font-semibold text-foreground mb-1 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            por {product.seller}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-primary font-bold text-lg">
                              ${product.price.toLocaleString()}
                            </p>
                            
                            <div className="flex items-center text-sm text-amber-600">
                              <Star className="h-5 w-5 fill-current mr-1" />
                              <span className="font-medium">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    Explorar Más Productos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Button variant="outline" className="h-20 flex flex-col">
            <ShoppingBag className="h-6 w-6 mb-2" />
            Explorar Productos
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <Heart className="h-6 w-6 mb-2" />
            Lista de Deseos
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <Star className="h-6 w-6 mb-2" />
            Mis Reseñas
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <Package className="h-6 w-6 mb-2" />
            Historial de Pedidos
          </Button>
        </div>
      </div></div>
  );
};

export default BuyerDashboard;