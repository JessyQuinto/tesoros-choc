import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Layout/Header';
import { useToast } from '@/hooks/use-toast';
import { Plus, Package, DollarSign, TrendingUp, Edit, Eye, AlertCircle, CheckCircle } from 'lucide-react';

const SellerDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [products] = useState([
    {
      id: 1,
      name: "Cesta Artesanal de Palma",
      price: 45000,
      stock: 12,
      sales: 8,
      status: "active",
      image: "/api/placeholder/100/100",
      createdAt: "2024-01-01"
    },
    {
      id: 2,
      name: "Collar Wayuu Tradicional", 
      price: 65000,
      stock: 5,
      sales: 15,
      status: "active",
      image: "/api/placeholder/100/100",
      createdAt: "2023-12-15"
    },
    {
      id: 3,
      name: "Máscara Ceremonial",
      price: 120000,
      stock: 0,
      sales: 3,
      status: "out_of_stock",
      image: "/api/placeholder/100/100",
      createdAt: "2023-11-20"
    }
  ]);

  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    totalSales: products.reduce((sum, p) => sum + p.sales, 0),
    revenue: products.reduce((sum, p) => sum + (p.price * p.sales), 0),
    commission: products.reduce((sum, p) => sum + (p.price * p.sales * 0.15), 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'out_of_stock': return 'Agotado';
      case 'pending': return 'Pendiente';
      default: return 'Inactivo';
    }
  };

  if (user?.role !== 'seller') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
              <p>Esta área está reservada para vendedores.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel de Vendedor</h1>
          <p className="text-muted-foreground">Gestiona tus productos y ventas</p>
          
          {!user?.isApproved && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Cuenta Pendiente de Aprobación</h3>
                  <p className="text-sm text-yellow-700">
                    Tu cuenta está siendo revisada por nuestro equipo. Podrás publicar productos una vez seas aprobado.
                  </p>
                </div>
              </div>
            </div>
          )}

          {user?.isApproved && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">¡Cuenta Aprobada!</h3>
                  <p className="text-sm text-green-700">
                    Ya puedes publicar y gestionar tus productos en Tesoros Chocó.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeProducts} activos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSales}</div>
              <p className="text-xs text-muted-foreground">Productos vendidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Ingresos brutos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comisión (15%)</CardTitle>
              <DollarSign className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">-${stats.commission.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Comisión plataforma</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Products Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Mis Productos
                    </CardTitle>
                    <CardDescription>
                      Gestiona tu inventario y productos
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => toast({ title: "Crear Producto", description: "Función disponible próximamente" })}
                    disabled={!user?.isApproved}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Producto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Stock: {product.stock} | Vendidos: {product.sales}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Creado: {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${product.price.toLocaleString()}</p>
                        <Badge className={getStatusColor(product.status)}>
                          {getStatusText(product.status)}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats & Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ventas Este Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-choco-earth mb-2">
                    ${(stats.revenue * 0.3).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    +25% vs mes anterior
                  </p>
                  <div className="text-sm">
                    <p>Ingresos netos: ${((stats.revenue * 0.3) * 0.85).toLocaleString()}</p>
                    <p className="text-red-600">Comisión: ${((stats.revenue * 0.3) * 0.15).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" disabled={!user?.isApproved}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Producto
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Gestionar Inventario
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Ver Estadísticas
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Historial de Pagos
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;