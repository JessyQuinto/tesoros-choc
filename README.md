# 🍫 Tesoros del Chocó - Proyecto SENA

Marketplace para productos artesanales del Chocó desarrollado como proyecto académico del SENA.

## 🚀 Inicio Rápido para Desarrollo

### ⚡ Opción 1: Stack Completo (Recomendado)
```bash
# Para Frontend + Backend juntos:
start-fullstack.bat
```

### 🎨 Opción 2: Solo Frontend
```bash
# Solo frontend (sin datos reales):
start-dev.bat
```

### 🔧 Opción 3: Manual
```bash
# Instalar dependencias (solo la primera vez)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

**URLs del proyecto:**
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000 (proyecto separado)

## 🏗️ Arquitectura del Proyecto

### Frontend (este proyecto)
- **Puerto**: 5173
- **Tecnología**: React + Vite + TypeScript
- **UI**: Shadcn/UI + Tailwind CSS
- **Auth**: Firebase Authentication

### Backend (proyecto separado)
- **Puerto**: 3000  
- **Ubicación**: `D:\DOCUMENTOS\GitHub\backend-marketplace`
- **Tecnología**: Node.js + Express + TypeScript
- **Base de datos**: Firebase Admin SDK

## 🛠️ Scripts Disponibles

- `npm run dev` - Servidor de desarrollo con auto-reload
- `npm run dev:alt` - Servidor en puerto 3001 si 3000 está ocupado
- `npm run start` - Alias para npm run dev
- `npm run build` - Construir para producción
- `npm run preview` - Previsualizar build de producción
- `npm run lint` - Revisar código
- `npm run type-check` - Verificar tipos TypeScript
- `npm run format` - Formatear código

## 🔧 Configuración

- **Puerto Frontend**: 5173 (Vite dev server)
- **Puerto Backend**: 3000 (Express server)
- **Auto-abrir navegador**: Sí
- **Host**: localhost
- **Modo strict port**: Desactivado (busca puerto disponible automáticamente)
- **API Base URL**: http://localhost:3000/api

## ✅ Estado del Proyecto

- ✅ **Dependencias instaladas y funcionando**
- ✅ **Servidor de desarrollo operativo**
- ✅ **TypeScript configurado**
- ✅ **Firebase conectado**
- ✅ **Vite configurado correctamente**
- ✅ **Scripts de inicio automatizados**
- ✅ **Proyecto listo para desarrollo**

## 📝 Notas del Proyecto

- ✅ Proyecto académico SENA
- ✅ No va a producción
- ✅ Configurado para desarrollo local
- ✅ Firebase configurado para testing
- ✅ Auto-reload habilitado para desarrollo ágil

---

## Project info (Original Lovable)

**URL**: https://lovable.dev/projects/412ba776-2dbf-463c-af37-a152465d6039

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/412ba776-2dbf-463c-af37-a152465d6039) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/412ba776-2dbf-463c-af37-a152465d6039) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
