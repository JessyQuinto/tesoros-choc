# 🏗️ ESPECIFICACIÓN COMPLETA DEL BACKEND - TESOROS DEL CHOCÓ

## 📋 **INFORMACIÓN DEL PROYECTO**

**Proyecto**: Marketplace de productos artesanales del Chocó, Colombia  
**Frontend**: React 18 + TypeScript + Vite (YA COMPLETADO)  
**Backend**: Node.js + Express + TypeScript + PostgreSQL  
**Objetivo**: API REST completa para soportar marketplace con 3 roles de usuario  

---

## 🎯 **ROLES DE USUARIO Y FUNCIONALIDADES**

### 👤 **BUYER (Comprador)**
- Registro y autenticación
- Explorar productos por categorías
- Agregar productos al carrito
- Proceso de checkout y pagos
- Gestión de direcciones de envío
- Historial de pedidos y seguimiento
- Sistema de reseñas de productos
- Notificaciones de pedidos y promociones
- Gestión de perfil personal

### 🏪 **SELLER (Vendedor)**
- Registro con proceso de aprobación
- Gestión completa de productos (CRUD)
- Gestión de inventario y stock
- Recepción y gestión de pedidos
- Dashboard financiero y reportes
- Responder a reseñas de clientes
- Notificaciones de nuevos pedidos
- Seguimiento de ventas y comisiones

### 👨‍💼 **ADMIN (Administrador)**
- Aprobación/rechazo de vendedores
- Moderación de productos
- Gestión de usuarios (suspender/activar)
- Reportes y analytics del marketplace
- Gestión de categorías de productos
- Configuración de comisiones
- Supervisión de transacciones
- Sistema de soporte y tickets

---

## 🛠️ **STACK TECNOLÓGICO REQUERIDO**

### **Core Backend:**
```json
{
  "runtime": "Node.js 20+ LTS",
  "framework": "Express.js 4.18+",
  "language": "TypeScript 5.0+",
  "orm": "Prisma 5.0+",
  "authentication": "Firebase Authentication",
  "validation": "Zod",
  "fileUpload": "Multer + Cloudinary"
}
```

### **Base de Datos:**
```json
{
  "primary": "PostgreSQL 15+",
  "cache": "Redis 7+",
  "search": "PostgreSQL Full-text search",
  "storage": "Cloudinary (imágenes)"
}
```

### **Servicios Externos:**
```json
{
  "payments": "Stripe + PSE Colombia",
  "email": "Nodemailer + Gmail SMTP",
  "notifications": "Socket.io",
  "monitoring": "Winston Logger"
}
```

---

## 📊 **ESQUEMA DE BASE DE DATOS**

### **Tabla: users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role user_role NOT NULL DEFAULT 'buyer',
  status user_status NOT NULL DEFAULT 'active',
  is_approved BOOLEAN DEFAULT false,
  profile_image VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  email_verified BOOLEAN DEFAULT false
);

-- Enums
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');
```

### **Tabla: seller_profiles**
```sql
CREATE TABLE seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  business_description TEXT,
  business_category VARCHAR(100),
  location_city VARCHAR(100),
  location_department VARCHAR(100),
  tax_id VARCHAR(50),
  bank_account_number VARCHAR(50),
  bank_name VARCHAR(100),
  commission_rate DECIMAL(5,2) DEFAULT 15.00,
  total_sales DECIMAL(12,2) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  total_products INTEGER DEFAULT 0,
  approval_status approval_status DEFAULT 'pending',
  approval_notes TEXT,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'under_review');
```

### **Tabla: categories**
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  parent_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Tabla: products**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  original_price DECIMAL(12,2),
  stock INTEGER NOT NULL DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  weight DECIMAL(8,2),
  dimensions_length DECIMAL(8,2),
  dimensions_width DECIMAL(8,2),
  dimensions_height DECIMAL(8,2),
  origin_city VARCHAR(100),
  origin_department VARCHAR(100),
  cultural_significance TEXT,
  materials TEXT[],
  tags TEXT[],
  status product_status DEFAULT 'draft',
  is_active BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  moderation_status moderation_status DEFAULT 'pending',
  moderation_notes TEXT,
  rejection_reason TEXT,
  moderated_by UUID REFERENCES users(id),
  moderated_at TIMESTAMP,
  views_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE product_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected', 'under_review');
```

