import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Send, Search, MessageCircle, User, Clock } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: 'buyer' | 'seller';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar?: string;
  productContext?: {
    id: string;
    name: string;
    image: string;
  };
}

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock conversations data
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      participantId: '2',
      participantName: 'María González',
      participantRole: 'buyer',
      lastMessage: '¿Tienes más cestas disponibles en ese color?',
      lastMessageTime: '2024-01-15T10:30:00',
      unreadCount: 2,
      productContext: {
        id: '1',
        name: 'Cesta Artesanal de Palma',
        image: '/api/placeholder/100/100'
      }
    },
    {
      id: '2',
      participantId: '3',
      participantName: 'Carlos Mosquera',
      participantRole: 'seller',
      lastMessage: 'El pedido está listo para envío',
      lastMessageTime: '2024-01-15T09:15:00',
      unreadCount: 0,
      productContext: {
        id: '2',
        name: 'Collar Wayuu Tradicional',
        image: '/api/placeholder/100/100'
      }
    },
    {
      id: '3',
      participantId: '4',
      participantName: 'Ana Lucía Palacios',
      participantRole: 'seller',
      lastMessage: 'Gracias por tu interés en mis productos',
      lastMessageTime: '2024-01-14T16:45:00',
      unreadCount: 1
    }
  ]);

  // Mock messages for selected conversation
  const [messages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1',
        senderId: '2',
        senderName: 'María González',
        content: '¡Hola! Me encanta la cesta que tienes publicada. ¿Podrías contarme más sobre los materiales?',
        timestamp: '2024-01-15T10:00:00',
        isRead: true
      },
      {
        id: '2',
        senderId: user?.id || '1',
        senderName: user?.name || 'Yo',
        content: 'Hola María! Muchas gracias por tu interés. La cesta está hecha con palma de iraca 100% natural, cosechada de manera sostenible en nuestra región.',
        timestamp: '2024-01-15T10:15:00',
        isRead: true
      },
      {
        id: '3',
        senderId: '2',
        senderName: 'María González',
        content: '¿Tienes más cestas disponibles en ese color?',
        timestamp: '2024-01-15T10:30:00',
        isRead: false
      }
    ],
    '2': [
      {
        id: '4',
        senderId: '3',
        senderName: 'Carlos Mosquera',
        content: 'Hola! Tu pedido del collar Wayuu está listo.',
        timestamp: '2024-01-15T09:00:00',
        isRead: true
      },
      {
        id: '5',
        senderId: '3',
        senderName: 'Carlos Mosquera',
        content: 'El pedido está listo para envío',
        timestamp: '2024-01-15T09:15:00',
        isRead: true
      }
    ]
  });

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const conversationMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    toast({
      title: "Mensaje Enviado",
      description: "Tu mensaje ha sido enviado exitosamente"
    });

    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background"><div className="container-full py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Inicia Sesión</h2>
              <p>Debes iniciar sesión para acceder a tus mensajes.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background"><div className="container-full py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mensajes</h1>
          <p className="text-muted-foreground">Comunícate con compradores y vendedores</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Conversaciones
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar conversaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[400px] overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay conversaciones</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedConversation === conversation.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback>
                            {conversation.participantName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm truncate">
                              {conversation.participantName}
                            </h4>
                            <div className="flex items-center gap-2">
                              {conversation.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatTime(conversation.lastMessageTime)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {conversation.participantRole === 'buyer' ? 'Comprador' : 'Vendedor'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                          
                          {conversation.productContext && (
                            <div className="flex items-center gap-2 mt-2 p-2 bg-muted/50 rounded">
                              <img 
                                src={conversation.productContext.image} 
                                alt={conversation.productContext.name}
                                className="w-6 h-6 rounded object-cover"
                              />
                              <span className="text-xs text-muted-foreground truncate">
                                {conversation.productContext.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation && selectedConv ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedConv.avatar} />
                      <AvatarFallback>
                        {selectedConv.participantName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedConv.participantName}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        {selectedConv.participantRole === 'buyer' ? 'Comprador' : 'Vendedor'}
                        {selectedConv.productContext && (
                          <>
                            <span>•</span>
                            <span>{selectedConv.productContext.name}</span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {conversationMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.senderId === user.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center gap-1 mt-1 text-xs ${
                            message.senderId === user.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            <Clock className="h-3 w-3" />
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Escribe tu mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Selecciona una conversación</h3>
                  <p>Elige una conversación de la lista para comenzar a chatear</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;