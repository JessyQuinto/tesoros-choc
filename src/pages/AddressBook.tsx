import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  Home, 
  Building, 
  Store,
  Star,
  Check,
  X
} from 'lucide-react';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  postalCode: string;
  neighborhood?: string;
  additionalInfo?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const DEPARTMENTS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas',
  'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca',
  'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño',
  'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia',
  'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
];

const ADDRESS_TYPES = [
  { value: 'home', label: 'Casa', icon: Home },
  { value: 'work', label: 'Trabajo', icon: Building },
  { value: 'other', label: 'Otro', icon: Store }
];

export const AddressBook = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      name: 'Casa Principal',
      firstName: 'María',
      lastName: 'González',
      phone: '+57 300 123 4567',
      address: 'Carrera 5 # 25-30',
      city: 'Quibdó',
      department: 'Chocó',
      postalCode: '270001',
      neighborhood: 'Niño Jesús',
      additionalInfo: 'Casa color verde, portón metálico',
      isDefault: true,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      type: 'work',
      name: 'Taller de Artesanías',
      firstName: 'María',
      lastName: 'González',
      phone: '+57 300 123 4567',
      address: 'Calle 15 # 8-42',
      city: 'Quibdó',
      department: 'Chocó',
      postalCode: '270001',
      neighborhood: 'Centro',
      additionalInfo: 'Local comercial planta baja',
      isDefault: false,
      isActive: true,
      createdAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-10T14:30:00Z'
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({
    type: 'home',
    name: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    department: '',
    postalCode: '',
    neighborhood: '',
    additionalInfo: '',
    isDefault: false,
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      type: 'home',
      name: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      city: '',
      department: '',
      postalCode: '',
      neighborhood: '',
      additionalInfo: '',
      isDefault: false,
      isActive: true
    });
    setEditingAddress(null);
  };

  const handleOpenDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setFormData(address);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const validateForm = (): boolean => {
    const required = ['name', 'firstName', 'lastName', 'phone', 'address', 'city', 'department'];
    
    for (const field of required) {
      if (!formData[field as keyof Address]) {
        toast({
          title: "Campo requerido",
          description: `El campo ${field} es obligatorio`,
          variant: "destructive"
        });
        return false;
      }
    }

    // Validate phone format
    const phoneRegex = /^\+57\s\d{3}\s\d{3}\s\d{4}$/;
    if (!phoneRegex.test(formData.phone || '')) {
      toast({
        title: "Teléfono inválido",
        description: "El formato debe ser: +57 300 123 4567",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSaveAddress = () => {
    if (!validateForm()) return;

    const now = new Date().toISOString();
    
    if (editingAddress) {
      // Update existing address
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddress.id 
          ? { ...formData, id: editingAddress.id, updatedAt: now } as Address
          : addr
      ));
      
      toast({
        title: "Dirección actualizada",
        description: "La dirección ha sido actualizada exitosamente"
      });
    } else {
      // Create new address
      const newAddress: Address = {
        ...formData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      } as Address;

      // If this is the first address or marked as default, make it default
      if (addresses.length === 0 || formData.isDefault) {
        // Remove default from other addresses
        setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
        newAddress.isDefault = true;
      }

      setAddresses(prev => [...prev, newAddress]);
      
      toast({
        title: "Dirección agregada",
        description: "La nueva dirección ha sido agregada exitosamente"
      });
    }

    handleCloseDialog();
  };

  const handleSetDefault = (addressId: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));

    toast({
      title: "Dirección principal actualizada",
      description: "La dirección principal ha sido cambiada"
    });
  };

  const handleToggleActive = (addressId: string) => {
    setAddresses(prev => prev.map(addr => 
      addr.id === addressId 
        ? { ...addr, isActive: !addr.isActive }
        : addr
    ));

    const address = addresses.find(addr => addr.id === addressId);
    toast({
      title: address?.isActive ? "Dirección desactivada" : "Dirección activada",
      description: address?.isActive 
        ? "La dirección ha sido desactivada" 
        : "La dirección ha sido activada"
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    const address = addresses.find(addr => addr.id === addressId);
    
    if (address?.isDefault && addresses.length > 1) {
      toast({
        title: "No se puede eliminar",
        description: "No puedes eliminar la dirección principal. Selecciona otra como principal primero.",
        variant: "destructive"
      });
      return;
    }

    setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    
    toast({
      title: "Dirección eliminada",
      description: "La dirección ha sido eliminada exitosamente"
    });
  };

  const getAddressTypeIcon = (type: string) => {
    const addressType = ADDRESS_TYPES.find(t => t.value === type);
    const Icon = addressType?.icon || Store;
    return <Icon className="h-4 w-4" />;
  };

  const getAddressTypeLabel = (type: string) => {
    const addressType = ADDRESS_TYPES.find(t => t.value === type);
    return addressType?.label || 'Otro';
  };

  if (!user) {
    return (
      <div className="container-full py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
            <p>Debes iniciar sesión para gestionar tus direcciones.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-full py-8 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis Direcciones</h1>
          <p className="text-muted-foreground">
            Gestiona tus direcciones de envío y facturación
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Dirección
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Editar Dirección' : 'Nueva Dirección'}
              </DialogTitle>
              <DialogDescription>
                {editingAddress 
                  ? 'Actualiza la información de tu dirección'
                  : 'Agrega una nueva dirección de envío o facturación'
                }
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Address Type and Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de dirección</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'home' | 'work' | 'other') => 
                      setFormData(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ADDRESS_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la dirección</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="ej. Casa Principal, Oficina"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Nombre"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Apellidos"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+57 300 123 4567"
                />
              </div>

              {/* Address Details */}
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Carrera 5 # 25-30"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Quibdó"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, postalCode: e.target.value }))}
                    placeholder="270001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Barrio/Vereda (opcional)</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                  placeholder="Niño Jesús"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Información adicional (opcional)</Label>
                <Input
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalInfo: e.target.value }))}
                  placeholder="Punto de referencia, instrucciones especiales"
                />
              </div>

              {/* Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dirección principal</p>
                    <p className="text-sm text-muted-foreground">
                      Usar como dirección predeterminada para envíos
                    </p>
                  </div>
                  <Switch
                    checked={formData.isDefault}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dirección activa</p>
                    <p className="text-sm text-muted-foreground">
                      Disponible para seleccionar en checkout
                    </p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={handleCloseDialog} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSaveAddress}>
                  <Check className="h-4 w-4 mr-2" />
                  {editingAddress ? 'Actualizar' : 'Guardar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tienes direcciones guardadas</h3>
            <p className="text-muted-foreground mb-4">
              Agrega tu primera dirección para poder realizar pedidos
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar primera dirección
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <Card key={address.id} className={`${!address.isActive ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                      {getAddressTypeIcon(address.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{address.name}</CardTitle>
                        {address.isDefault && (
                          <Badge className="bg-primary text-primary-foreground">
                            <Star className="h-3 w-3 mr-1" />
                            Principal
                          </Badge>
                        )}
                        <Badge variant="secondary">
                          {getAddressTypeLabel(address.type)}
                        </Badge>
                        {!address.isActive && (
                          <Badge variant="destructive">
                            Inactiva
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {address.firstName} {address.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleOpenDialog(address)}
                      variant="outline" 
                      size="sm"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={() => handleDeleteAddress(address.id)}
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Dirección</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{address.address}</p>
                      {address.neighborhood && <p>{address.neighborhood}</p>}
                      <p>{address.city}, {address.department}</p>
                      <p>Código Postal: {address.postalCode}</p>
                      {address.additionalInfo && (
                        <p className="italic">Info: {address.additionalInfo}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Contacto</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{address.firstName} {address.lastName}</p>
                      <p>{address.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  {!address.isDefault && address.isActive && (
                    <Button 
                      onClick={() => handleSetDefault(address.id)}
                      variant="outline" 
                      size="sm"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Hacer principal
                    </Button>
                  )}
                  <Button 
                    onClick={() => handleToggleActive(address.id)}
                    variant="outline" 
                    size="sm"
                  >
                    {address.isActive ? 'Desactivar' : 'Activar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
