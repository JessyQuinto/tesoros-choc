import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  updateProfile,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

export type UserRole = 'buyer' | 'seller' | 'admin' | 'pending_vendor';

export interface UserProfile {
  id: string;
  firebaseUid: string;
  email: string;
  name: string;
  role: UserRole;
  isApproved: boolean;
  avatar: string | null;
  needsRoleSelection: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>;
  loginWithGoogle: (isRegistering?: boolean, role?: UserRole) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  needsRoleSelection: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  
  const navigate = useNavigate();

  const clearError = useCallback(() => setError(null), []);

  // Fetch user profile from Firestore
  const fetchUserProfile = useCallback(async (firebaseUser: FirebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        setUser(userData);
        setNeedsRoleSelection(userData.needsRoleSelection || false);
        return userData;
      } else {
        // User doesn't exist in Firestore, needs role selection
        setNeedsRoleSelection(true);
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Error al cargar el perfil del usuario');
      return null;
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser) => {
      setFirebaseUser(currentFirebaseUser);
      if (currentFirebaseUser) {
        await fetchUserProfile(currentFirebaseUser);
      } else {
        setUser(null);
        setNeedsRoleSelection(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [fetchUserProfile]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    clearError();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (error) {
      const authError = error as AuthError;
      setError(getErrorMessage(authError.code));
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    clearError();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      await updateProfile(firebaseUser, { displayName: name });
      
      // Create user document in Firestore
      const userProfile: UserProfile = {
        id: firebaseUser.uid,
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: name,
        role: role === 'seller' ? 'pending_vendor' : role, // Sellers need approval
        isApproved: role === 'buyer' || role === 'admin',
        avatar: firebaseUser.photoURL,
        needsRoleSelection: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
      return true;
    } catch (error) {
      const authError = error as AuthError;
      setError(getErrorMessage(authError.code));
      setIsLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async (isRegistering: boolean = false, role?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    clearError();
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        // New user - create profile
        if (isRegistering && role) {
          // Creating new account with specified role
          const userProfile: UserProfile = {
            id: firebaseUser.uid,
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            role: role === 'seller' ? 'pending_vendor' : role,
            isApproved: role === 'buyer' || role === 'admin',
            avatar: firebaseUser.photoURL,
            needsRoleSelection: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
          setUser(userProfile);
          setNeedsRoleSelection(false);
        } else {
          // User logging in but doesn't exist - needs role selection
          setNeedsRoleSelection(true);
          setUser(null);
        }
      } else {
        // Existing user - load profile
        const userData = userDoc.data() as UserProfile;
        setUser(userData);
        setNeedsRoleSelection(userData.needsRoleSelection || false);
      }
      
      return true;
    } catch (error) {
      const authError = error as AuthError;
      setError(getErrorMessage(authError.code));
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      setNeedsRoleSelection(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setError('Error al cerrar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (data: Partial<UserProfile>) => {
    if (!firebaseUser) return;
    
    setIsLoading(true);
    try {
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      // If this is a new user creation (has all required fields), use setDoc instead of updateDoc
      if (data.id && data.firebaseUid && data.email && data.name && data.role !== undefined) {
        await setDoc(doc(db, 'users', firebaseUser.uid), updateData);
      } else {
        await updateDoc(doc(db, 'users', firebaseUser.uid), updateData);
      }
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...updateData } : updateData as UserProfile);
      setNeedsRoleSelection(false);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Error al actualizar el perfil');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Password reset error:', error);
      const authError = error as AuthError;
      setError(getErrorMessage(authError.code));
      throw error;
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'Este email ya está registrado.',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
      'auth/invalid-email': 'El formato del email es inválido.',
      'auth/user-not-found': 'No se encontró un usuario con ese email.',
      'auth/wrong-password': 'La contraseña es incorrecta.',
      'auth/invalid-credential': 'Las credenciales son inválidas.',
      'auth/too-many-requests': 'Demasiados intentos. Intenta de nuevo más tarde.',
    };
    return errorMessages[errorCode] || 'Ocurrió un error durante la autenticación.';
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUser,
    resetPassword,
    isLoading,
    error,
    clearError,
    needsRoleSelection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
