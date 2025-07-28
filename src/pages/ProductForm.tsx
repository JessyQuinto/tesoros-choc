import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ImageUploader } from '@/components/ui/image-uploader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye, Package } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100, 'Máximo 100 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').max(1000, 'Máximo 1000 caracteres'),
  price: z.number().min(1000, 'El precio mínimo es $1,000').max(10000000, 'Precio máximo $10,000,000'),
  originalPrice: z.number().optional(),
  category: z.string().min(1, 'Selecciona una categoría'),
  subcategory: z.string().optional(),
  stock: z.number().min(0, 'El stock no puede ser negativo').max(1000, 'Stock máximo 1000'),
  sku: z.string().optional(),
  weight: z.number().min(0.1, 'El peso mínimo es 0.1kg').max(50, 'Peso máximo 50kg'),
  dimensions: z.object({
    length: z.number().min(1, 'Largo mínimo 1cm').max(200, 'Largo máximo 200cm'),
    width: z.number().min(1, 'Ancho mínimo 1cm').max(200, 'Ancho máximo 200cm'),
    height: z.number().min(1, 'Alto mínimo 1cm').max(200, 'Alto máximo 200cm'),
  }),
  materials: z.string().min(2, 'Especifica los materiales'),
  craftingTime: z.string().min(1, 'Especifica el tiempo de elaboración'),
  origin: z.string().min(2, 'Especifica el origen'),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  tags: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploaded?: boolean;
}

const categories = [
  { value: 'textiles', label: 'Textiles', subcategories: ['Mochilas', 'Hamacas', 'Manteles', 'Ropa'] },
  { value: 'basketry', label: 'Cestería', subcategories: ['Cestas', 'Canastos', 'Sombreros', 'Decoración'] },
  { value: 'jewelry', label: 'Joyería', subcategories: ['Collares', 'Pulseras', 'Aretes', 'Anillos'] },
  { value: 'woodwork', label: 'Tallado', subcategories: ['Máscaras', 'Esculturas', 'Utensilios', 'Decoración'] },
  { value: 'ceramics', label: 'Cerámica', subcategories: ['Vasijas', 'Platos', 'Jarrones', 'Figuras'] },
  { value: 'instruments', label: 'Instrumentos', subcategories: ['Tambores', 'Maracas', 'Flautas', 'Otros'] },
];

