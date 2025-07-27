import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploaded?: boolean;
}

interface ImageUploaderProps {
  maxImages?: number;
  onImagesChange: (images: ImageFile[]) => void;
  initialImages?: string[];
  acceptedTypes?: string[];
  maxSizeInMB?: number;
}

export const ImageUploader = ({
  maxImages = 6,
  onImagesChange,
  initialImages = [],
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeInMB = 5
}: ImageUploaderProps) => {
  const [images, setImages] = useState<ImageFile[]>(() => {
    return initialImages.map(url => ({
      id: Math.random().toString(36),
      file: new File([], 'existing'),
      preview: url,
      uploaded: true
    }));
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Tipo de archivo no válido",
        description: `Solo se permiten archivos: ${acceptedTypes.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }

    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast({
        title: "Archivo muy grande",
        description: `El archivo debe ser menor a ${maxSizeInMB}MB`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleFiles = (files: FileList) => {
    const newImages: ImageFile[] = [];
    
    Array.from(files).forEach(file => {
      if (validateFile(file) && images.length + newImages.length < maxImages) {
        const imageFile: ImageFile = {
          id: Math.random().toString(36),
          file,
          preview: URL.createObjectURL(file),
          uploaded: false
        };
        newImages.push(imageFile);
      }
    });

    if (images.length + newImages.length > maxImages) {
      toast({
        title: "Límite de imágenes",
        description: `Solo puedes subir máximo ${maxImages} imágenes`,
        variant: "destructive"
      });
      return;
    }

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImagesChange(updatedImages);
    
    // Cleanup preview URL
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove && !imageToRemove.uploaded) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-gray-300 hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="py-8">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">
              Arrastra las imágenes aquí o haz clic para seleccionar
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Máximo {maxImages} imágenes, {maxSizeInMB}MB cada una
            </p>
            <Button type="button" variant="outline">
              <ImageIcon className="mr-2 h-4 w-4" />
              Seleccionar Imágenes
            </Button>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={image.id} className="relative group overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Primary Image Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Principal
                    </div>
                  )}
                  
                  {/* Upload Status */}
                  {!image.uploaded && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="bg-white/90 px-2 py-1 rounded text-xs">
                        Nuevo
                      </div>
                    </div>
                  )}
                  
                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="text-sm text-muted-foreground">
        <p>• La primera imagen será la imagen principal del producto</p>
        <p>• Formatos soportados: JPEG, PNG, WebP</p>
        <p>• Tamaño máximo: {maxSizeInMB}MB por imagen</p>
      </div>
    </div>
  );
};
