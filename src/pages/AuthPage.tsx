import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { GoogleIcon } from '@/components/ui/icons';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const { login, register, loginWithGoogle, error, isLoading, clearError } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  // Limpiar errores cuando la pestaña cambia
  useEffect(() => {
    clearError();
  }, [activeTab, clearError]);

  const onLogin = async (values: z.infer<typeof loginSchema>) => {
    await login(values);
  };

  const onRegister = async (values: z.infer<typeof registerSchema>) => {
    // El rol por defecto es 'buyer' ya que el usuario definirá su rol real en el siguiente paso.
    await register({ ...values, role: 'buyer' });
  };
  
  const onGoogleSignIn = async () => {
    await loginWithGoogle();
  };
  
  // Efecto para manejar la redirección post-autenticación
  useEffect(() => {
    if (!isLoading && !error && (loginForm.formState.isSubmitSuccessful || registerForm.formState.isSubmitSuccessful)) {
        toast({ title: '¡Autenticación exitosa!' });
        navigate(from, { replace: true });
    }
  }, [isLoading, error, navigate, from, loginForm.formState.isSubmitSuccessful, registerForm.formState.isSubmitSuccessful]);

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
                <GoogleIcon className="mr-2 h-4 w-4" /> Google
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
                <GoogleIcon className="mr-2 h-4 w-4" /> Google
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
