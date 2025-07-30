import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { auth } from '@/config/firebase';
import { apiClient } from '@/lib/api-client';
import { UserProfile, UserRole } from '@/types/user.types';
import { USER_CONFIG, findPredefinedAccount } from '@/config/users.config';
import EmailService from './EmailService';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  address?: string;
  businessName?: string;
  bio?: string;
}

export interface SellerRegistrationRequest {
  businessName: string;
  bio: string;
  phone: string;
}

export class AuthService {
  // Verificar token con el backend y obtener perfil completo
  async verifyTokenAndGetProfile(): Promise<UserProfile | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('❌ AuthService: No hay usuario autenticado');
        return null;
      }

      console.log('🔐 AuthService: Verificando token para usuario:', user.email);
      
      // Obtener el token de Firebase
      const token = await user.getIdToken();
      console.log('🔐 AuthService: Token obtenido, longitud:', token.length);
      
      // Verificar token con el backend
      console.log('🌐 AuthService: Enviando petición al backend...');
      const profile = await apiClient.post<UserProfile>('/auth/verify-token', {}, false, {
        'Authorization': `Bearer ${token}`
      });
      
      console.log('✅ AuthService: Perfil obtenido del backend:', profile.email);
      return profile;
    } catch (error) {
      console.error('❌ AuthService: Error verificando token:', error);
      return null;
    }
  }

  // Registro de usuario (usando Firebase Auth + Backend)
  async register(data: RegisterData): Promise<UserProfile> {
    try {
      console.log('🚀 Iniciando registro para:', data.email, 'con rol:', data.role);
      
      // 1. Verificar si es cuenta predefinida
      const predefinedAccount = findPredefinedAccount(data.email);
      if (predefinedAccount) {
        console.log('⚠️ Usuario predefinido detectado:', predefinedAccount);
        throw new Error('Este email está reservado para cuentas del sistema');
      }
      
      // 2. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      console.log('✅ Usuario creado en Auth:', user.uid);

      // 3. Enviar verificación de email
      try {
        await EmailService.sendCustomEmailVerification();
        console.log('📧 Email de verificación enviado');
      } catch (emailError) {
        console.warn('⚠️ Error enviando email personalizado, usando predeterminado');
        await sendEmailVerification(user);
        console.log('📧 Email de verificación enviado (predeterminado)');
      }

      // 4. Crear perfil en el backend
      const userProfile: UserProfile = {
        id: user.uid,
        email: data.email,
        name: data.name,
        role: data.role,
        isApproved: data.role === 'buyer' ? USER_CONFIG.BUYER_AUTO_APPROVED : false,
        phone: data.phone || '',
        address: data.address || '',
        businessName: data.businessName || '',
        bio: data.bio || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 5. Sincronizar con backend (opcional, depende de tu implementación)
      try {
        await apiClient.post<UserProfile>('/auth/register', userProfile, false);
        console.log('✅ Perfil sincronizado con backend');
      } catch (backendError) {
        console.warn('⚠️ Error sincronizando con backend:', backendError);
        // Continuar sin backend por ahora
      }

      return userProfile;
    } catch (error: unknown) {
      console.error('❌ Error en registro:', error);
      const err = error as { code?: string; message?: string };
      throw new Error(this.getErrorMessage(err.code || 'unknown'));
    }
  }

  // Login de usuario
  async login(email: string, password: string): Promise<UserProfile> {
    try {
      console.log('🔐 Iniciando login para:', email);
      
      // 1. Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('✅ Usuario autenticado en Firebase:', user.email);

      // 2. Verificar si el email está verificado
      if (!user.emailVerified) {
        console.log('⚠️ Email no verificado, enviando nuevo correo de verificación');
        try {
          await EmailService.sendCustomEmailVerification();
        } catch (emailError) {
          await sendEmailVerification(user);
        }
        throw new Error('Por favor verifica tu email. Hemos reenviado el correo de verificación.');
      }

      console.log('✅ Email verificado, procediendo con login');

      // 3. Verificar token con backend y obtener perfil completo
      const userProfile = await this.verifyTokenAndGetProfile();
      
      if (!userProfile) {
        // Si no hay perfil en backend, crear uno básico
        console.log('⚠️ No se encontró perfil en backend, creando perfil básico');
        const basicProfile: UserProfile = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || 'Usuario',
          role: 'buyer',
          isApproved: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        return basicProfile;
      }

      return userProfile;
    } catch (error: unknown) {
      console.error('❌ Error en login:', error);
      const err = error as { code?: string; message?: string };
      throw new Error(this.getErrorMessage(err.code || 'unknown'));
    }
  }

  // Obtener perfil del usuario actual
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      return await apiClient.get<UserProfile>('/users/profile', true);
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      return null;
    }
  }

  // Actualizar perfil del usuario
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    return await apiClient.put<UserProfile>('/users/profile', updates, true);
  }

  // Solicitar conversión a vendedor (buyer -> seller)
  async registerAsSeller(data: SellerRegistrationRequest): Promise<void> {
    await apiClient.post<void>('/users/register-seller', data as unknown as Record<string, unknown>, true);
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      console.log('✅ Logout exitoso');
    } catch (error: unknown) {
      console.error('❌ Error en logout:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  // Obtener usuario actual autenticado
  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }

  // Verificar si el email está verificado
  isEmailVerified(): boolean {
    return auth.currentUser?.emailVerified || false;
  }

  // Traducir códigos de error de Firebase
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este correo ya está registrado';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres';
      case 'auth/invalid-email':
        return 'Formato de correo inválido';
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada';
      case 'auth/operation-not-allowed':
        return 'Esta operación no está permitida';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu internet';
      default:
        return 'Error de autenticación';
    }
  }
}

export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    await EmailService.sendCustomPasswordReset(email);
  } catch (error) {
    // Fallback al método predeterminado de Firebase
    await sendPasswordResetEmail(auth, email);
  }
};

export const authService = new AuthService();