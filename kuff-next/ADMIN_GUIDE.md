# Guía del Administrador - KUFF Website

## Información de Acceso

### Credenciales de Administrador
- **Usuario**: `kuff`
- **Contraseña**: `afro2025`

### URLs del Sitio
- **Sitio en Producción**: https://kuff-next-aw2a2hkw4-fats-projects-d0e7820f.vercel.app
- **Panel de Administración**: https://kuff-next-aw2a2hkw4-fats-projects-d0e7820f.vercel.app/admin

---

## Cómo Ingresar al Panel de Administración

1. **Ir al Panel de Admin**
   - Abre tu navegador
   - Ve a: https://kuff-next-aw2a2hkw4-fats-projects-d0e7820f.vercel.app/admin

2. **Iniciar Sesión**
   - Usuario: `kuff`
   - Contraseña: `afro2025`
   - Haz clic en "Sign In"

3. **Acceso Exitoso**
   - Verás el panel de administración de eventos
   - Podrás ver todos los eventos creados
   - Tendrás botones para crear, editar y eliminar eventos

---

## Cómo Crear un Evento

### Paso 1: Preparar la Información del Evento

Antes de crear el evento, ten lista esta información:

- **Título del evento** (ej: "GROOVE NIGHT")
- **Fecha** en formato YYYY-MM-DD (ej: 2025-11-06)
- **Hora** en formato 24h (ej: 03:00 para 3:00 AM)
- **Ubicación** (ej: "Miami, FL")
- **Venue/Local** (ej: "The Trip")
- **Descripción** del evento
- **URL del Flyer** (imagen del evento subida a postimg.cc o similar)
- **Link de Tickets** (opcional - link de Instagram, Eventbrite, etc.)
- **Dirección completa** (para Google Maps)

### Paso 2: Subir el Flyer (Imagen del Evento)

**IMPORTANTE**: Debes subir la imagen del flyer ANTES de crear el evento.

1. Ve a: https://postimg.cc
2. Haz clic en "Choose images"
3. Selecciona la imagen del flyer de tu evento
4. Haz clic en "Upload"
5. **Copia el link directo** que termina en `.jpg` o `.png`
   - Ejemplo: `https://i.postimg.cc/k5HQMHpK/Whats-App-Image-2025-11-05-at-13-51-15-35ff5188.jpg`
6. Este link lo usarás en el campo "Flyer URL"

### Paso 3: Crear el Evento en el Panel

1. En el panel de admin, haz clic en **"Create New Event"**
2. Llena todos los campos:

   ```
   Title: GROOVE NIGHT
   Date: 2025-11-06
   Time: 03:00
   Location: Miami, FL
   Venue: The Trip
   Description: VIP TABLES // LADIES FREE
   Flyer URL: https://i.postimg.cc/k5HQMHpK/tu-imagen.jpg
   Ticket Link: https://www.instagram.com/p/DQsetLMDCMo/
   Address: 28 NE 14th St #1311, Miami, FL 33132
   Embed Map: (dejar vacío)
   ```

3. Haz clic en **"Create Event"**
4. El evento aparecerá automáticamente en la sección de "Upcoming Events" del sitio

### Notas Importantes sobre Fechas

- **Eventos Futuros**: Se muestran en "Upcoming Events" si la fecha es HOY o en el futuro
- **Eventos Pasados**: Se muestran en "Past Events" solo si tienen fotos agregadas
- Si un evento es de hoy a las 3:00 AM, usa la fecha de HOY (no de ayer)

---

## Cómo Editar un Evento

1. En el panel de admin, encuentra el evento que quieres editar
2. Haz clic en el botón **"Edit"** (ícono de lápiz)
3. Se abrirá un formulario con toda la información actual
4. Modifica los campos que necesites cambiar
5. Haz clic en **"Update Event"**
6. Los cambios se aplicarán inmediatamente en el sitio

**Puedes editar**:
- Título, fecha, hora, ubicación
- Descripción y venue
- Flyer (cambiando la URL de la imagen)
- Link de tickets
- Dirección

---

## Cómo Eliminar un Evento

1. En el panel de admin, encuentra el evento que quieres eliminar
2. Haz clic en el botón **"Delete"** (ícono de basura)
3. Confirma que quieres eliminar el evento
4. El evento se borrará permanentemente

**⚠️ ADVERTENCIA**: Esta acción NO se puede deshacer.

---

## Cómo Agregar Fotos a Eventos Pasados

Para que un evento aparezca en la sección de "Past Events", necesitas agregar fotos:

1. Sube las fotos a https://postimg.cc (igual que con los flyers)
2. Copia los links directos de cada foto
3. En el panel de admin, haz clic en **"Edit"** en el evento
4. En el campo **"Photos"**, pega las URLs separadas por comas:
   ```
   https://i.postimg.cc/foto1.jpg, https://i.postimg.cc/foto2.jpg, https://i.postimg.cc/foto3.jpg
   ```
5. Haz clic en **"Update Event"**
6. El evento ahora aparecerá en "Past Events" con una galería de fotos

---

## Cómo Funcionan los Eventos Compartidos

Cuando creas un evento, automáticamente se genera una página individual para compartir:

### URL del Evento
Cada evento tiene su propia página:
```
https://tu-sitio.vercel.app/event/1
https://tu-sitio.vercel.app/event/2
```

### Botones de Compartir
En la página del evento, los visitantes pueden:

1. **Compartir en WhatsApp**
   - Envía un mensaje con toda la info del evento
   - Incluye título, fecha, hora, lugar y link

2. **Compartir en Facebook**
   - Comparte el link del evento en Facebook

