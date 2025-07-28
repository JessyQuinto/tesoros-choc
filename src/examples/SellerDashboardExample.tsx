// Ejemplo de implementación para Dashboard de Vendedor
import React from 'react';
import { useSellerProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export const SellerDashboardExample = () => {
  const { user } = useAuth();
  const { products, loading: productsLoading, createProduct } = useSellerProducts();
  const { orders, loading: ordersLoading } = useOrders('seller');

  // Verificar que el usuario sea vendedor aprobado
  if (!user || user.role !== 'seller' || !user.isApproved) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Acceso Restringido</h2>
            <p className="text-muted-foreground">
              Solo vendedores aprobados pueden acceder a esta sección.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Vendedor</h1>
          <p className="text-muted-foreground">Bienvenido, {user.name}</p>
        </div>
        <Button 
          onClick={() => {
            // Aquí iría la lógica para abrir modal de crear producto
            console.log('Crear nuevo producto');
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {activeProducts} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              Total de ventas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalSales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total generado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <Badge variant="default">Aprobado</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Cuenta verificada y activa
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {productsLoading ? (
            <div className="text-center py-4">Cargando productos...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Aún no tienes productos registrados
              </p>
              <Button>Crear tu primer producto</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.images[0] || ''} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Stock: {product.stock} • ${product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={product.isActive ? 'default' : 'secondary'}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Órdenes Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="text-center py-4">Cargando órdenes...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No tienes órdenes recientes
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Orden #{order.id.slice(-8)}</h4>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} productos • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.totalAmount.toLocaleString()}</p>
                    <Badge 
                      variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'shipped' ? 'secondary' :
                        order.status === 'cancelled' ? 'destructive' : 'outline'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerDashboardExample;
