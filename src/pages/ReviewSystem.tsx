import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Package,
  CheckCircle,
  Trash2,
  Flag,
  AlertTriangle
} from 'lucide-react';

interface Review {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpfulVotes: number;
  notHelpfulVotes: number;
  images?: string[];
  sellerResponse?: {
    message: string;
    date: string;
  };
  canEdit?: boolean;
  canDelete?: boolean;
}

interface PendingReview {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  seller: string;
  purchaseDate: string;
  deliveredDate: string;
}

export const ReviewSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<PendingReview | null>(null);

  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: [] as string[]
  });

  const [pendingReviews] = useState<PendingReview[]>(user?.role === 'buyer' ? [
    {
      id: '1',
      orderId: 'TC-2024-001',
      productId: '1',
      productName: 'Cesta Artesanal de Palma',
      productImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEuP2jaxW-4doOKMOeSzU81-oqhTUUrABfv3OnLUY7DP8XCeySupsCIrkGLkf8lTZvCbWeHjjUoFpgAD6UuakL6TmxaPItdItP_4v-GXV8-ht2VHazbirtOjPrU5sayYuGsDk5555ngMjo-Wp8qlo6dlPDJkxqSnD6nXiuh_jDrpVMOKidedLRWj6v_VIcYbLTrcqQ4gupup8I61Bq1HPLTVV5AAuIn1qtJLwsusK8br9jqTFAFZ1-dn_0GBH4Ul4DXodkVi7kp0M',
      seller: 'María Mosquera',
      purchaseDate: '2024-01-18',
      deliveredDate: '2024-01-22'
    }
  ] : []);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      productId: '1',
      productName: 'Cesta Artesanal de Palma',
      userName: 'Ana García',
      userAvatar: '',
      rating: 5,
      title: 'Producto excepcional',
      comment: 'La calidad de la cesta es increíble. Se nota el trabajo artesanal y la dedicación.',
      date: '2024-01-15',
      verified: true,
      helpfulVotes: 12,
      notHelpfulVotes: 1,
      sellerResponse: {
        message: '¡Muchas gracias Ana! Me alegra saber que te gustó tanto.',
        date: '2024-01-16'
      },
      canEdit: user?.role === 'buyer',
      canDelete: user?.role === 'buyer'
    }
  ]);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || review.rating.toString() === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const handleRatingClick = (rating: number) => {
    setReviewForm(prev => ({ ...prev, rating }));
  };

  const handleOpenReviewDialog = (product: PendingReview) => {
    setSelectedProduct(product);
    setReviewForm({ rating: 0, title: '', comment: '', images: [] });
    setIsReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    if (!selectedProduct || reviewForm.rating === 0 || !reviewForm.comment.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    const newReview: Review = {
      id: `review-${Date.now()}`,
      productId: selectedProduct.productId,
      productName: selectedProduct.productName,
      userName: user?.name || 'Usuario',
      rating: reviewForm.rating,
      title: reviewForm.title || 'Reseña de cliente',
      comment: reviewForm.comment,
      date: new Date().toISOString(),
      verified: true,
      helpfulVotes: 0,
      notHelpfulVotes: 0,
      canEdit: true,
      canDelete: true
    };

    setReviews(prev => [newReview, ...prev]);
    setIsReviewDialogOpen(false);
    setSelectedProduct(null);
    toast({ title: "Reseña enviada", description: "Tu reseña ha sido publicada exitosamente" });
  };

  const renderStars = (rating: number, interactive = false, size = 'default') => {
    const sizeClass = size === 'large' ? 'h-6 w-6' : size === 'small' ? 'h-3 w-3' : 'h-4 w-4';
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => handleRatingClick(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Sistema de Reseñas</h1>
          <p className="text-muted-foreground">
            {user?.role === 'seller' 
              ? 'Gestiona las reseñas de tus productos y responde a tus clientes'
              : 'Gestiona tus reseñas y califica productos comprados'
            }
          </p>
        </div>

        {user?.role === 'seller' ? (
          <Tabs defaultValue="received" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="received">Reseñas Recibidas ({reviews.length})</TabsTrigger>
              <TabsTrigger value="respond">Pendientes Respuesta ({reviews.filter(r => !r.sellerResponse).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="received">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Reseñas de Mis Productos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredReviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm">{review.userName}</p>
                              <div className="flex items-center gap-2">
                                {renderStars(review.rating, false, 'small')}
                                <span className="text-sm font-medium">{review.rating}/5</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant={review.rating >= 4 ? 'default' : 'secondary'}>
                            {review.productName}
                          </Badge>
                        </div>
                        
                        <div className="mb-4">
                          <h4 className="font-semibold mb-1">{review.title}</h4>
                          <p className="text-sm">{review.comment}</p>
                        </div>

                        {review.sellerResponse && (
                          <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">Tu Respuesta</Badge>
                            </div>
                            <p className="text-sm">{review.sellerResponse.message}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="respond">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Pendientes de Respuesta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.filter(r => !r.sellerResponse).length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">¡Todo al día!</h3>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.filter(r => !r.sellerResponse).map((review) => (
                        <div key={review.id} className="border rounded-lg p-4">
                          <p className="text-sm mb-3">{review.comment}</p>
                          <Button size="sm" className="w-full">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Responder Reseña
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">Pendientes de Reseña ({pendingReviews.length})</TabsTrigger>
              <TabsTrigger value="my-reviews">Mis Reseñas ({reviews.filter(r => r.canEdit).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Productos por Calificar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingReviews.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No hay productos por reseñar</h3>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {pendingReviews.map((product) => (
                        <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <img 
                            src={product.productImage} 
                            alt={product.productName}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{product.productName}</h3>
                            <p className="text-sm text-muted-foreground">por {product.seller}</p>
                          </div>
                          <Button onClick={() => handleOpenReviewDialog(product)}>
                            <Star className="h-4 w-4 mr-2" />
                            Calificar
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="my-reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Reseñas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredReviews.filter(r => r.canEdit).map((review) => (
                      <div key={review.id} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">{review.productName}</h3>
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                            <span className="text-sm font-medium">{review.rating}/5</span>
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Calificar Producto</DialogTitle>
            </DialogHeader>
            
            {selectedProduct && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Calificación *</Label>
                  <div className="flex items-center gap-2">
                    {renderStars(reviewForm.rating, true, 'large')}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Comentario *</Label>
                  <Textarea
                    id="comment"
                    placeholder="Cuéntanos sobre tu experiencia..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleSubmitReview} className="flex-1">
                    Enviar Reseña
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      <Footer />
    </div>
  );
};

export default ReviewSystem;
