import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { GoogleIcon } from '@/components/ui/icons';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmar contraseña es requerido'),
  role: z.enum(['buyer', 'seller'], {
    required_error: 'Debes seleccionar un tipo de cuenta',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [searchParams] = useSearchParams();
  const { login, register, loginWithGoogle, error, isLoading, clearError } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  // Obtener el rol preseleccionado de los parámetros de URL
  const preselectedRole = searchParams.get('role') as UserRole || 'buyer';

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { 
      name: '', 
      email: '', 
      password: '', 
      confirmPassword: '',
      role: (preselectedRole === 'buyer' || preselectedRole === 'seller') ? preselectedRole : 'buyer'
    },
  });

  // Limpiar errores cuando la pestaña cambia
  useEffect(() => {
    clearError();
    // Si viene con un rol preseleccionado, activar la pestaña de registro
    if (searchParams.get('role')) {
      setActiveTab('register');
    }
  }, [activeTab, clearError, searchParams]);

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    await login(values.email, values.password);
  };

  const onRegister = async (values: z.infer<typeof registerSchema>) => {
    const success = await register(values.email, values.password, values.name, values.role);
    
    if (success) {
      toast({
        title: "¡Cuenta creada!",
        description: values.role === 'seller' 
          ? "Tu cuenta se creó exitosamente. Como vendedor, necesitas aprobación del administrador para publicar productos."
          : "Tu cuenta se creó exitosamente. ¡Bienvenido a Tesoros Chocó!"
      });
    }
  };
  
  const onGoogleSignIn = async () => {
    // Si está en la pestaña de registro, necesitamos el rol
    if (activeTab === 'register') {
      const selectedRole = registerForm.getValues('role');
      if (!selectedRole) {
        toast({
          title: 'Selecciona un tipo de cuenta',
          description: 'Debes elegir si quieres ser comprador o vendedor antes de continuar con Google.',
          variant: 'destructive',
        });
        return;
      }
      await loginWithGoogle(true, selectedRole);
    } else {
      // Es un login normal
      await loginWithGoogle(false);
    }
  };
  
  // Efecto para manejar la redirección post-autenticación
  useEffect(() => {
    if (!isLoading && !error && (loginForm.formState.isSubmitSuccessful || registerForm.formState.isSubmitSuccessful)) {
        toast({ title: '¡Autenticación exitosa!' });
        navigate(from, { replace: true });
    }
  }, [isLoading, error, navigate, from, loginForm.formState.isSubmitSuccessful, registerForm.formState.isSubmitSuccessful, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md p-4 sm:p-0">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Ingresar</TabsTrigger>
          <TabsTrigger value="register">Crear Cuenta</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Iniciar Sesión</CardTitle>
              <CardDescription>Accede a tu cuenta para continuar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <FormField control={loginForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="tu@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={loginForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Ingresando...' : 'Ingresar'}
                  </Button>
                </form>
              </Form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={onGoogleSignIn} disabled={isLoading}>
                <GoogleIcon className="mr-2 h-4 w-4" /> Iniciar sesión con Google
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Crear Cuenta</CardTitle>
              <CardDescription>Es rápido y fácil. Comienza ahora.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <FormField control={registerForm.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl><Input placeholder="Juan Pérez" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={registerForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="tu@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={registerForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={registerForm.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Contraseña</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={registerForm.control} name="role" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Tipo de cuenta</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="buyer" id="buyer" />
                            <Label htmlFor="buyer" className="flex-1 cursor-pointer">
                              <div>
                                <p className="font-medium">Comprador</p>
                                <p className="text-sm text-muted-foreground">Busca y compra productos artesanales</p>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="seller" id="seller" />
                            <Label htmlFor="seller" className="flex-1 cursor-pointer">
                              <div>
                                <p className="font-medium">Vendedor</p>
                                <p className="text-sm text-muted-foreground">Vende tus productos artesanales (requiere aprobación)</p>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                </form>
              </Form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">O regístrate con</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={onGoogleSignIn} disabled={isLoading}>
                <GoogleIcon className="mr-2 h-4 w-4" /> Crear cuenta con Google
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
