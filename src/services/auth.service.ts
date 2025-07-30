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
      if (!user) return null;

      // Obtener el token de Firebase
      const token = await user.getIdToken();
      
      // Verificar token con el backend - no requiere auth automática porque enviamos el token manualmente
      const profile = await apiClient.post<UserProfile>('/auth/verify-token', {}, false, {
        'Authorization': `Bearer ${token}`
      });
      return profile;
    } catch (error) {
      console.error('Error verificando token:', error);
      return null;
    }
  }

  // Registro de usuario (usando Firebase Auth + Backend)
  async register(data: RegisterData): Promise<UserProfile> {
    try {
      console.log('🚀 Iniciando registro para:', data.email, 'con rol:', data.role);
      
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      console.log('✅ Usuario creado en Auth:', user.uid);

      // 2. Enviar verificación de email con plantilla personalizada
      try {
        await EmailService.sendCustomEmailVerification();
        console.log('📧 Email de verificación enviado con plantilla personalizada');
      } catch (emailError) {
        console.warn('⚠️ Error enviando email personalizado, usando predeterminado');
        await sendEmailVerification(user);
        console.log('📧 Email de verificación enviado (predeterminado)');
      }

      // 3. El backend se encargará de crear el perfil cuando se verifique el token
      // por primera vez, usando la información de Firebase Auth
      
      // Por ahora, devolvemos un perfil temporal
      const userProfile: UserProfile = {
        id: user.uid,
        email: data.email,
        name: data.name,
        role: data.role,
        isApproved: data.role === 'buyer',
        phone: data.phone || '',
        address: data.address || '',
        businessName: data.businessName || '',
        bio: data.bio || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

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
      // 1. Autenticar con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Verificar si el email está verificado
      if (!user.emailVerified) {
        try {
          await EmailService.sendCustomEmailVerification();
        } catch (emailError) {
          await sendEmailVerification(user);
        }
        throw new Error('Por favor verifica tu email. Hemos reenviado el correo de verificación.');
      }

      // 3. Verificar token con backend y obtener perfil completo
      const userProfile = await this.verifyTokenAndGetProfile();
      
      if (!userProfile) {
        throw new Error('Error obteniendo perfil del servidor');
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
    } catch (error: unknown) {
      console.error('❌ Error en logout:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  // Obtener usuario actual autenticado
  getCurrentUser(): User | null {
    return auth.currentUser;
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