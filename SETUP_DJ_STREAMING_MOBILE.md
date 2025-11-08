# 📱 KUFF DJ - Streaming desde Teléfono

## 🎯 Objetivo
Transmitir en vivo a **kuffdj.net/live** directamente desde tu teléfono móvil.

---

## 📦 Lo que necesitas

### Hardware
- ✅ Smartphone (iPhone o Android)
- ✅ Audífonos (con cable o Bluetooth)
- ✅ Buena conexión a internet (WiFi o 4G/5G con buen plan de datos)

### Apps Recomendadas

#### **Opción 1: Larix Broadcaster** (RECOMENDADA - GRATIS)
- ✅ iOS: https://apps.apple.com/app/larix-broadcaster/id1042474385
- ✅ Android: https://play.google.com/store/apps/details?id=com.wmspanel.larix_broadcaster
- ✅ 100% gratis, sin marcas de agua
- ✅ Soporta RTMP directo a Owncast

#### **Opción 2: Streamlabs Mobile** (GRATIS)
- ✅ iOS: https://apps.apple.com/app/streamlabs/id1294578643
- ✅ Android: https://play.google.com/store/apps/details?id=com.streamlabs
- ✅ Gratis con marca de agua (se puede quitar pagando)

#### **Opción 3: Prism Live Studio**
- ✅ iOS/Android
- ✅ Más funciones pero más compleja

---

## 📱 Configuración: Larix Broadcaster (Recomendada)

### Paso 1: Instalar la App

1. Descarga **Larix Broadcaster** desde App Store o Google Play
2. Abre la app
3. Permite los permisos:
   - 🎤 Micrófono
   - 📹 Cámara (opcional si solo quieres audio)
   - 📍 Ubicación (opcional)

### Paso 2: Configurar Conexión a Owncast

1. En Larix, toca el ícono **⚙️ Settings** (arriba a la derecha)

2. Ve a **Connections** → **New Connection** → **RTMP/RTMPS**

3. Configura:
   ```
   Name: KUFF Owncast
   URL: rtmp://kuffdj.nolivos.cloud:1936/live
   Stream name: abc123
   ```

4. **Guarda** la conexión

### Paso 3: Configurar Audio

#### Si solo quieres transmitir audio (sin video):

1. En **Settings** → **Video**
   - Resolution: 1280x720 (puedes usar la mínima para ahorrar datos)
   - Bitrate: 500 kbps (bajo porque el video no importa)
   - FPS: 15

2. En **Settings** → **Audio**
   - Codec: AAC
   - Bitrate: **192 kbps** (BUENA CALIDAD para música)
   - Sample rate: 48000 Hz

#### Si quieres transmitir video + audio:

1. **Video**
   - Resolution: 1280x720 o 1920x1080
   - Bitrate: 2500 kbps
   - FPS: 30

2. **Audio**
   - Bitrate: 192 kbps
   - Sample rate: 48000 Hz

### Paso 4: Configurar la Escena

1. En la pantalla principal, toca **Sources** (abajo)

2. Puedes agregar:
   - 🎤 **Microphone**: Para capturar el audio de tu DJ mix
   - 📹 **Camera**: Si quieres mostrarte (opcional)
   - 🖼️ **Image**: Tu logo de KUFF (opcional)
   - 📝 **Text**: "KUFF Live Mix" (opcional)

3. Si solo quieres audio:
   - Solo agrega **Microphone**
   - Puedes agregar una **Image** con tu logo para que no se vea negro

### Paso 5: Ir en Vivo!

1. **Conecta tus audífonos** al teléfono

2. **Abre tu app de DJ** (djay, edjing, WeDJ, etc.)
   - O simplemente reproduce música desde Spotify/SoundCloud si solo vas a mezclar audio

3. **Regresa a Larix Broadcaster**

4. Toca el botón **🔴 REC** (rojo grande)
   - Se pondrá en verde cuando estés transmitiendo en vivo