export const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDraft, setIsDraft] = useState(false);

  const isEditing = Boolean(id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isActive: true,
      isFeatured: false,
      stock: 1,
      weight: 0.5,
      dimensions: {
        length: 10,
        width: 10,
        height: 10
      }
    }
  });

  const watchedCategory = watch('category');
  const watchedPrice = watch('price');
  const watchedOriginalPrice = watch('originalPrice');

  useEffect(() => {
    if (watchedCategory) {
      setSelectedCategory(watchedCategory);
    }
  }, [watchedCategory]);

  // Load product data if editing
  useEffect(() => {
    if (isEditing && id) {
      // Simulate loading existing product
      setIsLoading(true);
      setTimeout(() => {
        const mockProduct = {
          name: 'Cesta Artesanal de Palma',
          description: 'Hermosa cesta tejida a mano con palma de iraca, usando técnicas ancestrales transmitidas de generación en generación.',
          price: 45000,
          originalPrice: 60000,
          category: 'basketry',
          subcategory: 'Cestas',
          stock: 12,
          sku: 'CST-001',
          weight: 0.8,
          dimensions: { length: 25, width: 25, height: 15 },
          materials: 'Palma de iraca, fibras naturales',
          craftingTime: '2-3 días',
          origin: 'Quibdó, Chocó',
          isActive: true,
          isFeatured: false,
          tags: 'artesanal, tradicional, sostenible'
        };
        
        reset(mockProduct);
        setImages([
          { id: '1', file: new File([], ''), preview: '/api/placeholder/300/300', uploaded: true },
          { id: '2', file: new File([], ''), preview: '/api/placeholder/300/300', uploaded: true }
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [isEditing, id, reset]);

  const selectedCategoryData = categories.find(cat => cat.value === selectedCategory);

  const onSubmit = async (data: ProductFormData, saveAsDraft = false) => {
    if (images.length === 0) {
      toast({
        title: "Imágenes requeridas",
        description: "Debes subir al menos una imagen del producto",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setIsDraft(saveAsDraft);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const productData = {
        ...data,
        images: images.map(img => img.preview),
        sellerId: user?.id,
        status: saveAsDraft ? 'draft' : 'active',
        id: isEditing ? id : `prod_${Date.now()}`
      };

      toast({
        title: saveAsDraft ? "Borrador guardado" : isEditing ? "Producto actualizado" : "Producto creado",
        description: saveAsDraft 
          ? "El producto se guardó como borrador" 
          : isEditing 
            ? "Los cambios se guardaron correctamente"
            : "El producto se creó exitosamente"
      });

      if (!saveAsDraft) {
        navigate('/seller-dashboard');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el producto. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsDraft(false);
    }
  };

  const handleSaveAsDraft = () => {
    handleSubmit(data => onSubmit(data, true))();
  };

  const handlePreview = () => {
    // Simulate opening preview
    toast({
      title: "Vista previa",
      description: "Abriendo vista previa del producto..."
    });
  };

  if (user?.role !== 'seller') {
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

  return (
    <div className="container-full py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" onClick={() => navigate('/seller-dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing ? 'Modifica la información de tu producto' : 'Completa la información de tu nuevo producto'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(data => onSubmit(data, false))} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
            <CardDescription>
              Información principal que verán los compradores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Ej: Cesta Artesanal de Palma"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sku">SKU (Código de Producto)</Label>
                <Input
                  id="sku"
                  {...register('sku')}
                  placeholder="Ej: CST-001"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe tu producto, materiales, técnicas utilizadas, historia..."
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Select 
                  value={selectedCategory} 
                  onValueChange={(value) => {
                    setValue('category', value);
                    setSelectedCategory(value);
                    setValue('subcategory', ''); // Reset subcategory
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
                )}
              </div>

              {selectedCategoryData && (
                <div>
                  <Label htmlFor="subcategory">Subcategoría</Label>
                  <Select onValueChange={(value) => setValue('subcategory', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una subcategoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategoryData.subcategories.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="tags">Etiquetas</Label>
              <Input
                id="tags"
                {...register('tags')}
                placeholder="Ej: artesanal, tradicional, sostenible (separadas por comas)"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Palabras clave que ayudarán a los compradores a encontrar tu producto
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Imágenes del Producto</CardTitle>
            <CardDescription>
              Sube imágenes de alta calidad que muestren tu producto desde diferentes ángulos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader
              onImagesChange={setImages}
              initialImages={images.map(img => img.preview)}
              maxImages={6}
            />
          </CardContent>
        </Card>

        {/* Pricing and Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Precios e Inventario</CardTitle>
            <CardDescription>
              Configura el precio y disponibilidad de tu producto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="price">Precio de Venta (COP) *</Label>
                <Input
                  id="price"
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="45000"
                />
                {errors.price && (
                  <p className="text-sm text-destructive mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="originalPrice">Precio Original (COP)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  {...register('originalPrice', { valueAsNumber: true })}
                  placeholder="60000"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Si tienes descuento, ingresa el precio original
                </p>
              </div>

              <div>
                <Label htmlFor="stock">Stock Disponible *</Label>
                <Input
                  id="stock"
                  type="number"
                  {...register('stock', { valueAsNumber: true })}
                  placeholder="10"
                />
                {errors.stock && (
                  <p className="text-sm text-destructive mt-1">{errors.stock.message}</p>
                )}
              </div>
            </div>

            {/* Discount Preview */}
            {watchedPrice && watchedOriginalPrice && watchedOriginalPrice > watchedPrice && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  Descuento del {Math.round(((watchedOriginalPrice - watchedPrice) / watchedOriginalPrice) * 100)}%
                </p>
                <p className="text-sm text-green-600">
                  Los compradores verán: <span className="line-through">${watchedOriginalPrice.toLocaleString()}</span> ${watchedPrice.toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Producto</CardTitle>
            <CardDescription>
              Información específica sobre materiales, dimensiones y elaboración
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="materials">Materiales *</Label>
                <Input
                  id="materials"
                  {...register('materials')}
                  placeholder="Ej: Palma de iraca, fibras naturales"
                />
                {errors.materials && (
                  <p className="text-sm text-destructive mt-1">{errors.materials.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="craftingTime">Tiempo de Elaboración *</Label>
                <Input
                  id="craftingTime"
                  {...register('craftingTime')}
                  placeholder="Ej: 2-3 días"
                />
                {errors.craftingTime && (
                  <p className="text-sm text-destructive mt-1">{errors.craftingTime.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="origin">Lugar de Origen *</Label>
                <Input
                  id="origin"
                  {...register('origin')}
                  placeholder="Ej: Quibdó, Chocó"
                />
                {errors.origin && (
                  <p className="text-sm text-destructive mt-1">{errors.origin.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="weight">Peso (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  {...register('weight', { valueAsNumber: true })}
                  placeholder="0.8"
                />
                {errors.weight && (
                  <p className="text-sm text-destructive mt-1">{errors.weight.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Dimensiones (cm) *</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="length" className="text-sm">Largo</Label>
                  <Input
                    id="length"
                    type="number"
                    {...register('dimensions.length', { valueAsNumber: true })}
                    placeholder="25"
                  />
                  {errors.dimensions?.length && (
                    <p className="text-sm text-destructive mt-1">{errors.dimensions.length.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="width" className="text-sm">Ancho</Label>
                  <Input
                    id="width"
                    type="number"
                    {...register('dimensions.width', { valueAsNumber: true })}
                    placeholder="25"
                  />
                  {errors.dimensions?.width && (
                    <p className="text-sm text-destructive mt-1">{errors.dimensions.width.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="height" className="text-sm">Alto</Label>
                  <Input
                    id="height"
                    type="number"
                    {...register('dimensions.height', { valueAsNumber: true })}
                    placeholder="15"
                  />
                  {errors.dimensions?.height && (
                    <p className="text-sm text-destructive mt-1">{errors.dimensions.height.message}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración</CardTitle>
            <CardDescription>
              Configuraciones adicionales del producto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isActive">Producto Activo</Label>
                <p className="text-sm text-muted-foreground">
                  Los compradores pueden ver y comprar este producto
                </p>
              </div>
              <Switch
                id="isActive"
                {...register('isActive')}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isFeatured">Producto Destacado</Label>
                <p className="text-sm text-muted-foreground">
                  Aparecerá en la sección de productos destacados
                </p>
              </div>
              <Switch
                id="isFeatured"
                {...register('isFeatured')}
                onCheckedChange={(checked) => setValue('isFeatured', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveAsDraft}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isDraft ? 'Guardando...' : 'Guardar Borrador'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  disabled={isLoading}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Vista Previa
                </Button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="bg-choco-earth hover:bg-choco-earth/90"
              >
                <Package className="h-4 w-4 mr-2" />
                {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Producto' : 'Crear Producto'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