### **Tabla: product_images**
```sql
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  public_id VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255),
  sort_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Tabla: addresses**
```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type address_type DEFAULT 'shipping',
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address_line VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE address_type AS ENUM ('shipping', 'billing');
```

### **Tabla: orders**
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  subtotal DECIMAL(12,2) NOT NULL,
  shipping_cost DECIMAL(12,2) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  commission_amount DECIMAL(12,2) NOT NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'COP',
  
  -- Shipping information
  shipping_address JSONB NOT NULL,
  estimated_delivery_date DATE,
  actual_delivery_date DATE,
  tracking_number VARCHAR(100),
  tracking_url VARCHAR(500),
  
  -- Payment information
  payment_method VARCHAR(50),
  payment_intent_id VARCHAR(255),
  payment_completed_at TIMESTAMP,
  
  notes TEXT,
  cancelled_reason TEXT,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'paid', 'failed', 'refunded', 'cancelled');
```

### **Tabla: order_items**
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image VARCHAR(500),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL,
  product_sku VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### **Tabla: reviews**
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[],
  is_verified BOOLEAN DEFAULT false,
  status review_status DEFAULT 'published',
  helpful_count INTEGER DEFAULT 0,
  
  -- Seller response
  seller_response TEXT,
  seller_response_date TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE review_status AS ENUM ('published', 'hidden', 'flagged', 'pending');
```

### **Tabla: notifications**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  is_email_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TYPE notification_type AS ENUM (
  'order_confirmed', 'order_shipped', 'order_delivered', 'order_cancelled',
  'new_order', 'payment_received', 'product_approved', 'product_rejected',
  'new_review', 'seller_approved', 'seller_rejected', 'stock_low',
  'promotion', 'system_update'
);
```

### **Tabla: carts**
```sql
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, product_id)
);
```

### **Tabla: favorites**
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, product_id)
);
```

---

## 🔗 **ESTRUCTURA DE APIS REQUERIDAS**

### **🔐 Authentication Routes (`/api/auth`)**
```typescript
POST   /api/auth/verify-token         // Verificar Firebase token y sincronizar usuario
POST   /api/auth/complete-profile     // Completar perfil después del registro
POST   /api/auth/refresh              // Refresh Firebase token
GET    /api/auth/me                   // Obtener usuario actual
PUT    /api/auth/update-role           // Actualizar rol de usuario (buyer -> seller)
DELETE /api/auth/delete-account       // Eliminar cuenta completamente
```

### **👥 Users Routes (`/api/users`)**
```typescript
GET    /api/users/profile           // Obtener perfil usuario
PUT    /api/users/profile           // Actualizar perfil
POST   /api/users/upload-avatar     // Subir foto perfil
DELETE /api/users/avatar            // Eliminar foto perfil
PUT    /api/users/change-password   // Cambiar contraseña
GET    /api/users/notifications     // Obtener notificaciones
PUT    /api/users/notifications/:id/read // Marcar notificación leída
DELETE /api/users/notifications/:id // Eliminar notificación
```

### **📍 Addresses Routes (`/api/addresses`)**
```typescript
GET    /api/addresses               // Listar direcciones usuario
POST   /api/addresses               // Crear nueva dirección
GET    /api/addresses/:id           // Obtener dirección específica
PUT    /api/addresses/:id           // Actualizar dirección
DELETE /api/addresses/:id           // Eliminar dirección
PUT    /api/addresses/:id/default   // Marcar como predeterminada
```

### **🏪 Seller Routes (`/api/sellers`)**
```typescript
POST   /api/sellers/apply           // Aplicar para ser vendedor
GET    /api/sellers/profile         // Obtener perfil vendedor
PUT    /api/sellers/profile         // Actualizar perfil vendedor
GET    /api/sellers/dashboard       // Dashboard estadísticas
GET    /api/sellers/earnings        // Ganancias y comisiones
GET    /api/sellers/analytics       // Analytics de ventas
```

### **📦 Products Routes (`/api/products`)**
```typescript
GET    /api/products                // Listar productos (público)
GET    /api/products/:id            // Obtener producto específico
GET    /api/products/search         // Buscar productos
GET    /api/products/featured       // Productos destacados
GET    /api/products/categories/:slug // Productos por categoría

