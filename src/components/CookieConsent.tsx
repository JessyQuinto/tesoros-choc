import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Cookie, GraduationCap, Shield } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya aceptó las cookies
    const hasAccepted = localStorage.getItem('cookiesAccepted');
    if (!hasAccepted) {
      // Mostrar después de 2 segundos
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleDecline}
      />
      
      {/* Tarjeta de cookies profesional */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <Card className="w-full max-w-lg mx-auto shadow-xl border-0 pointer-events-auto bg-white">
          <CardContent className="p-8">
            {/* Botón cerrar */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              onClick={handleDecline}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* Encabezado */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[#e87c30] p-3 rounded-lg">
                <Cookie className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#333333]">
                  Política de Cookies
                </h3>
                <p className="text-sm text-[#666666]">Configuración de privacidad</p>
              </div>
            </div>

            {/* Contenido principal */}
            <div className="mb-6 space-y-4">
              <div className="bg-[#f9f9f9] p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-[#333333] leading-relaxed">
                  Utilizamos cookies para mejorar tu experiencia de navegación, 
                  personalizar contenido y analizar nuestro tráfico para ofrecerte 
                  <span className="font-medium"> la mejor experiencia posible</span>.
                </p>
              </div>
              
              {/* Mensaje académico */}
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-blue-800 mb-2">
                      Proyecto Académico SENA
                    </h4>
                    <p className="text-sm text-[#333333] mb-3">
                      Este proyecto hace parte del <span className="font-semibold">Tecnólogo Análisis y Desarrollo de Software</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-[#e87c30] text-white text-xs font-medium rounded-full">
                        Ficha: 2879645
                      </span>
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                        Grupo #4
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Button
                onClick={handleAccept}
                className="flex-1 bg-[#e87c30] text-white hover:bg-orange-600 font-medium rounded-full transition-colors"
              >
                <Cookie className="h-4 w-4 mr-2" />
                Aceptar Cookies
              </Button>
              <Button
                variant="outline"
                onClick={handleDecline}
                className="flex-1 border-gray-300 text-[#333333] hover:bg-gray-50 font-medium rounded-full"
              >
                <X className="h-4 w-4 mr-2" />
                Rechazar
              </Button>
            </div>

            {/* Información adicional */}
            <div className="flex items-center justify-center gap-2 text-xs text-[#666666] bg-gray-50 py-2 px-4 rounded-lg">
              <Shield className="h-3 w-3 text-green-600" />
              <span>Navegación segura • Datos protegidos • Análisis anónimo</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CookieConsent;
