import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings,
  Percent,
  ShieldCheck,
  FileText,
  DollarSign,
  RefreshCw,
  Save,
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  Package,
  MapPin,
  Globe,
  Mail,
  Phone,
  Building,
  Users,
  Palette,
  Type,
  Image,
  Link,
  Plus
} from 'lucide-react';

interface CommissionConfig {
  categoryId: string;
  categoryName: string;
  commissionRate: number;
  isActive: boolean;
}

interface PaymentConfig {
  id: string;
  name: string;
  type: 'credit_card' | 'bank_transfer' | 'digital_wallet' | 'pse';
  isActive: boolean;
  apiKey?: string;
  secretKey?: string;
  merchantId?: string;
  commissionRate: number;
}

interface ReturnPolicy {
  id: string;
  categoryId: string;
  categoryName: string;
  returnPeriodDays: number;
  isReturnable: boolean;
  returnConditions: string[];
  refundType: 'full' | 'partial' | 'store_credit';
  shippingCostResponsibility: 'buyer' | 'seller' | 'marketplace';
}

interface TermsAndConditions {
  id: string;
  section: string;
  title: string;
  content: string;
  lastModified: string;
  isActive: boolean;
}

interface PlatformSettings {
  siteName: string;
  siteDescription: string;
  supportEmail: string;
  supportPhone: string;
  companyAddress: string;
  taxRate: number;
  currency: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  allowGuestCheckout: boolean;
  requireEmailVerification: boolean;
  maxProductImages: number;
  maxFileSize: number;
  autoApproveProducts: boolean;
  autoApproveVendors: boolean;
}

