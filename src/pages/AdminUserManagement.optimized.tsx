/**
 * Optimized Admin User Management Page
 * Uses shared utilities and components for better maintainability
 */

import React from 'react';
import { AdminLayout } from '@/components/Layout/AdminLayout';
import { DataTable, StatusBadge } from '@/components/shared/DataTable';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useState,
  UserCheck,
  UserX,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Settings
} from '@/lib/shared-imports';
import {
  useDataManagement,
  useFiltering,
  getRoleColor,
  formatDate
} from '@/lib/admin-utils';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'buyer' | 'seller' | 'admin';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  isApproved?: boolean;
  location?: {
    city: string;
    department: string;
  };
  businessInfo?: {
    businessName: string;
    description: string;
    category: string;
  };
  stats?: {
    totalOrders?: number;
    totalSpent?: number;
    totalProducts?: number;
    totalSales?: number;
    rating?: number;
  };
  registeredAt: string;
  lastLoginAt?: string;
}

const AdminUserManagement = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Sample data using the new data management hook
  const { data: users, updateItem, deleteItem } = useDataManagement<User>([
    {
      id: '1',
      name: 'María José Rentería',
      email: 'maria@email.com',
      phone: '+57 300 123 4567',
      role: 'buyer',
      status: 'active',
      location: { city: 'Quibdó', department: 'Chocó' },
      stats: { totalOrders: 5, totalSpent: 250000 },
      registeredAt: '2024-01-10T10:00:00Z',
      lastLoginAt: '2024-01-25T15:30:00Z'
    },
    {
      id: '2',
      name: 'Carmen Riascos',
      email: 'carmen@email.com',
      phone: '+57 300 234 5678',
      role: 'seller',
      status: 'active',
      isApproved: true,
      location: { city: 'Istmina', department: 'Chocó' },
      businessInfo: {
        businessName: 'Artesanías Carmen',
        description: 'Productos tradicionales Wayuu',
        category: 'Textiles'
      },
      stats: { totalProducts: 25, totalSales: 89, rating: 4.8 },
      registeredAt: '2023-12-15T09:00:00Z',
      lastLoginAt: '2024-01-25T14:20:00Z'
    },
    {
      id: '3',
      name: 'Ana Lucía Palacios',
      email: 'ana.palacios@email.com',
      phone: '+57 300 345 6789',
      role: 'seller',
      status: 'pending',
      isApproved: false,
      location: { city: 'Riosucio', department: 'Chocó' },
      businessInfo: {
        businessName: 'Artesanías Palenque',
        description: 'Cestería tradicional palenquera',
        category: 'Artesanías'
      },
      registeredAt: '2024-01-15T12:00:00Z'
    }
  ]);

  // Use filtering hook
  const { filters, filteredData, updateFilter } = useFiltering(users, ['name', 'email']);

  // Computed data
  const pendingUsers = users.filter(u => u.status === 'pending');
  const activeUsers = users.filter(u => u.status === 'active');
  const sellers = users.filter(u => u.role === 'seller');
  const buyers = users.filter(u => u.role === 'buyer');

  // Actions
  const handleApproveUser = (userId: string) => {
    updateItem(userId, { status: 'active', isApproved: true });
  };

  const handleRejectUser = (userId: string) => {
    updateItem(userId, { status: 'inactive', isApproved: false });
  };

  const handleSuspendUser = (userId: string) => {
    updateItem(userId, { status: 'suspended' });
  };

  // Table columns configuration
  const userColumns = [
    {
      key: 'name' as keyof User,
      title: 'Usuario',
      render: (_: unknown, user: User) => (
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
          {user.phone && (
            <div className="text-xs text-muted-foreground">{user.phone}</div>
          )}
        </div>
      )
    },
    {
      key: 'role' as keyof User,
      title: 'Rol',
      render: (role: string) => (
        <Badge className={getRoleColor(role)}>
          {role === 'admin' ? 'Administrador' : 
           role === 'seller' ? 'Vendedor' : 'Comprador'}
        </Badge>
      )
    },
    {
      key: 'status' as keyof User,
      title: 'Estado',
      render: (status: string, user: User) => (
        <div>
          <StatusBadge status={status}>
            {status === 'active' ? 'Activo' :
             status === 'pending' ? 'Pendiente' :
             status === 'suspended' ? 'Suspendido' : 'Inactivo'}
          </StatusBadge>
          {user.role === 'seller' && user.status === 'active' && user.isApproved && (
            <div className="text-xs text-green-600 mt-1">✓ Aprobado</div>
          )}
        </div>
      )
    },
    {
      key: 'location' as keyof User,
      title: 'Ubicación',
      render: (_: unknown, user: User) => (
        user.location ? (
          <div className="text-sm">
            <div>{user.location.city}</div>
            <div className="text-muted-foreground">{user.location.department}</div>
          </div>
        ) : '-'
      )
    },
    {
      key: 'registeredAt' as keyof User,
      title: 'Registro',
      render: (date: string, user: User) => (
        <div className="text-sm">
          {formatDate(date)}
          {user.lastLoginAt && (
            <div className="text-xs text-muted-foreground">
              Último acceso: {formatDate(user.lastLoginAt)}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'stats' as keyof User,
      title: 'Estadísticas',
      render: (_: unknown, user: User) => {
        if (user.role === 'buyer' && user.stats) {
          return (
            <div className="text-sm">
              <div>{user.stats.totalOrders} pedidos</div>
              <div className="text-muted-foreground">
                ${user.stats.totalSpent?.toLocaleString()}
              </div>
            </div>
          );
        }
        if (user.role === 'seller' && user.stats) {
          return (
            <div className="text-sm">
              <div>{user.stats.totalProducts} productos</div>
              <div className="text-muted-foreground">
                {user.stats.totalSales} ventas
              </div>
              {user.stats.rating && (
                <div className="text-muted-foreground">
                  ⭐ {user.stats.rating}
                </div>
              )}
            </div>
          );
        }
        return '-';
      }
    },
    {
      key: 'id' as keyof User,
      title: 'Acciones',
      render: (_: unknown, user: User) => (
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedUser(user)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Detalles del Usuario</DialogTitle>
                <DialogDescription>
                  Información completa de {user.name}
                </DialogDescription>
              </DialogHeader>
              {selectedUser && <UserDetailsDialog user={selectedUser} />}
            </DialogContent>
          </Dialog>
          
          {user.status === 'pending' && (
            <>
              <Button 
                onClick={() => handleApproveUser(user.id)}
                size="sm"
                variant="outline"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button 
                onClick={() => handleRejectUser(user.id)}
                size="sm"
                variant="outline"
              >
                <UserX className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  const filterOptions = [
    {
      key: 'role',
      label: 'Rol',
      value: filters.status,
      onChange: (value: string) => updateFilter('status', value),
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'buyer', label: 'Compradores' },
        { value: 'seller', label: 'Vendedores' },
        { value: 'admin', label: 'Administradores' }
      ]
    },
    {
      key: 'status',
      label: 'Estado',
      value: filters.category,
      onChange: (value: string) => updateFilter('category', value),
      options: [
        { value: 'all', label: 'Todos' },
        { value: 'active', label: 'Activos' },
        { value: 'pending', label: 'Pendientes' },
        { value: 'inactive', label: 'Inactivos' },
        { value: 'suspended', label: 'Suspendidos' }
      ]
    }
  ];

  return (
    <AdminLayout 
      title="Gestión de Usuarios" 
      description="Administra usuarios, vendedores y compradores de la plataforma"
    >
      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {activeUsers.length} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendedores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellers.length}</div>
            <p className="text-xs text-muted-foreground">
              {sellers.filter(s => s.isApproved).length} aprobados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compradores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buyers.length}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              Esperando aprobación
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todos los Usuarios</TabsTrigger>
          <TabsTrigger value="pending">Pendientes de Aprobación</TabsTrigger>
          <TabsTrigger value="management">Gestión</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <DataTable
            title="Lista de Usuarios"
            description="Todos los usuarios registrados en la plataforma"
            data={filteredData}
            columns={userColumns}
            searchPlaceholder="Buscar por nombre o email..."
            onSearch={(query) => updateFilter('search', query)}
            filters={filterOptions}
            onRowClick={(user) => setSelectedUser(user)}
          />
        </TabsContent>

        <TabsContent value="pending">
          <PendingApprovalsList 
            users={pendingUsers}
            onApprove={handleApproveUser}
            onReject={handleRejectUser}
          />
        </TabsContent>

        <TabsContent value="management">
          <ManagementTools onSuspend={handleSuspendUser} />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

// Extracted components for better organization
const UserDetailsDialog: React.FC<{ user: User }> = ({ user }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold mb-2">Información Personal</h4>
        <div className="space-y-1 text-sm">
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {user.phone && <p><strong>Teléfono:</strong> {user.phone}</p>}
          <p><strong>Rol:</strong> {user.role}</p>
          <p><strong>Estado:</strong> {user.status}</p>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Ubicación</h4>
        {user.location ? (
          <div className="space-y-1 text-sm">
            <p><strong>Ciudad:</strong> {user.location.city}</p>
            <p><strong>Departamento:</strong> {user.location.department}</p>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No especificada</p>
        )}
      </div>
    </div>

    {user.businessInfo && (
      <div>
        <h4 className="font-semibold mb-2">Información del Negocio</h4>
        <div className="space-y-1 text-sm">
          <p><strong>Nombre del negocio:</strong> {user.businessInfo.businessName}</p>
          <p><strong>Categoría:</strong> {user.businessInfo.category}</p>
          <p><strong>Descripción:</strong> {user.businessInfo.description}</p>
        </div>
      </div>
    )}
  </div>
);

const PendingApprovalsList: React.FC<{
  users: User[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ users, onApprove, onReject }) => (
  <Card>
    <CardHeader>
      <CardTitle>Vendedores Pendientes de Aprobación</CardTitle>
      <CardDescription>
        Revisa y aprueba nuevos vendedores que quieren unirse al marketplace
      </CardDescription>
    </CardHeader>
    <CardContent>
      {users.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay solicitudes pendientes</h3>
          <p className="text-muted-foreground">
            Todas las solicitudes de vendedores han sido procesadas
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="border rounded-lg p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{user.name}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {user.phone}
                      </div>
                    )}
                    {user.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {user.location.city}, {user.location.department}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Registrado: {formatDate(user.registeredAt)}
                    </div>
                  </div>
                </div>

                {user.businessInfo && (
                  <div>
                    <h4 className="font-semibold mb-2">Información del Negocio</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>{user.businessInfo.businessName}</strong></p>
                      <p className="text-muted-foreground">{user.businessInfo.category}</p>
                      <p className="text-sm">{user.businessInfo.description}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={() => onApprove(user.id)}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprobar Vendedor
                  </Button>
                  <Button 
                    onClick={() => onReject(user.id)}
                    variant="destructive"
                    className="w-full"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Rechazar Solicitud
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

const ManagementTools: React.FC<{ onSuspend: (id: string) => void }> = ({ onSuspend }) => (
  <div className="grid lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Acciones en Lote</CardTitle>
        <CardDescription>
          Realiza acciones sobre múltiples usuarios
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full">
          <Mail className="h-4 w-4 mr-2" />
          Enviar Email Masivo
        </Button>
        <Button variant="outline" className="w-full">
          <UserCheck className="h-4 w-4 mr-2" />
          Aprobar Todos los Pendientes
        </Button>
        <Button variant="outline" className="w-full">
          <Settings className="h-4 w-4 mr-2" />
          Exportar Lista de Usuarios
        </Button>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Configuración del Sistema</CardTitle>
        <CardDescription>
          Ajustes generales de la plataforma
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" className="w-full">
          <Settings className="h-4 w-4 mr-2" />
          Configurar Comisiones
        </Button>
        <Button variant="outline" className="w-full">
          <AlertCircle className="h-4 w-4 mr-2" />
          Gestionar Reportes
        </Button>
      </CardContent>
    </Card>
  </div>
);

export default AdminUserManagement;
