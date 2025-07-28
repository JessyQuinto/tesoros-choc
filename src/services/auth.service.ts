import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { UserProfile, UserRole } from '@/types/user.types';

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

export class AuthService {
  // Registro de usuario
  async register(data: RegisterData): Promise<UserProfile> {
    try {
      console.log('🚀 Iniciando registro para:', data.email, 'con rol:', data.role);
      
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
      
      console.log('✅ Usuario creado en Auth:', user.uid);

      // 2. Preparar datos del perfil
      const userProfile: UserProfile = {
        id: user.uid,
        email: data.email,
        name: data.name,
        role: data.role,
        isApproved: data.role === 'buyer', // Compradores se aprueban automáticamente
        phone: data.phone || '',
        address: data.address || '',
        businessName: data.businessName || '',
        bio: data.bio || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('📝 Guardando perfil en Firestore:', userProfile);

      // 3. Guardar perfil en Firestore
      await setDoc(doc(db, 'users', user.uid), userProfile);
      
      console.log('✅ Perfil guardado exitosamente en Firestore');

      // 4. Enviar verificación de email
      await sendEmailVerification(user);
      
      console.log('📧 Email de verificación enviado');

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
        // Reenviar email de verificación
        await sendEmailVerification(user);
        throw new Error('Por favor verifica tu email. Hemos reenviado el correo de verificación.');
      }

      // 3. Obtener perfil de Firestore
      const userProfile = await this.getUserProfile(user.uid);
      
      if (!userProfile) {
        throw new Error('Perfil de usuario no encontrado');
      }

      return userProfile;
    } catch (error: unknown) {
      console.error('❌ Error en login:', error);
      const err = error as { code?: string; message?: string };
      throw new Error(this.getErrorMessage(err.code || 'unknown'));
    }
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

  // Obtener perfil de usuario
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      return null;
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
  await sendPasswordResetEmail(auth, email);
};

export const authService = new AuthService();