// Seller only
GET    /api/products/my-products    // Productos del vendedor
POST   /api/products                // Crear producto
PUT    /api/products/:id            // Actualizar producto
DELETE /api/products/:id            // Eliminar producto
POST   /api/products/:id/images     // Subir imágenes
DELETE /api/products/:id/images/:imageId // Eliminar imagen
PUT    /api/products/:id/status     // Cambiar status (activo/inactivo)
```

### **📂 Categories Routes (`/api/categories`)**
```typescript
GET    /api/categories              // Listar categorías
GET    /api/categories/:id          // Obtener categoría específica
GET    /api/categories/:id/products // Productos de categoría

// Admin only
POST   /api/categories              // Crear categoría
PUT    /api/categories/:id          // Actualizar categoría
DELETE /api/categories/:id          // Eliminar categoría
```

### **🛒 Cart Routes (`/api/cart`)**
```typescript
GET    /api/cart                    // Obtener carrito usuario
POST   /api/cart/items              // Agregar item al carrito
PUT    /api/cart/items/:productId   // Actualizar cantidad
DELETE /api/cart/items/:productId   // Eliminar item
DELETE /api/cart                    // Vaciar carrito completo
```

### **❤️ Favorites Routes (`/api/favorites`)**
```typescript
GET    /api/favorites               // Listar productos favoritos
POST   /api/favorites/:productId    // Agregar a favoritos
DELETE /api/favorites/:productId    // Remover de favoritos
```

### **📋 Orders Routes (`/api/orders`)**
```typescript
GET    /api/orders                  // Listar pedidos usuario
POST   /api/orders                  // Crear nuevo pedido
GET    /api/orders/:id              // Obtener pedido específico
PUT    /api/orders/:id/cancel       // Cancelar pedido

// Seller routes
GET    /api/orders/seller           // Pedidos del vendedor
PUT    /api/orders/:id/status       // Actualizar estado pedido
PUT    /api/orders/:id/tracking     // Actualizar tracking
POST   /api/orders/:id/notes        // Agregar notas al pedido
```

### **💳 Payments Routes (`/api/payments`)**
```typescript
POST   /api/payments/create-intent  // Crear payment intent
POST   /api/payments/confirm        // Confirmar pago
POST   /api/payments/webhook        // Webhook Stripe
GET    /api/payments/methods        // Métodos de pago disponibles
```

### **⭐ Reviews Routes (`/api/reviews`)**
```typescript
GET    /api/reviews/product/:productId // Reviews de producto
POST   /api/reviews                 // Crear review
PUT    /api/reviews/:id              // Actualizar review (solo owner)
DELETE /api/reviews/:id              // Eliminar review
POST   /api/reviews/:id/helpful      // Marcar review útil
POST   /api/reviews/:id/response     // Respuesta del vendedor
```

### **👨‍💼 Admin Routes (`/api/admin`)**
```typescript
// User management
GET    /api/admin/users             // Listar todos los usuarios
GET    /api/admin/users/:id         // Obtener usuario específico
PUT    /api/admin/users/:id/status  // Cambiar status usuario
DELETE /api/admin/users/:id         // Eliminar usuario

// Seller management
GET    /api/admin/sellers/pending   // Vendedores pendientes
PUT    /api/admin/sellers/:id/approve // Aprobar vendedor
PUT    /api/admin/sellers/:id/reject  // Rechazar vendedor

