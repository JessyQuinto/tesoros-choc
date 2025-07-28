// Temporal registration data storage
export interface TempRegistrationData {
  email: string;
  password: string;
  name: string;
  role?: 'buyer' | 'seller';
  phone?: string;
  address?: string;
  bio?: string;
  isGoogleAuth?: boolean;
  googleUser?: {
    email: string;
    name: string;
    avatar: string | null;
  };
}

export class RegistrationDataManager {
  private static readonly STORAGE_KEY = 'tesoros_temp_registration';

  static save(data: Partial<TempRegistrationData>): void {
    const existing = this.get();
    const merged = { ...existing, ...data };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merged));
  }

  static get(): TempRegistrationData | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  static clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static isComplete(data: TempRegistrationData): boolean {
    if (data.isGoogleAuth) {
      return !!(data.googleUser && data.role);
    }
    return !!(data.email && data.password && data.name && data.role);
  }
}
