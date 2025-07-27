import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile as updateFirebaseProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
  AuthError,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { userRepository, UserProfile } from './UserRepository';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'buyer' | 'seller';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  avatar?: string;
}

class AuthService {
  async register({ email, password, name, role }: RegisterData): Promise<{ authUser: AuthUser; userProfile: UserProfile }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await updateFirebaseProfile(firebaseUser, { displayName: name });

      const userProfile = await userRepository.registerUser({
        name,
        role,
        avatar: firebaseUser.photoURL || undefined,
      });

      return { authUser: this.mapFirebaseUser(firebaseUser), userProfile };
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  async login({ email, password }: LoginData): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return this.mapFirebaseUser(userCredential.user);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  async loginWithGoogle(): Promise<AuthUser> {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(auth, provider);
      return this.mapFirebaseUser(userCredential.user);
    } catch (error) {
      const authError = error as AuthError;
      if (authError.code === 'auth/popup-closed-by-user') {
        throw new Error('Ventana de Google cerrada. Intenta de nuevo.');
      }
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out: ", error);
      throw new Error('Error al cerrar sesión');
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  async updateUserProfile(data: UpdateProfileData): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuario no autenticado');

    if (data.name) {
      await updateFirebaseProfile(user, { displayName: data.name });
    }
    if (data.avatar) {
      await updateFirebaseProfile(user, { photoURL: data.avatar });
    }

    await userRepository.updateUserProfile({ name: data.name, avatar: data.avatar });
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return auth.onAuthStateChanged((firebaseUser) => {
      callback(firebaseUser ? this.mapFirebaseUser(firebaseUser) : null);
    });
  }

  private mapFirebaseUser(user: FirebaseUser): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
  }

  private getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'Este email ya está registrado.',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
      'auth/invalid-email': 'El formato del email es inválido.',
      'auth/user-not-found': 'No se encontró un usuario con ese email.',
      'auth/wrong-password': 'La contraseña es incorrecta.',
      'auth/invalid-credential': 'Las credenciales son inválidas.',
      'auth/too-many-requests': 'Demasiados intentos. Tu cuenta ha sido bloqueada temporalmente.',
      'auth/network-request-failed': 'Error de red. Verifica tu conexión.',
      'auth/popup-closed-by-user': 'Ventana de autenticación cerrada.',
      'auth/cancelled-popup-request': 'Solicitud de autenticación cancelada.',
      'auth/popup-blocked': 'El navegador bloqueó la ventana de autenticación.',
      'auth/account-exists-with-different-credential': 'Ya existe una cuenta con este email pero con un método de inicio de sesión diferente.'
    };
    return errorMessages[errorCode] || 'Ocurrió un error desconocido durante la autenticación.';
  }
}

export const authService = new AuthService();
