import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/Layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Star, 
  MapPin, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ArrowLeft, 
  User, 
  MessageCircle,
  Shield,
  Truck,
  RotateCcw
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock product data - in real app this would come from API
  const product = {
    id: Number(id),
    name: "Cesta Artesanal de Palma Tradicional",
    price: 45000,
    originalPrice: 60000,
    images: [
      "/api/placeholder/600/600",
      "/api/placeholder/600/600",
      "/api/placeholder/600/600",
      "/api/placeholder/600/600"
    ],
    seller: {
      name: "María Mosquera",
      location: "Quibdó, Chocó",
      rating: 4.8,
      totalSales: 156,
      verified: true
    },
    rating: 4.8,
    reviewCount: 24,
    stock: 12,
    category: "Cestería",
    isNew: true,
    featured: false,
    description: "Hermosa cesta tejida a mano con palma de iraca, una técnica ancestral transmitida de generación en generación por las comunidades del Chocó. Cada pieza es única y cuenta con detalles únicos que la hacen especial.",
    longDescription: `Esta cesta artesanal está elaborada con palma de iraca, una planta nativa de la región del Chocó. El proceso de tejido se realiza completamente a mano siguiendo técnicas ancestrales que han sido transmitidas de generación en generación.

Características principales:
• Material: Palma de iraca 100% natural
• Técnica: Tejido a mano tradicional
• Dimensiones: 30cm x 25cm x 20cm
• Peso: Aproximadamente 400g
• Tiempo de elaboración: 3-4 días

Cada cesta es única debido a la naturaleza artesanal del proceso. Las pequeñas variaciones en el tejido y el color son parte del encanto y autenticidad del producto.`,
    specifications: {
      material: "Palma de iraca",
      dimensions: "30cm x 25cm x 20cm",
      weight: "400g",
      origin: "Chocó, Colombia",
      craftTime: "3-4 días"
    },
    reviews: [
      {
        id: 1,
        user: "Ana García",
        rating: 5,
        comment: "Hermosa cesta, la calidad es excelente. Llegó muy bien empacada.",
        date: "2024-01-10",
        verified: true
      },
      {
        id: 2,
        user: "Carlos Rodríguez",
        rating: 4,
        comment: "Muy buena artesanía, aunque tardó un poco en llegar.",
        date: "2024-01-08",
        verified: true
      }
    ]
  };

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos al carrito",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (user.role !== 'buyer') {
      toast({
        title: "Solo compradores",
        description: "Solo los compradores pueden agregar productos al carrito",
        variant: "destructive"
      });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      seller: product.seller.name,
      maxStock: product.stock
    });

    toast({
      title: "Producto agregado",
      description: `${product.name} se agregó al carrito`
    });
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Eliminado de favoritos" : "Agregado a favoritos",
      description: isFavorite 
        ? "El producto se eliminó de tu lista de favoritos"
        : "El producto se agregó a tu lista de favoritos"
    });
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/products')}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a productos
          </Button>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
              />
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-choco-green">Nuevo</Badge>
              )}
              {discount > 0 && (
                <Badge className="absolute top-4 right-4 bg-destructive">
                  -{discount}%
                </Badge>
              )}
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index 
                      ? 'border-primary' 
                      : 'border-transparent hover:border-border'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviewCount} reseñas)</span>
                </div>
                <Badge variant="outline">{product.category}</Badge>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>{product.seller.location}</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.stock > 0 ? (
                <p className="text-sm text-muted-foreground">
                  {product.stock} unidades disponibles
                </p>
              ) : (
                <p className="text-sm text-destructive">Agotado</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-choco-earth/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-choco-earth" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{product.seller.name}</h3>
                        {product.seller.verified && (
                          <Shield className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {product.seller.totalSales} ventas • ⭐ {product.seller.rating}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contactar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2 p-3 border rounded-lg">
                <Truck className="h-6 w-6 text-choco-green" />
                <span className="text-xs font-medium">Envío Seguro</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 border rounded-lg">
                <Shield className="h-6 w-6 text-choco-earth" />
                <span className="text-xs font-medium">Compra Protegida</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 border rounded-lg">
                <RotateCcw className="h-6 w-6 text-choco-gold" />
                <span className="text-xs font-medium">30 días devolución</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Description and Specifications */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Descripción</h2>
                  <div className="prose max-w-none text-muted-foreground">
                    <p className="mb-4">{product.description}</p>
                    <div className="whitespace-pre-line">{product.longDescription}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Especificaciones</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Material</h4>
                      <p className="text-muted-foreground">{product.specifications.material}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Dimensiones</h4>
                      <p className="text-muted-foreground">{product.specifications.dimensions}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Peso</h4>
                      <p className="text-muted-foreground">{product.specifications.weight}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Origen</h4>
                      <p className="text-muted-foreground">{product.specifications.origin}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reviews */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Reseñas</h2>
                  
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold">{product.rating}</div>
                    <div className="flex justify-center mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {product.reviewCount} reseñas
                    </p>
                  </div>

                  <Separator className="mb-4" />

                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{review.user}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verificado
                              </Badge>
                            )}
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                        {review.id < product.reviews.length && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    Ver todas las reseñas
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;