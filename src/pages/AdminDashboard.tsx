import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Users, Package, DollarSign, TrendingUp, Eye, BarChart3, Settings, UserCheck, FileText, MessageSquare, Shield, Cog, Activity, CreditCard } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data for pending sellers
  const [pendingSellers, setPendingSellers] = useState([
    {
      id: '4',
      name: 'Ana Lucía Palacios',
      email: 'ana.palacios@email.com',
      location: 'Riosucio, Chocó',
      registeredAt: '2024-01-15',
      businessName: 'Artesanías Palenque',
      description: 'Especializada en cestería tradicional con técnicas ancestrales de la comunidad palenquera.'
    },
    {
      id: '5',
      name: 'Miguel Ángel Córdoba',
      email: 'miguel.cordoba@email.com',
      location: 'Condoto, Chocó',
      registeredAt: '2024-01-14',
      businessName: 'Tallado del Pacífico',
      description: 'Artesano de máscaras ceremoniales y esculturas en madera de la región.'
    }
  ]);

  const stats = {
    totalUsers: 156,
    activeSellers: 23,
    pendingApprovals: pendingSellers.length,
    totalProducts: 189,
    monthlyRevenue: 2450000,
    commission: 367500
  };

  const handleApproval = (sellerId: string, approved: boolean) => {
    setPendingSellers(prev => prev.filter(s => s.id !== sellerId));
    
    toast({
      title: approved ? "Vendedor Aprobado" : "Vendedor Rechazado",
      description: approved 
        ? "El vendedor ya puede publicar productos en la plataforma"
        : "Se ha notificado al vendedor sobre la decisión"
    });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
            <p>No tienes permisos para acceder al panel administrativo.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-muted-foreground">Gestiona vendedores, productos y el marketplace</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendedores Activos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSellers}</div>
              <p className="text-xs text-muted-foreground">
                <Badge variant="secondary" className="mr-1">{stats.pendingApprovals}</Badge>
                pendientes de aprobación
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">+8 nuevos esta semana</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+23% vs mes anterior</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comisiones (15%)</CardTitle>
              <DollarSign className="h-4 w-4 text-choco-gold group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-choco-earth">${stats.commission.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Ganancia de la plataforma</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Herramientas de Administración</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Link to="/admin/users">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <CardContent className="p-4 text-center">
                  <UserCheck className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium">Gestionar Usuarios</h3>
                  <p className="text-xs text-muted-foreground">Aprobar y administrar usuarios</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/products">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <CardContent className="p-4 text-center">
                  <Package className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium">Supervisar Productos</h3>
                  <p className="text-xs text-muted-foreground">Revisar y moderar productos</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/reports">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <CardContent className="p-4 text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium">Reportes Avanzados</h3>
                  <p className="text-xs text-muted-foreground">Análisis y estadísticas</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/content">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium">Gestión de Contenido</h3>
                  <p className="text-xs text-muted-foreground">Páginas y banners</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <Link to="/admin/support">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <CardContent className="p-4 text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium">Centro de Soporte</h3>
                  <p className="text-xs text-muted-foreground">Tickets y FAQ</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/config">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <CardContent className="p-4 text-center">
                  <Cog className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium">Configuración</h3>
                  <p className="text-xs text-muted-foreground">Ajustes de plataforma</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/audit">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <CardContent className="p-4 text-center">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium">Sistema de Auditoría</h3>
                  <p className="text-xs text-muted-foreground">Logs y seguridad</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/payments">
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <CardContent className="p-4 text-center">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium">Gestión de Pagos</h3>
                  <p className="text-xs text-muted-foreground">Pagos y comisiones</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Pending Seller Approvals */}
        <Card className="mb-8 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Vendedores Pendientes de Aprobación
            </CardTitle>
            <CardDescription>
              Revisa y aprueba nuevos vendedores para que puedan publicar productos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingSellers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>No hay vendedores pendientes de aprobación</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Negocio</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingSellers.map((seller) => (
                    <TableRow key={seller.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{seller.name}</div>
                          <div className="text-sm text-muted-foreground">{seller.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{seller.businessName}</div>
                          <div className="text-sm text-muted-foreground max-w-xs">
                            {seller.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{seller.location}</TableCell>
                      <TableCell>{new Date(seller.registeredAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproval(seller.id, true)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleApproval(seller.id, false)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rechazar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/users">
            <Button className="h-20 flex flex-col w-full">
              <Users className="h-6 w-6 mb-2" />
              Gestionar Usuarios
            </Button>
          </Link>
          <Button variant="outline" className="h-20 flex flex-col">
            <Package className="h-6 w-6 mb-2" />
            Revisar Productos
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <TrendingUp className="h-6 w-6 mb-2" />
            Reportes de Ventas
          </Button>
          <Button variant="outline" className="h-20 flex flex-col">
            <DollarSign className="h-6 w-6 mb-2" />
            Configurar Comisiones
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;