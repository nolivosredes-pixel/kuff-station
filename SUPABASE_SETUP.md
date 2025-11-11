# 🔥 Setup Supabase para Chat en Vivo

## 1. Crear cuenta en Supabase (GRATIS)

1. Ve a: https://supabase.com
2. Click en **"Start your project"**
3. Sign up con GitHub (recomendado) o email
4. Es 100% gratis (500MB database + 2GB bandwidth/mes)

## 2. Crear nuevo proyecto

1. Click en **"New Project"**
2. Nombre: `kuff-live-chat`
3. Database Password: (genera una segura y guárdala)
4. Region: **East US** (más cercano)
5. Click **"Create new project"**
6. Espera 2-3 minutos mientras se crea

## 3. Crear tabla de mensajes

1. Ve a **SQL Editor** en el menú izquierdo
2. Pega este SQL y dale **"Run"**:

```sql
-- Tabla para mensajes del chat en vivo
create table live_chat_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  username text not null,
  message text not null,
  avatar_color text default '#00d9ff'
);

-- Enable Row Level Security (RLS)
alter table live_chat_messages enable row level security;

-- Policy: Cualquiera puede leer mensajes
create policy "Anyone can read messages"
  on live_chat_messages for select
  using (true);

-- Policy: Cualquiera puede insertar mensajes
create policy "Anyone can insert messages"
  on live_chat_messages for insert
  with check (true);

-- Crear índice para búsquedas rápidas
create index live_chat_messages_created_at_idx on live_chat_messages (created_at desc);
```

## 4. Obtener las credenciales

1. Ve a **Settings → API** (en el menú izquierdo)
2. Copia estas 2 cosas:

### Project URL:
```
https://xxxxxxxxxxxxx.supabase.co
```

### Anon (public) key:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ...
```

## 5. Agregar a .env

Agrega esto a tu archivo `.env`:

```bash
# Supabase Configuration (para chat en vivo)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 6. Agregar a Vercel

También agrega estas variables en Vercel:

```bash
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
```

---

## 🎯 Features del chat:

- ✅ **Tiempo real**: Mensajes aparecen instantáneamente
- ✅ **Sin login**: Los viewers solo ponen su nombre
- ✅ **Auto-limpieza**: Mensajes viejos se borran automáticamente
- ✅ **Moderación**: Límite de caracteres, filtro de spam
- ✅ **Mobile-friendly**: Funciona perfecto en celular
- ✅ **Gratis**: 100% dentro del tier gratuito de Supabase

---

## 📊 Límites gratis de Supabase:

- ✅ 500MB database (suficiente para millones de mensajes)
- ✅ 2GB bandwidth/mes
- ✅ Hasta 500 conexiones simultáneas
- ✅ Sin límite de tiempo

---

¡Una vez que tengas las credenciales, avísame y configuro el chat! 🔥
