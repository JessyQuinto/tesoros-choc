// Simplified notification service without Firebase dependency
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  userId: string;
}

export class NotificationService {
  async getUserNotifications(userId: string): Promise<Notification[]> {
    // Mock data for demonstration
    return [
      {
        id: '1',
        title: 'Bienvenido',
        message: 'Bienvenido a Tesoros Chocó',
        type: 'info',
        read: false,
        createdAt: new Date(),
        userId,
      },
    ];
  }

  async markAsRead(notificationId: string): Promise<void> {
    console.log(`Marking notification ${notificationId} as read`);
  }

  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<void> {
    console.log('Creating notification:', notification);
  }
}

export const notificationService = new NotificationService();