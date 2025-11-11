# SRS Server for KUFF DJ Streaming

SRS (Simple Realtime Server) - servidor de streaming de bajo latency para KUFF.

## 🎯 RECOMENDACIÓN: Deploy en Fly.io (GRATIS)

**Fly.io es la mejor opción gratuita:**
- ✅ **160GB bandwidth gratis/mes** (vs Railway 45GB)
- ✅ **No se duerme** (vs Render que duerme después de 15min)
- ✅ **256MB RAM gratis** (perfecto para SRS)
- ✅ **Global CDN** incluido

### 📋 Deploy rápido en Fly.io

Ver guía completa en: [DEPLOY_FLYIO.md](./DEPLOY_FLYIO.md)

**Comandos rápidos:**

```bash
# 1. Instalar Fly CLI
curl -L https://fly.io/install.sh | sh

# 2. Login
flyctl auth login

# 3. Deploy desde srs-server/
cd /workspaces/kuff-station/srs-server
flyctl launch --no-deploy
flyctl deploy
```

## 📡 URLs después del deploy (Fly.io)

- **RTMP Input**: `rtmp://kuff-srs.fly.dev:1935/live`
- **HLS Output**: `https://kuff-srs.fly.dev/live/stream.m3u8`
- **HTTP-FLV**: `https://kuff-srs.fly.dev/live/stream.flv`
- **API Stats**: `https://kuff-srs.fly.dev:1985/api/v1/streams/`

## 🎛️ Configuración para Larix Broadcaster

```
URL: rtmp://kuff-srs.fly.dev:1935/live
Stream Key: stream (o el nombre que quieras)
```

## 📊 Ventajas vs Owncast

- ✅ **4x más rápido** (delay 2-5 seg vs 10-20 seg)
- ✅ **4x menos recursos** (50MB RAM vs 200MB)
- ✅ **Más estable** con muchos viewers
- ✅ **Soporta 1000+ viewers** simultáneos
- ✅ **Sin UI/admin panel** = más ligero y rápido

## 🔗 Actualizar Next.js después del deploy

Después de deployar en Fly.io, actualiza tu `.env`:

```bash
# Servidor SRS en Fly.io
OWNCAST_SERVER_URL=https://kuff-srs.fly.dev
OWNCAST_RTMP_URL=rtmp://kuff-srs.fly.dev:1935/live
OWNCAST_STREAM_KEY=QS76Y2rDmfxm*upmFVO@vpO99KyOyJ

# HLS URL para el player
SRS_HLS_URL=https://kuff-srs.fly.dev/live/stream.m3u8
```

Luego deploy a Vercel:

```bash
cd kuff-next
git add .
git commit -m "Update to SRS streaming server on Fly.io"
git push
```

## 📝 Notas técnicas

- HLS con fragmentos de **2 segundos** (muy bajo delay)
- DVR deshabilitado por defecto (ahorra recursos)
- CORS habilitado para acceso desde kuffdj.net
- API HTTP en puerto 1985 para status checks

## 🚀 Alternativa: Railway (requiere pago eventualmente)

Si prefieres Railway, ver: [railway.json](./railway.json)

**ADVERTENCIA:** Railway solo ofrece 45GB bandwidth gratis, luego cobra $0.10/GB. Para streaming NO es recomendado en el tier gratis.
