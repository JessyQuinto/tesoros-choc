import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import EmailService from '@/services/EmailService';
import { Mail, Eye, Send } from 'lucide-react';

export const EmailPreview = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<'verification' | 'welcome' | 'passwordReset' | 'sellerApproval'>('welcome');
  const [userName, setUserName] = useState('Juan Pérez');
  const [userEmail, setUserEmail] = useState('juan@ejemplo.com');
  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('buyer');
  const [previewHtml, setPreviewHtml] = useState('');

  const generatePreview = () => {
    // Acceso directo a los métodos privados para preview
    let html = '';
    
    if (selectedTemplate === 'welcome') {
      // Simular el template de bienvenida
      html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>¡Bienvenido a Tesoros del Chocó!</title>
            <style>
                body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f8f9fa; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #B8860B 0%, #2F8B5A 50%, #C44D34 100%); padding: 40px 20px; text-align: center; position: relative; }
                .logo { width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; }
                .header h1 { color: white; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
                .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 18px; }
                .content { padding: 40px 20px; }
                .welcome { text-align: center; margin-bottom: 40px; }
                .welcome h2 { color: #1a1a1a; font-size: 28px; margin-bottom: 15px; }
                .welcome p { color: #666; font-size: 18px; line-height: 1.6; margin-bottom: 15px; }
                .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 40px 0; }
                .feature { text-align: center; padding: 20px; background: #f8f9fa; border-radius: 12px; }
                .feature-icon { font-size: 32px; margin-bottom: 10px; }
                .feature h3 { font-size: 16px; color: #1a1a1a; margin-bottom: 5px; }
                .feature p { font-size: 14px; color: #666; margin: 0; }
                .action-button { text-align: center; margin: 40px 0; }
                .button { display: inline-block; background: linear-gradient(135deg, #B8860B 0%, #2F8B5A 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
                .footer { background: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef; }
                .footer p { color: #888; font-size: 14px; margin: 5px 0; }
                @media (max-width: 600px) { .features { grid-template-columns: 1fr; } }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🏔️</div>
                    <h1>¡Bienvenido a Tesoros del Chocó!</h1>
                    <p>Tu aventura comienza aquí</p>
                </div>
                
                <div class="content">
                    <div class="welcome">
                        <h2>¡Hola ${userName}! 👋</h2>
                        <p>¡Qué emoción tenerte con nosotros! Tu cuenta como <strong>${userRole === 'seller' ? 'vendedor' : 'comprador'}</strong> ha sido verificada exitosamente.</p>
                        <p>Estás a punto de descubrir los auténticos tesoros que el Chocó colombiano tiene para ofrecer.</p>
                    </div>
                    
                    <div class="features">
                        <div class="feature">
                            <div class="feature-icon">🛍️</div>
                            <h3>Productos Únicos</h3>
                            <p>Artesanías y productos tradicionales del Chocó</p>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">🤝</div>
                            <h3>Comunidad</h3>
                            <p>Conecta con artesanos y compradores locales</p>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">🚚</div>
                            <h3>Envíos Seguros</h3>
                            <p>Entrega garantizada en todo el país</p>
                        </div>
                        <div class="feature">
                            <div class="feature-icon">💰</div>
                            <h3>Pagos Seguros</h3>
                            <p>Transacciones protegidas y confiables</p>
                        </div>
                    </div>
                    
                    <div class="action-button">
                        <a href="${window.location.origin}" class="button">🚀 Comenzar a explorar</a>
                    </div>
                    
                    ${userRole === 'seller' ? `
                    <div style="background: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 12px; padding: 20px; margin: 30px 0;">
                        <h3 style="color: #1a5f1a; margin-top: 0;">🎯 Para vendedores</h3>
                        <p style="color: #2d5a2d; margin-bottom: 0;">Tu tienda está lista para recibir productos. Publica tus primeros artículos y comienza a vender los tesoros del Chocó.</p>
                    </div>
                    ` : `
                    <div style="background: #e8f4fd; border: 1px solid #c3e0fd; border-radius: 12px; padding: 20px; margin: 30px 0;">
                        <h3 style="color: #1a4c96; margin-top: 0;">🛒 Para compradores</h3>
                        <p style="color: #2d4d7a; margin-bottom: 0;">Explora nuestra colección de productos únicos y descubre los auténticos tesoros que el Chocó tiene para ofrecer.</p>
                    </div>
                    `}
                </div>
                
                <div class="footer">
                    <p><strong>Tesoros del Chocó</strong></p>
                    <p>Conectando el Chocó con el mundo</p>
                    <p style="font-size: 12px; color: #aaa;">
                        © ${new Date().getFullYear()} Tesoros del Chocó. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </body>
        </html>
      `;
    }
    
    setPreviewHtml(html);
  };

  const testWelcomeEmail = async () => {
    try {
      const result = await EmailService.sendWelcomeEmail({
        userName,
        userEmail,
        userRole,
        isApproved: true
      });
      
      if (result.success) {
        alert('✅ Correo de bienvenida enviado exitosamente (simulado)!\nRevisa la consola del navegador para ver el template HTML.');
      } else {
        alert('❌ Error enviando correo: ' + result.message);
      }
    } catch (error) {
      alert('❌ Error: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Panel de Control */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Vista Previa de Correos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <Label>Tipo de Correo</Label>
                <Select value={selectedTemplate} onValueChange={(value: 'verification' | 'welcome' | 'passwordReset' | 'sellerApproval') => setSelectedTemplate(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">🎉 Correo de Bienvenida</SelectItem>
                    <SelectItem value="verification">📧 Verificación de Email</SelectItem>
                    <SelectItem value="passwordReset">🔐 Restablecer Contraseña</SelectItem>
                    <SelectItem value="sellerApproval">✅ Aprobación de Vendedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nombre del Usuario</Label>
                <Input 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <Label>Email del Usuario</Label>
                <Input 
                  type="email"
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="juan@ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Rol del Usuario</Label>
                <Select value={userRole} onValueChange={(value: 'buyer' | 'seller') => setUserRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">🛒 Comprador</SelectItem>
                    <SelectItem value="seller">🏪 Vendedor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Button onClick={generatePreview} className="w-full" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Generar Vista Previa
                </Button>
                
                {selectedTemplate === 'welcome' && (
                  <Button onClick={testWelcomeEmail} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Probar Envío (Simulado)
                  </Button>
                )}
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Información</h4>
                <p className="text-sm text-blue-700">
                  Las plantillas están completamente implementadas. El correo de bienvenida se envía automáticamente cuando se verifica el email.
                </p>
              </div>

            </CardContent>
          </Card>

          {/* Vista Previa */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Vista Previa del Correo</CardTitle>
            </CardHeader>
            <CardContent>
              {previewHtml ? (
                <div className="border rounded-lg overflow-hidden">
                  <iframe 
                    srcDoc={previewHtml}
                    className="w-full h-[800px] border-0"
                    title="Vista previa del correo"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Haz clic en "Generar Vista Previa" para ver el correo</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default EmailPreview;
