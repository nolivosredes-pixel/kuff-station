# 🚀 Deploy SRS en Fly.io (GRATIS - 160GB bandwidth)

## 1. Instalar Fly CLI

```bash
# macOS/Linux
curl -L https://fly.io/install.sh | sh

# Verificar instalación
flyctl version
```

## 2. Login en Fly.io

```bash
flyctl auth login
```

Se abrirá tu navegador para autenticarte.

## 3. Deploy desde el directorio srs-server

```bash
cd /workspaces/kuff-station/srs-server

# Lanzar app (primera vez)
flyctl launch --no-deploy

# Cuando pregunte:
# - App name: kuff-srs (o el que prefieras)
# - Region: mia (Miami) o la más cercana
# - PostgreSQL: NO
# - Redis: NO

# Deploy!
flyctl deploy
```

## 4. Obtener tus URLs

Después del deploy, Fly.io te dará:

```bash
flyctl info
```

**Tus URLs serán:**
- **RTMP Input**: `rtmp://kuff-srs.fly.dev:1935/live`
- **HLS Output**: `https://kuff-srs.fly.dev/live/stream.m3u8`
- **HTTP-FLV**: `https://kuff-srs.fly.dev/live/stream.flv`
- **API Stats**: `https://kuff-srs.fly.dev:1985/api/v1/streams/`

## 5. Configurar Larix Broadcaster

```
URL: rtmp://kuff-srs.fly.dev:1935/live
Stream Key: stream (o el que quieras)
```

## 6. Actualizar Next.js

Copia las URLs en tu `.env`:

```bash
SRS_SERVER_URL=https://kuff-srs.fly.dev
SRS_RTMP_URL=rtmp://kuff-srs.fly.dev:1935/live
SRS_HLS_URL=https://kuff-srs.fly.dev/live/stream.m3u8
```

## 📊 Límites gratis de Fly.io

- ✅ **160GB bandwidth/mes** (suficiente para ~145 horas @ 720p)
- ✅ **256MB RAM** (más que suficiente para SRS)
- ✅ **3 máquinas compartidas gratis**
- ✅ **Sin auto-sleep** (siempre disponible)

## 🔧 Comandos útiles

```bash
# Ver logs en tiempo real
flyctl logs

# Ver status
flyctl status

# Escalar memoria si necesitas
flyctl scale memory 512

# Ver apps
flyctl apps list

# Destruir app
flyctl apps destroy kuff-srs
```

## 🎯 Ventajas vs otras opciones

| Plataforma | Bandwidth gratis | Auto-sleep | Precio |
|------------|------------------|------------|--------|
| **Fly.io** | 160GB | ❌ No | $0 |
| Railway | 45GB | ❌ No | $0 luego $5 |
| Render | 100GB | ✅ Sí (15min) | $0 |
| Vercel | ❌ No streaming | N/A | N/A |

## 🔥 Listo!

Una vez deployado, actualiza las URLs en tu `.env` y tu app estará lista para streaming desde Fly.io!
