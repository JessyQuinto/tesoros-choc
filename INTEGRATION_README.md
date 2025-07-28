# Integración Backend - Frontend

## 🎯 Resumen

Esta documentación describe la integración exitosa entre el frontend de React y el backend del marketplace de artesanías del Chocó.

## 🔧 Configuración Realizada

### 1. Configuración de API

- **API Client**: `src/lib/api-client.ts` - Cliente HTTP con autenticación Firebase
- **Configuración**: `src/config/api.config.ts` - URLs y configuración centralizada
- **Base URL**: `http://localhost:3000/api` (desarrollo)

### 2. Servicios Creados

#### AuthService (`src/services/auth.service.ts`)
- ✅ Verificación de token con backend
- ✅ Registro y login con Firebase Auth
- ✅ Gestión de perfil de usuario
- ✅ Solicitud de conversión a vendedor

#### ProductService (`src/services/product.service.ts`)
- ✅ Obtener productos públicos
- ✅ Búsqueda y filtrado por categoría
- ✅ Gestión de productos para vendedores
- ✅ CRUD completo de productos

#### OrderService (`src/services/order.service.ts`)
- ✅ Agregar productos al carrito
- ✅ Proceso de checkout
- ✅ Historial de órdenes para compradores y vendedores

#### AdminService (`src/services/admin.service.ts`)
- ✅ Gestión de usuarios
- ✅ Aprobación/rechazo de vendedores
- ✅ Suspensión/reactivación de usuarios
- ✅ Estadísticas del sistema

### 3. Hooks Personalizados

#### `src/hooks/useProducts.ts`
```typescript
const { products, loading, error, searchProducts, getProductsByCategory } = useProducts();
```

#### `src/hooks/useOrders.ts`
```typescript
const { orders, loading, error } = useOrders('buyer'); // o 'seller'
const { addToCart, checkout } = useCart();
```

#### `src/hooks/useAdmin.ts`
```typescript
const { users, approveUser, rejectUser, suspendUser } = useAdminUsers();
const { stats } = useAdminStats();
```

### 4. Tipos TypeScript

- **Productos**: `src/types/product.types.ts`
- **Órdenes**: `src/types/order.types.ts`
- **Usuarios**: `src/types/user.types.ts` (actualizado)

## 🔐 Flujo de Autenticación

1. **Frontend**: Usuario se registra/login con Firebase Auth
2. **Firebase**: Genera ID Token
3. **Frontend**: Envía token al backend en header `Authorization: Bearer <token>`
4. **Backend**: Verifica token y devuelve perfil completo del usuario

### Ejemplo de Uso

```typescript
import { authService } from '@/services/auth.service';

// Login
const userProfile = await authService.login(email, password);

// Verificar sesión actual
const profile = await authService.verifyTokenAndGetProfile();

// Actualizar perfil
await authService.updateProfile({ name: 'Nuevo Nombre' });
```

## 📊 Endpoints Integrados

### Públicos (sin autenticación)
- `GET /api/products` - Lista de productos
- `GET /api/products/:id` - Detalle de producto

### Autenticados
- `POST /api/auth/verify-token` - Verificar token y obtener perfil
- `GET /api/users/profile` - Perfil del usuario
- `PUT /api/users/profile` - Actualizar perfil
- `POST /api/users/register-seller` - Solicitar ser vendedor

### Comprador
- `POST /api/buyer/cart/add` - Agregar al carrito
- `POST /api/buyer/checkout` - Procesar compra
- `GET /api/buyer/orders` - Historial de órdenes

### Vendedor
- `GET /api/seller/products` - Productos del vendedor
- `POST /api/seller/products` - Crear producto
- `PUT /api/seller/products/:id` - Actualizar producto
- `GET /api/seller/orders` - Órdenes recibidas

### Administrador
- `GET /api/admin/users` - Lista de usuarios
- `PUT /api/admin/users/:id/approve` - Aprobar vendedor
- `PUT /api/admin/users/:id/reject` - Rechazar vendedor
- `PUT /api/admin/users/:id/suspend` - Suspender usuario

## 🌟 Características Implementadas

### ✅ Página de Productos Actualizada
- Carga productos desde el backend
- Búsqueda en tiempo real
- Filtrado por categoría
- Manejo de estados de carga y error

### ✅ Autenticación Centralizada
- Context Provider actualizado
- Verificación automática de tokens
- Manejo de errores mejorado

### ✅ Manejo de Errores
- Respuestas consistentes de la API
- Manejo de errores HTTP
- Feedback visual para el usuario

## 🚀 Próximos Pasos

1. **Completar integración en otras páginas**:
   - Dashboard de vendedor
   - Panel de administración
   - Carrito de compras
   - Historial de órdenes

2. **Optimizaciones**:
   - Cache de datos
   - Paginación de productos
   - Optimistic updates

3. **Funcionalidades adicionales**:
   - Upload de imágenes
   - Sistema de notificaciones
   - Chat entre usuarios

## 🔧 Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```bash
# Backend URL
VITE_API_BASE_URL=http://localhost:3000/api

# Firebase Config (ya configurado)
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
# etc...
```

## 🐛 Solución de Problemas

### Error de CORS
Si encuentras errores de CORS, asegúrate de que el backend tenga configurado:
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // URL del frontend
  credentials: true
}));
```

### Token Expirado
El frontend automáticamente obtiene tokens frescos de Firebase. Si hay problemas:
- Verificar que el usuario esté logueado en Firebase
- Revisar la configuración de Firebase Auth

### Tipos TypeScript
Los tipos están sincronizados con el backend. Si hay discrepancias:
- Verificar la documentación del backend
- Actualizar los tipos en `src/types/`

## 📚 Referencias

- [Documentación del Backend](./backend-integration-guide.md)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [React Query para cache](https://tanstack.com/query/latest) (recomendado para futuras optimizaciones)
