import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu correo electrónico",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setEmailSent(true);
      toast({
        title: "Email enviado",
        description: "Revisa tu bandeja de entrada para restablecer tu contraseña",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo enviar el email de recuperación",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center space-x-2">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#e87c30">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-xl font-light tracking-wide text-[#333333]">tesoros</span>
            </Link>
          </div>

          <Card className="bg-white rounded-lg shadow-md border-0">
            <CardHeader className="text-center px-8 pt-8">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-semibold text-[#333333] mb-2">Email Enviado</CardTitle>
              <CardDescription className="text-[#666666]">
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="px-8">
              <div className="bg-[#f2f2f2] p-4 rounded-lg text-sm text-[#666666]">
                <p className="mb-2">• Revisa tu bandeja de entrada</p>
                <p className="mb-2">• También verifica la carpeta de spam</p>
                <p>• El enlace expira en 24 horas</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
              <Link to="/auth" className="w-full">
                <Button 
                  className="w-full bg-[#e87c30] text-white rounded-full px-4 py-3 hover:bg-orange-600 font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Login
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center space-x-2">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="#e87c30">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span className="text-xl font-light tracking-wide text-[#333333]">tesoros</span>
          </Link>
        </div>

        <Card className="bg-white rounded-lg shadow-md border-0">
          <CardHeader className="text-center px-8 pt-8">
            <CardTitle className="text-2xl font-semibold text-[#333333] mb-2">Recuperar Contraseña</CardTitle>
            <CardDescription className="text-[#666666]">
              Ingresa tu email para recibir un enlace de recuperación
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-8">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#333333] font-medium">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-white border border-gray-300 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#e87c30] focus:border-[#e87c30] transition-colors"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 px-8 pb-8">
              <Button 
                type="submit" 
                className="w-full bg-[#e87c30] text-white rounded-full px-4 py-3 hover:bg-orange-600 font-medium transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Enlace
                  </>
                )}
              </Button>
              
              <Link to="/auth" className="w-full">
                <Button 
                  variant="outline"
                  className="w-full border-gray-300 text-[#333333] hover:bg-gray-50 font-medium rounded-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Login
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