// Product moderation
GET    /api/admin/products/pending  // Productos pendientes
PUT    /api/admin/products/:id/approve // Aprobar producto
PUT    /api/admin/products/:id/reject  // Rechazar producto
PUT    /api/admin/products/:id/feature // Marcar destacado

// Analytics
GET    /api/admin/analytics/overview // Estadísticas generales
GET    /api/admin/analytics/sales   // Reportes de ventas
GET    /api/admin/analytics/users   // Estadísticas usuarios
GET    /api/admin/analytics/products // Estadísticas productos

// System
GET    /api/admin/system/health     // Estado del sistema
GET    /api/admin/system/logs       // Logs del sistema
```

---

## 🔒 **MIDDLEWARE DE SEGURIDAD REQUERIDO**

### **Authentication Middleware**
```typescript
// Verificar Firebase ID token válido
const authenticateFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Buscar o crear usuario en base de datos
    let user = await prisma.user.findUnique({
      where: { firebase_uid: decodedToken.uid }
    });

    if (!user) {
      // Crear usuario automáticamente en primera autenticación
      user = await prisma.user.create({
        data: {
          firebase_uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email.split('@')[0],
          email_verified: decodedToken.email_verified,
          profile_image: decodedToken.picture
        }
      });
    }

    req.user = user;
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
```

### **Authorization Middleware**
```typescript
// Verificar roles específicos
const requireRole = (roles: string[]) => {
  return (req, res, next) => {
    // Verificar req.user.role está en roles permitidos
    // next() o error 403
  }
}

// Verificar vendedor aprobado
const requireApprovedSeller = (req, res, next) => {
  // Verificar user.role === 'seller' && user.is_approved === true
}

// Verificar propietario del recurso
const requireOwnership = (resourceType: string) => {
  return async (req, res, next) => {
    // Verificar que el usuario es dueño del recurso
    // Para productos: product.seller_id === user.id
    // Para pedidos: order.buyer_id === user.id (buyers) o order.seller_id === user.id (sellers)
  }
}
```

### **Validation Middleware**
```typescript
// Validar datos de entrada con Zod
const validateRequest = (schema: ZodSchema) => {
  return (req, res, next) => {
    // Validar req.body, req.params, req.query según schema
    // next() o error 400 con detalles de validación
  }
}
```

### **Rate Limiting Middleware**
```typescript
// Limitar requests por IP/usuario
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de requests
  message: "Demasiadas peticiones, intenta más tarde"
});
```

---

## 📝 **SCHEMAS DE VALIDACIÓN (ZOD)**

### **User Schemas**
```typescript
const completeProfileSchema = z.object({
  name: z.string().min(2, "Nombre muy corto"),
  phone: z.string().optional(),
  role: z.enum(['buyer', 'seller']).default('buyer')
});

const updateRoleSchema = z.object({
  role: z.enum(['seller']), // Solo permitir cambio a seller
  business_name: z.string().min(2).optional(),
  business_description: z.string().optional(),
  business_category: z.string().optional(),
  location_city: z.string().optional(),
  location_department: z.string().optional()
});

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  // No permitir cambio de email (manejado por Firebase)
});
```

### **Product Schemas**
```typescript
const createProductSchema = z.object({
  name: z.string().min(5, "Nombre muy corto").max(255),
  description: z.string().min(20, "Descripción muy corta"),
  price: z.number().positive("Precio debe ser positivo"),
  original_price: z.number().positive().optional(),
  stock: z.number().int().min(0, "Stock no puede ser negativo"),
  category_id: z.string().uuid("ID categoría inválido"),
  weight: z.number().positive().optional(),
  dimensions: z.object({
    length: z.number().positive().optional(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional()
  }).optional(),
  origin_city: z.string().optional(),
  origin_department: z.string().optional(),
  cultural_significance: z.string().optional(),
  materials: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional()
});
```

### **Order Schemas**
```typescript
const createOrderSchema = z.object({
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive()
  })).min(1, "Debe tener al menos un item"),
  shipping_address: z.object({
    full_name: z.string().min(2),
    phone: z.string().min(10),
    address_line: z.string().min(10),
    city: z.string().min(2),
    department: z.string().min(2),
    postal_code: z.string().optional()
  }),
  payment_method: z.enum(['credit_card', 'pse', 'nequi'])
});
```

---

## 🚀 **SERVICIOS EXTERNOS A INTEGRAR**

### **Cloudinary (Imágenes)**
```typescript
// Configuración
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload de imágenes con transformaciones
const uploadImage = async (file: Express.Multer.File) => {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'tesoros-choco/products',
    transformation: [
      { width: 800, height: 600, crop: 'fill', quality: 'auto' },
      { format: 'webp' }
    ]
  });
  return {
    url: result.secure_url,
    public_id: result.public_id
  };
};
```

### **Stripe (Pagos)**
```typescript
// Crear Payment Intent
const createPaymentIntent = async (amount: number, currency = 'cop') => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // centavos
    currency,
    payment_method_types: ['card'],
    metadata: {
      marketplace: 'tesoros-choco'
    }
  });
  return paymentIntent;
};

