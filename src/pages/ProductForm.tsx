import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { sellerService } from '@/services/seller.service';
import { Product, ProductCreateRequest, ProductUpdateRequest } from '@/types/product.types';
import { ArrowLeft, Save, Upload, X, Plus } from 'lucide-react';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    images: [],
    isActive: true
  });

  const categories = [
    'Cestería',
    'Tejidos',
    'Cerámica',
    'Madera',
    'Metal',
    'Textiles',
    'Joyería',
    'Otros'
  ];

  // Cargar producto si estamos editando
  useEffect(() => {
    if (id && id !== 'new') {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productData = await sellerService.getProduct(id);
      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el producto",
        variant: "destructive"
      });
      navigate('/seller/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // En una implementación real, aquí subirías las imágenes a Firebase Storage
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setProduct(prev => ({
        ...prev,
        images: [...(prev.images || []), ...imageUrls]
      }));
    }
  };

  const removeImage = (index: number) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const validateForm = (): boolean => {
    if (!product.name?.trim()) {
      toast({
        title: "Error",
        description: "El nombre del producto es obligatorio",
        variant: "destructive"
      });
      return false;
    }

    if (!product.description?.trim()) {
      toast({
        title: "Error",
        description: "La descripción del producto es obligatoria",
        variant: "destructive"
      });
      return false;
    }

    if (!product.price || product.price <= 0) {
      toast({
        title: "Error",
        description: "El precio debe ser mayor a 0",
        variant: "destructive"
      });
      return false;
    }

    if (product.stock === undefined || product.stock < 0) {
      toast({
        title: "Error",
        description: "El stock no puede ser negativo",
        variant: "destructive"
      });
      return false;
    }

    if (!product.category) {
      toast({
        title: "Error",
        description: "Debes seleccionar una categoría",
        variant: "destructive"
      });
      return false;
    }

    if (!product.images || product.images.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar al menos una imagen",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      if (id && id !== 'new') {
        // Actualizar producto existente
        const updateData: ProductUpdateRequest = {
          name: product.name!,
          description: product.description!,
          price: product.price!,
          stock: product.stock!,
          category: product.category!,
          images: product.images!,
          isActive: product.isActive!
        };

        await sellerService.updateProduct(id, updateData);
        
        toast({
          title: "Producto actualizado",
          description: "Los cambios se han guardado exitosamente"
        });
      } else {
        // Crear nuevo producto
        const createData: ProductCreateRequest = {
          name: product.name!,
          description: product.description!,
          price: product.price!,
          stock: product.stock!,
          category: product.category!,
          images: product.images!
        };

        await sellerService.createProduct(createData);
        
        toast({
          title: "Producto creado",
          description: "El producto se ha creado exitosamente"
        });
      }

      navigate('/seller/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el producto",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.role !== 'seller') {
    return (
      <div className="container-full py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
            <p>Esta área está reservada para vendedores.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-full py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-full py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/seller/products')}
          className="text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Productos
        </Button>
        <h1 className="text-3xl font-bold">
          {id && id !== 'new' ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Formulario */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Nombre */}
              <div>
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                  id="name"
                  value={product.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Cesta Artesanal de Palma"
                />
              </div>

              {/* Descripción */}
              <div>
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={product.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe tu producto..."
                  rows={4}
                />
              </div>

              {/* Precio y Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio (COP) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={product.price || ''}
                    onChange={(e) => handleInputChange('price', Number(e.target.value))}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={product.stock || ''}
                    onChange={(e) => handleInputChange('stock', Number(e.target.value))}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              {/* Categoría */}
              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={product.category || ''}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Estado activo */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={product.isActive || false}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                />
                <Label htmlFor="isActive">Producto activo</Label>
              </div>
            </CardContent>
          </Card>

          {/* Imágenes */}
          <Card>
            <CardHeader>
              <CardTitle>Imágenes del Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subida de imágenes */}
              <div>
                <Label htmlFor="images">Agregar Imágenes</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-2"
                />
              </div>

              {/* Vista previa de imágenes */}
              {product.images && product.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Producto ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Vista previa */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
            </CardHeader>
            <CardContent>
              {product.images && product.images.length > 0 ? (
                <div className="space-y-4">
                  <img
                    src={product.images[0]}
                    alt={product.name || 'Producto'}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{product.name || 'Nombre del producto'}</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      {product.category || 'Categoría'}
                    </p>
                    <p className="text-primary font-bold text-xl">
                      ${(product.price || 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {product.description || 'Descripción del producto...'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Upload className="h-12 w-12 mx-auto mb-4" />
                  <p>Agrega imágenes para ver la vista previa</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4 mt-8">
        <Button
          variant="outline"
          onClick={() => navigate('/seller/products')}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {id && id !== 'new' ? 'Actualizar' : 'Crear'} Producto
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
