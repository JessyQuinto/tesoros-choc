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
import { 
  Loader2, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Store, 
  FileText, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  Mountain,
  ShoppingBag,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Register = () => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    return formData.phone && 
           formData.address && 
           formData.businessName && 
           formData.bio && 
           formData.bio.length >= 50;
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
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold text-foreground">
          Nombre completo
        </Label>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
          <Input
            id="name"
            placeholder="Tu nombre completo"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="pl-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-foreground">
          Correo electrónico
        </Label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="pl-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-semibold text-foreground">
          Contraseña
        </Label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="pl-12 pr-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
          Confirmar contraseña
        </Label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirma tu contraseña"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="pl-12 pr-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {formData.password !== formData.confirmPassword && formData.confirmPassword && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Las contraseñas no coinciden</AlertDescription>
        </Alert>
      )}

      {formData.password && formData.password.length < 6 && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>La contraseña debe tener al menos 6 caracteres</AlertDescription>
        </Alert>
      )}

      <Button 
        onClick={() => setStep(2)} 
        className="w-full h-12 bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none group"
        disabled={!validateStep1()}
      >
        <span>Continuar</span>
        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          ¿Cómo quieres participar?
        </h3>
        <p className="text-muted-foreground">
          Selecciona el tipo de cuenta que mejor se adapte a tus necesidades
        </p>
      </div>

      <RadioGroup value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
        <div className="space-y-4">
          <Card className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${
            selectedRole === 'buyer' 
              ? 'border-primary bg-primary/5 shadow-md transform scale-[1.02]' 
              : 'border-border/50 hover:border-primary/30 hover:bg-muted/30'
          }`}>
            <CardContent className="p-6">
              <RadioGroupItem value="buyer" id="buyer" className="absolute top-6 right-6" />
              <Label htmlFor="buyer" className="cursor-pointer block">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${selectedRole === 'buyer' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'} transition-colors duration-200`}>
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-lg font-semibold">Comprador</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Descubre y compra productos artesanales únicos del Chocó. 
                      Apoya a los artesanos locales y lleva contigo un pedazo de Colombia.
                    </p>
                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Acceso inmediato</span>
                    </div>
                  </div>
                </div>
              </Label>
            </CardContent>
          </Card>

          <Card className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${
            selectedRole === 'seller' 
              ? 'border-primary bg-primary/5 shadow-md transform scale-[1.02]' 
              : 'border-border/50 hover:border-primary/30 hover:bg-muted/30'
          }`}>
            <CardContent className="p-6">
              <RadioGroupItem value="seller" id="seller" className="absolute top-6 right-6" />
              <Label htmlFor="seller" className="cursor-pointer block">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${selectedRole === 'seller' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'} transition-colors duration-200`}>
                    <Store className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-lg font-semibold">Vendedor</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Comparte tu arte y tradiciones con el mundo. 
                      Vende tus productos artesanales y conecta con compradores globales.
                    </p>
                    <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
                      <Users className="h-4 w-4" />
                      <span>Requiere aprobación</span>
                    </div>
                  </div>
                </div>
              </Label>
            </CardContent>
          </Card>
        </div>
      </RadioGroup>

      <div className="flex gap-3">
        <Button 
          onClick={() => setStep(1)} 
          variant="outline" 
          className="flex-1 h-12 rounded-xl border-border/50 hover:bg-muted/50 transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Atrás
        </Button>
        <Button 
          onClick={() => setStep(3)} 
          className="flex-1 h-12 bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group"
        >
          <span>Continuar</span>
          <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <h3 className="text-xl font-bold">
          {selectedRole === 'buyer' ? 'Información adicional' : 'Información de tu negocio'}
        </h3>
        <p className="text-muted-foreground text-sm">
          {selectedRole === 'buyer' 
            ? 'Opcional - Puedes completar esta información más tarde' 
            : 'Requerida para aprobar tu cuenta como vendedor'}
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
            Teléfono {selectedRole === 'seller' && <span className="text-destructive">*</span>}
          </Label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            <Input
              id="phone"
              placeholder="+57 300 123 4567"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="pl-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
              required={selectedRole === 'seller'}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-semibold text-foreground">
            Dirección {selectedRole === 'seller' && <span className="text-destructive">*</span>}
          </Label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
            <Input
              id="address"
              placeholder="Tu dirección completa"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="pl-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
              required={selectedRole === 'seller'}
            />
          </div>
        </div>

        {selectedRole === 'seller' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-sm font-semibold text-foreground">
                Nombre de tu tienda <span className="text-destructive">*</span>
              </Label>
              <div className="relative group">
                <Store className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                <Input
                  id="businessName"
                  placeholder="Ej: Artesanías del Pacífico"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="pl-12 h-12 bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-semibold text-foreground">
                Descripción de tu negocio <span className="text-destructive">*</span>
              </Label>
              <div className="relative group">
                <FileText className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
                <Textarea
                  id="bio"
                  placeholder="Describe tus productos, técnicas artesanales y experiencia... (mínimo 50 caracteres)"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="pl-12 pt-4 min-h-[120px] bg-background/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20 transition-all duration-200 resize-none"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {formData.bio.length}/50 caracteres mínimos
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-3">
        <Button 
          onClick={() => setStep(2)} 
          variant="outline" 
          className="flex-1 h-12 rounded-xl border-border/50 hover:bg-muted/50 transition-all duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Atrás
        </Button>
        <Button 
          onClick={handleSubmit}
          className="flex-1 h-12 bg-gradient-to-r from-primary via-secondary to-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none group"
          disabled={isLoading || !validateStep3()}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <CheckCircle2 className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
          )}
          {isLoading 
            ? 'Creando cuenta...' 
            : selectedRole === 'buyer' 
              ? 'Crear cuenta' 
              : 'Enviar solicitud'
          }
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/3 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-lg relative z-10 backdrop-blur-sm bg-card/80 border-border/20 shadow-2xl">
        <CardHeader className="text-center space-y-6 pb-8">
          {/* Logo con animación mejorada */}
          <div className="mx-auto relative">
            <div className="w-20 h-20 bg-gradient-to-br from-primary via-secondary to-accent rounded-3xl flex items-center justify-center shadow-xl rotate-3 transition-transform duration-500 hover:rotate-6 hover:scale-110">
              <Mountain className="w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-accent to-primary rounded-full animate-pulse shadow-lg">
              <Sparkles className="w-4 h-4 text-white m-1" />
            </div>
          </div>
          
          <div className="space-y-3">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              ¡Únete a nosotros!
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              {step === 1 && 'Comencemos creando tu cuenta'}
              {step === 2 && 'Elige tu tipo de cuenta'}
              {step === 3 && (selectedRole === 'buyer' ? 'Información adicional' : 'Completa tu perfil de vendedor')}
            </CardDescription>
          </div>

          {/* Indicador de progreso mejorado */}
          <div className="flex items-center justify-center space-x-2 pt-2">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step >= stepNum
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > stepNum ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    stepNum
                  )}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`w-8 h-1 mx-2 rounded-full transition-all duration-300 ${
                      step > stepNum ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {error && (
            <Alert variant="destructive" className="border-destructive/50 bg-destructive/5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
            </Alert>
          )}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground font-medium">
                ¿Ya tienes cuenta?
              </span>
            </div>
          </div>
          
          <Link to="/login">
            <Button variant="outline" className="w-full h-12 border-primary/20 text-primary hover:bg-primary/5 rounded-xl font-semibold transition-all duration-300 hover:border-primary/40">
              Iniciar sesión
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};