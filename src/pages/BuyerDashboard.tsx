import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Layout/Header';
import { ShoppingBag, Heart, Star, Package, TrendingUp, Eye, Filter } from 'lucide-react';

const BuyerDashboard = () => {
  const { user } = useAuth();

  const recentOrders = [
    {
      id: '001',
      productName: 'Cesta Artesanal de Palma',
      seller: 'María Mosquera',
      price: 45000,
      status: 'delivered',
      orderDate: '2024-01-10',
      image: '/api/placeholder/100/100'
    },
    {
      id: '002',
      productName: 'Collar Wayuu Tradicional',
      seller: 'Carmen Riascos',
      price: 65000,
      status: 'shipped',
      orderDate: '2024-01-12',
      image: '/api/placeholder/100/100'
    }
  ];

  const recommendations = [
    {
      id: 1,
      name: "Máscara Ceremonial Embera",
      price: 85000,
      image: "/api/placeholder/200/200",
      seller: "Pedro Jaramillo",
      rating: 4.9,
      isNew: true
    },
    {
      id: 2,
      name: "Tambor Tradicional",
      price: 120000,
      image: "/api/placeholder/200/200",
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
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
                  <Button variant="outline" className="w-full">
                    Ver Todos los Pedidos
                  </Button>
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
                <div className="space-y-4">
                  {recommendations.map((product) => (
                    <div key={product.id} className="group cursor-pointer">
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-32 rounded-lg object-cover group-hover:opacity-75 transition-opacity"
                        />
                        <div className="absolute top-2 right-2">
                          <Heart className="h-5 w-5 text-white/70 hover:text-red-500 cursor-pointer" />
                        </div>
                        {product.isNew && (
                          <Badge className="absolute top-2 left-2 bg-choco-green">Nuevo</Badge>
                        )}
                        {product.featured && (
                          <Badge className="absolute top-2 left-2 bg-choco-gold text-choco-earth">Destacado</Badge>
                        )}
                      </div>
                      <div className="mt-2">
                        <h3 className="font-semibold text-sm">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">por {product.seller}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-bold text-primary">${product.price.toLocaleString()}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs">{product.rating}</span>
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
      </div>
    </div>
  );
};

export default BuyerDashboard;