3. **Compartir en Twitter**
   - Comparte el link del evento en Twitter

4. **Copiar Link**
   - Copia el link directo al portapapeles
   - Para compartir en cualquier lugar

### Cómo Compartir un Evento

1. Ve al sitio público
2. En la sección "Upcoming Events", encuentra tu evento
3. Haz clic en **"View & Share"**
4. Se abrirá la página del evento con todos los botones de compartir
5. Elige cómo quieres compartir (WhatsApp, Facebook, Twitter, o copiar link)

**IMPORTANTE**: También puedes ir directo a `/event/[número]` en el navegador.

---

## Variables de Entorno (Para Vercel)

**⚠️ IMPORTANTE**: Para que el panel de administración funcione en producción, necesitas configurar estas variables en Vercel:

### Configurar en Vercel:

1. Ve a: https://vercel.com/fats-projects-d0e7820f/kuff-next/settings/environment-variables

2. Agrega estas variables (una por una):

   ```
   NEXTAUTH_URL = https://kuff-next-aw2a2hkw4-fats-projects-d0e7820f.vercel.app
   NEXTAUTH_SECRET = 3Nj8mYQ4SssdLrNCTm/h3lLxP0ktGsUDWy5ek+FruWg=
   AUTH_SECRET = 3Nj8mYQ4SssdLrNCTm/h3lLxP0ktGsUDWy5ek+FruWg=
   ADMIN_EMAIL = kuff
   ADMIN_PASSWORD = afro2025
   ```

3. Después de agregar todas las variables, haz clic en **"Redeploy"** en Vercel

4. Espera a que termine el deployment (1-2 minutos)

5. Ahora podrás iniciar sesión en el panel de admin

---

## Solución de Problemas Comunes

### Problema: No puedo iniciar sesión
**Solución**:
- Verifica que las variables de entorno estén configuradas en Vercel
- Usa exactamente: Usuario `kuff` y contraseña `afro2025`
- Si no funciona, haz "Redeploy" en Vercel

### Problema: Creé un evento pero no aparece
**Solución**:
- Verifica la fecha del evento:
  - Si es HOY o FUTURO: debe aparecer en "Upcoming Events"
  - Si es PASADO: solo aparece si tiene fotos en "Past Events"
- Recarga la página (F5)
- Si es un evento de madrugada (3 AM), usa la fecha del día en que comienza

### Problema: El flyer no se ve
**Solución**:
- Verifica que el link del flyer sea el link DIRECTO de la imagen
- Debe terminar en `.jpg`, `.png` o `.jpeg`
- Usa https://postimg.cc para subir imágenes
- Copia el link que dice "Direct link"

### Problema: Los botones de compartir no funcionan
**Solución**:
- Verifica que estés en la página del evento (`/event/1`)
- Para WhatsApp, asegúrate de tener WhatsApp instalado
- Para copiar link, el navegador pedirá permiso (acéptalo)

---

## Consejos y Mejores Prácticas

### Al Crear Eventos:

1. **Fechas de Madrugada**
   - Si el evento es a las 3:00 AM del miércoles, usa la fecha del martes noche
   - Ejemplo: Evento "Wednesday 3 AM" = usar fecha del martes

2. **Imágenes de Flyers**
   - Usa imágenes de buena calidad (mínimo 800x800 píxeles)
   - Formato JPG o PNG
   - Sube siempre a postimg.cc u otro servicio similar

3. **Descripciones**
   - Sé conciso pero claro
   - Incluye información importante: precio, dress code, amenidades

4. **Links de Tickets**
   - Puedes usar links de Instagram, Facebook Events, Eventbrite, etc.
   - Asegúrate de que el link funcione antes de publicar

### Mantenimiento Regular:

1. **Revisa eventos pasados**
   - Agrega fotos a eventos que ya pasaron
   - Esto mantiene el sitio actualizado con contenido visual

2. **Actualiza eventos futuros**
   - Si cambia algo (hora, venue, etc.), edita el evento inmediatamente

3. **Borra eventos antiguos**
   - Puedes eliminar eventos muy viejos para mantener el sitio limpio

---

## Información Técnica

### Estructura del Sitio:

- **Framework**: Next.js 16
- **Hosting**: Vercel
- **Autenticación**: NextAuth
- **Almacenamiento**: JSON file (`/data/events.json`)

### Rutas Importantes:

- `/` - Página principal
- `/admin` - Panel de administración (requiere login)
- `/event/[id]` - Página individual de cada evento
- `/api/events` - API para eventos (GET/POST)
- `/api/events/[id]` - API para evento específico (GET/PUT/DELETE)

---

## Contacto y Soporte

Si tienes problemas técnicos o necesitas ayuda:

1. Revisa esta guía primero
2. Verifica la sección de "Solución de Problemas"
3. Asegúrate de que las variables de entorno estén configuradas en Vercel

---

## Resumen Rápido

### Para Crear un Evento:
1. Sube el flyer a postimg.cc
2. Ve a `/admin` e inicia sesión
3. Clic en "Create New Event"
4. Llena todos los campos
5. Haz clic en "Create Event"

### Para Compartir un Evento:
1. Ve al sitio público
2. Clic en "View & Share" en el evento
3. Usa los botones de compartir (WhatsApp, Facebook, Twitter)

### Para Editar Credenciales:
- Ve a Vercel → Settings → Environment Variables
- Cambia `ADMIN_EMAIL` y/o `ADMIN_PASSWORD`
- Haz "Redeploy"

---

**¡Listo! Tu sitio está completamente funcional y listo para gestionar eventos.** 🎉