const PlatformConfiguration = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [commissions, setCommissions] = useState<CommissionConfig[]>([
    {
      categoryId: '1',
      categoryName: 'Arte y Decoración',
      commissionRate: 15,
      isActive: true
    },
    {
      categoryId: '2',
      categoryName: 'Joyería y Accesorios',
      commissionRate: 18,
      isActive: true
    },
    {
      categoryId: '3',
      categoryName: 'Textiles',
      commissionRate: 12,
      isActive: true
    },
    {
      categoryId: '4',
      categoryName: 'Alimentación',
      commissionRate: 8,
      isActive: true
    },
    {
      categoryId: '5',
      categoryName: 'Instrumentos Musicales',
      commissionRate: 20,
      isActive: true
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentConfig[]>([
    {
      id: '1',
      name: 'Tarjetas de Crédito/Débito',
      type: 'credit_card',
      isActive: true,
      commissionRate: 3.5
    },
    {
      id: '2',
      name: 'PSE',
      type: 'pse',
      isActive: true,
      commissionRate: 2.8
    },
    {
      id: '3',
      name: 'Nequi',
      type: 'digital_wallet',
      isActive: true,
      commissionRate: 2.2
    },
    {
      id: '4',
      name: 'Daviplata',
      type: 'digital_wallet',
      isActive: true,
      commissionRate: 2.2
    },
    {
      id: '5',
      name: 'Transferencia Bancaria',
      type: 'bank_transfer',
      isActive: false,
      commissionRate: 1.5
    }
  ]);

  const [returnPolicies, setReturnPolicies] = useState<ReturnPolicy[]>([
    {
      id: '1',
      categoryId: '1',
      categoryName: 'Arte y Decoración',
      returnPeriodDays: 15,
      isReturnable: true,
      returnConditions: ['Producto sin usar', 'Empaque original', 'Sin daños'],
      refundType: 'full',
      shippingCostResponsibility: 'buyer'
    },
    {
      id: '2',
      categoryId: '2',
      categoryName: 'Joyería y Accesorios',
      returnPeriodDays: 10,
      isReturnable: true,
      returnConditions: ['Producto sin usar', 'Empaque original', 'Certificados incluidos'],
      refundType: 'full',
      shippingCostResponsibility: 'buyer'
    },
    {
      id: '3',
      categoryId: '4',
      categoryName: 'Alimentación',
      returnPeriodDays: 0,
      isReturnable: false,
      returnConditions: ['No aplica por razones de seguridad alimentaria'],
      refundType: 'full',
      shippingCostResponsibility: 'buyer'
    }
  ]);

  const [termsAndConditions, setTermsAndConditions] = useState<TermsAndConditions[]>([
    {
      id: '1',
      section: 'general',
      title: 'Términos Generales de Uso',
      content: 'Al acceder y utilizar este marketplace, usted acepta cumplir con estos términos y condiciones...',
      lastModified: '2024-03-15',
      isActive: true
    },
    {
      id: '2',
      section: 'sellers',
      title: 'Términos para Vendedores',
      content: 'Los vendedores se comprometen a ofrecer productos auténticos y de calidad...',
      lastModified: '2024-03-15',
      isActive: true
    },
    {
      id: '3',
      section: 'buyers',
      title: 'Términos para Compradores',
      content: 'Los compradores se comprometen a realizar compras de buena fe...',
      lastModified: '2024-03-15',
      isActive: true
    },
    {
      id: '4',
      section: 'privacy',
      title: 'Política de Privacidad',
      content: 'Esta política describe cómo recopilamos, usamos y protegemos su información personal...',
      lastModified: '2024-03-15',
      isActive: true
    },
    {
      id: '5',
      section: 'shipping',
      title: 'Política de Envíos',
      content: 'Los envíos se realizan a través de transportadoras certificadas...',
      lastModified: '2024-03-15',
      isActive: true
    }
  ]);

  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    siteName: 'Tesoros del Chocó',
    siteDescription: 'Marketplace de artesanías tradicionales del Pacífico colombiano',
    supportEmail: 'soporte@tesoroschoco.com',
    supportPhone: '+57 300 123 4567',
    companyAddress: 'Quibdó, Chocó, Colombia',
    taxRate: 19,
    currency: 'COP',
    defaultLanguage: 'es',
    maintenanceMode: false,
    allowGuestCheckout: false,
    requireEmailVerification: true,
    maxProductImages: 10,
    maxFileSize: 5,
    autoApproveProducts: false,
    autoApproveVendors: false
  });

  const [newTerm, setNewTerm] = useState({
    section: '',
    title: '',
    content: ''
  });

  const updateCommission = (categoryId: string, rate: number) => {
    setCommissions(prev => prev.map(comm => 
      comm.categoryId === categoryId 
        ? { ...comm, commissionRate: rate }
        : comm
    ));
  };

  const toggleCommissionStatus = (categoryId: string) => {
    setCommissions(prev => prev.map(comm => 
      comm.categoryId === categoryId 
        ? { ...comm, isActive: !comm.isActive }
        : comm
    ));
  };

  const togglePaymentMethod = (paymentId: string) => {
    setPaymentMethods(prev => prev.map(payment => 
      payment.id === paymentId 
        ? { ...payment, isActive: !payment.isActive }
        : payment
    ));
  };

  const updateReturnPolicy = (policyId: string, field: keyof ReturnPolicy, value: ReturnPolicy[keyof ReturnPolicy]) => {
    setReturnPolicies(prev => prev.map(policy => 
      policy.id === policyId 
        ? { ...policy, [field]: value }
        : policy
    ));
  };

  const updateTermsAndConditions = (termId: string, field: keyof TermsAndConditions, value: TermsAndConditions[keyof TermsAndConditions]) => {
    setTermsAndConditions(prev => prev.map(term => 
      term.id === termId 
        ? { ...term, [field]: value, lastModified: new Date().toISOString().split('T')[0] }
        : term
    ));
  };

  const addNewTerm = () => {
    if (!newTerm.section || !newTerm.title || !newTerm.content) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive"
      });
      return;
    }

    const term: TermsAndConditions = {
      id: Date.now().toString(),
      ...newTerm,
      lastModified: new Date().toISOString().split('T')[0],
      isActive: true
    };

    setTermsAndConditions(prev => [...prev, term]);
    setNewTerm({ section: '', title: '', content: '' });
    
    toast({
      title: "Término agregado",
      description: "El nuevo término se ha agregado correctamente"
    });
  };

  const saveSettings = () => {
    toast({
      title: "Configuración guardada",
      description: "Todos los cambios se han guardado correctamente"
    });
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
            <h1 className="text-3xl font-bold mb-2">Configuración de Plataforma</h1>
            <p className="text-muted-foreground">
              Administra las configuraciones globales del marketplace
            </p>
          </div>
          <Button onClick={saveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>

        <Tabs defaultValue="commissions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="commissions">Comisiones</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
            <TabsTrigger value="returns">Devoluciones</TabsTrigger>
            <TabsTrigger value="terms">Términos</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>

          {/* Commission Configuration */}
          <TabsContent value="commissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Comisiones por Categoría</CardTitle>
                <CardDescription>
                  Define las comisiones que cobrará la plataforma por cada categoría de producto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {commissions.map((commission) => (
                    <div key={commission.categoryId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Switch
                          checked={commission.isActive}
                          onCheckedChange={() => toggleCommissionStatus(commission.categoryId)}
                        />
                        <div>
                          <h3 className="font-medium">{commission.categoryName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Comisión actual: {commission.commissionRate}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-48">
                          <Slider
                            value={[commission.commissionRate]}
                            onValueChange={(value) => updateCommission(commission.categoryId, value[0])}
                            max={30}
                            min={5}
                            step={0.5}
                            disabled={!commission.isActive}
                          />
                        </div>
                        <div className="text-right min-w-[60px]">
                          <span className="text-lg font-bold">{commission.commissionRate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Información importante:</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Las comisiones se cobran automáticamente cuando se completa una venta</li>
                    <li>• Los cambios de comisión aplican solo para nuevas ventas</li>
                    <li>• Las categorías desactivadas no generarán comisiones</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Configuration */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
                <CardDescription>
                  Configura las pasarelas de pago disponibles en la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paymentMethods.map((payment) => (
                    <div key={payment.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={payment.isActive}
                            onCheckedChange={() => togglePaymentMethod(payment.id)}
                          />
                          <CreditCard className="h-5 w-5 text-primary" />
                          <div>
                            <h3 className="font-medium">{payment.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Comisión: {payment.commissionRate}% por transacción
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {payment.isActive ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      {payment.isActive && (
                        <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                          <div>
                            <Label htmlFor={`api-key-${payment.id}`}>API Key</Label>
                            <Input
                              id={`api-key-${payment.id}`}
                              type="password"
                              placeholder="sk_test_..."
                              value={payment.apiKey || ''}
                              onChange={(e) => {
                                setPaymentMethods(prev => prev.map(p => 
                                  p.id === payment.id ? { ...p, apiKey: e.target.value } : p
                                ));
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`secret-key-${payment.id}`}>Secret Key</Label>
                            <Input
                              id={`secret-key-${payment.id}`}
                              type="password"
                              placeholder="sk_live_..."
                              value={payment.secretKey || ''}
                              onChange={(e) => {
                                setPaymentMethods(prev => prev.map(p => 
                                  p.id === payment.id ? { ...p, secretKey: e.target.value } : p
                                ));
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`merchant-id-${payment.id}`}>Merchant ID</Label>
                            <Input
                              id={`merchant-id-${payment.id}`}
                              placeholder="12345678"
                              value={payment.merchantId || ''}
                              onChange={(e) => {
                                setPaymentMethods(prev => prev.map(p => 
                                  p.id === payment.id ? { ...p, merchantId: e.target.value } : p
                                ));
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Return Policies */}
          <TabsContent value="returns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Políticas de Devolución por Categoría</CardTitle>
                <CardDescription>
                  Define las políticas de devolución específicas para cada categoría
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {returnPolicies.map((policy) => (
                    <div key={policy.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">{policy.categoryName}</h3>
                        <Switch
                          checked={policy.isReturnable}
                          onCheckedChange={(checked) => updateReturnPolicy(policy.id, 'isReturnable', checked)}
                        />
                      </div>
                      
                      {policy.isReturnable && (
                        <div className="space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Período de devolución (días)</Label>
                              <Input
                                type="number"
                                value={policy.returnPeriodDays}
                                onChange={(e) => updateReturnPolicy(policy.id, 'returnPeriodDays', parseInt(e.target.value))}
                                min="0"
                                max="30"
                              />
                            </div>
                            <div>
                              <Label>Tipo de reembolso</Label>
                              <Select 
                                value={policy.refundType} 
                                onValueChange={(value: 'full' | 'partial' | 'store_credit') => updateReturnPolicy(policy.id, 'refundType', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="full">Reembolso completo</SelectItem>
                                  <SelectItem value="partial">Reembolso parcial</SelectItem>
                                  <SelectItem value="store_credit">Crédito en tienda</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <div>
                            <Label>Responsable del costo de envío</Label>
                            <Select 
                              value={policy.shippingCostResponsibility} 
                              onValueChange={(value: 'buyer' | 'seller' | 'marketplace') => updateReturnPolicy(policy.id, 'shippingCostResponsibility', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="buyer">Comprador</SelectItem>
                                <SelectItem value="seller">Vendedor</SelectItem>
                                <SelectItem value="marketplace">Marketplace</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Condiciones de devolución</Label>
                            <div className="space-y-2 mt-2">
                              {policy.returnConditions.map((condition, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-sm">{condition}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {!policy.isReturnable && (
                        <div className="text-sm text-muted-foreground">
                          <AlertCircle className="h-4 w-4 inline mr-2" />
                          No se permiten devoluciones para esta categoría
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Terms and Conditions */}
          <TabsContent value="terms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Términos y Condiciones</CardTitle>
                <CardDescription>
                  Gestiona los términos y condiciones de la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Add new term */}
                  <div className="p-4 border-2 border-dashed rounded-lg">
                    <h3 className="font-medium mb-4">Agregar Nueva Sección</h3>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="new-section">Sección</Label>
                          <Select value={newTerm.section} onValueChange={(value) => setNewTerm(prev => ({ ...prev, section: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar sección" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="sellers">Vendedores</SelectItem>
                              <SelectItem value="buyers">Compradores</SelectItem>
                              <SelectItem value="privacy">Privacidad</SelectItem>
                              <SelectItem value="shipping">Envíos</SelectItem>
                              <SelectItem value="returns">Devoluciones</SelectItem>
                              <SelectItem value="payments">Pagos</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="new-title">Título</Label>
                          <Input
                            id="new-title"
                            value={newTerm.title}
                            onChange={(e) => setNewTerm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Título del término"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="new-content">Contenido</Label>
                        <Textarea
                          id="new-content"
                          value={newTerm.content}
                          onChange={(e) => setNewTerm(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Contenido del término..."
                          className="min-h-[100px]"
                        />
                      </div>
                      <Button onClick={addNewTerm}>
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Término
                      </Button>
                    </div>
                  </div>

                  {/* Existing terms */}
                  <div className="space-y-4">
                    {termsAndConditions.map((term) => (
                      <div key={term.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-medium">{term.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="capitalize">{term.section}</span>
                              <span>•</span>
                              <span>Última modificación: {term.lastModified}</span>
                            </div>
                          </div>
                          <Switch
                            checked={term.isActive}
                            onCheckedChange={(checked) => updateTermsAndConditions(term.id, 'isActive', checked)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Contenido</Label>
                          <Textarea
                            value={term.content}
                            onChange={(e) => updateTermsAndConditions(term.id, 'content', e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid gap-6">
              {/* Site Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Información del Sitio</CardTitle>
                  <CardDescription>
                    Configuración básica de la plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="site-name">Nombre del Sitio</Label>
                      <Input
                        id="site-name"
                        value={platformSettings.siteName}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, siteName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Moneda</Label>
                      <Select value={platformSettings.currency} onValueChange={(value) => setPlatformSettings(prev => ({ ...prev, currency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="COP">COP - Peso Colombiano</SelectItem>
                          <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="site-description">Descripción del Sitio</Label>
                    <Textarea
                      id="site-description"
                      value={platformSettings.siteDescription}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="support-email">Email de Soporte</Label>
                      <Input
                        id="support-email"
                        type="email"
                        value={platformSettings.supportEmail}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="support-phone">Teléfono de Soporte</Label>
                      <Input
                        id="support-phone"
                        value={platformSettings.supportPhone}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, supportPhone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="company-address">Dirección de la Empresa</Label>
                    <Textarea
                      id="company-address"
                      value={platformSettings.companyAddress}
                      onChange={(e) => setPlatformSettings(prev => ({ ...prev, companyAddress: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Platform Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Configuraciones de la Plataforma</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="maintenance-mode">Modo de Mantenimiento</Label>
                        <Switch
                          id="maintenance-mode"
                          checked={platformSettings.maintenanceMode}
                          onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="guest-checkout">Permitir Compra como Invitado</Label>
                        <Switch
                          id="guest-checkout"
                          checked={platformSettings.allowGuestCheckout}
                          onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, allowGuestCheckout: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-verification">Requerir Verificación de Email</Label>
                        <Switch
                          id="email-verification"
                          checked={platformSettings.requireEmailVerification}
                          onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, requireEmailVerification: checked }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-approve-products">Auto-aprobar Productos</Label>
                        <Switch
                          id="auto-approve-products"
                          checked={platformSettings.autoApproveProducts}
                          onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, autoApproveProducts: checked }))}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-approve-vendors">Auto-aprobar Vendedores</Label>
                        <Switch
                          id="auto-approve-vendors"
                          checked={platformSettings.autoApproveVendors}
                          onCheckedChange={(checked) => setPlatformSettings(prev => ({ ...prev, autoApproveVendors: checked }))}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="tax-rate">Tasa de Impuesto (%)</Label>
                      <Input
                        id="tax-rate"
                        type="number"
                        value={platformSettings.taxRate}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-product-images">Máximo Imágenes por Producto</Label>
                      <Input
                        id="max-product-images"
                        type="number"
                        value={platformSettings.maxProductImages}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, maxProductImages: parseInt(e.target.value) }))}
                        min="1"
                        max="20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-file-size">Tamaño Máximo de Archivo (MB)</Label>
                      <Input
                        id="max-file-size"
                        type="number"
                        value={platformSettings.maxFileSize}
                        onChange={(e) => setPlatformSettings(prev => ({ ...prev, maxFileSize: parseInt(e.target.value) }))}
                        min="1"
                        max="50"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default PlatformConfiguration;
