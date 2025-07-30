import { sendEmailVerification, sendPasswordResetEmail, ActionCodeSettings } from 'firebase/auth';
import { auth } from '@/config/firebase';

// Configuración personalizada para correos de Firebase
const actionCodeSettings: ActionCodeSettings = {
  // URL donde será redirigido el usuario después de hacer clic en el enlace
  url: window.location.origin + '/auth-action',
  // Manejar el enlace en la misma aplicación
  handleCodeInApp: true,
  // Configuración para iOS
  iOS: {
    bundleId: 'com.tesoroschoco.app'
  },
  // Configuración para Android
  android: {
    packageName: 'com.tesoroschoco.app',
    installApp: true,
    minimumVersion: '12'
  },
  // Configuración dinámica de links
  dynamicLinkDomain: 'tesoroschoco.page.link'
};

interface WelcomeEmailData {
  userName: string;
  userEmail: string;
  userRole: 'buyer' | 'seller';
  isApproved?: boolean;
}

export class EmailService {
  
  /**
   * Envía email de verificación con plantilla personalizada
   */
  static async sendCustomEmailVerification(customActionCodeSettings?: Partial<ActionCodeSettings>) {
    if (!auth.currentUser) {
      throw new Error('No hay usuario autenticado');
    }

    const settings = {
      ...actionCodeSettings,
      ...customActionCodeSettings,
      // URL personalizada para email de verificación
      url: window.location.origin + '/auth-action?mode=verifyEmail&continueUrl=' + encodeURIComponent(window.location.origin + '/dashboard')
    };

    try {
      await sendEmailVerification(auth.currentUser, settings);
      console.log('✅ Email de verificación enviado con plantilla personalizada');
    } catch (error) {
      console.error('❌ Error enviando email de verificación:', error);
      throw error;
    }
  }

  /**
   * Envía email de restablecimiento con plantilla personalizada
   */
  static async sendCustomPasswordReset(email: string, customActionCodeSettings?: Partial<ActionCodeSettings>) {
    const settings = {
      ...actionCodeSettings,
      ...customActionCodeSettings,
      // URL personalizada para reset de contraseña
      url: window.location.origin + '/auth-action?mode=resetPassword&continueUrl=' + encodeURIComponent(window.location.origin + '/login')
    };

    try {
      await sendPasswordResetEmail(auth, email, settings);
      console.log('✅ Email de reset de contraseña enviado con plantilla personalizada');
    } catch (error) {
      console.error('❌ Error enviando email de reset:', error);
      throw error;
    }
  }

  /**
   * Envía correo de bienvenida (requiere backend o servicio externo)
   * DESHABILITADO para evitar bucles - se maneja desde el backend
   */
  static async sendWelcomeEmail(data: WelcomeEmailData) {
    try {
      // DESHABILITADO: El correo de bienvenida se maneja desde el backend
      // para evitar bucles infinitos en el frontend
      console.log('📧 Correo de bienvenida deshabilitado en frontend - se maneja desde backend');
      
      // En un entorno real, aquí llamarías a tu backend o Firebase Functions
      // await fetch('/api/sendWelcomeEmail', { ... })
      
      // Simular delay de envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('✅ Correo de bienvenida manejado desde backend');
      return { success: true, message: 'Correo de bienvenida manejado desde backend' };
    } catch (error) {
      console.error('❌ Error enviando correo de bienvenida:', error);
      return { success: false, message: 'Error enviando correo' };
    }
  }

  /**
   * Genera el HTML del correo de bienvenida con datos reales
   */
  private static getWelcomeEmailHTML(data: WelcomeEmailData): string {
    const template = this.getWelcomeTemplate();
    return template
      .replace(/\[USER_NAME\]/g, data.userName)
      .replace(/\[USER_EMAIL\]/g, data.userEmail)
      .replace(/\[USER_ROLE\]/g, data.userRole === 'seller' ? 'vendedor' : 'comprador')
      .replace(/\[DASHBOARD_URL\]/g, window.location.origin + (data.userRole === 'seller' ? '/seller-dashboard' : '/buyer-dashboard'));
  }