// Webhook para confirmar pagos
const handleStripeWebhook = (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Marcar pedido como pagado
      break;
    case 'payment_intent.payment_failed':
      // Marcar pedido como fallido
      break;
  }
};
```

### **Nodemailer (Emails)**
```typescript
// Configuración Gmail SMTP
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Templates de email
const emailTemplates = {
  welcome: (name: string) => ({
    subject: 'Bienvenido a Tesoros del Chocó',
    html: `<h1>¡Hola ${name}!</h1><p>Gracias por unirte a nuestra comunidad...</p>`
  }),
  
  orderConfirmation: (orderNumber: string, total: number) => ({
    subject: `Pedido confirmado - ${orderNumber}`,
    html: `<h1>Tu pedido ha sido confirmado</h1><p>Total: $${total.toLocaleString()}</p>`
  }),
  
  sellerApproved: (businessName: string) => ({
    subject: 'Cuenta de vendedor aprobada',
    html: `<h1>¡Felicitaciones!</h1><p>Tu negocio "${businessName}" ha sido aprobado...</p>`
  })
};
```

### **Socket.io (Notificaciones Real-time)**
```typescript
// Configuración Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  }
});

// Middleware de autenticación Socket
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserById(decoded.userId);
    socket.userId = user.id;
    socket.userRole = user.role;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Eventos de notificaciones
const sendNotification = (userId: string, notification: any) => {
  io.to(userId).emit('notification', notification);
};
```

---

## 📁 **ESTRUCTURA DE PROYECTO REQUERIDA**

```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── users.controller.ts
│   │   ├── products.controller.ts
│   │   ├── orders.controller.ts
│   │   ├── reviews.controller.ts
│   │   ├── admin.controller.ts
│   │   └── payments.controller.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── product.service.ts
│   │   ├── order.service.ts
│   │   ├── payment.service.ts
│   │   ├── notification.service.ts
│   │   ├── email.service.ts
│   │   └── upload.service.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── upload.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── logging.middleware.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── products.routes.ts
│   │   ├── orders.routes.ts
│   │   ├── admin.routes.ts
│   │   └── index.ts
│   │
│   ├── schemas/
│   │   ├── auth.schemas.ts
│   │   ├── user.schemas.ts
│   │   ├── product.schemas.ts
│   │   ├── order.schemas.ts
│   │   └── common.schemas.ts
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── product.types.ts
│   │   ├── order.types.ts
│   │   └── common.types.ts
│   │
│   ├── utils/
│   │   ├── jwt.utils.ts
│   │   ├── password.utils.ts
│   │   ├── email.utils.ts
│   │   ├── validators.utils.ts
│   │   └── constants.ts
│   │
│   ├── config/
│   │   ├── database.ts
│   │   ├── cloudinary.ts
│   │   ├── stripe.ts
│   │   └── redis.ts
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   │
│   ├── sockets/
│   │   ├── notifications.socket.ts
│   │   └── index.ts
│   │
│   └── app.ts
│
├── uploads/          # Archivos temporales
├── logs/            # Logs de aplicación
├── tests/           # Tests unitarios e integración
├── .env.example     # Variables de entorno ejemplo
├── .gitignore
├── package.json
├── tsconfig.json
├── docker-compose.yml
└── README.md
```

---

## 🔧 **VARIABLES DE ENTORNO REQUERIDAS**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/tesoros_choco"
REDIS_URL="redis://localhost:6379"

# Firebase Admin SDK
FIREBASE_PROJECT_ID="chocomarketlogin"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@chocomarketlogin.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-app-password"

# Frontend
FRONTEND_URL="http://localhost:5173"
CORS_ORIGIN="http://localhost:5173"

# Server
PORT=3000
NODE_ENV="development"

# File Upload
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/webp"
```

