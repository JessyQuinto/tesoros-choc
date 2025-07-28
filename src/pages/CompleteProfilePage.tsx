import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { RegistrationDataManager } from '@/lib/registration-manager';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, User } from 'lucide-react';

const profileSchema = z.object({
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(500, 'La biografía no puede exceder 500 caracteres').optional(),
});

export function CompleteProfilePage() {
  const { completeRegistration, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSkipping, setIsSkipping] = useState(false);
  const [tempData, setTempData] = useState(RegistrationDataManager.get());

  useEffect(() => {
    const data = RegistrationDataManager.get();
    if (!data || !data.role) {
      // No hay datos completos, redirigir al inicio
      navigate('/login');
      return;
    }
    setTempData(data);
  }, [navigate]);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phone: '',
      address: '',
      bio: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!tempData) {
      toast({
        title: 'Error',
        description: 'No se encontraron datos de registro.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Agregar información adicional a los datos temporales
      const completeData = {
        ...tempData,
        phone: values.phone,
        address: values.address,
        bio: values.bio,
      };

      // AQUÍ ES DONDE FINALMENTE CREAMOS LA CUENTA EN FIREBASE
      const success = await completeRegistration(completeData);
      
      if (success) {
        // Limpiar datos temporales
        RegistrationDataManager.clear();
        
        toast({
          title: '¡Cuenta creada exitosamente!',
          description: tempData.role === 'seller' 
            ? 'Tu cuenta como vendedor ha sido creada. Necesitas aprobación del administrador.'
            : '¡Bienvenido a Tesoros Chocó!',
        });
        
        // Redirigir según el rol
        if (tempData.role === 'seller') {
          navigate('/pending-approval');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error completing registration:', error);
      toast({
        title: 'Error al crear la cuenta',
        description: 'Ocurrió un error al crear tu cuenta. Intenta de nuevo.',
        variant: 'destructive',
      });
    }
  };

  const handleSkip = async () => {
    if (!tempData) {
      toast({
        title: 'Error',
        description: 'No se encontraron datos de registro.',
        variant: 'destructive',
      });
      return;
    }

    setIsSkipping(true);
    try {
      // CREAR CUENTA SIN INFORMACIÓN ADICIONAL
      const success = await completeRegistration(tempData);
      
      if (success) {
        // Limpiar datos temporales
        RegistrationDataManager.clear();
        
        toast({
          title: '¡Cuenta creada!',
          description: 'Puedes completar tu información más tarde desde configuraciones.',
        });
        
        // Redirigir según el rol
        if (tempData.role === 'seller') {
          navigate('/pending-approval');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error skipping profile:', error);
      toast({
        title: 'Error al crear la cuenta',
        description: 'Ocurrió un error al crear tu cuenta. Intenta de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsSkipping(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Completa tu perfil
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Agrega información adicional para personalizar tu experiencia
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Información adicional</CardTitle>
          <CardDescription>
            Esta información es opcional y puedes completarla más tarde.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+57 300 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu dirección" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografía</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Cuéntanos un poco sobre ti..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-3 mt-6">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Guardando...' : 'Completar perfil'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleSkip}
                  disabled={isSkipping}
                  className="w-full"
                >
                  {isSkipping ? 'Omitiendo...' : 'Omitir por ahora'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        Siempre puedes actualizar esta información desde tu perfil
      </p>
    </div>
  );
}
