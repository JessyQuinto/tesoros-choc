/**
 * Shared Data Table Component for Admin Pages
 * Provides consistent table functionality with search, filters, and pagination
 */

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Search,
  Filter
} from '@/lib/shared-imports';
import { getStatusColor } from '@/lib/admin-utils';

interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  title: string;
  description?: string;
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  filters?: Array<{
    key: string;
    label: string;
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (value: string) => void;
  }>;
  actions?: React.ReactNode;
  loading?: boolean;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id: string }>({
  title,
  description,
  data,
  columns,
  searchPlaceholder = "Buscar...",
  onSearch,
  filters = [],
  actions,
  loading = false,
  onRowClick
}: DataTableProps<T>) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {onSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-10"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          )}
          
          {filters.map((filter) => (
            <Select
              key={filter.key}
              value={filter.value}
              onValueChange={filter.onChange}
            >
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={String(column.key)}>
                      {column.title}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={columns.length} 
                      className="text-center py-8 text-muted-foreground"
                    >
                      No se encontraron resultados
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item) => (
                    <TableRow 
                      key={item.id}
                      className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                      onClick={() => onRowClick?.(item)}
                    >
                      {columns.map((column) => (
                        <TableCell key={String(column.key)}>
                          {column.render 
                            ? column.render(item[column.key], item)
                            : String(item[column.key] || '-')
                          }
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper component for status badges
export const StatusBadge: React.FC<{ status: string; children: React.ReactNode }> = ({ 
  status, 
  children 
}) => (
  <Badge className={getStatusColor(status)}>
    {children}
  </Badge>
);

export default DataTable;