---

## 🧪 **CASOS DE PRUEBA CRÍTICOS**

### **Authentication Tests**
```typescript
describe('Firebase Authentication', () => {
  test('Usuario con token Firebase válido puede acceder a rutas protegidas')
  test('Token Firebase inválido/expirado retorna error 401')
  test('Usuario se crea automáticamente en DB en primera autenticación')
  test('Usuario puede completar perfil después del registro')
  test('Usuario puede cambiar rol de buyer a seller')
  test('Seller queda pendiente de aprobación al cambiar rol')
  test('Datos de perfil se sincronizan con Firebase')
});
```

### **Product Management Tests**
```typescript
describe('Products', () => {
  test('Vendedor puede crear producto')
  test('Vendedor no puede crear producto si no está aprobado')
  test('Producto creado queda en estado "pending" moderación')
  test('Solo el propietario puede editar su producto')
  test('Admin puede aprobar/rechazar productos')
  test('Productos aprobados aparecen en listado público')
  test('Upload de imágenes funciona correctamente')
});
```

### **Order Flow Tests**
```typescript
describe('Orders', () => {
  test('Comprador puede crear pedido con productos válidos')
  test('Stock se reduce al crear pedido')
  test('Vendedor recibe notificación de nuevo pedido')
  test('Estados de pedido se actualizan correctamente')
  test('Payment intent se crea correctamente')
  test('Webhook de Stripe marca pedido como pagado')
  test('Comprador puede ver historial de pedidos')
});
```

---

## 📊 **MÉTRICAS Y MONITOREO**

### **Health Check Endpoint**
```typescript
GET /api/health
Response: {
  status: "ok",
  timestamp: "2024-01-20T10:30:00Z",
  services: {
    database: "connected",
    redis: "connected",
    cloudinary: "connected",
    stripe: "connected"
  },
  uptime: 3600
}
```

### **Logs Requeridos**
```typescript
// Winston logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Log events importantes
logger.info('User registered', { userId, email, role });
logger.info('Order created', { orderId, buyerId, sellerId, total });
logger.warn('Failed login attempt', { email, ip });
logger.error('Payment failed', { orderId, error: error.message });
```

---

## 🚀 **PLAN DE IMPLEMENTACIÓN**

### **Fase 1 - Fundación (Semana 1-2)**
1. ✅ Setup inicial del proyecto Node.js + TypeScript
2. ✅ Configuración PostgreSQL + Prisma
3. ✅ Sistema de autenticación JWT completo
4. ✅ Middleware de seguridad básico
5. ✅ CRUD básico de usuarios
6. ✅ Upload de imágenes con Cloudinary

### **Fase 2 - Core Features (Semana 3-4)**
1. ✅ Sistema completo de productos (CRUD)
2. ✅ Sistema de categorías
3. ✅ Gestión de carrito de compras
4. ✅ Sistema básico de pedidos
5. ✅ Integración con Stripe para pagos
6. ✅ Sistema de notificaciones por email

