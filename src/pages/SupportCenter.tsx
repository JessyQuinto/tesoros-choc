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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { useToast } from '@/hooks/use-toast';
import { 
  HelpCircle,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Search,
  Filter,
  Mail,
  Phone,
  FileText,
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  ArrowRight,
  Calendar,
  Tag,
  Users,
  BookOpen,
  Lightbulb,
  Settings,
  Save,
  X
} from 'lucide-react';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'payment' | 'shipping' | 'product' | 'account' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  userEmail: string;
  userName: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  responses: SupportResponse[];
}

interface SupportResponse {
  id: string;
  message: string;
  author: string;
  authorType: 'user' | 'admin';
  timestamp: string;
  isInternal: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  viewCount: number;
  helpfulVotes: number;
  notHelpfulVotes: number;
  createdAt: string;
  updatedAt: string;
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  viewCount: number;
  author: string;
  createdAt: string;
  updatedAt: string;
}

const SupportCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('tickets');
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [isFAQDialogOpen, setIsFAQDialogOpen] = useState(false);
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [selectedArticle, setSelectedHelpArticle] = useState<HelpArticle | null>(null);
  const [ticketFilter, setTicketFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: '1',
      title: 'Problema con el pago de mi pedido',
      description: 'No pude completar el pago con mi tarjeta de crédito, aparece un error.',
      category: 'payment',
      priority: 'high',
      status: 'open',
      userEmail: 'maria.lopez@email.com',
      userName: 'María López',
      createdAt: '2024-03-15T10:30:00',
      updatedAt: '2024-03-15T10:30:00',
      responses: []
    },
    {
      id: '2',
      title: '¿Cuándo llegará mi pedido?',
      description: 'Hice un pedido hace una semana y no he recibido información de envío.',
      category: 'shipping',
      priority: 'medium',
      status: 'in-progress',
      userEmail: 'carlos.ruiz@email.com',
      userName: 'Carlos Ruiz',
      assignedTo: 'Ana García',
      createdAt: '2024-03-14T14:20:00',
      updatedAt: '2024-03-15T09:15:00',
      responses: [
        {
          id: '1',
          message: 'Hola Carlos, estamos verificando el estado de tu envío con la transportadora.',
          author: 'Ana García',
          authorType: 'admin',
          timestamp: '2024-03-15T09:15:00',
          isInternal: false
        }
      ]
    },
    {
      id: '3',
      title: 'Producto defectuoso recibido',
      description: 'La artesanía que recibí tiene un defecto en la pintura. Necesito una devolución.',
      category: 'product',
      priority: 'high',
      status: 'resolved',
      userEmail: 'lucia.moreno@email.com',
      userName: 'Lucía Moreno',
      assignedTo: 'Admin',
      createdAt: '2024-03-12T16:45:00',
      updatedAt: '2024-03-14T11:30:00',
      responses: [
        {
          id: '2',
          message: 'Lamentamos mucho este inconveniente. Iniciaremos el proceso de devolución inmediatamente.',
          author: 'Admin',
          authorType: 'admin',
          timestamp: '2024-03-13T10:00:00',
          isInternal: false
        },
        {
          id: '3',
          message: 'Hemos procesado tu devolución. El reembolso se reflejará en 3-5 días hábiles.',
          author: 'Admin',
          authorType: 'admin',
          timestamp: '2024-03-14T11:30:00',
          isInternal: false
        }
      ]
    }
  ]);

  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: '¿Cómo puedo realizar un pedido?',
      answer: 'Para realizar un pedido, navega por nuestro catálogo de productos, selecciona los artículos que deseas, agrégalos al carrito y procede al checkout. Necesitarás crear una cuenta o iniciar sesión.',
      category: 'Pedidos',
      isPublished: true,
      viewCount: 245,
      helpfulVotes: 32,
      notHelpfulVotes: 3,
      createdAt: '2024-03-01T10:00:00',
      updatedAt: '2024-03-01T10:00:00'
    },
    {
      id: '2',
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard), PSE, Nequi, Daviplata y transferencias bancarias. Todos los pagos son procesados de forma segura.',
      category: 'Pagos',
      isPublished: true,
      viewCount: 189,
      helpfulVotes: 28,
      notHelpfulVotes: 2,
      createdAt: '2024-03-01T10:00:00',
      updatedAt: '2024-03-02T15:30:00'
    },
    {
      id: '3',
      question: '¿Cuánto tiempo tarda el envío?',
      answer: 'Los envíos dentro de Colombia tardan entre 3-7 días hábiles. Para ciudades principales (Bogotá, Medellín, Cali) el tiempo es de 2-4 días hábiles.',
      category: 'Envíos',
      isPublished: true,
      viewCount: 156,
      helpfulVotes: 25,
      notHelpfulVotes: 1,
      createdAt: '2024-03-01T10:00:00',
      updatedAt: '2024-03-01T10:00:00'
    },
    {
      id: '4',
      question: '¿Puedo devolver un producto?',
      answer: 'Sí, aceptamos devoluciones dentro de los 15 días posteriores a la entrega, siempre que el producto esté en perfectas condiciones. Los costos de envío de devolución corren por cuenta del comprador, excepto en casos de productos defectuosos.',
      category: 'Devoluciones',
      isPublished: true,
      viewCount: 134,
      helpfulVotes: 22,
      notHelpfulVotes: 4,
      createdAt: '2024-03-01T10:00:00',
      updatedAt: '2024-03-01T10:00:00'
    }
  ]);

  const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([
    {
      id: '1',
      title: 'Guía para nuevos compradores',
      content: '<h2>Bienvenido a Tesoros del Chocó</h2><p>Esta guía te ayudará a navegar por nuestro marketplace...</p>',
      category: 'Guías',
      tags: ['principiantes', 'comprar', 'navegación'],
      isPublished: true,
      viewCount: 89,
      author: 'Admin',
      createdAt: '2024-03-01T10:00:00',
      updatedAt: '2024-03-01T10:00:00'
    },
    {
      id: '2',
      title: 'Cómo cuidar las artesanías',
      content: '<h2>Cuidado y Mantenimiento</h2><p>Las artesanías del Chocó requieren cuidados especiales...</p>',
      category: 'Cuidado de Productos',
      tags: ['mantenimiento', 'cuidado', 'artesanías'],
      isPublished: true,
      viewCount: 67,
      author: 'Admin',
      createdAt: '2024-03-01T10:00:00',
      updatedAt: '2024-03-01T10:00:00'
    }
  ]);

  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: '',
    category: 'other' as SupportTicket['category'],
    priority: 'medium' as SupportTicket['priority']
  });

  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
    category: '',
    isPublished: true
  });

  const [articleForm, setArticleForm] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    isPublished: true
  });

  const [responseForm, setResponseForm] = useState({
    message: '',
    isInternal: false
  });

  const getStatusBadge = (status: SupportTicket['status']) => {
    const variants = {
      'open': 'destructive',
      'in-progress': 'default',
      'resolved': 'secondary',
      'closed': 'outline'
    } as const;
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    const variants = {
      'low': 'outline',
      'medium': 'secondary',
      'high': 'default',
      'urgent': 'destructive'
    } as const;
    
    return <Badge variant={variants[priority]}>{priority}</Badge>;
  };

  const getCategoryIcon = (category: SupportTicket['category']) => {
    const icons = {
      'technical': <Settings className="h-4 w-4" />,
      'payment': <Calendar className="h-4 w-4" />,
      'shipping': <Mail className="h-4 w-4" />,
      'product': <Tag className="h-4 w-4" />,
      'account': <User className="h-4 w-4" />,
      'other': <HelpCircle className="h-4 w-4" />
    };
    
    return icons[category];
  };

  const handleTicketSubmit = () => {
    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      ...ticketForm,
      status: 'open',
      userEmail: user?.email || 'admin@tesoros.com',
      userName: user?.name || 'Admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: []
    };
    
    setSupportTickets(prev => [newTicket, ...prev]);
    setIsTicketDialogOpen(false);
    setTicketForm({
      title: '',
      description: '',
      category: 'other',
      priority: 'medium'
    });
    
    toast({
      title: "Ticket creado",
      description: "El ticket de soporte se ha creado correctamente."
    });
  };

  const handleFAQSubmit = () => {
    if (selectedFAQ) {
      setFaqs(prev => prev.map(faq => 
        faq.id === selectedFAQ.id 
          ? { ...faq, ...faqForm, updatedAt: new Date().toISOString() }
          : faq
      ));
      toast({ title: "FAQ actualizada", description: "Los cambios se han guardado correctamente." });
    } else {
      const newFAQ: FAQ = {
        id: Date.now().toString(),
        ...faqForm,
        viewCount: 0,
        helpfulVotes: 0,
        notHelpfulVotes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setFaqs(prev => [...prev, newFAQ]);
      toast({ title: "FAQ creada", description: "La nueva FAQ se ha creado correctamente." });
    }
    
    setIsFAQDialogOpen(false);
    setFaqForm({
      question: '',
      answer: '',
      category: '',
      isPublished: true
    });
    setSelectedFAQ(null);
  };

  const handleArticleSubmit = () => {
    if (selectedArticle) {
      setHelpArticles(prev => prev.map(article => 
        article.id === selectedArticle.id 
          ? { 
              ...article, 
              ...articleForm, 
              tags: articleForm.tags.split(',').map(tag => tag.trim()),
              updatedAt: new Date().toISOString() 
            }
          : article
      ));
      toast({ title: "Artículo actualizado", description: "Los cambios se han guardado correctamente." });
    } else {
      const newArticle: HelpArticle = {
        id: Date.now().toString(),
        ...articleForm,
        tags: articleForm.tags.split(',').map(tag => tag.trim()),
        viewCount: 0,
        author: user?.name || 'Admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setHelpArticles(prev => [...prev, newArticle]);
      toast({ title: "Artículo creado", description: "El nuevo artículo se ha creado correctamente." });
    }
    
    setIsArticleDialogOpen(false);
    setArticleForm({
      title: '',
      content: '',
      category: '',
      tags: '',
      isPublished: true
    });
    setSelectedHelpArticle(null);
  };

  const addResponse = (ticketId: string) => {
    if (!responseForm.message.trim()) return;
    
    const newResponse: SupportResponse = {
      id: Date.now().toString(),
      message: responseForm.message,
      author: user?.name || 'Admin',
      authorType: 'admin',
      timestamp: new Date().toISOString(),
      isInternal: responseForm.isInternal
    };
    
    setSupportTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { 
            ...ticket, 
            responses: [...ticket.responses, newResponse],
            updatedAt: new Date().toISOString(),
            status: 'in-progress'
          }
        : ticket
    ));
    
    setResponseForm({ message: '', isInternal: false });
    toast({ title: "Respuesta enviada", description: "Tu respuesta se ha enviado correctamente." });
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setSupportTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status, updatedAt: new Date().toISOString() }
        : ticket
    ));
    
    toast({ title: "Estado actualizado", description: `El ticket se ha marcado como ${status}.` });
  };

  const filteredTickets = supportTickets.filter(ticket => {
    const matchesFilter = ticketFilter === 'all' || ticket.status === ticketFilter;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
            <h1 className="text-3xl font-bold mb-2">Centro de Soporte</h1>
            <p className="text-muted-foreground">
              Gestiona tickets de soporte, FAQ y artículos de ayuda
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tickets">Tickets de Soporte</TabsTrigger>
            <TabsTrigger value="faq">Preguntas Frecuentes</TabsTrigger>
            <TabsTrigger value="articles">Artículos de Ayuda</TabsTrigger>
          </TabsList>

          {/* Support Tickets */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Buscar tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Select value={ticketFilter} onValueChange={setTicketFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="open">Abiertos</SelectItem>
                    <SelectItem value="in-progress">En Progreso</SelectItem>
                    <SelectItem value="resolved">Resueltos</SelectItem>
                    <SelectItem value="closed">Cerrados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Ticket
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Ticket de Soporte</DialogTitle>
                    <DialogDescription>
                      Crea un nuevo ticket para registrar una consulta o problema
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ticket-title">Título</Label>
                      <Input
                        id="ticket-title"
                        value={ticketForm.title}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Describe brevemente el problema"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ticket-description">Descripción</Label>
                      <Textarea
                        id="ticket-description"
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe el problema en detalle"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ticket-category">Categoría</Label>
                        <Select value={ticketForm.category} onValueChange={(value: SupportTicket['category']) => setTicketForm(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Técnico</SelectItem>
                            <SelectItem value="payment">Pagos</SelectItem>
                            <SelectItem value="shipping">Envíos</SelectItem>
                            <SelectItem value="product">Productos</SelectItem>
                            <SelectItem value="account">Cuenta</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="ticket-priority">Prioridad</Label>
                        <Select value={ticketForm.priority} onValueChange={(value: SupportTicket['priority']) => setTicketForm(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Baja</SelectItem>
                            <SelectItem value="medium">Media</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                            <SelectItem value="urgent">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleTicketSubmit}>
                      <Save className="h-4 w-4 mr-2" />
                      Crear Ticket
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getCategoryIcon(ticket.category)}
                          <h3 className="font-semibold">{ticket.title}</h3>
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {ticket.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{ticket.userName} ({ticket.userEmail})</span>
                          <span>Creado: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                          {ticket.assignedTo && <span>Asignado a: {ticket.assignedTo}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Select value={ticket.status} onValueChange={(value: SupportTicket['status']) => updateTicketStatus(ticket.id, value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Abierto</SelectItem>
                            <SelectItem value="in-progress">En Progreso</SelectItem>
                            <SelectItem value="resolved">Resuelto</SelectItem>
                            <SelectItem value="closed">Cerrado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Responses */}
                    {ticket.responses.length > 0 && (
                      <div className="border-t pt-4 space-y-3">
                        <h4 className="font-medium">Respuestas:</h4>
                        {ticket.responses.map((response) => (
                          <div key={response.id} className="bg-muted p-3 rounded">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{response.author}</span>
                              <div className="flex items-center gap-2">
                                {response.isInternal && <Badge variant="outline">Interno</Badge>}
                                <span className="text-xs text-muted-foreground">
                                  {new Date(response.timestamp).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm">{response.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Response */}
                    {ticket.status !== 'closed' && (
                      <div className="border-t pt-4 mt-4">
                        <Label htmlFor={`response-${ticket.id}`}>Agregar Respuesta</Label>
                        <Textarea
                          id={`response-${ticket.id}`}
                          value={responseForm.message}
                          onChange={(e) => setResponseForm(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="Escribe tu respuesta..."
                          className="mt-2"
                        />
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`internal-${ticket.id}`}
                              checked={responseForm.isInternal}
                              onChange={(e) => setResponseForm(prev => ({ ...prev, isInternal: e.target.checked }))}
                            />
                            <Label htmlFor={`internal-${ticket.id}`} className="text-sm">
                              Nota interna (no visible para el usuario)
                            </Label>
                          </div>
                          <Button size="sm" onClick={() => addResponse(ticket.id)}>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Enviar
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FAQ Management */}
          <TabsContent value="faq" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Preguntas Frecuentes</h2>
              <Dialog open={isFAQDialogOpen} onOpenChange={setIsFAQDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setSelectedFAQ(null);
                    setFaqForm({
                      question: '',
                      answer: '',
                      category: '',
                      isPublished: true
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva FAQ
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{selectedFAQ ? 'Editar' : 'Crear'} FAQ</DialogTitle>
                    <DialogDescription>
                      {selectedFAQ ? 'Modifica' : 'Crea'} una pregunta frecuente
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="faq-question">Pregunta</Label>
                      <Input
                        id="faq-question"
                        value={faqForm.question}
                        onChange={(e) => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
                        placeholder="¿Cuál es tu pregunta?"
                      />
                    </div>
                    <div>
                      <Label htmlFor="faq-answer">Respuesta</Label>
                      <Textarea
                        id="faq-answer"
                        value={faqForm.answer}
                        onChange={(e) => setFaqForm(prev => ({ ...prev, answer: e.target.value }))}
                        placeholder="Proporciona una respuesta detallada"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="faq-category">Categoría</Label>
                      <Input
                        id="faq-category"
                        value={faqForm.category}
                        onChange={(e) => setFaqForm(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="Ej: Pedidos, Pagos, Envíos"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="faq-published"
                        checked={faqForm.isPublished}
                        onChange={(e) => setFaqForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                      />
                      <Label htmlFor="faq-published">Publicar FAQ</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleFAQSubmit}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {faqs.map((faq) => (
                <Card key={faq.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{faq.question}</h3>
                          <Badge variant={faq.isPublished ? 'default' : 'secondary'}>
                            {faq.isPublished ? 'Publicada' : 'Borrador'}
                          </Badge>
                          <Badge variant="outline">{faq.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {faq.answer}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{faq.viewCount} vistas</span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {faq.helpfulVotes}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsDown className="h-3 w-3" />
                            {faq.notHelpfulVotes}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setSelectedFAQ(faq);
                            setFaqForm({
                              question: faq.question,
                              answer: faq.answer,
                              category: faq.category,
                              isPublished: faq.isPublished
                            });
                            setIsFAQDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setFaqs(prev => prev.filter(f => f.id !== faq.id));
                            toast({ title: "FAQ eliminada", description: "La FAQ se ha eliminado correctamente." });
                          }}
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

          {/* Help Articles */}
          <TabsContent value="articles" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Artículos de Ayuda</h2>
              <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setSelectedHelpArticle(null);
                    setArticleForm({
                      title: '',
                      content: '',
                      category: '',
                      tags: '',
                      isPublished: true
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Artículo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{selectedArticle ? 'Editar' : 'Crear'} Artículo</DialogTitle>
                    <DialogDescription>
                      {selectedArticle ? 'Modifica' : 'Crea'} un artículo de ayuda
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="article-title">Título</Label>
                      <Input
                        id="article-title"
                        value={articleForm.title}
                        onChange={(e) => setArticleForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Título del artículo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="article-content">Contenido</Label>
                      <Textarea
                        id="article-content"
                        value={articleForm.content}
                        onChange={(e) => setArticleForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Contenido del artículo (HTML permitido)"
                        className="min-h-[200px]"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="article-category">Categoría</Label>
                        <Input
                          id="article-category"
                          value={articleForm.category}
                          onChange={(e) => setArticleForm(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="Ej: Guías, Tutoriales"
                        />
                      </div>
                      <div>
                        <Label htmlFor="article-tags">Etiquetas (separadas por comas)</Label>
                        <Input
                          id="article-tags"
                          value={articleForm.tags}
                          onChange={(e) => setArticleForm(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="tag1, tag2, tag3"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="article-published"
                        checked={articleForm.isPublished}
                        onChange={(e) => setArticleForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                      />
                      <Label htmlFor="article-published">Publicar artículo</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleArticleSubmit}>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {helpArticles.map((article) => (
                <Card key={article.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <h3 className="font-semibold">{article.title}</h3>
                          <Badge variant={article.isPublished ? 'default' : 'secondary'}>
                            {article.isPublished ? 'Publicado' : 'Borrador'}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="mb-2">{article.category}</Badge>
                        <div className="flex items-center gap-2 mb-3">
                          {article.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <span>{article.viewCount} vistas</span>
                          <span className="ml-4">Por {article.author}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setSelectedHelpArticle(article);
                            setArticleForm({
                              title: article.title,
                              content: article.content,
                              category: article.category,
                              tags: article.tags.join(', '),
                              isPublished: article.isPublished
                            });
                            setIsArticleDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setHelpArticles(prev => prev.filter(a => a.id !== article.id));
                            toast({ title: "Artículo eliminado", description: "El artículo se ha eliminado correctamente." });
                          }}
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
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default SupportCenter;
