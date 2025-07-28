# Flujo de Autenticación Corregido - Separación de Pasos

## Problema Original
El flujo estaba creando cuentas con datos "quemados" (hardcodeados) en lugar de seguir el proceso correcto de:
1. Autenticación → 2. Selección de rol → 3. Completar perfil → 4. Crear en Firestore

## Nuevo Flujo Implementado

### 📝 Registro con Formulario
1. **Formulario de registro**: Solo nombre, email, contraseña (SIN selección de rol)
2. **Autenticación Firebase**: Crea cuenta en Firebase Auth + displayName
3. **Redirección**: `/select-role`
4. **Selección de rol**: Comprador/Vendedor
5. **Creación de perfil**: Se crea documento completo en Firestore
6. **Redirección final**: 
   - Comprador → `/complete-profile`
   - Vendedor → `/pending-approval`

### 🔑 Registro/Login con Google
1. **Autenticación Google**: Solo autentica con Google
2. **Verificación**: ¿Existe perfil en Firestore?
   - **Sí existe** → Login normal, redirige a dashboard
   - **No existe** → Usuario nuevo, redirige a `/select-role`
3. **Selección de rol**: Comprador/Vendedor (mismo flujo que formulario)
4. **Resto igual** que el flujo de formulario

### 📋 Completar Perfil (Nueva página)
- **Campos opcionales**: Teléfono, dirección, biografía
- **Opción "Omitir"**: Puede completar después
- **Persistencia**: Se guarda en Firestore
- **Redirección**: Dashboard apropiado

## Métodos Actualizados

### `AuthContext.tsx`
- ✅ `register()`: Solo crea cuenta Firebase (sin rol, sin Firestore)
- ✅ `loginWithGoogle()`: Simplificado, solo autentica
- ✅ `createUserProfile()`: NUEVO - Crea perfil completo en Firestore
- ✅ `updateUser()`: Actualiza perfil existente

### `AuthPage.tsx`
- ✅ Formulario registro sin selección de rol
- ✅ Botones Google sin lógica de rol
- ✅ Redirecciones apropiadas

### `SelectRolePage.tsx`
- ✅ Usa `createUserProfile()` en lugar de `updateUser()`
- ✅ Crea perfil completo con rol seleccionado
- ✅ Redirige a completar perfil o aprobación

### `CompleteProfilePage.tsx` (NUEVO)
- ✅ Formulario para información adicional opcional
- ✅ Opción de omitir y completar después
- ✅ Actualiza perfil existente

## Estados del Usuario

### 1. **Solo Firebase Auth** (needsRoleSelection: true)
- Autenticado en Firebase
- Sin documento en Firestore
- Redirige a `/select-role`

### 2. **Perfil Básico Creado** (needsRoleSelection: false)
- Documento en Firestore con rol
- Puede tener campos opcionales vacíos
- Acceso completo a la app

### 3. **Perfil Completo**
- Toda la información incluida
- Experiencia personalizada completa

## Rutas y Redirecciones

```
/register → /select-role → /complete-profile → /dashboard
/login-google (nuevo) → /select-role → /complete-profile → /dashboard  
/login-google (existente) → /dashboard
/login-form → /dashboard
```

## Ventajas del Nuevo Flujo

✅ **Separación clara**: Cada paso tiene una responsabilidad específica
✅ **Datos reales**: No más información hardcodeada
✅ **Flexibilidad**: Usuarios pueden omitir información opcional
✅ **Consistencia**: Mismo flujo para formulario y Google
✅ **UX mejorada**: Pasos claros y progresivos
✅ **Mantenibilidad**: Código más limpio y modular

## Archivos Modificados
- `src/contexts/AuthContext.tsx` - Métodos de autenticación
- `src/pages/AuthPage.tsx` - Formularios simplificados  
- `src/pages/SelectRolePage.tsx` - Creación de perfil con rol
- `src/pages/CompleteProfilePage.tsx` - NUEVO - Completar información
- `src/App.tsx` - Nueva ruta para completar perfil

## Estado Actual
✅ Flujo de registro paso a paso implementado
✅ Separación correcta de responsabilidades  
✅ Sin datos hardcodeados
✅ Experiencia de usuario mejorada
✅ Compatible con formulario y Google
