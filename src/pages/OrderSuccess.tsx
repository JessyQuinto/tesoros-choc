import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Download, MessageCircle } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state || {};
  
  const {
    orderNumber = `TC-${Date.now()}`,
    total = 0,
    items = 0
  } = orderData;

  useEffect(() => {
    // If no order data, redirect to home
    if (!location.state) {
      navigate('/');
    }
  }, [location.state, navigate]);

  return (
    <div className="min-h-screen bg-background"><div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-choco-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-choco-green" />
              </div>
              
              <h1 className="text-3xl font-bold mb-2">¡Pedido Confirmado!</h1>
              <p className="text-muted-foreground mb-6">
                Tu pedido ha sido procesado exitosamente. Recibirás un email de confirmación en breve.
              </p>

              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="text-sm text-muted-foreground mb-1">Número de pedido</div>
                <div className="text-xl font-bold text-primary">{orderNumber}</div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6 text-left">
                <div>
                  <div className="text-sm text-muted-foreground">Total pagado</div>
                  <div className="text-lg font-bold">${total.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Productos</div>
                  <div className="text-lg font-bold">{items} artículos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">¿Qué sigue?</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Confirmación por email</h3>
                    <p className="text-sm text-muted-foreground">
                      Recibirás un email con los detalles de tu pedido y el número de seguimiento.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Preparación del pedido</h3>
                    <p className="text-sm text-muted-foreground">
                      Los artesanos comenzarán a preparar tu pedido. Esto puede tomar 1-2 días.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Envío</h3>
                    <p className="text-sm text-muted-foreground">
                      Tu pedido será enviado y recibirás el código de seguimiento.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-choco-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-choco-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Entrega</h3>
                    <p className="text-sm text-muted-foreground">
                      Tiempo estimado: 5-7 días hábiles desde la confirmación.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/buyer-dashboard')}
              className="flex items-center gap-2 h-16"
            >
              <Package className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Ver mis pedidos</div>
                <div className="text-xs text-muted-foreground">Seguimiento y historial</div>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 h-16"
            >
              <Package className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Seguir comprando</div>
                <div className="text-xs text-muted-foreground">Explorar más productos</div>
              </div>
            </Button>
          </div>

          {/* Support */}
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-bold mb-2">¿Necesitas ayuda?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Nuestro equipo está aquí para ayudarte con cualquier pregunta sobre tu pedido.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat en vivo
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar factura
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;