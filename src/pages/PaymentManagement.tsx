import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Settings,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Percent,
  Calendar,
  Users,
  Building,
  Banknote,
  Wallet,
  RefreshCw,
  FileText,
  Send,
  Receipt,
  PieChart,
  BarChart3,
  Filter,
  Search
} from 'lucide-react';

interface PaymentGateway {
  id: string;
  name: string;
  provider: string;
  type: 'credit_card' | 'bank_transfer' | 'digital_wallet' | 'crypto';
  isActive: boolean;
  processingFee: number;
  dailyLimit: number;
  monthlyLimit: number;
  supportedCurrencies: string[];
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  testMode: boolean;
  lastTransactionDate: string;
  totalTransactions: number;
  totalVolume: number;
}

interface Commission {
  id: string;
  sellerId: string;
  sellerName: string;
  orderId: string;
  saleAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'calculated' | 'paid' | 'disputed';
  calculatedDate: string;
  paidDate?: string;
  paymentMethod?: string;
  category: string;
}

interface FinancialReport {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalCommissions: number;
  platformFees: number;
  paymentProcessingFees: number;
  netIncome: number;
  transactionCount: number;
  averageOrderValue: number;
  topSellerRevenue: number;
  topSellerName: string;
}

interface PaymentDispute {
  id: string;
  orderId: string;
  buyerName: string;
  sellerName: string;
  amount: number;
  reason: string;
  status: 'open' | 'investigating' | 'resolved' | 'chargeback';
  createdDate: string;
  resolvedDate?: string;
  resolution?: string;
  evidence: string[];
}

const PaymentManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isGatewayDialogOpen, setIsGatewayDialogOpen] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);
  const [commissionFilter, setCommissionFilter] = useState('all');
  const [reportPeriod, setReportPeriod] = useState('month');

  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([
    {
      id: '1',
      name: 'Pasarela Principal',
      provider: 'Mercado Pago',
      type: 'credit_card',
      isActive: true,
      processingFee: 3.5,
      dailyLimit: 10000000,
      monthlyLimit: 300000000,
      supportedCurrencies: ['COP', 'USD'],
      apiKey: 'pk_test_...',
      secretKey: 'sk_test_...',
      webhookUrl: 'https://tesoroschoco.com/webhooks/mercadopago',
      testMode: false,
      lastTransactionDate: '2024-03-15T14:30:00Z',
      totalTransactions: 1247,
      totalVolume: 89500000
    },
    {
      id: '2',
      name: 'PSE Colombia',
      provider: 'ePayco',
      type: 'bank_transfer',
      isActive: true,
      processingFee: 2.8,
      dailyLimit: 20000000,
      monthlyLimit: 600000000,
      supportedCurrencies: ['COP'],
      apiKey: 'pub_test_...',
      secretKey: 'priv_test_...',
      webhookUrl: 'https://tesoroschoco.com/webhooks/epayco',
      testMode: false,
      lastTransactionDate: '2024-03-15T13:45:00Z',
      totalTransactions: 892,
      totalVolume: 45600000
    },
    {
      id: '3',
      name: 'Nequi',
      provider: 'Nequi API',
      type: 'digital_wallet',
      isActive: true,
      processingFee: 2.2,
      dailyLimit: 5000000,
      monthlyLimit: 150000000,
      supportedCurrencies: ['COP'],
      apiKey: 'nequi_test_...',
      secretKey: 'nequi_secret_...',
      webhookUrl: 'https://tesoroschoco.com/webhooks/nequi',
      testMode: false,
      lastTransactionDate: '2024-03-15T12:20:00Z',
      totalTransactions: 567,
      totalVolume: 23400000
    }
  ]);

  const [commissions, setCommissions] = useState<Commission[]>([
    {
      id: '1',
      sellerId: 'seller_123',
      sellerName: 'María López',
      orderId: 'ORD-001',
      saleAmount: 125000,
      commissionRate: 15,
      commissionAmount: 18750,
      status: 'pending',
      calculatedDate: '2024-03-15T10:30:00Z',
      category: 'Arte y Decoración'
    },
    {
      id: '2',
      sellerId: 'seller_456',
      sellerName: 'Carlos Ruiz',
      orderId: 'ORD-002',
      saleAmount: 85000,
      commissionRate: 18,
      commissionAmount: 15300,
      status: 'paid',
      calculatedDate: '2024-03-14T15:20:00Z',
      paidDate: '2024-03-15T09:15:00Z',
      paymentMethod: 'Transferencia Bancaria',
      category: 'Joyería'
    },
    {
      id: '3',
      sellerId: 'seller_789',
      sellerName: 'Pedro Sánchez',
      orderId: 'ORD-003',
      saleAmount: 95000,
      commissionRate: 12,
      commissionAmount: 11400,
      status: 'calculated',
      calculatedDate: '2024-03-14T11:45:00Z',
      category: 'Textiles'
    },
    {
      id: '4',
      sellerId: 'seller_234',
      sellerName: 'Ana Morales',
      orderId: 'ORD-004',
      saleAmount: 67000,
      commissionRate: 8,
      commissionAmount: 5360,
      status: 'disputed',
      calculatedDate: '2024-03-13T16:30:00Z',
      category: 'Alimentación'
    }
  ]);

  const [financialReports, setFinancialReports] = useState<FinancialReport[]>([
    {
      id: '1',
      period: 'Marzo 2024',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      totalRevenue: 18500000,
      totalCommissions: 2775000,
      platformFees: 185000,
      paymentProcessingFees: 647500,
      netIncome: 2312500,
      transactionCount: 234,
      averageOrderValue: 79059,
      topSellerRevenue: 1250000,
      topSellerName: 'María López'
    },
    {
      id: '2',
      period: 'Febrero 2024',
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      totalRevenue: 15200000,
      totalCommissions: 2280000,
      platformFees: 152000,
      paymentProcessingFees: 532000,
      netIncome: 1896000,
      transactionCount: 198,
      averageOrderValue: 76767,
      topSellerRevenue: 980000,
      topSellerName: 'Carlos Ruiz'
    }
  ]);

  const [paymentDisputes, setPaymentDisputes] = useState<PaymentDispute[]>([
    {
      id: '1',
      orderId: 'ORD-156',
      buyerName: 'Luis García',
      sellerName: 'Carmen Díaz',
      amount: 145000,
      reason: 'Producto no recibido',
      status: 'investigating',
      createdDate: '2024-03-14T10:30:00Z',
      evidence: ['tracking_number.pdf', 'communication_logs.txt']
    },
    {
      id: '2',
      orderId: 'ORD-142',
      buyerName: 'Rosa Moreno',
      sellerName: 'Miguel Torres',
      amount: 89000,
      reason: 'Producto defectuoso',
      status: 'resolved',
      createdDate: '2024-03-12T14:20:00Z',
      resolvedDate: '2024-03-15T11:30:00Z',
      resolution: 'Reembolso completo procesado',
      evidence: ['product_photos.jpg', 'defect_report.pdf']
    }
  ]);

  const [gatewayForm, setGatewayForm] = useState({
    name: '',
    provider: '',
    type: 'credit_card' as PaymentGateway['type'],
    processingFee: 0,
    dailyLimit: 0,
    monthlyLimit: 0,
    apiKey: '',
    secretKey: '',
    webhookUrl: '',
    testMode: true
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'destructive',
      'calculated': 'default',
      'paid': 'secondary',
      'disputed': 'outline',
      'open': 'destructive',
      'investigating': 'default',
      'resolved': 'secondary',
      'chargeback': 'destructive'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status.toUpperCase()}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'credit_card': <CreditCard className="h-4 w-4" />,
      'bank_transfer': <Building className="h-4 w-4" />,
      'digital_wallet': <Wallet className="h-4 w-4" />,
      'crypto': <Banknote className="h-4 w-4" />
    };
    
    return icons[type as keyof typeof icons] || <CreditCard className="h-4 w-4" />;
  };

  const handleGatewaySubmit = () => {
    if (selectedGateway) {
      setPaymentGateways(prev => prev.map(gateway => 
        gateway.id === selectedGateway.id 
          ? { ...gateway, ...gatewayForm }
          : gateway
      ));
      toast({ title: "Pasarela actualizada", description: "Los cambios se han guardado correctamente." });
    } else {
      const newGateway: PaymentGateway = {
        id: Date.now().toString(),
        ...gatewayForm,
        isActive: false,
        supportedCurrencies: ['COP'],
        lastTransactionDate: new Date().toISOString(),
        totalTransactions: 0,
        totalVolume: 0
      };
      setPaymentGateways(prev => [...prev, newGateway]);
      toast({ title: "Pasarela creada", description: "La nueva pasarela se ha creado correctamente." });
    }
    
    setIsGatewayDialogOpen(false);
    resetGatewayForm();
  };

  const resetGatewayForm = () => {
    setGatewayForm({
      name: '',
      provider: '',
      type: 'credit_card',
      processingFee: 0,
      dailyLimit: 0,
      monthlyLimit: 0,
      apiKey: '',
      secretKey: '',
      webhookUrl: '',
      testMode: true
    });
    setSelectedGateway(null);
  };

  const editGateway = (gateway: PaymentGateway) => {
    setSelectedGateway(gateway);
    setGatewayForm({
      name: gateway.name,
      provider: gateway.provider,
      type: gateway.type,
      processingFee: gateway.processingFee,
      dailyLimit: gateway.dailyLimit,
      monthlyLimit: gateway.monthlyLimit,
      apiKey: gateway.apiKey,
      secretKey: gateway.secretKey,
      webhookUrl: gateway.webhookUrl,
      testMode: gateway.testMode
    });
    setIsGatewayDialogOpen(true);
  };

  const toggleGatewayStatus = (gatewayId: string) => {
    setPaymentGateways(prev => prev.map(gateway => 
      gateway.id === gatewayId 
        ? { ...gateway, isActive: !gateway.isActive }
        : gateway
    ));
  };

  const payCommission = (commissionId: string) => {
    setCommissions(prev => prev.map(commission => 
      commission.id === commissionId 
        ? { 
            ...commission, 
            status: 'paid',
            paidDate: new Date().toISOString(),
            paymentMethod: 'Transferencia Bancaria'
          }
        : commission
    ));
    toast({ title: "Comisión pagada", description: "El pago se ha procesado correctamente." });
  };

  const filteredCommissions = commissions.filter(commission => 
    commissionFilter === 'all' || commission.status === commissionFilter
  );

  if (user?.role !== 'admin') {
    return (
      <div><div className="container mx-auto px-4 py-8">
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
    <div className="min-h-screen bg-background"><div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Pagos</h1>
            <p className="text-muted-foreground">
              Administra pasarelas de pago, comisiones y reportes financieros
            </p>
          </div>
        </div>

        <Tabs defaultValue="gateways" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="gateways">Pasarelas de Pago</TabsTrigger>
            <TabsTrigger value="commissions">Comisiones</TabsTrigger>
            <TabsTrigger value="reports">Reportes Financieros</TabsTrigger>
            <TabsTrigger value="disputes">Disputas</TabsTrigger>
          </TabsList>

          {/* Payment Gateways */}
          <TabsContent value="gateways" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Pasarelas de Pago</h2>
              <Dialog open={isGatewayDialogOpen} onOpenChange={setIsGatewayDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetGatewayForm}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Nueva Pasarela
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{selectedGateway ? 'Editar' : 'Crear'} Pasarela de Pago</DialogTitle>
                    <DialogDescription>
                      {selectedGateway ? 'Modifica' : 'Configura'} una pasarela de pago
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="gateway-name">Nombre</Label>
                        <Input
                          id="gateway-name"
                          value={gatewayForm.name}
                          onChange={(e) => setGatewayForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Nombre de la pasarela"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gateway-provider">Proveedor</Label>
                        <Input
                          id="gateway-provider"
                          value={gatewayForm.provider}
                          onChange={(e) => setGatewayForm(prev => ({ ...prev, provider: e.target.value }))}
                          placeholder="Ej: Mercado Pago, ePayco"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="gateway-type">Tipo</Label>
                        <Select value={gatewayForm.type} onValueChange={(value: PaymentGateway['type']) => setGatewayForm(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit_card">Tarjeta de Crédito</SelectItem>
                            <SelectItem value="bank_transfer">Transferencia Bancaria</SelectItem>
                            <SelectItem value="digital_wallet">Billetera Digital</SelectItem>
                            <SelectItem value="crypto">Criptomonedas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="gateway-fee">Tarifa de Procesamiento (%)</Label>
                        <Input
                          id="gateway-fee"
                          type="number"
                          value={gatewayForm.processingFee}
                          onChange={(e) => setGatewayForm(prev => ({ ...prev, processingFee: parseFloat(e.target.value) }))}
                          step="0.1"
                          min="0"
                          max="10"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="daily-limit">Límite Diario (COP)</Label>
                        <Input
                          id="daily-limit"
                          type="number"
                          value={gatewayForm.dailyLimit}
                          onChange={(e) => setGatewayForm(prev => ({ ...prev, dailyLimit: parseInt(e.target.value) }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="monthly-limit">Límite Mensual (COP)</Label>
                        <Input
                          id="monthly-limit"
                          type="number"
                          value={gatewayForm.monthlyLimit}
                          onChange={(e) => setGatewayForm(prev => ({ ...prev, monthlyLimit: parseInt(e.target.value) }))}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        value={gatewayForm.apiKey}
                        onChange={(e) => setGatewayForm(prev => ({ ...prev, apiKey: e.target.value }))}
                        placeholder="pk_test_..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="secret-key">Secret Key</Label>
                      <Input
                        id="secret-key"
                        type="password"
                        value={gatewayForm.secretKey}
                        onChange={(e) => setGatewayForm(prev => ({ ...prev, secretKey: e.target.value }))}
                        placeholder="sk_test_..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input
                        id="webhook-url"
                        value={gatewayForm.webhookUrl}
                        onChange={(e) => setGatewayForm(prev => ({ ...prev, webhookUrl: e.target.value }))}
                        placeholder="https://tesoroschoco.com/webhooks/..."
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="test-mode"
                        checked={gatewayForm.testMode}
                        onCheckedChange={(checked) => setGatewayForm(prev => ({ ...prev, testMode: checked }))}
                      />
                      <Label htmlFor="test-mode">Modo de Prueba</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleGatewaySubmit}>
                      Guardar Pasarela
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Gateway Statistics */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pasarelas Activas</p>
                      <p className="text-2xl font-bold">{paymentGateways.filter(g => g.isActive).length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Volumen Total</p>
                      <p className="text-2xl font-bold">$158.5M</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Transacciones</p>
                      <p className="text-2xl font-bold">2,706</p>
                    </div>
                    <Receipt className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tasa de Éxito</p>
                      <p className="text-2xl font-bold">98.5%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Gateways List */}
            <div className="space-y-4">
              {paymentGateways.map((gateway) => (
                <Card key={gateway.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getTypeIcon(gateway.type)}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{gateway.name}</h3>
                            <Badge variant={gateway.isActive ? 'default' : 'secondary'}>
                              {gateway.isActive ? 'Activa' : 'Inactiva'}
                            </Badge>
                            {gateway.testMode && (
                              <Badge variant="outline">Modo Prueba</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Proveedor: {gateway.provider} • Tarifa: {gateway.processingFee}%
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>{gateway.totalTransactions.toLocaleString()} transacciones</span>
                            <span>Volumen: ${(gateway.totalVolume / 1000000).toFixed(1)}M</span>
                            <span>Última: {new Date(gateway.lastTransactionDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={gateway.isActive}
                          onCheckedChange={() => toggleGatewayStatus(gateway.id)}
                        />
                        <Button size="sm" variant="outline" onClick={() => editGateway(gateway)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Commissions */}
          <TabsContent value="commissions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Gestión de Comisiones</h2>
              <div className="flex items-center gap-2">
                <Select value={commissionFilter} onValueChange={setCommissionFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="calculated">Calculadas</SelectItem>
                    <SelectItem value="paid">Pagadas</SelectItem>
                    <SelectItem value="disputed">Disputadas</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            {/* Commission Summary */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Comisiones Pendientes</p>
                      <p className="text-2xl font-bold">$18,750</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Pagado</p>
                      <p className="text-2xl font-bold">$2.28M</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">En Disputa</p>
                      <p className="text-2xl font-bold">$5,360</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tasa Promedio</p>
                      <p className="text-2xl font-bold">13.25%</p>
                    </div>
                    <Percent className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Commissions List */}
            <div className="space-y-4">
              {filteredCommissions.map((commission) => (
                <Card key={commission.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{commission.sellerName}</h3>
                          {getStatusBadge(commission.status)}
                          <Badge variant="outline">{commission.category}</Badge>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Orden: </span>
                            <span className="font-mono">{commission.orderId}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Venta: </span>
                            <span className="font-medium">${commission.saleAmount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Comisión: </span>
                            <span className="font-medium">${commission.commissionAmount.toLocaleString()} ({commission.commissionRate}%)</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Calculada: </span>
                            <span>{new Date(commission.calculatedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {commission.paidDate && (
                          <div className="mt-2 text-sm text-green-600">
                            Pagada el {new Date(commission.paidDate).toLocaleDateString()} via {commission.paymentMethod}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {commission.status === 'calculated' && (
                          <Button size="sm" onClick={() => payCommission(commission.id)}>
                            <Send className="h-4 w-4 mr-2" />
                            Pagar
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Financial Reports */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Reportes Financieros</h2>
              <div className="flex items-center gap-2">
                <Select value={reportPeriod} onValueChange={setReportPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Semanal</SelectItem>
                    <SelectItem value="month">Mensual</SelectItem>
                    <SelectItem value="quarter">Trimestral</SelectItem>
                    <SelectItem value="year">Anual</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Generar Reporte
                </Button>
              </div>
            </div>

            {/* Financial Reports List */}
            <div className="space-y-4">
              {financialReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{report.period}</span>
                      <Badge variant="secondary">
                        {report.transactionCount} transacciones
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {report.startDate} - {report.endDate}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">
                          ${(report.totalRevenue / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          ${(report.totalCommissions / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-sm text-muted-foreground">Comisiones</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">
                          ${(report.paymentProcessingFees / 1000).toFixed(0)}K
                        </p>
                        <p className="text-sm text-muted-foreground">Tarifas Procesamiento</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          ${(report.netIncome / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-sm text-muted-foreground">Ingreso Neto</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">
                          ${(report.averageOrderValue / 1000).toFixed(0)}K
                        </p>
                        <p className="text-sm text-muted-foreground">Ticket Promedio</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-muted rounded">
                      <p className="text-sm">
                        <span className="font-medium">Top Vendedor: </span>
                        {report.topSellerName} con ${(report.topSellerRevenue / 1000000).toFixed(1)}M en ventas
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Payment Disputes */}
          <TabsContent value="disputes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Disputas de Pago</h2>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Exportar Disputas
              </Button>
            </div>

            {/* Disputes List */}
            <div className="space-y-4">
              {paymentDisputes.map((dispute) => (
                <Card key={dispute.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">Orden {dispute.orderId}</h3>
                          {getStatusBadge(dispute.status)}
                        </div>
                        <p className="text-sm mb-2">
                          <span className="font-medium">Motivo:</span> {dispute.reason}
                        </p>
                        <div className="grid md:grid-cols-3 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">Comprador: </span>
                            <span>{dispute.buyerName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Vendedor: </span>
                            <span>{dispute.sellerName}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Monto: </span>
                            <span className="font-medium">${dispute.amount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Creada: {new Date(dispute.createdDate).toLocaleString()}
                          {dispute.resolvedDate && (
                            <span> • Resuelta: {new Date(dispute.resolvedDate).toLocaleString()}</span>
                          )}
                        </div>
                        {dispute.evidence.length > 0 && (
                          <div className="mt-2">
                            <span className="text-sm text-muted-foreground">Evidencia: </span>
                            {dispute.evidence.map((evidence, index) => (
                              <Badge key={index} variant="outline" className="mr-1">
                                {evidence}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {dispute.resolution && (
                          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                            <span className="font-medium text-green-800">Resolución: </span>
                            <span className="text-green-700">{dispute.resolution}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {dispute.status === 'open' && (
                          <Button size="sm" variant="outline">
                            Investigar
                          </Button>
                        )}
                        {dispute.status === 'investigating' && (
                          <Button size="sm">
                            Resolver
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div></div>
  );
};

export default PaymentManagement;
