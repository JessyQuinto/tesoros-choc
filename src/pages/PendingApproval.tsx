import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Clock, CheckCircle, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PendingApproval = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-8">
              <div className="mx-auto w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-12 h-12 text-amber-600" />
              </div>
              
              <CardTitle className="text-3xl font-bold text-foreground mb-2">
                ¡Registro Exitoso!
              </CardTitle>
              
              <CardDescription className="text-lg">
                Tu solicitud para ser vendedor está siendo revisada
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <div className="bg-muted/50 rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Estado de tu Solicitud
                </h3>
                
                <div className="space-y-4 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Registro completado</p>
                      <p className="text-sm text-muted-foreground">Tu cuenta ha sido creada exitosamente</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 animate-pulse"></div>
                    <div>
                      <p className="font-medium">Revisión en proceso</p>
                      <p className="text-sm text-muted-foreground">Nuestro equipo está verificando tu información</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-muted-foreground">Aprobación pendiente</p>
                      <p className="text-sm text-muted-foreground">Te notificaremos cuando tu cuenta sea aprobada</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">¿Qué puedes hacer mientras tanto?</h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Explora Productos</h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Conoce qué tipo de productos venden otros artesanos
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/products')}
                      className="w-full"
                    >
                      Ver Productos
                    </Button>
                  </Card>
                  
                  <Card className="p-4">
                    <h5 className="font-medium mb-2">Prepara tu Inventario</h5>
                    <p className="text-sm text-muted-foreground mb-3">
                      Organiza fotos y descripciones de tus productos
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/profile/settings')}
                      className="w-full"
                    >
                      Mi Perfil
                    </Button>
                  </Card>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4">¿Necesitas ayuda?</h4>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    soporte@tesoroschoco.com
                  </Button>
                  
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    +57 300 123 4567
                  </Button>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Tiempo estimado:</strong> La revisión generalmente toma entre 24-48 horas hábiles.
                  Te enviaremos un correo electrónico a <strong>{user?.email}</strong> cuando tu cuenta sea aprobada.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PendingApproval;
