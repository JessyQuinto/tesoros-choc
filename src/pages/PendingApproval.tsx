import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/admin.service';
import { UserProfile } from '@/types/user.types';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Calendar,
  AlertTriangle,
  Search,
  Filter,
  Users,
  Eye,
  MessageSquare
} from 'lucide-react';

const PendingApproval = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [pendingSellers, setPendingSellers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<UserProfile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Cargar vendedores pendientes
  useEffect(() => {
    loadPendingSellers();
  }, []);

  const loadPendingSellers = async () => {
    try {
      setLoading(true);
      const sellers = await adminService.getPendingSellers();
      setPendingSellers(sellers);
    } catch (error) {
      console.error('Error loading pending sellers:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los vendedores pendientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (seller: UserProfile, type: 'approve' | 'reject') => {
    setSelectedSeller(seller);
    setActionType(type);
    setReason('');
    setIsDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedSeller || !actionType) return;

    try {
      setProcessing(true);

      if (actionType === 'approve') {
        await adminService.approveSeller(selectedSeller.id, reason);
        toast({
          title: "Vendedor aprobado",
          description: `${selectedSeller.name} ha sido aprobado exitosamente`
        });
      } else {
        await adminService.rejectSeller(selectedSeller.id, reason);
        toast({
          title: "Vendedor rechazado",
          description: `${selectedSeller.name} ha sido rechazado`
        });
      }

      // Remover vendedor de la lista
      setPendingSellers(prev => prev.filter(s => s.id !== selectedSeller.id));
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error processing action:', error);
      toast({
        title: "Error",
        description: `No se pudo ${actionType === 'approve' ? 'aprobar' : 'rechazar'} al vendedor`,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const filteredSellers = pendingSellers.filter(seller => 
    seller.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'admin') {
    return (
      <div className="container-full py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
            <p>Esta área está reservada para administradores.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-full py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-full py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Aprobación de Vendedores</h1>
          <p className="text-muted-foreground">
            Revisa y aprueba las solicitudes de nuevos vendedores
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-orange-600">
            <Clock className="h-4 w-4 mr-1" />
            {pendingSellers.length} Pendientes
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Pendientes</p>
                <p className="text-2xl font-bold">{pendingSellers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Aprobados Hoy</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Rechazados Hoy</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Promedio Tiempo</p>
                <p className="text-2xl font-bold">2.5 días</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar Vendedor</Label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sellers List */}
      <div className="space-y-4">
        {filteredSellers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay vendedores pendientes</h3>
              <p className="text-muted-foreground">
                {pendingSellers.length === 0 
                  ? 'Todos los vendedores han sido procesados'
                  : 'No se encontraron vendedores con los filtros aplicados'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSellers.map((seller) => (
            <Card key={seller.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Seller Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{seller.name}</h3>
                        <Badge variant="outline" className="text-orange-600">
                          Pendiente de Aprobación
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {seller.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>

                      {seller.bio && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {seller.bio}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {seller.location && (
                          <Badge variant="secondary" className="text-xs">
                            📍 {seller.location}
                          </Badge>
                        )}
                        {seller.phone && (
                          <Badge variant="secondary" className="text-xs">
                            📞 {seller.phone}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(seller, 'approve')}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Aprobar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAction(seller, 'reject')}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rechazar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Action Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Aprobar Vendedor' : 'Rechazar Vendedor'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? '¿Estás seguro de que quieres aprobar a este vendedor?'
                : '¿Estás seguro de que quieres rechazar a este vendedor?'
              }
            </DialogDescription>
          </DialogHeader>

          {selectedSeller && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">{selectedSeller.name}</h4>
                <p className="text-sm text-muted-foreground">{selectedSeller.email}</p>
              </div>

              <div>
                <Label htmlFor="reason">
                  {actionType === 'approve' ? 'Razón de aprobación (opcional)' : 'Razón de rechazo'}
                </Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    actionType === 'approve' 
                      ? 'Mensaje de bienvenida...'
                      : 'Explica por qué se rechaza la solicitud...'
                  }
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={processing}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={processing || (actionType === 'reject' && !reason.trim())}
              className={
                actionType === 'approve' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  {actionType === 'approve' ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  {actionType === 'approve' ? 'Aprobar' : 'Rechazar'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingApproval;