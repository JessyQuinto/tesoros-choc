import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RoleSelector } from '@/components/RoleSelector';
import { useNavigate } from 'react-router-dom';

export const FirebaseUserSetup = () => {
  const { user, firebaseUser, updateUser } = useAuth();
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Si el usuario está autenticado con Firebase pero no tiene rol asignado
    if (firebaseUser && (!user || user.needsRoleSelection)) {
      setShowRoleSelector(true);
    }
  }, [firebaseUser, user]);

  const handleRoleSelected = (role: 'buyer' | 'seller') => {
    if (firebaseUser) {
      // Crear usuario completo con el rol seleccionado
      const completeUser = {
        id: firebaseUser.uid,
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuario',
        role: role,
        isApproved: role === 'buyer', // Solo buyers son auto-aprobados
        avatar: firebaseUser.photoURL || undefined,
        needsRoleSelection: false // Importante: marcar como completado
      };

      updateUser(completeUser);
      setShowRoleSelector(false);

      // Redireccionar según el rol
      switch (role) {
        case 'buyer':
          navigate('/buyer-dashboard');
          break;
        case 'seller':
          navigate('/seller-dashboard');
          break;
        default:
          navigate('/');
      }
    }
  };

  if (showRoleSelector && firebaseUser) {
    return (
      <RoleSelector 
        firebaseUser={firebaseUser} 
        onComplete={handleRoleSelected}
      />
    );
  }

  return null;
};