5. **Verifica que estás en vivo:**
   - Abre el navegador en tu teléfono
   - Ve a: **kuffdj.net/live**
   - Deberías verte/escucharte (con ~10-20 segundos de delay)

6. **Para detener:**
   - Toca el botón verde de nuevo
   - La transmisión se detendrá

---

## 📱 Configuración: Streamlabs Mobile

### Paso 1: Instalar y Configurar

1. Descarga **Streamlabs** desde App Store o Google Play
2. Abre la app
3. **Salta** el login (puedes usar sin cuenta)

### Paso 2: Configurar RTMP

1. Toca **⚙️ Settings**

2. Ve a **Stream Settings**

3. Selecciona **Custom RTMP**

4. Configura:
   ```
   Stream URL: rtmp://kuffdj.nolivos.cloud:1936/live
   Stream Key: abc123
   ```

5. **Save**

### Paso 3: Configurar Calidad

1. En **Settings** → **Video Settings**
   - Resolution: 720p o 1080p
   - Bitrate: Auto o 2500

2. En **Settings** → **Audio Settings**
   - Audio Bitrate: 192 kbps

### Paso 4: Ir en Vivo

1. En la pantalla principal, toca **Go Live**
2. Ajusta lo que quieres mostrar (cámara, logo, etc.)
3. Toca **Start Streaming**
4. Verifica en **kuffdj.net/live**

---

## 🎧 Setup para DJ Móvil

### Opción A: Apps de DJ en el teléfono

**Apps populares de DJ para móvil:**

- **djay** (iOS/Android) - $$$
  - La mejor app para DJ profesional en móvil
  - Soporta Spotify integration
  - Efectos y loops profesionales

- **edjing Mix** (iOS/Android) - Gratis
  - Buena para empezar
  - Versión gratis con anuncios

- **WeDJ** (iOS/Android) - Gratis (Pioneer)
  - Oficial de Pioneer
  - Interfaz similar a CDJs

- **Cross DJ** (iOS/Android) - $$
  - Buena calidad
  - 4 decks

**Flujo de trabajo:**

1. Conecta audífonos al teléfono
2. Abre la app de DJ
3. Empieza a mezclar
4. Abre Larix Broadcaster
5. Toca **REC** para transmitir
6. El audio de la app de DJ se transmitirá automáticamente

⚠️ **Problema:** No todas las apps permiten audio en background mientras usas otra app. Puede que necesites usar **solo Larix** y reproducir música desde ahí.

### Opción B: Mezclar en computadora/mixer → Transmitir desde teléfono

Si tienes tu mixer conectado a la computadora pero quieres transmitir desde el teléfono:

1. **No funciona bien** - mejor usa OBS en la computadora
2. El teléfono solo capturaría el audio ambiente (micrófono)
3. Calidad será mucho peor

**Recomendación:** Si tienes mixer, usa OBS en la computadora (ver SETUP_DJ_STREAMING.md)

---

## 🎚️ Tips para Mejor Calidad

### Audio

1. **Usa audífonos con cable** (mejor calidad que Bluetooth)
2. En Larix:
   - Audio Bitrate: 192 kbps (mínimo 128 kbps)
   - Sample Rate: 48000 Hz
3. **Evita** grabar en lugares con mucho ruido de fondo

### Internet

1. **WiFi siempre es mejor** que datos móviles
2. Si usas datos:
   - 4G/5G con buen plan (mínimo 3-5 Mbps upload)
   - Reduce el bitrate de video a 1000-1500 kbps
3. **Evita** lugares con mala señal

### Batería

1. **Conecta el cargador** - transmitir gasta mucha batería
2. Cierra otras apps en background
3. Reduce el brillo de la pantalla

### Video (opcional)

Si quieres agregar video:

1. Usa la cámara frontal para mostrarte
2. Coloca el teléfono en un tripié o soporte
3. Busca buena iluminación
4. Evita luz de fondo (ventanas atrás)

---

## 📊 Monitorear tu Stream

### Desde el teléfono

