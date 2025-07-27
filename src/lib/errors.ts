export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    
    // Esto asegura que la pila de llamadas se capture correctamente
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
