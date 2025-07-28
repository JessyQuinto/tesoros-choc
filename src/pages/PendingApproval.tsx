import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, CheckCircle, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PendingApproval = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-background to-orange-50 p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-amber-600">Solicitud Enviada</CardTitle>
            <CardDescription>Tu cuenta está pendiente de aprobación</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-800 mb-2">¡Gracias por tu solicitud!</h3>
            <p className="text-sm text-amber-700 leading-relaxed">
              Hemos recibido tu solicitud para convertirte en vendedor en <strong>Tesoros del Chocó</strong>. 
              Nuestro equipo revisará tu información y te notificaremos por correo electrónico una vez 
              que tu cuenta sea aprobada.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                <CheckCircle className="w-3 h-3 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Información recibida</h4>
                <p className="text-xs text-muted-foreground">Hemos guardado todos tus datos correctamente</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mt-0.5">
                <Clock className="w-3 h-3 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-sm">En revisión</h4>
                <p className="text-xs text-muted-foreground">Nuestro equipo está revisando tu solicitud</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center mt-0.5">
                <Mail className="w-3 h-3 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Notificación</h4>
                <p className="text-xs text-muted-foreground">Te enviaremos un correo cuando esté lista</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">¿Qué puedes hacer mientras tanto?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Explorar productos de otros artesanos</li>
              <li>• Familiarizarte con la plataforma</li>
              <li>• Preparar las fotos de tus productos</li>
              <li>• Escribir descripciones detalladas</li>
            </ul>
          </div>

          <div className="border-t pt-4 space-y-3">
            <Link to="/">
              <Button className="w-full btn-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Explorar productos
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={logout}
            >
              Cerrar sesión
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              ¿Tienes preguntas? Escríbenos a{' '}
              <a href="mailto:soporte@tesoroschoco.com" className="text-primary hover:underline">
                soporte@tesoroschoco.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};