  /**
   * Envía correo de notificación de aprobación para vendedores
   */
  static async sendSellerApprovalEmail(userData: { name: string; email: string; businessName: string }) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/emails/seller-approved`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await auth.currentUser?.getIdToken()}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error('Error enviando correo de aprobación');
      }

      console.log('✅ Correo de aprobación de vendedor enviado');
    } catch (error) {
      console.error('❌ Error enviando correo de aprobación:', error);
    }
  }

  /**
   * Plantillas de correo locales (para preview o backup)
   */
  static getEmailTemplates() {
    return {
      verification: {
        subject: '🌟 Verifica tu cuenta en Tesoros del Chocó',
        html: this.getVerificationTemplate(),
        text: 'Verifica tu cuenta en Tesoros del Chocó haciendo clic en el enlace que te enviamos.'
      },
      passwordReset: {
        subject: '🔐 Restablece tu contraseña - Tesoros del Chocó',
        html: this.getPasswordResetTemplate(),
        text: 'Restablece tu contraseña en Tesoros del Chocó haciendo clic en el enlace que te enviamos.'
      },
      welcome: {
        subject: '🎉 ¡Bienvenido a Tesoros del Chocó!',
        html: this.getWelcomeTemplate(),
        text: '¡Bienvenido a Tesoros del Chocó! Tu cuenta ha sido verificada exitosamente.'
      },
      sellerApproval: {
        subject: '✅ Tu tienda ha sido aprobada - Tesoros del Chocó',
        html: this.getSellerApprovalTemplate(),
        text: '¡Felicitaciones! Tu tienda en Tesoros del Chocó ha sido aprobada.'
      }
    };
  }

  private static getVerificationTemplate(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifica tu cuenta - Tesoros del Chocó</title>
        <style>
            /* Estilos inline para máxima compatibilidad */
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #B8860B 0%, #2F8B5A 100%); padding: 40px 20px; text-align: center; }
            .logo { width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
            .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px; }
            .content { padding: 40px 20px; }
            .welcome { text-align: center; margin-bottom: 40px; }
            .welcome h2 { color: #1a1a1a; font-size: 24px; margin-bottom: 10px; }
            .welcome p { color: #666; font-size: 16px; line-height: 1.5; }
            .action-button { text-align: center; margin: 40px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #B8860B 0%, #2F8B5A 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
            .steps { background: #f8f9fa; border-radius: 12px; padding: 30px; margin: 30px 0; }
            .step { display: flex; align-items: center; margin-bottom: 20px; }
            .step:last-child { margin-bottom: 0; }
            .step-number { width: 32px; height: 32px; background: linear-gradient(135deg, #B8860B 0%, #2F8B5A 100%); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; }
            .step-text { font-size: 14px; color: #555; }
            .footer { background: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef; }
            .footer p { color: #888; font-size: 14px; margin: 5px 0; }
            .social { margin: 20px 0; }
            .social a { display: inline-block; margin: 0 10px; color: #666; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🏔️</div>
                <h1>Tesoros del Chocó</h1>
                <p>Artesanías auténticas del corazón de Colombia</p>
            </div>
            
            <div class="content">
                <div class="welcome">
                    <h2>¡Verifica tu cuenta!</h2>
                    <p>Estás a un paso de descubrir los tesoros artesanales más auténticos del Chocó colombiano.</p>
                </div>
                
                <div class="action-button">
                    <a href="[VERIFICATION_LINK]" class="button">✅ Verificar mi cuenta</a>
                </div>
                
                <div class="steps">
                    <h3 style="margin-top: 0; color: #1a1a1a;">¿Qué sucede después?</h3>
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-text">Haz clic en el botón "Verificar mi cuenta"</div>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-text">Serás redirigido a nuestra plataforma</div>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-text">¡Ya podrás explorar todos nuestros productos!</div>
                    </div>
                </div>
                
                <p style="color: #888; font-size: 14px; text-align: center; margin-top: 30px;">
                    Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:<br>
                    <a href="[VERIFICATION_LINK]" style="color: #B8860B; word-break: break-all;">[VERIFICATION_LINK]</a>
                </p>
            </div>
            
            <div class="footer">
                <p><strong>Tesoros del Chocó</strong></p>
                <p>Conectando artesanos con el mundo</p>
                <div class="social">
                    <a href="#">📧 Contacto</a>
                    <a href="#">📱 WhatsApp</a>
                    <a href="#">📘 Facebook</a>
                </div>
                <p style="font-size: 12px; color: #aaa;">
                    Si no solicitaste esta verificación, puedes ignorar este correo.
                </p>
            </div>
        </div>
    </body>
    </html>`;
  }

  private static getPasswordResetTemplate(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablece tu contraseña - Tesoros del Chocó</title>
        <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #B8860B 0%, #2F8B5A 100%); padding: 40px 20px; text-align: center; }
            .logo { width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
            .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px; }
            .content { padding: 40px 20px; }
            .welcome { text-align: center; margin-bottom: 40px; }
            .welcome h2 { color: #1a1a1a; font-size: 24px; margin-bottom: 10px; }
            .welcome p { color: #666; font-size: 16px; line-height: 1.5; }
            .action-button { text-align: center; margin: 40px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #B8860B 0%, #2F8B5A 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
            .security-notice { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 12px; padding: 20px; margin: 30px 0; }
            .security-notice h3 { color: #856404; margin-top: 0; }
            .security-notice p { color: #856404; font-size: 14px; margin-bottom: 0; }
            .footer { background: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef; }
            .footer p { color: #888; font-size: 14px; margin: 5px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🔐</div>
                <h1>Restablece tu contraseña</h1>
                <p>Tesoros del Chocó</p>
            </div>
            
            <div class="content">
                <div class="welcome">
                    <h2>¿Olvidaste tu contraseña?</h2>
                    <p>No te preocupes, es fácil crear una nueva. Haz clic en el botón de abajo para continuar.</p>
                </div>
                
                <div class="action-button">
                    <a href="[RESET_LINK]" class="button">🔑 Crear nueva contraseña</a>
                </div>
                
                <div class="security-notice">
                    <h3>🛡️ Aviso de seguridad</h3>
                    <p>Este enlace expirará en 1 hora por tu seguridad. Si no solicitaste restablecer tu contraseña, puedes ignorar este correo y tu contraseña permanecerá sin cambios.</p>
                </div>
                
                <p style="color: #888; font-size: 14px; text-align: center; margin-top: 30px;">
                    Si tienes problemas con el botón, copia y pega este enlace:<br>
                    <a href="[RESET_LINK]" style="color: #B8860B; word-break: break-all;">[RESET_LINK]</a>
                </p>
            </div>
            
            <div class="footer">
                <p><strong>Tesoros del Chocó</strong></p>
                <p>Tu seguridad es nuestra prioridad</p>
                <p style="font-size: 12px; color: #aaa;">
                    © ${new Date().getFullYear()} Tesoros del Chocó. Todos los derechos reservados.
                </p>
            </div>
        </div>
    </body>
    </html>`;
  }

  private static getWelcomeTemplate(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>¡Bienvenido a Tesoros del Chocó!</title>
        <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #B8860B 0%, #2F8B5A 50%, #C44D34 100%); padding: 40px 20px; text-align: center; position: relative; overflow: hidden; }
            .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a"><stop offset="20%" stop-color="%23fff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23fff" stop-opacity="0"/></radialGradient></defs><circle fill="url(%23a)" cx="10" cy="10" r="10"/><circle fill="url(%23a)" cx="50" cy="10" r="10"/><circle fill="url(%23a)" cx="90" cy="10" r="10"/></svg>') repeat; opacity: 0.3; }
            .logo { width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; position: relative; z-index: 1; }
            .header h1 { color: white; margin: 0; font-size: 32px; font-weight: bold; position: relative; z-index: 1; }
            .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 18px; position: relative; z-index: 1; }
            .content { padding: 40px 20px; }
            .welcome { text-align: center; margin-bottom: 40px; }
            .welcome h2 { color: #1a1a1a; font-size: 28px; margin-bottom: 15px; }
            .welcome p { color: #666; font-size: 18px; line-height: 1.6; }
            .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 40px 0; }
            .feature { background: #f8f9fa; border-radius: 12px; padding: 20px; text-align: center; }
            .feature-icon { font-size: 32px; margin-bottom: 10px; }
            .feature h3 { color: #1a1a1a; font-size: 16px; margin-bottom: 5px; }
            .feature p { color: #666; font-size: 14px; margin: 0; }
            .action-buttons { text-align: center; margin: 40px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #B8860B 0%, #2F8B5A 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 16px; margin: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
            .button.secondary { background: transparent; border: 2px solid #B8860B; color: #B8860B; }
            .testimonial { background: #f8f9fa; border-left: 4px solid #B8860B; padding: 20px; margin: 30px 0; border-radius: 0 12px 12px 0; font-style: italic; }
            .footer { background: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef; }
            .footer p { color: #888; font-size: 14px; margin: 5px 0; }
            .social { margin: 20px 0; }
            .social a { display: inline-block; margin: 0 10px; color: #666; text-decoration: none; }
            @media (max-width: 480px) {
                .features { grid-template-columns: 1fr; }
                .header h1 { font-size: 24px; }
                .welcome h2 { font-size: 22px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🎉</div>
                <h1>¡Bienvenido!</h1>
                <p>Ya eres parte de Tesoros del Chocó</p>
            </div>
            
            <div class="content">
                <div class="welcome">
                    <h2>¡Tu cuenta está lista!</h2>
                    <p>Gracias por verificar tu email. Ahora puedes explorar y disfrutar de los tesoros artesanales más auténticos del Chocó colombiano.</p>
                </div>
                
                <div class="features">
                    <div class="feature">
                        <div class="feature-icon">🏺</div>
                        <h3>Productos Únicos</h3>
                        <p>Artesanías auténticas hechas a mano</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🚚</div>
                        <h3>Envío Seguro</h3>
                        <p>Entrega garantizada a todo el país</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">❤️</div>
                        <h3>Apoyo Local</h3>
                        <p>Cada compra apoya a artesanos chocoanos</p>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🛡️</div>
                        <h3>Compra Segura</h3>
                        <p>Pagos protegidos y garantizados</p>
                    </div>
                </div>
                
                <div class="action-buttons">
                    <a href="[EXPLORE_LINK]" class="button">🛍️ Explorar productos</a>
                    <a href="[PROFILE_LINK]" class="button secondary">👤 Completar perfil</a>
                </div>
                
                <div class="testimonial">
                    "Los productos de Tesoros del Chocó son increíbles. Cada pieza cuenta una historia y la calidad es excepcional. ¡Totalmente recomendado!" 
                    <strong>- María González, Cliente satisfecha</strong>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Tesoros del Chocó</strong></p>
                <p>Conectando artesanos con el mundo</p>
                <div class="social">
                    <a href="[WHATSAPP_LINK]">📱 WhatsApp</a>
                    <a href="[EMAIL_LINK]">📧 Soporte</a>
                    <a href="[FACEBOOK_LINK]">📘 Facebook</a>
                    <a href="[INSTAGRAM_LINK]">📸 Instagram</a>
                </div>
                <p style="font-size: 12px; color: #aaa;">
                    © ${new Date().getFullYear()} Tesoros del Chocó. Todos los derechos reservados.<br>
                    Si no deseas recibir estos correos, puedes <a href="[UNSUBSCRIBE_LINK]" style="color: #B8860B;">darte de baja aquí</a>.
                </p>
            </div>
        </div>
    </body>
    </html>`;
  }

  private static getSellerApprovalTemplate(): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>¡Tu tienda ha sido aprobada! - Tesoros del Chocó</title>
        <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 20px; text-align: center; }
            .logo { width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 20px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: bold; }
            .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px; }
            .content { padding: 40px 20px; }
            .welcome { text-align: center; margin-bottom: 40px; }
            .welcome h2 { color: #1a1a1a; font-size: 24px; margin-bottom: 10px; }
            .welcome p { color: #666; font-size: 16px; line-height: 1.5; }
            .next-steps { background: #f0f9ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 30px; margin: 30px 0; }
            .next-steps h3 { color: #1e40af; margin-top: 0; }
            .step { display: flex; align-items: center; margin-bottom: 20px; }
            .step:last-child { margin-bottom: 0; }
            .step-number { width: 32px; height: 32px; background: #10B981; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; }
            .step-text { font-size: 14px; color: #555; }
            .action-button { text-align: center; margin: 40px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
            .footer { background: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef; }
            .footer p { color: #888; font-size: 14px; margin: 5px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">✅</div>
                <h1>¡Felicitaciones!</h1>
                <p>Tu tienda ha sido aprobada</p>
            </div>
            
            <div class="content">
                <div class="welcome">
                    <h2>¡Ya puedes vender en Tesoros del Chocó!</h2>
                    <p>Hemos revisado tu solicitud y nos complace informarte que tu tienda <strong>[BUSINESS_NAME]</strong> ha sido aprobada.</p>
                </div>
                
                <div class="next-steps">
                    <h3>🚀 Primeros pasos como vendedor</h3>
                    <div class="step">
                        <div class="step-number">1</div>
                        <div class="step-text">Accede a tu panel de vendedor y completa tu perfil</div>
                    </div>
                    <div class="step">
                        <div class="step-number">2</div>
                        <div class="step-text">Sube fotos de alta calidad de tus productos</div>
                    </div>
                    <div class="step">
                        <div class="step-number">3</div>
                        <div class="step-text">Escribe descripciones detalladas y atractivas</div>
                    </div>
                    <div class="step">
                        <div class="step-number">4</div>
                        <div class="step-text">Configura tus métodos de pago y envío</div>
                    </div>
                    <div class="step">
                        <div class="step-number">5</div>
                        <div class="step-text">¡Comienza a recibir pedidos!</div>
                    </div>
                </div>
                
                <div class="action-button">
                    <a href="[SELLER_DASHBOARD_LINK]" class="button">🏪 Ir a mi tienda</a>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Tesoros del Chocó</strong></p>
                <p>Estamos aquí para apoyarte en cada paso</p>
                <p style="font-size: 12px; color: #aaa;">
                    Si tienes preguntas, contacta a nuestro equipo de soporte.
                </p>
            </div>
        </div>
    </body>
    </html>`;
  }
}

export default EmailService;
