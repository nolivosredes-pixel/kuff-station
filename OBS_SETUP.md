# 🎥 Configuración de OBS para KUFF Streaming

## Credenciales de Streaming

**Server (URL):** `rtmp://kuff-srs.fly.dev:1935/live`
**Stream Key:** `QS76Y2rDmfxm*upmFVO@vpO99KyOyJ`

---

## 📋 Setup paso a paso en OBS Studio

### 1. Abrir configuración de Stream
- Abre OBS Studio
- Ve a **Settings** (Configuración)
- Click en **Stream** en el menú izquierdo

### 2. Configurar servidor RTMP
- **Service:** Selecciona **Custom** (Personalizado)
- **Server:** `rtmp://kuff-srs.fly.dev:1935/live`
- **Stream Key:** `QS76Y2rDmfxm*upmFVO@vpO99KyOyJ`
- Click **OK**

### 3. Configuración de Video (recomendada)
Ve a **Settings → Video**:
- **Base Resolution:** 1920x1080 (o tu resolución de pantalla)
- **Output Resolution:** 1280x720 (720p es ideal para streaming)
- **FPS:** 30 (o 60 si tienes buen internet)

### 4. Configuración de Output (importante)
Ve a **Settings → Output**:

**Si tienes buena conexión (5+ Mbps upload):**
- **Output Mode:** Advanced
- **Encoder:** x264 (o Hardware si tienes GPU potente)
- **Bitrate:** 2500-4000 Kbps para 720p
- **Keyframe Interval:** 2 segundos
- **Preset:** veryfast

**Si tienes conexión lenta (< 5 Mbps upload):**
- **Output Mode:** Simple
- **Video Bitrate:** 1500-2000 Kbps
- **Encoder:** x264
- **Preset:** ultrafast

### 5. Configuración de Audio
Ve a **Settings → Audio**:
- **Sample Rate:** 48 kHz
- **Channels:** Stereo

En **Output → Audio Bitrate:**
- **Audio Bitrate:** 160 Kbps (calidad buena)

---

## 🎵 Setup para DJ Streaming

### Agregar fuentes de audio:
1. **Audio de DJ Software** (Serato, Traktor, etc):
   - En OBS, ve a **Audio Mixer**
   - Asegúrate de capturar el output de tu software DJ
   - Usa un cable virtual como VB-Audio Cable o Loopback

2. **Micrófono** (opcional):
   - Agrega en **Settings → Audio → Mic/Auxiliary Audio**

### Agregar escenas:
1. **Escena Principal:**
   - Agrega una fuente de **Image** con tu logo KUFF
   - Agrega **Text** con el nombre del DJ o track actual
   - Opcional: **Browser Source** para visualizador de audio

2. **Escena "Coming Soon":**
   - Imagen estática mientras preparas el set

---

## 🚀 Empezar a streamear

1. Click en **Start Streaming** en OBS
2. El stream aparecerá automáticamente en **https://kuffdj.net/live**
3. Latencia: **3-5 segundos** (súper rápido!)

---

## 📊 Monitoreo

- **Ver tu stream:** https://kuffdj.net/live
- **Ver credenciales:** https://kuffdj.net/admin
- **Stats del servidor:** https://fly.io/apps/kuff-srs/monitoring

---

## 🔧 Troubleshooting

**Problema:** OBS dice "Connection failed"
- Verifica que el server URL sea exactamente: `rtmp://kuff-srs.fly.dev:1935/live`
- Verifica que el stream key esté correcto (sin espacios extra)
- Chequea tu firewall/antivirus

**Problema:** Stream se corta o buffers
- Baja el bitrate en **Settings → Output**
- Cambia el preset a "ultrafast" o "superfast"
- Cierra otros programas que usen internet

**Problema:** No se ve el stream en kuffdj.net/live
- Espera 10-15 segundos después de dar "Start Streaming"
- Refresca la página de kuffdj.net/live
- Verifica en el admin que el servidor detecte el stream

---

## 💡 Tips Pro

1. **Haz una prueba privada primero**: Streamea 5-10 minutos antes del show real para verificar audio/video
2. **Usa conexión por cable**: WiFi puede causar drops
3. **Cierra apps innecesarias**: Para mejor rendimiento
4. **Monitorea el bitrate**: En OBS, ve a **View → Stats**
5. **Backup plan**: Ten tu celular con Larix listo por si OBS falla

---

## 📱 Alternativa: Streaming desde celular

Si prefieres streamear desde el celular en vez de PC:
- Ver guía: `SETUP_DJ_STREAMING_MOBILE.md`
- App: Larix Broadcaster (iOS/Android)
- Mismo server URL y stream key

---

¡Listo para transmitir! 🎵🔥
