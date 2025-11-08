# 🎧 KUFF DJ - Setup de Streaming en Vivo

## 🎯 Objetivo
Conectar tu mixer DJ a la computadora y transmitir en vivo a **kuffdj.net/live** automáticamente.

---

## 📦 Requisitos

### Hardware
- ✅ Mixer DJ (Pioneer DDJ, CDJ, Numark, Traktor, etc.)
- ✅ Computadora (Windows/Mac)
- ✅ Cable USB o Audio Interface (Focusrite Scarlett, Behringer U-Phoria)
- ✅ Audífonos para monitorear

### Software
- ✅ OBS Studio (gratis) - https://obsproject.com/download
- ✅ Drivers del mixer (si es necesario)

---

## 🔌 Paso 1: Conectar el Mixer

### Opción A: Mixer con USB (Controladores modernos)
**Ejemplo: Pioneer DDJ-400, DDJ-1000, Traktor S2, etc.**

1. Conecta el cable USB del mixer a tu computadora
2. Instala los drivers:
   - **Pioneer**: https://www.pioneerdj.com/en/support/
   - **Traktor**: https://www.native-instruments.com/en/support/downloads/
   - **Numark**: https://www.numark.com/support
3. Abre tu software de DJ (Rekordbox, Traktor, Serato)
4. Verifica que el mixer aparezca en las preferencias de audio

### Opción B: Mixer sin USB (Mezcladores tradicionales)
**Ejemplo: Pioneer DJM-900, Allen & Heath Xone, mezcladores analógicos**

1. Necesitas un **Audio Interface**:
   - Focusrite Scarlett 2i2 (~$180 USD)
   - Behringer U-Phoria UM2 (~$50 USD)
   - PreSonus AudioBox (~$100 USD)

