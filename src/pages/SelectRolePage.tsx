import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ShoppingCart, Store, ArrowRight } from 'lucide-react';

type Role = 'buyer' | 'seller';

export function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const { createUserProfile, isLoading, firebaseUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRoleSelection = async () => {
    if (!selectedRole || !firebaseUser) {
      toast({
        title: 'Error',
        description: 'Por favor, selecciona un rol válido',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create complete user profile
      const userProfileData = {
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || '',
        role: selectedRole,
        isApproved: selectedRole === 'buyer',
        avatar: firebaseUser.photoURL,
        needsRoleSelection: false,
      };

      const success = await createUserProfile(userProfileData);
      
      if (success) {
        toast({
          title: '¡Perfil creado!',
          description: selectedRole === 'seller' 
            ? 'Tu cuenta como vendedor ha sido creada. Necesitas aprobación del administrador para publicar productos.'
            : 'Tu cuenta como comprador ha sido creada. ¡Bienvenido a Tesoros Chocó!',
        });
        
        // Redirect based on role
        if (selectedRole === 'seller') {
          navigate('/pending-approval');
        } else {
          navigate('/complete-profile');
        }
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: 'Error al crear el perfil',
        description: 'Ocurrió un error al configurar tu cuenta. Intenta de nuevo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          ¡Bienvenido, {firebaseUser?.displayName || 'nuevo usuario'}!
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          Para personalizar tu experiencia, elige cómo quieres empezar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <RoleCard
          role="buyer"
          title="Soy Comprador"
          description="Explora productos únicos, guarda tus favoritos y compra con seguridad."
          icon={<ShoppingCart className="h-12 w-12 text-blue-500" />}
          isSelected={selectedRole === 'buyer'}
          onSelect={() => setSelectedRole('buyer')}
        />
        <RoleCard
          role="seller"
          title="Soy Vendedor"
          description="Publica tus productos, gestiona tu inventario y alcanza a nuevos clientes."
          icon={<Store className="h-12 w-12 text-purple-500" />}
          isSelected={selectedRole === 'seller'}
          onSelect={() => setSelectedRole('seller')}
        />
      </div>

      <div className="mt-12 w-full max-w-xs">
        <Button
          onClick={handleRoleSelection}
          disabled={!selectedRole || isLoading}
          className="w-full text-lg py-6"
          size="lg"
        >
          {isLoading ? 'Guardando...' : 'Continuar'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

interface RoleCardProps {
  role: Role;
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
}

function RoleCard({ title, description, icon, isSelected, onSelect }: RoleCardProps) {
  return (
    <Card
      onClick={onSelect}
      className={cn(
        'cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105',
        isSelected ? 'ring-2 ring-blue-500 border-blue-500 shadow-lg' : 'hover:shadow-md'
      )}
    >
      <CardHeader className="items-center text-center">
        {icon}
        <CardTitle className="text-2xl font-semibold mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center text-base">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
