import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, Column } from '@/components/shared/DataTable';
import { UserRole } from '@/contexts/AuthContext';

interface UserManagementViewModel {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isApproved: boolean;
  createdAt: string;
}

export function AdminUserManagement() {
  // Mock data para demostración
  const [mockUsers] = useState<UserManagementViewModel[]>([
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
      name: 'María García',
      email: 'maria@example.com',
      role: 'pending_vendor',
      isApproved: false,
      createdAt: '2024-01-20'
    },
    {
      id: '3',
      name: 'Carlos Rodriguez',
      email: 'carlos@example.com',
      role: 'seller',
      isApproved: true,
      createdAt: '2024-01-10'
    }
  ]);

  const updateUserStatus = async (userId: string, updates: { role?: UserRole; isApproved?: boolean }) => {
    console.log('Actualizando usuario:', userId, updates);
    // Aquí se conectaría con la API real
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
          {value === 'pending_vendor' ? 'Vendedor Pendiente' : value}
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
      key: 'id',
      title: 'Acciones',
      render: (_, row) => (
        <div className="flex space-x-2">
          {row.role === 'pending_vendor' && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={() => updateUserStatus(row.id, { role: 'seller', isApproved: true })}
              >
                Aprobar Vendedor
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => updateUserStatus(row.id, { isApproved: false })}
              >
                Rechazar
              </Button>
            </>
          )}
          {row.role !== 'pending_vendor' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateUserStatus(row.id, { isApproved: !row.isApproved })}
            >
              {row.isApproved ? 'Suspender' : 'Aprobar'}
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <DataTable title="Gestión de Usuarios" columns={columns} data={mockUsers} />
    </div>
  );
}