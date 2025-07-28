import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/user.types';
import { Loader2, User, Mail, Lock, Phone, MapPin, Store, FileText, Sparkles } from 'lucide-react';

export const Register = () => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  const [isLoading, setIsLoading] = useState(false);
  const { register, error, clearError } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    businessName: '',
    bio: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    const { name, email, password, confirmPassword } = formData;
    return name && email && password && confirmPassword && password === confirmPassword && password.length >= 6;
  };

  const validateStep3 = () => {
    if (selectedRole === 'buyer') {
      return true; // Optional fields for buyers
    }
    // Required fields for sellers
    return formData.phone && formData.address && formData.businessName && formData.bio;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep1() || !validateStep3()) {
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        businessName: selectedRole === 'seller' ? formData.businessName : undefined,
        bio: selectedRole === 'seller' ? formData.bio : undefined
      });
      
      // Show success message about email verification
      toast({
        title: "¡Cuenta creada exitosamente!",
        description: `Hemos enviado un correo de verificación a ${formData.email}. Por favor, verifica tu email antes de iniciar sesión.`,
      });
      
      // Redirect to email verification page
      navigate('/verify-email');
    } catch (err) {
      // Error handled by context
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre completo</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="name"
            placeholder="Tu nombre completo"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirma tu contraseña"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      {formData.password !== formData.confirmPassword && formData.confirmPassword && (
        <Alert variant="destructive">
          <AlertDescription>Las contraseñas no coinciden</AlertDescription>
        </Alert>
      )}

      <Button 
        onClick={() => setStep(2)} 
        className="w-full btn-primary h-11"
        disabled={!validateStep1()}
      >
        Continuar
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">¿Cómo quieres usar la plataforma?</h3>
        <p className="text-sm text-muted-foreground">Selecciona el tipo de cuenta que necesitas</p>
      </div>

      <RadioGroup value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="buyer" id="buyer" />
            <Label htmlFor="buyer" className="flex-1 cursor-pointer">
              <div>
                <h4 className="font-medium">Comprador</h4>
                <p className="text-sm text-muted-foreground">Explora y compra productos artesanales únicos</p>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="seller" id="seller" />
            <Label htmlFor="seller" className="flex-1 cursor-pointer">
              <div>
                <h4 className="font-medium">Vendedor</h4>
                <p className="text-sm text-muted-foreground">Vende tus productos artesanales al mundo</p>
              </div>
            </Label>
          </div>
        </div>
      </RadioGroup>

      <div className="flex gap-3">
        <Button 
          onClick={() => setStep(1)} 
          variant="outline" 
          className="flex-1"
        >
          Atrás
        </Button>
        <Button 
          onClick={() => setStep(3)} 
          className="flex-1 btn-primary"
        >
          Continuar
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">
          {selectedRole === 'buyer' ? 'Información adicional (opcional)' : 'Información de tu negocio'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {selectedRole === 'buyer' 
            ? 'Puedes completar esta información más tarde' 
            : 'Esta información es necesaria para aprobar tu cuenta'}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono {selectedRole === 'seller' && '*'}</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            placeholder="+57 300 123 4567"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="pl-10"
            required={selectedRole === 'seller'}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección {selectedRole === 'seller' && '*'}</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="address"
            placeholder="Tu dirección completa"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="pl-10"
            required={selectedRole === 'seller'}
          />
        </div>
      </div>

      {selectedRole === 'seller' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="businessName">Nombre de tu tienda *</Label>
            <div className="relative">
              <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="businessName"
                placeholder="Nombre de tu negocio"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Descripción de tu negocio *</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="bio"
                placeholder="Describe tus productos y experiencia..."
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="pl-10 min-h-[100px]"
                required
              />
            </div>
          </div>
        </>
      )}

      <div className="flex gap-3">
        <Button 
          onClick={() => setStep(2)} 
          variant="outline" 
          className="flex-1"
        >
          Atrás
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex-1 btn-primary h-11"
          disabled={isLoading || !validateStep3()}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          {selectedRole === 'buyer' ? 'Crear cuenta' : 'Enviar solicitud'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gradient">Únete a nosotros</CardTitle>
            <CardDescription>
              Paso {step} de 3 - {step === 1 ? 'Información básica' : step === 2 ? 'Tipo de cuenta' : 'Información adicional'}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <div className="text-center border-t pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              ¿Ya tienes cuenta?
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};