1. Abre el navegador (Chrome/Safari)
2. Ve a: **kuffdj.net/admin**
3. Inicia sesión
4. Verás:
   - 🔴 Status: LIVE
   - 👥 Viewers: Cantidad de espectadores

### Estadísticas en Larix

En la app, mientras transmites:
- **FPS**: Cuadros por segundo
- **Bitrate**: Tasa de bits actual
- **Upload**: Velocidad de subida

---

## 🎬 Flujo Completo: Teléfono → kuffdj.net/live

### Antes del Set

1. ✅ Carga completa del teléfono
2. ✅ Conecta el cargador
3. ✅ Verifica buena señal WiFi/4G
4. ✅ Conecta audífonos
5. ✅ Abre Larix Broadcaster
6. ✅ Verifica configuración RTMP

### Durante el Set

1. 🎧 Abre tu app de DJ o reproduce música
2. 🔴 Toca **REC** en Larix
3. 👀 Verifica que estás en vivo (kuffdj.net/live)
4. 🎶 Mezcla como siempre
5. 📊 Monitorea viewers en el admin

### Después del Set

1. ✅ Detén la transmisión (botón verde en Larix)
2. ✅ Cierra Larix
3. ✅ Listo!

---

## ⚠️ Troubleshooting

### No puedo conectar a Owncast

1. Verifica las credenciales:
   ```
   URL: rtmp://kuffdj.nolivos.cloud:1936/live
   Key: abc123
   ```
2. Asegúrate de estar en internet (WiFi o datos)
3. Prueba con otra conexión

### El audio se escucha mal

1. Aumenta Audio Bitrate a 192 kbps
2. Usa audífonos con cable (no Bluetooth)
3. Evita ruido de fondo

### Se corta la transmisión

1. Tu internet es lento - reduce el bitrate de video
2. Cierra otras apps
3. Usa WiFi en lugar de datos móviles

### No aparece en kuffdj.net/live

1. Espera 10-15 segundos (hay delay)
2. Refresca la página
3. Verifica que Larix diga "LIVE" (botón verde)

### Gasta muchos datos móviles

1. **Usa WiFi siempre que puedas**
2. Si debes usar datos:
   - Video bitrate: 500-1000 kbps
   - Audio bitrate: 128 kbps
   - 1 hora ≈ 500 MB - 1 GB de datos

---

## 💡 Consejos Pro

### Para sets largos (1+ horas)

1. **Batería externa** o cargador conectado
2. Modo avión + solo WiFi (ahorra batería)
3. Cierra todas las apps excepto Larix

### Para mejor engagement

1. Anuncia en Instagram Stories que vas a estar en vivo
2. Comparte el link: **kuffdj.net/live**
3. Usa el chat de Owncast para interactuar con viewers

### Seguridad

1. **NUNCA** compartas tu Stream Key (`abc123`) públicamente
2. Solo compártela con DJs invitados de confianza
3. Si se compromete, cámbiala en el admin de Owncast

---

## 🎉 Ventajas del Streaming Móvil

✅ **Portabilidad** - Transmite desde cualquier lugar
✅ **Facilidad** - No necesitas computadora
✅ **Espontaneidad** - Live improvisados desde fiestas/eventos
✅ **Bajo costo** - Solo tu teléfono y audífonos

## ⚠️ Desventajas

❌ **Calidad de audio** - No tan profesional como OBS + mixer
❌ **Batería** - Se agota rápido
❌ **Datos móviles** - Puede ser costoso sin WiFi
❌ **Multitasking** - Difícil usar otras apps mientras transmites

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la configuración de Larix
2. Verifica tu conexión a internet
3. Checa el admin de Owncast: https://kuffdj.nolivos.cloud/admin

---

**¡Listo! Ahora puedes transmitir en vivo desde tu teléfono a kuffdj.net/live** 🎉📱

**Resumen rápido:**
1. Descarga Larix Broadcaster
2. Configura RTMP: `rtmp://kuffdj.nolivos.cloud:1936/live` / Key: `abc123`
3. Conecta audífonos
4. Toca REC
5. Apareces en kuffdj.net/live automáticamente