### **Fase 3 - Advanced Features (Semana 5-6)**
1. ✅ Sistema de reseñas y calificaciones
2. ✅ Panel de administración completo
3. ✅ Sistema de moderación de productos
4. ✅ Notificaciones real-time con Socket.io
5. ✅ Analytics y reportes básicos
6. ✅ Sistema de favoritos

### **Fase 4 - Production Ready (Semana 7-8)**
1. ✅ Tests unitarios e integración
2. ✅ Optimizaciones de performance
3. ✅ Documentación API completa
4. ✅ Deployment y configuración producción
5. ✅ Monitoreo y logging
6. ✅ Backup y recovery procedures

---

## 📚 **DOCUMENTACIÓN API**

El backend debe generar automáticamente documentación Swagger/OpenAPI en:
- **Development**: `http://localhost:3000/api-docs`
- **Production**: `https://api.tesoroschoco.com/api-docs`

### **Ejemplo de endpoint documentado:**
```yaml
/api/products:
  get:
    summary: "Listar productos"
    tags: ["Products"]
    parameters:
      - name: page
        in: query
        schema:
          type: integer
          default: 1
      - name: limit
        in: query
        schema:
          type: integer
          default: 20
      - name: category
        in: query
        schema:
          type: string
      - name: search
        in: query
        schema:
          type: string
    responses:
      200:
        description: "Lista de productos"
        content:
          application/json:
            schema:
              type: object
              properties:
                products:
                  type: array
                  items:
                    $ref: "#/components/schemas/Product"
                pagination:
                  $ref: "#/components/schemas/Pagination"
```

---

## ✅ **CHECKLIST DE COMPLETITUD**

### **Core Functionality**
- [ ] Sistema de autenticación JWT completo
- [ ] Registro de usuarios (buyer/seller)
- [ ] Proceso de aprobación de vendedores
- [ ] CRUD completo de productos con imágenes
- [ ] Sistema de categorías
- [ ] Carrito de compras funcional
- [ ] Proceso completo de checkout
- [ ] Integración de pagos con Stripe
- [ ] Gestión de pedidos con estados
- [ ] Sistema de reseñas y calificaciones

### **Admin Features**
- [ ] Panel de administración
- [ ] Moderación de productos
- [ ] Gestión de usuarios
- [ ] Analytics y reportes
- [ ] Sistema de configuración

### **Communication**
- [ ] Notificaciones por email
- [ ] Notificaciones real-time
- [ ] Sistema de mensajería básico

### **Security & Performance**
- [ ] Validación de entrada completa
- [ ] Rate limiting implementado
- [ ] Manejo de errores robusto
- [ ] Logging completo
- [ ] Tests unitarios e integración

### **Production Ready**
- [ ] Variables de entorno configuradas
- [ ] Documentación API completa
- [ ] Health checks implementados
- [ ] Backup strategy definida
- [ ] Monitoring configurado

---

## 🎯 **OBJETIVOS DE PERFORMANCE**

- **Response Time**: < 200ms para endpoints simples
- **Database Queries**: < 100ms promedio
- **File Upload**: < 5 segundos para imágenes
- **Payment Processing**: < 10 segundos
- **Concurrent Users**: Soportar 1000+ usuarios simultáneos
- **Uptime**: 99.9% disponibilidad

---

## 🔒 **CONSIDERACIONES DE SEGURIDAD**

1. **Passwords**: Hasheado con bcrypt (12+ rounds)
2. **JWT**: Expiración corta + refresh token
3. **CORS**: Configurado para frontend específico
4. **Rate Limiting**: Por IP y por usuario
5. **Input Validation**: Validación estricta con Zod
6. **SQL Injection**: Prevención con Prisma ORM
7. **File Upload**: Validación de tipo y tamaño
8. **Environment**: Variables sensibles en .env
9. **HTTPS**: Obligatorio en producción
10. **Headers**: Helmet.js para headers de seguridad

---

Este documento especifica completamente el backend requerido para Tesoros del Chocó. Cualquier IA que implemente este backend debe seguir estas especificaciones exactamente para garantizar compatibilidad completa con el frontend ya desarrollado.
