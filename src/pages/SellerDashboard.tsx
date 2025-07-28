import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Plus, Package, DollarSign, TrendingUp, Edit, Eye, AlertCircle, CheckCircle, ShoppingCart, BarChart3, Settings, CreditCard } from 'lucide-react';

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
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEuP2jaxW-4doOKMOeSzU81-oqhTUUrABfv3OnLUY7DP8XCeySupsCIrkGLkf8lTZvCbWeHjjUoFpgAD6UuakL6TmxaPItdItP_4v-GXV8-ht2VHazbirtOjPrU5sayYuGsDk5555ngMjo-Wp8qlo6dlPDJkxqSnD6nXiuh_jDrpVMOKidedLRWj6v_VIcYbLTrcqQ4gupup8I61Bq1HPLTVV5AAuIn1qtJLwsusK8br9jqTFAFZ1-dn_0GBH4Ul4DXodkVi7kp0M",
      createdAt: "2024-01-01"
    },
    {
      id: 2,
      name: "Collar Wayuu Tradicional", 
      price: 65000,
      stock: 5,
      sales: 15,
      status: "active",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBiYNoSLNic5jl6-U9odJs0DHlb_DH6iu8C2Yx_ACDbF1SOcf08gCkUzAMmYnAm3oIpjRYjVVKnyna3kH-qzh4yMeaWUq9IkFoPpZaxelHg4sgsEqfvOlDde3_nPTIHM_OSmzozA4ONRlu-LqoeBdSjz4RNNiaOVp8Jj45f0tApnYhQHnwBbFEP8ojXsT-SsYoRramlMrGmFxVY5Io5PMJB1PjxbuL8kZrs_9pJPuTwWMPS8TZF_68js_Wla-KU0n4hb56FiV5Gi0M",
      createdAt: "2023-12-15"
    },
    {
      id: 3,
      name: "Máscara Ceremonial",
      price: 120000,
      stock: 0,
      sales: 3,
      status: "out_of_stock",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_ZHNSMDAW1me7RnXk1CSqUZgPLHOwfxYxyO3ETpijuoydbc9yPM0Ixu49EgZ2pzIFe0-ZB6u1SEhOeO9k3xkvcQsqx9ECts7u6jpOJHDiZv79sPd6Y33aTZTo4kuQ1xjIx28_YpdiRKJrhtUZr12KRIfl1xy51eW5KSVpAUcMqaawccL0Qqfkm9KVNc-NTb4MQX5YEk4vP_4jGhoaENwogHpZ2p8V3VzSFauAtoKyh2EHut7OswfpLM9XewQrm3H7I2tIOiJUBBo",
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
      <div><div className="container mx-auto px-4 py-8">
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
    <div className="min-h-screen bg-background"><div className="container mx-auto px-4 py-8">
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

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            <Link to="/products/manage" className="group">
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group-hover:scale-105">
                <CardContent className="p-4 text-center">
                  <Package className="h-8 w-8 mx-auto mb-2 text-primary group-hover:text-primary/80" />
                  <h3 className="font-medium text-sm">Gestionar Productos</h3>
                  <p className="text-xs text-muted-foreground">Crear y editar</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/orders/manage" className="group">
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group-hover:scale-105">
                <CardContent className="p-4 text-center">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-primary group-hover:text-primary/80" />
                  <h3 className="font-medium text-sm">Gestionar Pedidos</h3>
                  <p className="text-xs text-muted-foreground">Ver y actualizar</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/financial-dashboard" className="group">
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group-hover:scale-105">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary group-hover:text-primary/80" />
                  <h3 className="font-medium text-sm">Dashboard Financiero</h3>
                  <p className="text-xs text-muted-foreground">Ventas y comisiones</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/orders/tracking" className="group">
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group-hover:scale-105">
                <CardContent className="p-4 text-center">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary group-hover:text-primary/80" />
                  <h3 className="font-medium text-sm">Seguimiento Pedidos</h3>
                  <p className="text-xs text-muted-foreground">Tracking avanzado</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/reviews" className="group">
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group-hover:scale-105">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary group-hover:text-primary/80" />
                  <h3 className="font-medium text-sm">Gestionar Reseñas</h3>
                  <p className="text-xs text-muted-foreground">Ver y responder</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/notifications" className="group">
              <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group-hover:scale-105">
                <CardContent className="p-4 text-center">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 text-primary group-hover:text-primary/80" />
                  <h3 className="font-medium text-sm">Notificaciones</h3>
                  <p className="text-xs text-muted-foreground">Centro de alertas</p>
                </CardContent>
              </Card>
            </Link>
          </div>
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
                  <Link to="/products/manage">
                    <Button 
                      disabled={!user?.isApproved}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Producto
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="group cursor-pointer">
                      <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                        {/* Image Container */}
                        <div className="relative">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          
                          {/* Status Badge */}
                          <div className="absolute top-2 left-2">
                            <Badge className={getStatusColor(product.status)}>
                              {getStatusText(product.status)}
                            </Badge>
                          </div>
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex gap-2">
                              <Button 
                                size="sm"
                                className="bg-primary text-white rounded-lg px-3 py-1 hover:bg-primary/90 font-medium"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>
                              <Button 
                                size="sm"
                                variant="secondary"
                                className="bg-white text-foreground rounded-lg px-3 py-1 hover:bg-white/90 font-medium"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 bg-white">
                          <h3 className="text-lg font-semibold text-foreground mb-1 hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Stock: {product.stock} | Vendidos: {product.sales}
                          </p>
                          <p className="text-xs text-muted-foreground mb-4">
                            Creado: {new Date(product.createdAt).toLocaleDateString()}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-primary font-bold text-lg">
                              ${product.price.toLocaleString()}
                            </p>
                            
                            <div className="text-sm text-muted-foreground">
                              ID: {product.id}
                            </div>
                          </div>
                        </div>
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
      </div></div>
  );
};

export default SellerDashboard;