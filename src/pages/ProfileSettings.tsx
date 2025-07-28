import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Bell, 
  Shield, 
  CreditCard,
  Globe,
  Eye,
  EyeOff,
  Trash2,
  Edit2,
  Save,
  X
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  location: {
    city: string;
    department: string;
    address?: string;
  };
  businessInfo?: {
    businessName: string;
    description: string;
    category: string;
    taxId?: string;
    website?: string;
  };
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      orderUpdates: boolean;
      promotions: boolean;
      newProducts: boolean;
    };
    privacy: {
      showEmail: boolean;
      showPhone: boolean;
      allowMessages: boolean;
      publicProfile: boolean;
    };
    language: string;
    currency: string;
  };
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  passwordLastChanged: string;
}

export const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  // State for form editing
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Mock user profile data
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || '1',
    name: user?.name || 'Maria Gonzalez',
    email: user?.email || 'maria@email.com',
    phone: '+57 300 123 4567',
    avatar: '',
    bio: 'Artesana tradicional del Chocó con más de 15 años de experiencia en la elaboración de canastas y productos en palma.',
    location: {
      city: 'Quibdó',
      department: 'Chocó',
      address: 'Carrera 5 # 25-30, Barrio Niño Jesús'
    },
    businessInfo: user?.role === 'seller' ? {
      businessName: 'Artesanías María',
      description: 'Especialistas en productos artesanales tradicionales del Chocó',
      category: 'Artesanías',
      taxId: '123456789-1',
      website: 'https://artesaniasmaria.com'
    } : undefined,
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
        orderUpdates: true,
        promotions: false,
        newProducts: true
      },
      privacy: {
        showEmail: false,
        showPhone: false,
        allowMessages: true,
        publicProfile: true
      },
      language: 'es',
      currency: 'COP'
    }
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30,
    passwordLastChanged: '2024-01-15'
  });

  // Form state
  const [editForm, setEditForm] = useState(profile);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = () => {
    try {
      setProfile(editForm);
      
      // Update auth context
      updateUser({
        ...user!,
        name: editForm.name,
        email: editForm.email
      });

      setIsEditing(false);
      
      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido guardada exitosamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar tu perfil",
        variant: "destructive"
      });
    }
  };

  const handleChangePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive"
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 8 caracteres",
        variant: "destructive"
      });
      return;
    }

    // Simulate password change
    setSecuritySettings(prev => ({
      ...prev,
      passwordLastChanged: new Date().toISOString().split('T')[0]
    }));

    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    setIsChangingPassword(false);

    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido cambiada exitosamente"
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setEditForm(prev => ({ ...prev, avatar: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNotificationChange = (key: keyof typeof profile.preferences.notifications, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notifications: {
          ...prev.preferences.notifications,
          [key]: value
        }
      }
    }));

    toast({
      title: "Preferencia actualizada",
      description: "Tu configuración de notificaciones ha sido guardada"
    });
  };

  const handlePrivacyChange = (key: keyof typeof profile.preferences.privacy, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        privacy: {
          ...prev.preferences.privacy,
          [key]: value
        }
      }
    }));

    toast({
      title: "Configuración de privacidad actualizada",
      description: "Tu configuración ha sido guardada"
    });
  };

  const handleSecurityChange = (key: keyof SecuritySettings, value: boolean | number) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }));

    toast({
      title: "Configuración de seguridad actualizada",
      description: "Tu configuración ha sido guardada"
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Funcionalidad no disponible",
      description: "La eliminación de cuenta requiere verificación adicional",
      variant: "destructive"
    });
  };

  return (
    <div className="container-full py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuración de Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y preferencias de cuenta
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="privacy">Privacidad</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>
                      Actualiza tu información básica y foto de perfil
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSaveProfile} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Guardar
                        </Button>
                        <Button 
                          onClick={() => {
                            setIsEditing(false);
                            setEditForm(profile);
                          }} 
                          variant="outline" 
                          size="sm"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={isEditing ? editForm.avatar : profile.avatar} />
                      <AvatarFallback className="text-lg">
                        {(isEditing ? editForm.name : profile.name).split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/80">
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{profile.name}</h3>
                    <p className="text-muted-foreground">{profile.email}</p>
                    <Badge variant="secondary" className="mt-1">
                      {user?.role === 'seller' ? 'Vendedor' : 
                       user?.role === 'admin' ? 'Administrador' : 'Comprador'}
                    </Badge>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {profile.name}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {profile.email}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        {profile.phone}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <div className="flex items-center gap-2 p-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {profile.location.city}, {profile.location.department}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground p-2">
                      {profile.bio || 'No hay biografía disponible'}
                    </p>
                  )}
                </div>

                {/* Business Information (for sellers) */}
                {user?.role === 'seller' && profile.businessInfo && (
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-4">Información del Negocio</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Nombre del negocio</Label>
                        {isEditing ? (
                          <Input
                            id="businessName"
                            value={editForm.businessInfo?.businessName || ''}
                            onChange={(e) => setEditForm(prev => ({
                              ...prev,
                              businessInfo: {
                                ...prev.businessInfo!,
                                businessName: e.target.value
                              }
                            }))}
                          />
                        ) : (
                          <div className="p-2 text-sm">{profile.businessInfo.businessName}</div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Categoría</Label>
                        {isEditing ? (
                          <Select
                            value={editForm.businessInfo?.category}
                            onValueChange={(value) => setEditForm(prev => ({
                              ...prev,
                              businessInfo: {
                                ...prev.businessInfo!,
                                category: value
                              }
                            }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Artesanías">Artesanías</SelectItem>
                              <SelectItem value="Textiles">Textiles</SelectItem>
                              <SelectItem value="Joyería">Joyería</SelectItem>
                              <SelectItem value="Decoración">Decoración</SelectItem>
                              <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="p-2 text-sm">{profile.businessInfo.category}</div>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="businessDescription">Descripción del negocio</Label>
                        {isEditing ? (
                          <Textarea
                            id="businessDescription"
                            value={editForm.businessInfo?.description || ''}
                            onChange={(e) => setEditForm(prev => ({
                              ...prev,
                              businessInfo: {
                                ...prev.businessInfo!,
                                description: e.target.value
                              }
                            }))}
                            rows={2}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground p-2">
                            {profile.businessInfo.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>
                Configura cómo y cuándo quieres recibir notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Methods */}
              <div>
                <h4 className="font-semibold mb-4">Métodos de notificación</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Correo electrónico</p>
                        <p className="text-sm text-muted-foreground">Recibir notificaciones por email</p>
                      </div>
                    </div>
                    <Switch
                      checked={profile.preferences.notifications.email}
                      onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">SMS</p>
                        <p className="text-sm text-muted-foreground">Recibir notificaciones por mensaje de texto</p>
                      </div>
                    </div>
                    <Switch
                      checked={profile.preferences.notifications.sms}
                      onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Notificaciones push</p>
                        <p className="text-sm text-muted-foreground">Recibir notificaciones en el navegador</p>
                      </div>
                    </div>
                    <Switch
                      checked={profile.preferences.notifications.push}
                      onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                    />
                  </div>
                </div>
              </div>

              {/* Notification Types */}
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Tipos de notificaciones</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Actualizaciones de pedidos</p>
                      <p className="text-sm text-muted-foreground">Estado de tus pedidos y envíos</p>
                    </div>
                    <Switch
                      checked={profile.preferences.notifications.orderUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('orderUpdates', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Promociones y ofertas</p>
                      <p className="text-sm text-muted-foreground">Descuentos y promociones especiales</p>
                    </div>
                    <Switch
                      checked={profile.preferences.notifications.promotions}
                      onCheckedChange={(checked) => handleNotificationChange('promotions', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Nuevos productos</p>
                      <p className="text-sm text-muted-foreground">Productos nuevos de tus vendedores favoritos</p>
                    </div>
                    <Switch
                      checked={profile.preferences.notifications.newProducts}
                      onCheckedChange={(checked) => handleNotificationChange('newProducts', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Privacidad</CardTitle>
              <CardDescription>
                Controla la visibilidad de tu información personal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mostrar correo electrónico</p>
                    <p className="text-sm text-muted-foreground">Otros usuarios pueden ver tu email</p>
                  </div>
                  <Switch
                    checked={profile.preferences.privacy.showEmail}
                    onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mostrar teléfono</p>
                    <p className="text-sm text-muted-foreground">Otros usuarios pueden ver tu número</p>
                  </div>
                  <Switch
                    checked={profile.preferences.privacy.showPhone}
                    onCheckedChange={(checked) => handlePrivacyChange('showPhone', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Permitir mensajes</p>
                    <p className="text-sm text-muted-foreground">Otros usuarios pueden enviarte mensajes</p>
                  </div>
                  <Switch
                    checked={profile.preferences.privacy.allowMessages}
                    onCheckedChange={(checked) => handlePrivacyChange('allowMessages', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Perfil público</p>
                    <p className="text-sm text-muted-foreground">Tu perfil es visible para todos</p>
                  </div>
                  <Switch
                    checked={profile.preferences.privacy.publicProfile}
                    onCheckedChange={(checked) => handlePrivacyChange('publicProfile', checked)}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">Preferencias generales</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Idioma</Label>
                    <Select value={profile.preferences.language} onValueChange={(value) => 
                      setProfile(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, language: value }
                      }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Moneda</Label>
                    <Select value={profile.preferences.currency} onValueChange={(value) => 
                      setProfile(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, currency: value }
                      }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                        <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="space-y-6">
            {/* Password Section */}
            <Card>
              <CardHeader>
                <CardTitle>Contraseña</CardTitle>
                <CardDescription>
                  Gestiona tu contraseña y configuraciones de seguridad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Última actualización</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(securitySettings.passwordLastChanged).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    variant="outline"
                  >
                    {isChangingPassword ? 'Cancelar' : 'Cambiar contraseña'}
                  </Button>
                </div>

                {isChangingPassword && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Contraseña actual</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nueva contraseña</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                    </div>

                    <Button onClick={handleChangePassword} className="w-full">
                      Actualizar contraseña
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Configuraciones de Seguridad</CardTitle>
                <CardDescription>
                  Protege tu cuenta con configuraciones adicionales
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Autenticación de dos factores</p>
                      <p className="text-sm text-muted-foreground">Agrega una capa extra de seguridad</p>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) => handleSecurityChange('twoFactorEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Notificaciones de inicio de sesión</p>
                      <p className="text-sm text-muted-foreground">Recibe alertas cuando alguien acceda a tu cuenta</p>
                    </div>
                  </div>
                  <Switch
                    checked={securitySettings.loginNotifications}
                    onCheckedChange={(checked) => handleSecurityChange('loginNotifications', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tiempo de expiración de sesión (minutos)</Label>
                  <Select 
                    value={securitySettings.sessionTimeout.toString()} 
                    onValueChange={(value) => handleSecurityChange('sessionTimeout', parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                      <SelectItem value="480">8 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
                <CardDescription>
                  Acciones irreversibles que afectan permanentemente tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleDeleteAccount}
                  variant="destructive" 
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar cuenta permanentemente
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Esta acción no se puede deshacer. Todos tus datos serán eliminados.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