2. Conecta las **salidas MASTER** del mixer al interface:
   - RCA → Interface (cable RCA a 1/4" TRS)
   - XLR → Interface (cable XLR balanceado)

3. Conecta el interface por USB a la computadora

---

## 🎥 Paso 2: Instalar y Configurar OBS Studio

### Instalación
1. Descarga OBS: https://obsproject.com/download
2. Instala en tu computadora
3. Abre OBS Studio

### Configuración de Audio

#### 1. Ir a Settings → Audio
- **Desktop Audio**: Disabled (no queremos audio del sistema)
- **Mic/Auxiliary Audio**: Selecciona tu mixer o audio interface
  - Si tu mixer es USB: Busca "DDJ-400", "Traktor Kontrol", etc.
  - Si usas interface: Busca "Focusrite", "Scarlett", "U-Phoria", etc.

#### 2. Configurar la Fuente de Audio
1. En la ventana principal de OBS:
2. En **Sources** (abajo), click en **+** → **Audio Input Capture**
3. Nombre: "DJ Mix Audio"
4. Device: Selecciona tu mixer o interface
5. Click OK

#### 3. Verificar que entra audio
- Toca música en tu mixer
- Deberías ver las barras de audio moverse en OBS (abajo del todo)
- Si no se mueve, verifica la configuración de audio en Settings

---

## 📡 Paso 3: Configurar Streaming a Owncast

### Configuración de Transmisión

1. En OBS → **Settings** → **Stream**

2. Configura:
   - **Service**: Custom...
   - **Server**: `rtmp://kuffdj.nolivos.cloud:1936/live`
   - **Stream Key**: `abc123`

3. Click **OK**

### Configuración de Video (Opcional)

Si solo quieres transmitir audio sin video:

1. **Settings** → **Video**
   - **Base Canvas Resolution**: 1280x720
   - **Output Resolution**: 1280x720
   - **FPS**: 30

2. En **Sources**, agrega:
   - **Image**: Tu logo o artwork de KUFF
   - **Text**: "KUFF Live Mix" o lo que quieras

Si quieres transmitir con webcam:
- En **Sources** → **+** → **Video Capture Device**
- Selecciona tu cámara

### Configuración de Bitrate

1. **Settings** → **Output**
2. **Output Mode**: Simple
3. **Video Bitrate**: 2500 Kbps
4. **Audio Bitrate**: 192 (buena calidad para música)

---

## 🚀 Paso 4: Ir en Vivo!

### Empezar a Transmitir

1. Conecta tus audífonos al mixer
2. Carga música en tu software de DJ
3. Empieza a mezclar
4. En OBS, verifica que las barras de audio se muevan
5. Click en **Start Streaming** (botón grande a la derecha)

### Verificar que estás en vivo

1. Abre un navegador
2. Ve a: **https://kuffdj.net/live**
3. Deberías ver tu stream automáticamente
4. También puedes ver estadísticas en: **https://kuffdj.nolivos.cloud/admin**

### Detener la Transmisión

1. Click en **Stop Streaming** en OBS
2. La transmisión desaparecerá de kuffdj.net/live automáticamente

---

## 🎚️ Configuración de Audio Avanzada

### Para mejor calidad de sonido:

1. **Settings** → **Audio**
   - **Sample Rate**: 48 kHz (estándar streaming)
   - **Channels**: Stereo

2. **Settings** → **Output** → **Audio**
   - **Audio Bitrate**:
     - 128 kbps = calidad aceptable
     - 192 kbps = buena calidad (recomendado)
     - 256 kbps = excelente calidad
     - 320 kbps = máxima calidad (puede ser mucho ancho de banda)

### Monitoreo de Audio

Para escuchar lo que transmites:

1. Click derecho en la fuente de audio (en Mixer de OBS)
2. **Advanced Audio Properties**
3. **Audio Monitoring**: Monitor and Output

---

## 🔧 Troubleshooting

### No se escucha audio en OBS

1. Verifica que el mixer esté conectado y encendido
2. En **Settings** → **Audio**, verifica que la fuente correcta esté seleccionada
3. Toca música en el mixer y observa las barras de nivel
4. Verifica que el volumen MASTER del mixer no esté en 0

### La transmisión no aparece en kuffdj.net/live

1. Verifica que OBS diga "Live" (abajo a la derecha, en verde)
2. Espera 10-15 segundos (hay un pequeño delay)
3. Refresca la página kuffdj.net/live
4. Verifica las credenciales RTMP en OBS Settings → Stream

### Audio distorsionado o con cortes

1. Reduce el **Video Bitrate** en Settings → Output
2. Verifica tu conexión a internet (mínimo 3-5 Mbps upload)
3. Reduce la calidad de video o usa solo audio

### Mucho delay/latencia

Es normal tener 10-30 segundos de delay en streaming. Esto es por el buffer de HLS.

---

## 📱 Monitoreo desde tu Admin

1. Ve a: **https://kuffdj.net/admin**
2. Verás el panel "🎥 Owncast Server"
3. Status: 🔴 LIVE cuando estés transmitiendo
4. Viewers: Cuánta gente te está viendo

---

## 🎉 Flujo de Trabajo Típico

### Antes del Set

1. ✅ Conectar mixer a computadora
2. ✅ Abrir software de DJ (Rekordbox, Traktor, etc.)
3. ✅ Abrir OBS Studio
4. ✅ Verificar que entra audio (barras en OBS)
5. ✅ Click "Start Streaming"

### Durante el Set

1. 🎧 Mezcla como siempre
2. 👀 Ojo a las barras de audio en OBS (no debe estar en rojo)
3. 📊 Puedes ver viewers en kuffdj.net/admin

### Después del Set

1. ✅ Click "Stop Streaming" en OBS
2. ✅ Cerrar OBS
3. ✅ Apagar mixer

---

## 💡 Tips Profesionales

### Para sets largos (4+ horas)

- Usa **conexión ethernet** (no WiFi)
- Reduce bitrate de video a 1500 Kbps
- Cierra otros programas que usen internet

### Para mejor engagement

- Anuncia en Instagram/Facebook que vas a estar en vivo
- Comparte el link: **kuffdj.net/live**
- Responde comentarios en el chat de Owncast

### Seguridad

- **NUNCA** compartas tu Stream Key (`abc123`) públicamente
- Si se compromete, cámbiala en el admin de Owncast
- Solo dásela a DJs invitados de confianza

---

## 📞 Soporte

Si tienes problemas:
1. Verifica la consola de OBS (View → Log Files → Current Log)
2. Checa el admin de Owncast: https://kuffdj.nolivos.cloud/admin
3. Revisa la documentación de Owncast: https://owncast.online/docs/

---

**¡Listo! Ahora puedes transmitir en vivo desde tu mixer a kuffdj.net/live** 🎉🎧
