import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable, Column } from '@/components/shared/DataTable';
import { UserRole } from '@/types/user.types';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/AdminService';
import { notificationService } from '@/services/NotificationService';
// Mock data instead of Firebase
import { Users, UserCheck, UserX, Shield } from 'lucide-react';

interface UserManagementViewModel {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isApproved: boolean;
  createdAt: string;
}

export function AdminUserManagement() {
  const [users, setUsers] = useState<UserManagementViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending_vendors'>('all');
  const { toast } = useToast();

  // Load mock users
  useEffect(() => {
    const mockUsers: UserManagementViewModel[] = [
      {
        id: '1',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        role: 'buyer',
        isApproved: true,
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'María González',
        email: 'maria@example.com',
        role: 'seller',
        isApproved: true,
        createdAt: '2024-01-20'
      },
      {
        id: '3',
        name: 'Carlos Rodríguez',
        email: 'carlos@example.com',
        role: 'pending_vendor',
        isApproved: false,
        createdAt: '2024-01-25'
      }
    ];
    
    setUsers(mockUsers);
    setIsLoading(false);
  }, []);

  // Filtrar usuarios según la selección
  const filteredUsers = filter === 'pending_vendors' 
    ? users.filter(user => user.role === 'pending_vendor')
    : users;

  // Estadísticas rápidas
  const stats = {
    total: users.length,
    buyers: users.filter(u => u.role === 'buyer').length,
    sellers: users.filter(u => u.role === 'seller').length,
    pendingVendors: users.filter(u => u.role === 'pending_vendor').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  const updateUserStatus = async (userId: string, updates: { role?: UserRole; isApproved?: boolean }) => {
    try {
      setIsLoading(true);
      
      // Obtener información del usuario actual
      const currentUser = users.find(user => user.id === userId);
      if (!currentUser) {
        throw new Error('Usuario no encontrado');
      }

      // Mock update user
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      ));

      // Show success notifications
      if (updates.role === 'seller' && updates.isApproved === true) {
        toast({
          title: "Vendedor aprobado",
          description: `${currentUser.name} ha sido aprobado como vendedor`,
        });
      } else if (updates.isApproved === false && currentUser.role === 'pending_vendor') {
        toast({
          title: "Solicitud rechazada",
          description: `La solicitud de ${currentUser.name} ha sido rechazada`,
        });
      } else if (updates.isApproved === false && currentUser.isApproved === true) {
        toast({
          title: "Cuenta suspendida",
          description: `La cuenta de ${currentUser.name} ha sido suspendida`,
        });
      } else if (updates.isApproved === true && currentUser.isApproved === false) {
        toast({
          title: "Cuenta reactivada",
          description: `La cuenta de ${currentUser.name} ha sido reactivada`,
        });
      } else {
        toast({
          title: "Usuario actualizado",
          description: "El estado del usuario se ha actualizado correctamente",
        });
      }

    } catch (error) {
      console.error('Error actualizando usuario:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleVariant = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'seller': return 'default';
      case 'buyer': return 'secondary';
      case 'pending_vendor': return 'outline';
      default: return 'secondary';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'seller': return 'Vendedor';
      case 'buyer': return 'Comprador';
      case 'pending_vendor': return 'Vendedor Pendiente';
      default: return role;
    }
  };

  const columns: Column<UserManagementViewModel>[] = [
    {
      key: 'name',
      title: 'Nombre',
    },
    {
      key: 'email',
      title: 'Email',
    },
    {
      key: 'role',
      title: 'Rol',
      render: (value) => (
        <Badge variant={getRoleVariant(value as UserRole)}>
          {getRoleLabel(value as UserRole)}
        </Badge>
      ),
    },
    {
      key: 'isApproved',
      title: 'Estado',
      render: (value) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Aprobado' : 'Pendiente'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      title: 'Fecha de Registro',
      render: (value) => {
        if (!value) return 'N/A';
        const date = new Date(value);
        return date.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      },
    },
    {
      key: 'id',
      title: 'Acciones',
      render: (_, row) => (
        <div className="flex space-x-2">
          {row.role === 'pending_vendor' && (
            <>
              <Button
                size="sm"
                variant="default"
                disabled={isLoading}
                onClick={() => updateUserStatus(row.id, { role: 'seller', isApproved: true })}
              >
                {isLoading ? 'Aprobando...' : 'Aprobar Vendedor'}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={isLoading}
                onClick={() => updateUserStatus(row.id, { isApproved: false })}
              >
                {isLoading ? 'Rechazando...' : 'Rechazar'}
              </Button>
            </>
          )}
          {row.role !== 'pending_vendor' && (
            <Button
              size="sm"
              variant="outline"
              disabled={isLoading}
              onClick={() => updateUserStatus(row.id, { isApproved: !row.isApproved })}
            >
              {isLoading ? 'Actualizando...' : row.isApproved ? 'Suspender' : 'Aprobar'}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra usuarios, aprueba vendedores y gestiona permisos
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={filter} onValueChange={(value: 'all' | 'pending_vendors') => setFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar usuarios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los usuarios ({users.length})</SelectItem>
              <SelectItem value="pending_vendors">
                Vendedores pendientes ({stats.pendingVendors})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compradores</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.buyers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendedores</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sellers}</div>
            </CardContent>
          </Card>
          
          <Card className={stats.pendingVendors > 0 ? "border-amber-200 bg-amber-50" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <UserX className={`h-4 w-4 ${stats.pendingVendors > 0 ? "text-amber-600" : "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.pendingVendors > 0 ? "text-amber-600" : ""}`}>
                {stats.pendingVendors}
              </div>
              {stats.pendingVendors > 0 && (
                <p className="text-xs text-amber-600">Requieren atención</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <DataTable 
          title="" 
          columns={columns} 
          data={filteredUsers}
        />
      )}
      
      {!isLoading && filteredUsers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {filter === 'pending_vendors' 
            ? 'No hay vendedores pendientes de aprobación' 
            : 'No hay usuarios registrados'}
        </div>
      )}
    </div>
  );
}