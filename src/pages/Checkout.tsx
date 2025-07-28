import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  MapPin, 
  Shield, 
  ArrowLeft, 
  Wallet,
  Smartphone
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    department: '',
    postalCode: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const shippingCost = totalPrice > 100000 ? 0 : 8000;
  const totalWithShipping = totalPrice + shippingCost;

  const handleInputChange = (field: string, value: string, section: 'shipping' | 'payment') => {
    if (section === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [field]: value }));
    } else {
      setPaymentInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    const requiredShipping = ['fullName', 'phone', 'address', 'city', 'department'];
    const missingShipping = requiredShipping.filter(field => !shippingInfo[field as keyof typeof shippingInfo]);
    
    if (missingShipping.length > 0) {
      toast({
        title: "Información incompleta",
        description: "Por favor completa todos los campos de envío",
        variant: "destructive"
      });
      return false;
    }

    if (paymentMethod === 'credit_card') {
      const requiredPayment = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
      const missingPayment = requiredPayment.filter(field => !paymentInfo[field as keyof typeof paymentInfo]);
      
      if (missingPayment.length > 0) {
        toast({
          title: "Información de pago incompleta",
          description: "Por favor completa todos los campos de la tarjeta",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Clear cart after successful order
      clearCart();
      
      toast({
        title: "¡Pedido confirmado!",
        description: "Tu pedido ha sido procesado exitosamente. Recibirás un email de confirmación."
      });

      // Redirect to success page or order confirmation
      navigate('/order-success', { 
        state: { 
          orderNumber: `TC-${Date.now()}`,
          total: totalWithShipping,
          items: items.length
        }
      });
      
    } catch (error) {
      toast({
        title: "Error en el pago",
        description: "Hubo un problema procesando tu pago. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || user.role !== 'buyer') {
    return (
      <div><div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Restringido</h2>
              <p className="mb-4">Debes iniciar sesión como comprador para realizar el checkout.</p>
              <Button onClick={() => navigate('/auth')}>
                Iniciar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background"><div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Carrito Vacío</h2>
              <p className="mb-4">No tienes productos en tu carrito para procesar.</p>
              <Button onClick={() => navigate('/products')}>
                Explorar Productos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background"><div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/cart')}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al carrito
          </Button>
          <h1 className="text-3xl font-bold">Finalizar Compra</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Información de Envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nombre completo</Label>
                    <Input
                      id="fullName"
                      value={shippingInfo.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value, 'shipping')}
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value, 'shipping')}
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Dirección completa</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value, 'shipping')}
                    placeholder="Calle, carrera, número, apartamento"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value, 'shipping')}
                      placeholder="Tu ciudad"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Departamento</Label>
                    <Select value={shippingInfo.department} onValueChange={(value) => handleInputChange('department', value, 'shipping')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="choco">Chocó</SelectItem>
                        <SelectItem value="antioquia">Antioquia</SelectItem>
                        <SelectItem value="valle">Valle del Cauca</SelectItem>
                        <SelectItem value="cundinamarca">Cundinamarca</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Código postal</Label>
                    <Input
                      id="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value, 'shipping')}
                      placeholder="270001"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Método de Pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Payment Method Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-4 border rounded-lg flex items-center gap-3 transition-colors ${
                      paymentMethod === 'credit_card' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">Tarjeta</span>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('pse')}
                    className={`p-4 border rounded-lg flex items-center gap-3 transition-colors ${
                      paymentMethod === 'pse' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Wallet className="h-5 w-5" />
                    <span className="font-medium">PSE</span>
                  </button>
                  
                  <button
                    onClick={() => setPaymentMethod('nequi')}
                    className={`p-4 border rounded-lg flex items-center gap-3 transition-colors ${
                      paymentMethod === 'nequi' 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Smartphone className="h-5 w-5" />
                    <span className="font-medium">Nequi</span>
                  </button>
                </div>

                {/* Credit Card Form */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label htmlFor="cardNumber">Número de tarjeta</Label>
                      <Input
                        id="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => {
                          // Format card number with spaces
                          const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
                          handleInputChange('cardNumber', value, 'payment');
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Fecha de expiración</Label>
                        <Input
                          id="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => {
                            // Format MM/YY
                            const value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
                            handleInputChange('expiryDate', value, 'payment');
                          }}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={paymentInfo.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''), 'payment')}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                      <Input
                        id="cardName"
                        value={paymentInfo.cardName}
                        onChange={(e) => handleInputChange('cardName', e.target.value, 'payment')}
                        placeholder="Nombre como aparece en la tarjeta"
                      />
                    </div>
                  </div>
                )}

                {/* PSE Info */}
                {paymentMethod === 'pse' && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Serás redirigido a tu banco para completar el pago de forma segura.
                    </p>
                  </div>
                )}

                {/* Nequi Info */}
                {paymentMethod === 'nequi' && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Se enviará una notificación a tu app Nequi para autorizar el pago.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Products */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium text-sm">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span className={shippingCost === 0 ? 'text-choco-green' : ''}>
                      {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString()}`}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      ${totalWithShipping.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleSubmitOrder}
                  disabled={isProcessing}
                  className="w-full"
                  size="lg"
                >
                  {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
                </Button>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Pago 100% seguro y encriptado</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div></div>
  );
};

export default Checkout;