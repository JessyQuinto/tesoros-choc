import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/AdminService";
import { getColumns, UserManagementViewModel } from "./AdminUserManagement.columns";
import { DataTable } from "@/components/shared/DataTable";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function AdminUserManagement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const [dialogState, setDialogState] = useState({ isOpen: false, userId: '' });

  const { data: users, isLoading, error } = useQuery<UserManagementViewModel[], Error>({
    queryKey: ["adminUsers"],
    queryFn: () => adminService.getAllUsers(),
  });

  const mutationOptions = {
    onSuccess: (message: string) => {
      toast({ title: "Éxito", description: message });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: (error: Error) => {
      handleError(error, "Operación de administrador fallida");
    },
  };

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: { role?: string; isApproved?: boolean } }) =>
      adminService.updateUser(userId, data).then(() => "Usuario actualizado correctamente."),
    ...mutationOptions,
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => 
        adminService.deleteUser(userId).then(() => "Usuario eliminado correctamente."),
    ...mutationOptions,
    onSettled: () => {
      setDialogState({ isOpen: false, userId: '' });
    },
  });

  const onApprove = (userId: string) => {
    updateUserMutation.mutate({ userId, data: { isApproved: true } });
  };
  
  const onUpdateRole = (userId: string, newRole: 'buyer' | 'seller' | 'admin') => {
    // Para simplificar, asumimos que solo se puede cambiar entre buyer y seller.
    const targetRole = newRole === 'buyer' ? 'seller' : 'buyer';
    updateUserMutation.mutate({ userId, data: { role: targetRole } });
  };
  
  const openDeleteDialog = (userId: string) => {
    setDialogState({ isOpen: true, userId });
  };
  
  const columns = getColumns(onApprove, onUpdateRole, openDeleteDialog);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }

  if (error) {
    // El hook useErrorHandler ya podría haber manejado esto, pero es una buena práctica tener un fallback.
    return <div className="text-red-500 text-center p-4">Error al cargar usuarios: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
      <DataTable columns={columns} data={users || []} />
      
      <AlertDialog open={dialogState.isOpen} onOpenChange={(isOpen) => setDialogState(prev => ({ ...prev, isOpen }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario
              y todos sus datos asociados del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserMutation.mutate(dialogState.userId)}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? "Eliminando..." : "Confirmar Eliminación"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
