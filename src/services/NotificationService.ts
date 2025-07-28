import { doc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

class NotificationService {
  
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<void> {
    try {
      await addDoc(collection(db, 'notifications'), {
        ...notification,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), {
        isRead: true,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Notificaciones específicas para aprobación de vendedores
  async notifyVendorApproved(userId: string, userName: string): Promise<void> {
    await this.createNotification({
      userId,
      title: '¡Cuenta Aprobada!',
      message: `¡Felicitaciones ${userName}! Tu cuenta de vendedor ha sido aprobada. Ya puedes comenzar a publicar y vender tus productos artesanales.`,
      type: 'success',
      isRead: false
    });
  }

  async notifyVendorRejected(userId: string, userName: string): Promise<void> {
    await this.createNotification({
      userId,
      title: 'Solicitud No Aprobada',
      message: `Hola ${userName}, lamentamos informarte que tu solicitud para ser vendedor no fue aprobada en esta ocasión. Puedes contactar soporte para más información.`,
      type: 'warning',
      isRead: false
    });
  }

  async notifyAccountSuspended(userId: string, userName: string): Promise<void> {
    await this.createNotification({
      userId,
      title: 'Cuenta Suspendida',
      message: `Hola ${userName}, tu cuenta ha sido suspendida temporalmente. Por favor contacta con soporte para más información.`,
      type: 'error',
      isRead: false
    });
  }

  async notifyAccountReactivated(userId: string, userName: string): Promise<void> {
    await this.createNotification({
      userId,
      title: 'Cuenta Reactivada',
      message: `Hola ${userName}, tu cuenta ha sido reactivada exitosamente. Ya puedes continuar usando la plataforma normalmente.`,
      type: 'success',
      isRead: false
    });
  }
}

export const notificationService = new NotificationService();
