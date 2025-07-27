import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { AuthUser } from '@/services/auth.service';

interface RoleSelectorProps {
  firebaseUser: AuthUser;
  onComplete: (role: 'buyer' | 'seller') => void; // Solo permitir buyer y seller
}

export const RoleSelector = ({ firebaseUser, onComplete }: RoleSelectorProps) => {
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller'>('buyer'); // Solo buyer/seller
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validación de seguridad - solo permitir buyer y seller
      if (selectedRole !== 'buyer' && selectedRole !== 'seller') {
        toast({
          title: "Error",
          description: "Rol no válido seleccionado",
          variant: "destructive"
        });
        return;
      }

      // Actualizar el usuario con el rol seleccionado
      updateUser({ 
        role: selectedRole, 
        needsRoleSelection: false // Importante: marcar como completado
      });
      
      toast({
        title: "¡Perfil completado!",
        description: `Tu cuenta se configuró como ${selectedRole === 'buyer' ? 'Comprador' : 'Vendedor'}`,
      });

      onComplete(selectedRole);

      // Redireccionar según el rol
      switch (selectedRole) {
        case 'buyer':
          navigate('/buyer-dashboard');
          break;
        case 'seller':
          navigate('/seller-dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar el perfil",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white rounded-lg shadow-md border-0">
          <CardHeader className="text-center px-8 pt-8">
            <CardTitle className="text-2xl font-semibold text-[#333333] mb-2">
              Completa tu Perfil
            </CardTitle>
            <CardDescription className="text-[#666666]">
              ¡Hola {firebaseUser?.displayName || firebaseUser?.email}! 
              Selecciona tu tipo de cuenta para empezar a usar la plataforma
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-8 pb-8">
              <div className="space-y-4">
                <Label className="text-[#333333] font-medium text-base">¿Cómo planeas usar Tesoros del Chocó?</Label>
                
                <RadioGroup value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'buyer' | 'seller')}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors">
                      <RadioGroupItem value="buyer" id="buyer" />
                      <Label htmlFor="buyer" className="flex-1 cursor-pointer">
                        <div className="font-medium text-green-600">🛒 Comprador</div>
                        <div className="text-sm text-[#666666]">Quiero explorar y comprar productos del Chocó</div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors">
                      <RadioGroupItem value="seller" id="seller" />
                      <Label htmlFor="seller" className="flex-1 cursor-pointer">
                        <div className="font-medium text-[#e87c30]">🏪 Vendedor</div>
                        <div className="text-sm text-[#666666]">Quiero vender mis productos artesanales</div>
                      </Label>
                    </div>
                    
                    {/* Nota: Rol de administrador removido - solo cuentas predefinidas */}
                  </div>
                </RadioGroup>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#e87c30] text-white rounded-full px-4 py-3 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 font-medium transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Configurando perfil...
                  </>
                ) : (
                  'Continuar'
                )}
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};
