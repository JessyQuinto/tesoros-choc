# FLUJO DE REGISTRO CORREGIDO - MAPEO COMPLETO

## 🔥 PROBLEMA ORIGINAL
```
❌ FLUJO INCORRECTO:
Formulario → register() → 🚨 FIREBASE AUTH CREADA → select-role → complete-profile
                              ↑
                         PROBLEMA: Cuenta creada
                         sin información completa
```

## ✅ NUEVO FLUJO CORRECTO

### 📋 REGISTRO CON FORMULARIO
```
1. AuthPage (Formulario)
   ↓ [email, password, name]
   ↓ onRegister() → RegistrationDataManager.save()
   ↓ (NO se llama a Firebase)
   ↓
2. SelectRolePage  
   ↓ [+ role seleccionado]
   ↓ RegistrationDataManager.save({role})
   ↓
3. CompleteProfilePage
   ↓ [+ phone, address, bio - OPCIONAL]
   ↓ completeRegistration() 
   ↓ ✅ AQUÍ SE CREA LA CUENTA EN FIREBASE
   ↓ createUserWithEmailAndPassword()
   ↓ setDoc() para Firestore
   ↓ RegistrationDataManager.clear()
   ↓
4. Dashboard/PendingApproval
```

### 🔑 REGISTRO CON GOOGLE
```
1. AuthPage (Google Button)
   ↓ loginWithGoogle() → ✅ Firebase Auth (Google)
   ↓ RegistrationDataManager.save({googleUser})
   ↓ 
2. SelectRolePage
   ↓ [+ role seleccionado]
   ↓ RegistrationDataManager.save({role})
   ↓
3. CompleteProfilePage  
   ↓ [+ phone, address, bio - OPCIONAL]
   ↓ completeRegistration()
   ↓ ✅ AQUÍ SE CREA EL PERFIL EN FIRESTORE
   ↓ setDoc() para Firestore
   ↓ RegistrationDataManager.clear()
   ↓
4. Dashboard/PendingApproval
```

## 🗂️ ALMACENAMIENTO TEMPORAL (localStorage)

### Estructura de datos temporales:
```typescript
interface TempRegistrationData {
  // Para formulario
  email?: string;
  password?: string;
  name?: string;
  
  // Para Google
  isGoogleAuth?: boolean;
  googleUser?: {
    email: string;
    name: string;
    avatar: string | null;
  };
  
  // Común
  role?: 'buyer' | 'seller';
  phone?: string;
  address?: string;
  bio?: string;
}
```

## 🎯 PUNTOS CLAVE DEL NUEVO FLUJO

### ✅ Lo que SÍ hace cada página:

#### AuthPage:
- ❌ NO crea cuenta en Firebase
- ✅ Guarda datos en localStorage
- ✅ Redirige a `/select-role`

#### SelectRolePage:
- ❌ NO crea perfil en Firestore
- ✅ Agrega rol a datos temporales
- ✅ Redirige a `/complete-profile`

#### CompleteProfilePage:
- ✅ **ÚNICA** página que llama a Firebase
- ✅ Crea cuenta completa con TODA la información
- ✅ Limpia datos temporales
- ✅ Redirige al dashboard final

## 📊 COMPARACIÓN DE FLUJOS

| Paso | Flujo Anterior ❌ | Nuevo Flujo ✅ |
|------|------------------|----------------|
| 1 | Formulario → Firebase Auth | Formulario → localStorage |
| 2 | Ya autenticado → select-role | localStorage → select-role |
| 3 | Firestore parcial → complete | localStorage → complete |
| 4 | Actualizar Firestore | **Firebase Auth + Firestore completo** |

## 🛠️ MÉTODOS ACTUALIZADOS

### AuthContext.tsx:
- `register()`: Solo guarda en localStorage (NO Firebase)
- `completeRegistration()`: **NUEVO** - Crea cuenta completa
- `loginWithGoogle()`: Para Google, auth inmediato pero perfil después

### AuthPage.tsx:
- `onRegister()`: Usa RegistrationDataManager
- `onGoogleSignIn()`: Guarda datos de Google temporalmente

### SelectRolePage.tsx:
- Solo agrega rol a datos temporales
- NO llama a Firebase

### CompleteProfilePage.tsx:
- **ÚNICA** página que crea la cuenta en Firebase
- Maneja tanto registro con formulario como Google
- Limpia datos temporales al final

## 🔒 VALIDACIONES DE SEGURIDAD

- Cada página verifica que existan datos temporales
- Si no hay datos, redirige al login
- Los datos se limpian después de crear la cuenta exitosamente
- No se puede saltear pasos del flujo

## 🎯 RESULTADO FINAL

✅ **La cuenta en Firebase se crea SOLO al final**  
✅ **Con TODA la información del usuario**  
✅ **Sin datos hardcodeados**  
✅ **Flujo paso a paso controlado**  
✅ **Experiencia de usuario mejorada**  

### Estado antes:
```
register() → ⚡ Firebase Auth (datos incompletos)
```

### Estado después:
```
Recopilar info → Completar datos → ⚡ Firebase Auth (datos completos)
```
