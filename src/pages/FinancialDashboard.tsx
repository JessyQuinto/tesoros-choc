import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/contexts/NotificationContext';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Wallet,
  Download,
  BanknoteIcon,
  Calculator,
  Calendar,
  CreditCard,
  Eye,
  Filter,
  BarChart3
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'sale' | 'commission' | 'withdrawal' | 'refund';
  orderId?: string;
  orderNumber?: string;
  productName?: string;
  amount: number;
  commission?: number;
  netAmount: number;
  status: 'completed' | 'pending' | 'processing' | 'failed';
  date: string;
  customer?: string;
  paymentMethod?: string;
  description: string;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  bankAccount: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  fees: number;
  netAmount: number;
}

export const FinancialDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const [periodFilter, setPeriodFilter] = useState('month');
  const [transactionTypeFilter, setTransactionTypeFilter] = useState('all');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');

  // Estado para manejar retiros
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([
    {
      id: '1',
      amount: 300000,
      bankAccount: '****1234',
      status: 'completed',
      requestedAt: '2024-01-20T10:00:00Z',
      processedAt: '2024-01-22T14:30:00Z',
      fees: 4500,
      netAmount: 295500
    },
    {
      id: '2',
      amount: 150000,
      bankAccount: '****1234',
      status: 'pending',
      requestedAt: '2024-01-24T16:20:00Z',
      fees: 2250,
      netAmount: 147750
    }
  ]);

  // Mock financial data
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'sale',
      orderId: '1',
      orderNumber: 'TC-2024-001',
      productName: 'Cesta Artesanal de Palma',
      amount: 90000,
      commission: 13500,
      netAmount: 76500,
      status: 'completed',
      date: '2024-01-25T10:30:00Z',
      customer: 'María González',
      paymentMethod: 'Tarjeta de Crédito',
      description: 'Venta de producto - Cesta Artesanal de Palma (x2)'
    },
    {
      id: '2',
      type: 'sale',
      orderId: '2',
      orderNumber: 'TC-2024-002',
      productName: 'Collar Wayuu Tradicional',
      amount: 65000,
      commission: 9750,
      netAmount: 55250,
      status: 'completed',
      date: '2024-01-23T15:45:00Z',
      customer: 'Carlos Restrepo',
      paymentMethod: 'PSE',
      description: 'Venta de producto - Collar Wayuu Tradicional'
    },
    {
      id: '3',
      type: 'sale',
      orderId: '3',
      orderNumber: 'TC-2024-003',
      productName: 'Máscara Ceremonial',
      amount: 120000,
      commission: 18000,
      netAmount: 102000,
      status: 'pending',
      date: '2024-01-25T09:15:00Z',
      customer: 'Ana López',
      paymentMethod: 'PSE',
      description: 'Venta de producto - Máscara Ceremonial'
    }
  ]);

  // Calculate financial stats
  const completedSales = transactions.filter(t => t.type === 'sale' && t.status === 'completed');
  const pendingSales = transactions.filter(t => t.type === 'sale' && t.status === 'pending');
  const totalWithdrawals = withdrawalRequests
    .filter(w => w.status === 'completed')
    .reduce((sum, w) => sum + w.netAmount, 0);

  const totalRevenue = completedSales.reduce((sum, t) => sum + t.amount, 0);
  const totalCommissions = completedSales.reduce((sum, t) => sum + (t.commission || 0), 0);
  const netEarnings = completedSales.reduce((sum, t) => sum + t.netAmount, 0);
  const pendingRevenue = pendingSales.reduce((sum, t) => sum + t.amount, 0);
  const availableBalance = netEarnings - totalWithdrawals;
  
  const stats = {
    totalRevenue,
    totalCommissions,
    netEarnings,
    pendingRevenue,
    availableBalance,
    totalSales: completedSales.length,
    pendingSales: pendingSales.length,
    commissionRate: 15, // 15% commission
    totalWithdrawals,
    averageOrderValue: completedSales.length > 0 ? totalRevenue / completedSales.length : 0
  };

  // Datos actualizados automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      addNotification({
        title: 'Actualización Financiera',
        message: 'Tus datos financieros han sido actualizados',
        type: 'info',
        category: 'system',
        userId: user?.id || ''
      });
    }, 300000); // Cada 5 minutos

    return () => clearInterval(interval);
  }, [addNotification, user?.id]);

  // Función para solicitar retiro
  const handleWithdrawalRequest = () => {
    const amount = parseFloat(withdrawalAmount);
    
    if (!amount || amount < 50000) {
      toast({
        title: "Error",
        description: "El monto mínimo de retiro es $50,000",
        variant: "destructive"
      });
      return;
    }

    if (!bankAccount) {
      toast({
        title: "Error", 
        description: "Por favor selecciona una cuenta bancaria",
        variant: "destructive"
      });
      return;
    }

    if (amount > stats.availableBalance) {
      toast({
        title: "Error",
        description: "No tienes saldo suficiente disponible",
        variant: "destructive"
      });
      return;
    }

    const fees = amount * 0.015; // 1.5% comisión
    const netAmount = amount - fees;

    const newRequest: WithdrawalRequest = {
      id: `withdrawal-${Date.now()}`,
      amount,
      bankAccount: bankAccount,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      fees,
      netAmount
    };

    setWithdrawalRequests(prev => [newRequest, ...prev]);
    setWithdrawalAmount('');
    setBankAccount('');

    addNotification({
      title: 'Solicitud de Retiro Enviada',
      message: `Tu solicitud de retiro por $${amount.toLocaleString()} ha sido enviada y está en proceso.`,
      type: 'success',
      category: 'account',
      userId: user?.id || ''
    });

    toast({
      title: "Solicitud Enviada",
      description: `Tu solicitud de retiro por $${amount.toLocaleString()} está en proceso.`
    });
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'sale': return 'bg-green-100 text-green-800';
      case 'commission': return 'bg-red-100 text-red-800';
      case 'withdrawal': return 'bg-blue-100 text-blue-800';
      case 'refund': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTransactions = transactions
    .filter(t => transactionTypeFilter === 'all' || t.type === transactionTypeFilter)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (user?.role !== 'seller') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
              <p>Esta área está reservada para vendedores.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dashboard Financiero</h1>
            <p className="text-muted-foreground">
              Gestiona tus ventas, comisiones y retiros
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Reporte
            </Button>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
                <SelectItem value="quarter">Este trimestre</SelectItem>
                <SelectItem value="year">Este año</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Saldo Disponible</CardTitle>
              <Wallet className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">${stats.availableBalance.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-1">Disponible para retiro</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-blue-600 mt-1">Ventas brutas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">Comisiones</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">${stats.totalCommissions.toLocaleString()}</div>
              <p className="text-xs text-orange-600 mt-1">15% de las ventas</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Ventas</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{stats.totalSales}</div>
              <p className="text-xs text-purple-600 mt-1">Productos vendidos</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="transactions">Transacciones</TabsTrigger>
            <TabsTrigger value="withdrawals">Retiros</TabsTrigger>
            <TabsTrigger value="analytics">Análisis</TabsTrigger>
          </TabsList>

          {/* Transacciones */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Historial de Transacciones</CardTitle>
                    <CardDescription>Todas tus ventas y movimientos financieros</CardDescription>
                  </div>
                  <Select value={transactionTypeFilter} onValueChange={setTransactionTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="sale">Ventas</SelectItem>
                      <SelectItem value="withdrawal">Retiros</SelectItem>
                      <SelectItem value="commission">Comisiones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead className="text-right">Neto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString('es-ES')}
                        </TableCell>
                        <TableCell>
                          <Badge className={getTransactionTypeColor(transaction.type)}>
                            {transaction.type === 'sale' ? 'Venta' : transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            {transaction.customer && (
                              <p className="text-sm text-muted-foreground">Cliente: {transaction.customer}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status === 'completed' ? 'Completada' : 
                             transaction.status === 'pending' ? 'Pendiente' : transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          ${transaction.netAmount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Retiros */}
          <TabsContent value="withdrawals">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Solicitar Retiro */}
              <Card>
                <CardHeader>
                  <CardTitle>Solicitar Retiro</CardTitle>
                  <CardDescription>
                    Retira tus ganancias a tu cuenta bancaria
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">
                      Saldo disponible: ${stats.availableBalance.toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Monto mínimo: $50,000 • Comisión: 1.5%
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Monto a retirar</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="50000"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      min={50000}
                      max={stats.availableBalance}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bank">Cuenta bancaria</Label>
                    <Select value={bankAccount} onValueChange={setBankAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona cuenta" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="****1234">Bancolombia ****1234</SelectItem>
                        <SelectItem value="****5678">Banco de Bogotá ****5678</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleWithdrawalRequest}
                    className="w-full"
                    disabled={!withdrawalAmount || !bankAccount}
                  >
                    <BanknoteIcon className="h-4 w-4 mr-2" />
                    Solicitar Retiro
                  </Button>
                </CardContent>
              </Card>

              {/* Historial de Retiros */}
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Retiros</CardTitle>
                  <CardDescription>Tus solicitudes de retiro</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {withdrawalRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">${request.amount.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.requestedAt).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status === 'completed' ? 'Completado' :
                           request.status === 'pending' ? 'Pendiente' :
                           request.status === 'processing' ? 'Procesando' : 'Rechazado'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen Financiero</CardTitle>
                  <CardDescription>Métricas clave de rendimiento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Valor promedio por pedido</span>
                    <span className="font-bold">${stats.averageOrderValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Total retirado</span>
                    <span className="font-bold">${stats.totalWithdrawals.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Pagos pendientes</span>
                    <span className="font-bold text-orange-600">${stats.pendingRevenue.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Próximos Pagos</CardTitle>
                  <CardDescription>Ventas por procesar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingSales.map((sale) => (
                      <div key={sale.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{sale.productName}</p>
                          <p className="text-sm text-muted-foreground">{sale.customer}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${sale.netAmount.toLocaleString()}</p>
                          <Badge className="text-xs">Pendiente</Badge>
                        </div>
                      </div>
                    ))}
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
