# KUFF DJ Website - Next.js

Sitio web profesional para KUFF DJ con sistema de gestión de eventos dinámicos, panel de administración protegido, y diseño moderno.

## Características

- ✨ Diseño moderno y responsivo
- 🎉 Sistema de eventos dinámicos con API
- 🔒 Panel de administración protegido con NextAuth
- 🖼️ Galería de fotos con lightbox para eventos pasados
- 📱 Totalmente responsive
- 🚀 Optimizado para SEO y rendimiento
- 🎨 Integración con PostImages.org para hosting de imágenes

## Tecnologías

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Autenticación**: NextAuth.js v5
- **Estilos**: CSS Modules + Custom CSS
- **Hosting de Imágenes**: PostImages.org

## Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secreto-generado-aqui

# Admin Credentials
ADMIN_EMAIL=tu-email@ejemplo.com
ADMIN_PASSWORD=tu-contraseña-segura
```

**Importante**: Genera un secreto seguro para `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Despliegue en Vercel (Recomendado)

### Opción 1: Deploy con Git (Recomendado)

1. Sube tu código a GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/tu-usuario/kuff-next.git
   git push -u origin main
   ```

2. Ve a [vercel.com](https://vercel.com) e inicia sesión

3. Haz clic en "Add New Project"

4. Importa tu repositorio de GitHub

5. Configura las variables de entorno en Vercel:
   - `NEXTAUTH_URL` = `https://tu-dominio.vercel.app`
   - `NEXTAUTH_SECRET` = (genera uno nuevo con `openssl rand -base64 32`)
   - `ADMIN_EMAIL` = tu email de administrador
   - `ADMIN_PASSWORD` = tu contraseña segura

6. Haz clic en "Deploy"

### Opción 2: Deploy con Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Sigue las instrucciones y asegúrate de configurar las variables de entorno.

### Opción 3: Deploy con PM2 en tu Servidor (VPS)

Si tienes tu propio servidor y quieres mantener la aplicación siempre activa:

```bash
# 1. Construir para producción
npm run build

# 2. Iniciar con PM2 (mantiene la app corriendo 24/7)
npm run pm2:start

# 3. Ver logs
npm run pm2:logs

# 4. Ver estado
npm run pm2:status
```

**Comandos útiles de PM2:**
- `npm run pm2:start` - Iniciar la aplicación
- `npm run pm2:stop` - Detener la aplicación
- `npm run pm2:restart` - Reiniciar la aplicación
- `npm run pm2:logs` - Ver logs en tiempo real
- `npm run pm2:status` - Ver estado del proceso
- `npm run pm2:monit` - Monitor de recursos (CPU, memoria)

**Para auto-inicio después de reboot del servidor:**

```bash
pm2 save
pm2 startup
# Ejecuta el comando que PM2 te muestre
```

📖 **Guía completa**: Ver [PM2-GUIDE.md](./PM2-GUIDE.md) para instrucciones detalladas.

**¿Cuál opción elegir?**
- **Vercel** (Recomendado): Más fácil, deploy automático, CDN global, gratis
- **PM2**: Si tienes tu propio servidor VPS y necesitas control total

## Uso del Panel de Administración

1. Accede a `/admin` en tu sitio
2. Inicia sesión con las credenciales configuradas en `.env`
3. Agrega, edita o elimina eventos
4. Para imágenes, sube a [PostImages.org](https://postimages.org) y pega el enlace directo

### Agregar Eventos

1. Completa el formulario con la información del evento
2. Para el flyer, sube la imagen a PostImages.org y copia el "Direct Link"
3. Para eventos pasados, agrega URLs de fotos (una por línea) en el campo de fotos

## Estructura del Proyecto

```
kuff-next/
├── app/
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx        # Página de login
│   │   └── page.tsx            # Panel de administración
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts    # Configuración de NextAuth
│   │   └── events/
│   │       ├── route.ts        # GET/POST eventos
│   │       └── [id]/
│   │           └── route.ts    # PUT/DELETE eventos
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Página principal
│   ├── providers.tsx           # SessionProvider
│   └── globals.css             # Estilos globales
├── components/
│   ├── EventsSection.tsx       # Sección de eventos
│   └── Navigation.tsx          # Navegación
├── data/
│   └── events.json             # Datos de eventos
├── lib/
│   ├── auth.ts                 # Configuración de auth
│   └── types.ts                # Tipos de TypeScript
├── public/
│   └── assets/                 # Imágenes y recursos
├── .env                        # Variables de entorno
├── .env.example                # Ejemplo de variables
├── next.config.ts              # Configuración de Next.js
├── package.json                # Dependencias
└── tsconfig.json               # Configuración de TypeScript
```

## API Endpoints

### GET /api/events
Obtiene todos los eventos

### POST /api/events
Crea un nuevo evento (requiere autenticación)

**Body:**
```json
{
  "title": "KUFF at Club",
  "date": "2025-12-31",
  "time": "22:00",
  "location": "Miami, FL",
  "venue": "Club Space",
  "description": "Descripción del evento",
  "flyer": "https://i.postimg.cc/...",
  "ticketLink": "https://...",
  "address": "Dirección completa",
  "photos": []
}
```

### PUT /api/events/[id]
Actualiza un evento (requiere autenticación)

### DELETE /api/events/[id]
Elimina un evento (requiere autenticación)

## Seguridad

- ✅ Panel de administración protegido con NextAuth
- ✅ Credenciales almacenadas en variables de entorno
- ✅ Validación de sesión en todas las rutas de API protegidas
- ⚠️ **Importante**: Cambia `ADMIN_PASSWORD` por una contraseña segura en producción

## Personalización

### Cambiar Colores

Edita las variables CSS en `app/globals.css`:

```css
:root {
    --primary-color: #00d9ff;      /* Color principal (cyan) */
    --secondary-color: #0099cc;
    --accent-color: #00ffff;
}
```

### Modificar Contenido

- **Información del DJ**: Edita `app/page.tsx` en la sección "About"
- **Enlaces de redes sociales**: Actualiza los enlaces en la sección "Contact"
- **Videos de YouTube**: Cambia los IDs en el array de videos

## Soporte

Para problemas o preguntas:
- Verifica la [documentación de Next.js](https://nextjs.org/docs)
- Revisa la [documentación de NextAuth](https://next-auth.js.org/)

## Licencia

Todos los derechos reservados - KUFF DJ 2025
 
