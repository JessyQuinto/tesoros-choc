import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText,
  Image,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Upload,
  Calendar,
  Tag,
  Globe,
  Settings,
  Megaphone,
  Layout,
  Palette,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  List,
  Link,
  ImageIcon
} from 'lucide-react';

interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  lastModified: string;
  author: string;
}

interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  position: 'hero' | 'sidebar' | 'footer';
  isActive: boolean;
  startDate: string;
  endDate: string;
  priority: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  productCount: number;
  parentId?: string;
}

const ContentManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isPageDialogOpen, setIsPageDialogOpen] = useState(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<StaticPage | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [staticPages, setStaticPages] = useState<StaticPage[]>([
    {
      id: '1',
      title: 'Acerca de Tesoros del Chocó',
      slug: 'acerca-de',
      content: '<h1>Acerca de Tesoros del Chocó</h1><p>Marketplace dedicado a promover la artesanía tradicional del Pacífico colombiano...</p>',
      status: 'published',
      lastModified: '2024-03-15',
      author: 'Admin'
    },
    {
      id: '2',
      title: 'Términos y Condiciones',
      slug: 'terminos-condiciones',
      content: '<h1>Términos y Condiciones</h1><p>Al acceder y utilizar esta plataforma...</p>',
      status: 'published',
      lastModified: '2024-03-10',
      author: 'Admin'
    },
    {
      id: '3',
      title: 'Política de Privacidad',
      slug: 'politica-privacidad',
      content: '<h1>Política de Privacidad</h1><p>Esta política describe cómo recopilamos...</p>',
      status: 'draft',
      lastModified: '2024-03-12',
      author: 'Admin'
    }
  ]);

  const [banners, setBanners] = useState<Banner[]>([
    {
      id: '1',
      title: 'Descubre la Artesanía del Chocó',
      description: 'Productos únicos hechos a mano por artesanos locales',
      imageUrl: '/api/placeholder/800/400',
      link: '/productos',
      position: 'hero',
      isActive: true,
      startDate: '2024-03-01',
      endDate: '2024-04-30',
      priority: 1
    },
    {
      id: '2',
      title: 'Envío Gratis en Compras +$100.000',
      description: 'Aplica para toda Colombia',
      imageUrl: '/api/placeholder/400/200',
      link: '/productos',
      position: 'sidebar',
      isActive: true,
      startDate: '2024-03-15',
      endDate: '2024-05-15',
      priority: 2
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    {
      id: '1',
      name: 'Arte y Decoración',
      slug: 'arte-decoracion',
      description: 'Piezas decorativas y obras de arte tradicional',
      imageUrl: '/api/placeholder/300/200',
      isActive: true,
      productCount: 89
    },
    {
      id: '2',
      name: 'Joyería y Accesorios',
      slug: 'joyeria-accesorios',
      description: 'Joyas artesanales y accesorios únicos',
      imageUrl: '/api/placeholder/300/200',
      isActive: true,
      productCount: 67
    },
    {
      id: '3',
      name: 'Textiles',
      slug: 'textiles',
      description: 'Tejidos tradicionales y prendas artesanales',
      imageUrl: '/api/placeholder/300/200',
      isActive: true,
      productCount: 45
    }
  ]);

  const [pageForm, setPageForm] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'draft' as 'published' | 'draft'
  });

  const [bannerForm, setBannerForm] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    position: 'hero' as 'hero' | 'sidebar' | 'footer',
    isActive: true,
    startDate: '',
    endDate: '',
    priority: 1
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isActive: true,
    parentId: ''
  });

  const handlePageSubmit = () => {
    if (selectedPage) {
      setStaticPages(prev => prev.map(page => 
        page.id === selectedPage.id 
          ? { ...page, ...pageForm, lastModified: new Date().toISOString().split('T')[0] }
          : page
      ));
      toast({ title: "Página actualizada", description: "Los cambios se han guardado correctamente." });
    } else {
      const newPage: StaticPage = {
        id: Date.now().toString(),
        ...pageForm,
        lastModified: new Date().toISOString().split('T')[0],
        author: user?.name || 'Admin'
      };
      setStaticPages(prev => [...prev, newPage]);
      toast({ title: "Página creada", description: "La nueva página se ha creado correctamente." });
    }
    setIsPageDialogOpen(false);
    resetPageForm();
  };

  const handleBannerSubmit = () => {
    if (selectedBanner) {
      setBanners(prev => prev.map(banner => 
        banner.id === selectedBanner.id 
          ? { ...banner, ...bannerForm }
          : banner
      ));
      toast({ title: "Banner actualizado", description: "Los cambios se han guardado correctamente." });
    } else {
      const newBanner: Banner = {
        id: Date.now().toString(),
        ...bannerForm
      };
      setBanners(prev => [...prev, newBanner]);
      toast({ title: "Banner creado", description: "El nuevo banner se ha creado correctamente." });
    }
    setIsBannerDialogOpen(false);
    resetBannerForm();
  };

  const handleCategorySubmit = () => {
    if (selectedCategory) {
      setCategories(prev => prev.map(category => 
        category.id === selectedCategory.id 
          ? { ...category, ...categoryForm, slug: categoryForm.name.toLowerCase().replace(/\s+/g, '-') }
          : category
      ));
      toast({ title: "Categoría actualizada", description: "Los cambios se han guardado correctamente." });
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        ...categoryForm,
        slug: categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        productCount: 0
      };
      setCategories(prev => [...prev, newCategory]);
      toast({ title: "Categoría creada", description: "La nueva categoría se ha creado correctamente." });
    }
    setIsCategoryDialogOpen(false);
    resetCategoryForm();
  };

  const resetPageForm = () => {
    setPageForm({
      title: '',
      slug: '',
      content: '',
      status: 'draft'
    });
    setSelectedPage(null);
  };

  const resetBannerForm = () => {
    setBannerForm({
      title: '',
      description: '',
      imageUrl: '',
      link: '',
      position: 'hero',
      isActive: true,
      startDate: '',
      endDate: '',
      priority: 1
    });
    setSelectedBanner(null);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      isActive: true,
      parentId: ''
    });
    setSelectedCategory(null);
  };

  const editPage = (page: StaticPage) => {
    setSelectedPage(page);
    setPageForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      status: page.status
    });
    setIsPageDialogOpen(true);
  };

  const editBanner = (banner: Banner) => {
    setSelectedBanner(banner);
    setBannerForm({
      title: banner.title,
      description: banner.description,
      imageUrl: banner.imageUrl,
      link: banner.link,
      position: banner.position,
      isActive: banner.isActive,
      startDate: banner.startDate,
      endDate: banner.endDate,
      priority: banner.priority
    });
    setIsBannerDialogOpen(true);
  };

  const editCategory = (category: Category) => {
    setSelectedCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      isActive: category.isActive,
      parentId: category.parentId || ''
    });
    setIsCategoryDialogOpen(true);
  };

  const deletePage = (id: string) => {
    setStaticPages(prev => prev.filter(page => page.id !== id));
    toast({ title: "Página eliminada", description: "La página se ha eliminado correctamente." });
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
    toast({ title: "Banner eliminado", description: "El banner se ha eliminado correctamente." });
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
    toast({ title: "Categoría eliminada", description: "La categoría se ha eliminado correctamente." });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
              <p>Esta área está reservada para administradores.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Contenido</h1>
            <p className="text-muted-foreground">
              Administra páginas, banners y categorías del sitio
            </p>
          </div>
        </div>

        <Tabs defaultValue="pages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pages">Páginas Estáticas</TabsTrigger>
            <TabsTrigger value="banners">Banners y Promociones</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
          </TabsList>

          {/* Static Pages */}
          <TabsContent value="pages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Páginas Estáticas</h2>
              <Dialog open={isPageDialogOpen} onOpenChange={setIsPageDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetPageForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Página
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{selectedPage ? 'Editar' : 'Crear'} Página</DialogTitle>
                    <DialogDescription>
                      {selectedPage ? 'Modifica' : 'Crea'} el contenido de la página estática
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">Título</Label>
                        <Input
                          id="title"
                          value={pageForm.title}
                          onChange={(e) => setPageForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Título de la página"
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug">URL (slug)</Label>
                        <Input
                          id="slug"
                          value={pageForm.slug}
                          onChange={(e) => setPageForm(prev => ({ ...prev, slug: e.target.value }))}
                          placeholder="url-de-la-pagina"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="content">Contenido</Label>
                      <Textarea
                        id="content"
                        value={pageForm.content}
                        onChange={(e) => setPageForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Contenido HTML de la página"
                        className="min-h-[200px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Estado</Label>
                      <Select value={pageForm.status} onValueChange={(value: 'published' | 'draft') => setPageForm(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Borrador</SelectItem>
                          <SelectItem value="published">Publicado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handlePageSubmit}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {staticPages.map((page) => (
                <Card key={page.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{page.title}</h3>
                          <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                            {page.status === 'published' ? 'Publicado' : 'Borrador'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          URL: /{page.slug}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Última modificación: {page.lastModified} por {page.author}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => editPage(page)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => deletePage(page.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Banners */}
          <TabsContent value="banners" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Banners y Promociones</h2>
              <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetBannerForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Banner
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{selectedBanner ? 'Editar' : 'Crear'} Banner</DialogTitle>
                    <DialogDescription>
                      {selectedBanner ? 'Modifica' : 'Crea'} un banner promocional
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="banner-title">Título</Label>
                      <Input
                        id="banner-title"
                        value={bannerForm.title}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Título del banner"
                      />
                    </div>
                    <div>
                      <Label htmlFor="banner-description">Descripción</Label>
                      <Textarea
                        id="banner-description"
                        value={bannerForm.description}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descripción del banner"
                      />
                    </div>
                    <div>
                      <Label htmlFor="banner-image">URL de Imagen</Label>
                      <Input
                        id="banner-image"
                        value={bannerForm.imageUrl}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="banner-link">Enlace</Label>
                      <Input
                        id="banner-link"
                        value={bannerForm.link}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, link: e.target.value }))}
                        placeholder="/productos"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="banner-position">Posición</Label>
                        <Select value={bannerForm.position} onValueChange={(value: 'hero' | 'sidebar' | 'footer') => setBannerForm(prev => ({ ...prev, position: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hero">Hero Principal</SelectItem>
                            <SelectItem value="sidebar">Barra Lateral</SelectItem>
                            <SelectItem value="footer">Pie de Página</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="banner-priority">Prioridad</Label>
                        <Input
                          id="banner-priority"
                          type="number"
                          value={bannerForm.priority}
                          onChange={(e) => setBannerForm(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="banner-start">Fecha Inicio</Label>
                        <Input
                          id="banner-start"
                          type="date"
                          value={bannerForm.startDate}
                          onChange={(e) => setBannerForm(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="banner-end">Fecha Fin</Label>
                        <Input
                          id="banner-end"
                          type="date"
                          value={bannerForm.endDate}
                          onChange={(e) => setBannerForm(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="banner-active"
                        checked={bannerForm.isActive}
                        onCheckedChange={(checked) => setBannerForm(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor="banner-active">Activo</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleBannerSubmit}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {banners.map((banner) => (
                <Card key={banner.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <img 
                          src={banner.imageUrl} 
                          alt={banner.title}
                          className="w-24 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{banner.title}</h3>
                            <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                              {banner.isActive ? 'Activo' : 'Inactivo'}
                            </Badge>
                            <Badge variant="outline">{banner.position}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {banner.description}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            <span>Vigencia: {banner.startDate} - {banner.endDate}</span>
                            <span className="ml-4">Prioridad: {banner.priority}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => editBanner(banner)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => deleteBanner(banner.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Categories */}
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Categorías de Productos</h2>
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetCategoryForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Categoría
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{selectedCategory ? 'Editar' : 'Crear'} Categoría</DialogTitle>
                    <DialogDescription>
                      {selectedCategory ? 'Modifica' : 'Crea'} una categoría de productos
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="category-name">Nombre</Label>
                      <Input
                        id="category-name"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nombre de la categoría"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category-description">Descripción</Label>
                      <Textarea
                        id="category-description"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descripción de la categoría"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category-image">URL de Imagen</Label>
                      <Input
                        id="category-image"
                        value={categoryForm.imageUrl}
                        onChange={(e) => setCategoryForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category-parent">Categoría Padre (Opcional)</Label>
                      <Select value={categoryForm.parentId} onValueChange={(value) => setCategoryForm(prev => ({ ...prev, parentId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría padre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Sin categoría padre</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="category-active"
                        checked={categoryForm.isActive}
                        onCheckedChange={(checked) => setCategoryForm(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor="category-active">Categoría Activa</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCategorySubmit}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-6">
                    <img 
                      src={category.imageUrl} 
                      alt={category.name}
                      className="w-full h-32 object-cover rounded mb-4"
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{category.name}</h3>
                      <Badge variant={category.isActive ? 'default' : 'secondary'}>
                        {category.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">
                        {category.productCount} productos
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /{category.slug}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => editCategory(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteCategory(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContentManagement;
