import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  Calendar,
  Download,
  Filter,
  MapPin,
  Tag,
  PieChart,
  LineChart,
  Activity,
  Target,
  ShoppingCart,
  Eye
} from 'lucide-react';

interface SalesReport {
  period: string;
  totalSales: number;
  totalRevenue: number;
  commission: number;
  orders: number;
  growth: number;
}

interface RegionReport {
  region: string;
  department: string;
  sales: number;
  revenue: number;
  sellers: number;
  topCategory: string;
}

interface CategoryReport {
  category: string;
  products: number;
  sales: number;
  revenue: number;
  growth: number;
  averagePrice: number;
}

interface GrowthMetrics {
  metric: string;
  current: number;
  previous: number;
  growth: number;
  trend: 'up' | 'down' | 'stable';
}

const AdminReports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [salesReports] = useState<SalesReport[]>([
    {
      period: 'Enero 2024',
      totalSales: 234,
      totalRevenue: 12500000,
      commission: 1875000,
      orders: 189,
      growth: 15.2
    },
    {
      period: 'Febrero 2024',
      totalSales: 287,
      totalRevenue: 15200000,
      commission: 2280000,
      orders: 234,
      growth: 21.6
    },
    {
      period: 'Marzo 2024',
      totalSales: 356,
      totalRevenue: 18900000,
      commission: 2835000,
      orders: 298,
      growth: 24.0
    }
  ]);

  const [regionReports] = useState<RegionReport[]>([
    {
      region: 'Chocó',
      department: 'Chocó',
      sales: 145,
      revenue: 8500000,
      sellers: 23,
      topCategory: 'Arte y Decoración'
    },
    {
      region: 'Antioquia',
      department: 'Antioquia',
      sales: 89,
      revenue: 5200000,
      sellers: 15,
      topCategory: 'Joyería y Accesorios'
    },
    {
      region: 'Valle del Cauca',
      department: 'Valle del Cauca',
      sales: 67,
      revenue: 3800000,
      sellers: 12,
      topCategory: 'Textiles'
    },
    {
      region: 'Bogotá D.C.',
      department: 'Cundinamarca',
      sales: 55,
      revenue: 3500000,
      sellers: 8,
      topCategory: 'Alimentación'
    }
  ]);

  const [categoryReports] = useState<CategoryReport[]>([
    {
      category: 'Arte y Decoración',
      products: 89,
      sales: 145,
      revenue: 8200000,
      growth: 18.5,
      averagePrice: 56551
    },
    {
      category: 'Joyería y Accesorios',
      products: 67,
      sales: 123,
      revenue: 6800000,
      growth: 25.3,
      averagePrice: 55284
    },
    {
      category: 'Textiles',
      products: 45,
      sales: 98,
      revenue: 4500000,
      growth: 12.8,
      averagePrice: 45918
    },
    {
      category: 'Alimentación',
      products: 34,
      sales: 156,
      revenue: 3200000,
      growth: 8.2,
      averagePrice: 20512
    },
    {
      category: 'Instrumentos Musicales',
      products: 23,
      sales: 34,
      revenue: 2100000,
      growth: 15.7,
      averagePrice: 61764
    }
  ]);

  const [growthMetrics] = useState<GrowthMetrics[]>([
    {
      metric: 'Usuarios Activos',
      current: 1250,
      previous: 1089,
      growth: 14.8,
      trend: 'up'
    },
    {
      metric: 'Vendedores Nuevos',
      current: 23,
      previous: 18,
      growth: 27.8,
      trend: 'up'
    },
    {
      metric: 'Productos Publicados',
      current: 189,
      previous: 156,
      growth: 21.2,
      trend: 'up'
    },
    {
      metric: 'Ticket Promedio',
      current: 68500,
      previous: 72300,
      growth: -5.3,
      trend: 'down'
    },
    {
      metric: 'Tasa de Conversión',
      current: 3.8,
      previous: 3.5,
      growth: 8.6,
      trend: 'up'
    },
    {
      metric: 'Tiempo en Sitio (min)',
      current: 8.4,
      previous: 7.2,
      growth: 16.7,
      trend: 'up'
    }
  ]);

  const handleExportReport = (type: string) => {
    toast({
      title: "Exportando reporte",
      description: `Generando reporte de ${type} en formato Excel...`
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-destructive mb-4">Acceso Denegado</h2>
            <p>Esta área está reservada para administradores.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reportes y Análisis</h1>
            <p className="text-muted-foreground">
              Análisis detallado del rendimiento del marketplace
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mes</SelectItem>
                <SelectItem value="quarter">Este Trimestre</SelectItem>
                <SelectItem value="year">Este Año</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => handleExportReport('general')}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="financial" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="financial">Financiero</TabsTrigger>
            <TabsTrigger value="regional">Por Región</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
            <TabsTrigger value="growth">Crecimiento</TabsTrigger>
          </TabsList>

          {/* Financial Reports */}
          <TabsContent value="financial" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$46.6M</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+20.1%</span> vs mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Comisiones</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$6.99M</div>
                  <p className="text-xs text-muted-foreground">
                    15% de comisión promedio
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Órdenes</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">721</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+24.0%</span> crecimiento
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$64,600</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-600">-5.3%</span> vs período anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sales Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Ventas</CardTitle>
                <CardDescription>
                  Evolución de ingresos y comisiones por período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {salesReports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{report.period}</h3>
                        <p className="text-sm text-muted-foreground">
                          {report.orders} órdenes • {report.totalSales} productos vendidos
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          ${(report.totalRevenue / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Comisión: ${(report.commission / 1000000).toFixed(1)}M
                        </div>
                        <div className={`text-sm ${getTrendColor(report.growth)}`}>
                          {report.growth > 0 ? '+' : ''}{report.growth}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button onClick={() => handleExportReport('financiero')} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Reporte Financiero
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regional Reports */}
          <TabsContent value="regional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis por Región</CardTitle>
                <CardDescription>
                  Rendimiento de ventas y vendedores por departamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionReports.map((region, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold">{region.region}</h3>
                          <Badge variant="secondary">{region.department}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${(region.revenue / 1000000).toFixed(1)}M</div>
                          <div className="text-sm text-muted-foreground">{region.sales} ventas</div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Vendedores: </span>
                          <span className="font-medium">{region.sellers}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Categoría Top: </span>
                          <span className="font-medium">{region.topCategory}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Promedio/Venta: </span>
                          <span className="font-medium">${Math.round(region.revenue / region.sales).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button onClick={() => handleExportReport('regional')} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Análisis Regional
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Category Reports */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Categoría</CardTitle>
                <CardDescription>
                  Análisis de productos y ventas por categoría de artesanías
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryReports.map((category, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold">{category.category}</h3>
                          <Badge 
                            variant={category.growth > 15 ? 'default' : category.growth > 0 ? 'secondary' : 'destructive'}
                          >
                            {category.growth > 0 ? '+' : ''}{category.growth}%
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${(category.revenue / 1000000).toFixed(1)}M</div>
                          <div className="text-sm text-muted-foreground">{category.sales} ventas</div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Productos: </span>
                          <span className="font-medium">{category.products}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Precio Promedio: </span>
                          <span className="font-medium">${category.averagePrice.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Conversión: </span>
                          <span className="font-medium">{((category.sales / category.products) * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tendencia: </span>
                          <span className={`font-medium ${getTrendColor(category.growth)}`}>
                            {getTrendIcon(category.growth > 0 ? 'up' : category.growth < 0 ? 'down' : 'stable')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button onClick={() => handleExportReport('categorias')} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Análisis de Categorías
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Growth Metrics */}
          <TabsContent value="growth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Crecimiento</CardTitle>
                <CardDescription>
                  Indicadores clave de rendimiento del marketplace
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {growthMetrics.map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-sm">{metric.metric}</h3>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="text-2xl font-bold mb-1">
                        {metric.metric.includes('$') || metric.metric.includes('Promedio') 
                          ? `$${metric.current.toLocaleString()}` 
                          : metric.current.toLocaleString()
                        }
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">vs anterior:</span>
                        <span className={getTrendColor(metric.growth)}>
                          {metric.growth > 0 ? '+' : ''}{metric.growth}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Anterior: {metric.previous.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button onClick={() => handleExportReport('crecimiento')} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Métricas de Crecimiento
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Growth Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Tendencias</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nuevos registros diarios</span>
                      <Badge className="bg-green-100 text-green-800">+18%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tiempo promedio en sitio</span>
                      <Badge className="bg-green-100 text-green-800">+16.7%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Productos por vendedor</span>
                      <Badge className="bg-blue-100 text-blue-800">+12%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Páginas vistas por sesión</span>
                      <Badge className="bg-green-100 text-green-800">+8.3%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Áreas de Oportunidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ticket promedio</span>
                      <Badge variant="destructive">-5.3%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tasa de abandono carrito</span>
                      <Badge className="bg-yellow-100 text-yellow-800">68%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Devoluciones</span>
                      <Badge className="bg-yellow-100 text-yellow-800">+2.1%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tiempo resp. vendedores</span>
                      <Badge className="bg-yellow-100 text-yellow-800">4.2h</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminReports;
