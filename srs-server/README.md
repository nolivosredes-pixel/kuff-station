# SRS Server for KUFF DJ Streaming

SRS (Simple Realtime Server) setup optimizado para streaming de DJ en vivo.

## 🚀 Deploy en Railway

1. Ve a: https://railway.com/new/github
2. Selecciona el repo: `kuff-station`
3. Railway detectará el Dockerfile automáticamente
4. Deploy!

## 📡 URLs después del deploy

Una vez desplegado, Railway te dará URLs públicas:

- **RTMP Input**: `rtmp://TU-APP.railway.app:1935/live`
- **HLS Output**: `https://TU-APP.railway.app/live/stream.m3u8`
- **HTTP-FLV**: `https://TU-APP.railway.app/live/stream.flv`
- **API Stats**: `https://TU-APP.railway.app:1985/api/v1/streams/`

## 🎛️ Configuración para Larix Broadcaster

```
URL: rtmp://TU-APP.railway.app:1935/live
Stream Key: stream (o el nombre que quieras)
```

## 🔧 Variables de entorno (opcional)

No necesitas variables de entorno para el setup básico. Todo funciona out-of-the-box.

## 📊 Ventajas vs Owncast

- ✅ 4x más rápido (delay 2-5 seg vs 10-20 seg)
- ✅ 4x menos recursos (50MB RAM vs 200MB)
- ✅ Más estable con muchos viewers
- ✅ Soporta 1000+ viewers simultáneos

## 🔗 Integración con Next.js

Actualiza tu `.env`:

```bash
# Reemplaza con tu URL de Railway
SRS_SERVER_URL=https://TU-APP.railway.app
SRS_RTMP_URL=rtmp://TU-APP.railway.app:1935/live
SRS_HLS_URL=https://TU-APP.railway.app/live/stream.m3u8
```

## 📝 Notas

- El servidor usa HLS con fragmentos de 2 segundos (muy bajo delay)
- DVR está deshabilitado por defecto (puedes habilitarlo en srs.conf)
- CORS habilitado para acceso desde tu web
