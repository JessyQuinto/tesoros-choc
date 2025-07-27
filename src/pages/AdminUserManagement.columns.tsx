"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { UserProfile } from "@/services/UserRepository";
import { cn } from "@/lib/utils";

export type UserManagementViewModel = Pick<
  UserProfile,
  'id' | 'name' | 'email' | 'role' | 'isApproved'
>;

export const getColumns = (
  onApprove: (id: string) => void,
  onUpdateRole: (id: string, role: 'buyer' | 'seller' | 'admin') => void,
  onDelete: (id: string) => void
): ColumnDef<UserManagementViewModel>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nombre
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge
          variant={
            role === "admin"
              ? "destructive"
              : role === "seller"
              ? "secondary"
              : "default"
          }
        >
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isApproved",
    header: "Estado",
    cell: ({ row }) => {
      const { isApproved, role } = row.original;
      if (role === 'buyer' || role === 'admin') {
        return <span className="text-muted-foreground">N/A</span>;
      }
      return (
        <Badge
          className={cn(isApproved ? "bg-green-500" : "bg-yellow-500", "text-white")}
        >
          {isApproved ? "Aprobado" : "Pendiente"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            {user.role === "seller" && !user.isApproved && (
              <DropdownMenuItem onClick={() => onApprove(user.id)}>
                Aprobar Vendedor
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onUpdateRole(user.id, user.role === 'buyer' ? 'seller' : 'buyer')}>
              Hacer {user.role === 'buyer' ? 'Vendedor' : 'Comprador'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(user.id)}
            >
              Eliminar Usuario
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
