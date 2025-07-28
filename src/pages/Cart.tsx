import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-skeleton';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  CreditCard,
  MapPin,
  Truck
} from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const { toast } = useToast();
  
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  const shippingCost = totalPrice > 100000 ? 0 : 8000; // Free shipping over 100k
  const totalWithShipping = totalPrice + shippingCost;

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    updateQuantity(productId, newQuantity);
    
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

  const handleRemoveItem = async (productId: number, productName: string) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    removeFromCart(productId);
    setUpdatingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
    
    toast({
      title: "Producto eliminado",
      description: `${productName} se eliminó del carrito`
    });
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (user.role !== 'buyer') {
      toast({
        title: "Solo compradores",
        description: "Solo los compradores pueden realizar compras",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingOrder(true);
    
    // Simulate checkout process
    setTimeout(() => {
      navigate('/checkout');
      setIsProcessingOrder(false);
    }, 1000);
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Carrito vaciado",
      description: "Se eliminaron todos los productos del carrito"
    });
  };

  if (!user || user.role !== 'buyer') {
    return (
      <div><div className="container-full py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Restringido</h2>
              <p className="mb-4">Debes iniciar sesión como comprador para ver el carrito.</p>
              <Button onClick={() => navigate('/auth')}>
                Iniciar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background"><div className="container-full py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/products')}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Seguir Comprando
          </Button>
          <h1 className="text-3xl font-bold">Mi Carrito</h1>
          <span className="text-muted-foreground">({totalItems} productos)</span>
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
              <p className="text-muted-foreground mb-6">
                Descubre los increíbles productos artesanales del Chocó
              </p>
              <Button onClick={() => navigate('/products')}>
                Explorar Productos
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Cart with Items */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Productos ({totalItems})</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleClearCart}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Vaciar carrito
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          por {item.seller}
                        </p>
                        <p className="font-bold text-primary">
                          ${item.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                        >
                          {updatingItems.has(item.id) ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Minus className="h-3 w-3" />
                          )}
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock || updatingItems.has(item.id)}
                        >
                          {updatingItems.has(item.id) ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Plus className="h-3 w-3" />
                          )}
                        </Button>
                      </div>

                      {/* Subtotal and Remove */}
                      <div className="text-right">
                        <p className="font-bold mb-2">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          disabled={updatingItems.has(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          {updatingItems.has(item.id) ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Shipping Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Truck className="h-5 w-5 text-choco-green" />
                    <div>
                      {shippingCost === 0 ? (
                        <span className="text-choco-green font-medium">
                          ¡Envío gratis! Tu pedido supera los $100,000
                        </span>
                      ) : (
                        <span>
                          Envío: ${shippingCost.toLocaleString()} • 
                          <span className="text-choco-green ml-1">
                            Gratis en compras sobre $100,000
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
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
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({totalItems} productos)</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span className={shippingCost === 0 ? 'text-choco-green' : ''}>
                      {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString()}`}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      ${totalWithShipping.toLocaleString()}
                    </span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={isProcessingOrder}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessingOrder ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Procesando...</span>
                      </div>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Proceder al Pago
                      </>
                    )}
                  </Button>                  <div className="text-xs text-muted-foreground text-center">
                    Compra segura y protegida
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-choco-earth mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Entrega estimada</p>
                      <p className="text-muted-foreground">
                        5-7 días hábiles • Seguimiento incluido
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <Card className="mt-4">
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <h4 className="font-medium text-sm">Compra Protegida</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-choco-green rounded-full"></span>
                        Pago seguro
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-choco-green rounded-full"></span>
                        Devoluciones
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-choco-green rounded-full"></span>
                        Garantía
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-choco-green rounded-full"></span>
                        Soporte 24/7
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div></div>
  );
};

export default Cart;