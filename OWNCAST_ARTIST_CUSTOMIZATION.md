# 🎨 KUFF - Owncast Artist Customization

## 📋 Resumen
Esta personalización oculta el texto "Streaming on Owncast Started XX:XX" y lo reemplaza con información del artista KUFF con animaciones reactivas al ritmo de la música.

## ✨ Características
- ✅ Oculta branding de Owncast y timestamps
- ✅ Muestra información del artista (KUFF)
- ✅ Badge "LIVE NOW" animado
- ✅ Géneros musicales (Minimal Bass, Tech House, Indie Dance)
- ✅ Visualizador de audio con 40 barras reactivas
- ✅ Partículas flotantes animadas
- ✅ Fondo con pulso reactivo
- ✅ Efectos de glow y pulso sincronizados
- ✅ Identidad visual cyan mantenida

## 🚀 Instalación

### Paso 1: Acceder al Admin de Owncast
1. Ve a: `https://kuffdj.nolivos.cloud/admin`
2. Inicia sesión con tus credenciales

### Paso 2: Instalar CSS
1. En el menú lateral → **Appearance** (Apariencia)
2. Busca la sección **"Custom CSS"**
3. Abre el archivo: `owncast-custom.css`
4. Copia TODO el contenido
5. Pégalo en el campo "Custom CSS"
6. Click **Save** (Guardar)

### Paso 3: Instalar JavaScript
1. En la misma página (Appearance)
2. Busca la sección **"Custom Javascript"**
3. Abre el archivo: `owncast-artist-info.js`
4. Copia TODO el contenido
5. Pégalo en el campo "Custom Javascript"
6. Click **Save** (Guardar)

### Paso 4: Verificar
1. Abre tu stream: `https://kuffdj.nolivos.cloud`
2. Deberías ver:
   - Nombre "KUFF" en grande con efecto cyan
   - "International DJ & Producer"
   - Tags de géneros
   - Badge "🔴 LIVE NOW"
   - Visualizador de audio en la parte inferior
   - Partículas flotantes
   - NO deberías ver "Streaming on Owncast Started..."

## 🎨 Personalización

### Cambiar el nombre del artista
En `owncast-artist-info.js`, línea ~50:
```javascript
<h1 class="kuff-artist-name">KUFF</h1>
```

### Cambiar el título
Línea ~51:
```javascript
<p class="kuff-artist-title">International DJ & Producer</p>
```

### Cambiar géneros
Línea ~53-57:
```javascript
<div class="kuff-genres">
  <span class="kuff-genre-tag">Minimal Bass</span>
  <span class="kuff-genre-tag">Tech House</span>
  <span class="kuff-genre-tag">Indie Dance</span>
</div>
```

### Cambiar BPM de las animaciones
Línea ~133:
```javascript
const bpm = 120; // Cambia esto al BPM de tu música
```

### Cambiar colores
En `owncast-custom.css`, líneas con `#00d9ff` (cyan):
- `#00d9ff` = Cyan principal
- `#0099cc` = Cyan oscuro
- `#00ffff` = Cyan claro

## 🎵 Características de las Animaciones

### Visualizador de Audio
- 40 barras que simulan reacción al audio
- Patrón de onda sinusoidal
- Actualización cada 50ms
- Altura variable: 10-100px

### Partículas
- Generación cada 300ms
- Flotan desde abajo hacia arriba
- Deriva horizontal aleatoria
- Duración: 5-15 segundos

### Pulso de Beat
- Sincronizado a 120 BPM (configurable)
- Efecto de escala en el nombre del artista
- Duración del pulso: 100ms

### Fondo Reactivo
- Rotación de matiz (hue) continua
- Saturación variable con onda sinusoidal
- Actualización cada 100ms

## 🔧 Troubleshooting

### No veo los cambios
1. Haz "Hard Refresh": `Ctrl + Shift + R` (Windows/Linux) o `Cmd + Shift + R` (Mac)
2. Borra caché del navegador
3. Verifica que guardaste ambos archivos (CSS y JS)

### Sigue mostrando "Streaming on Owncast"
1. Verifica que el JavaScript se guardó correctamente
2. Abre la consola del navegador (F12)
3. Busca el mensaje: `✅ KUFF Artist Info & Visualizer Ready!`
4. Si no aparece, revisa errores en la consola

### Las animaciones se ven lentas
1. Reduce el número de partículas (línea ~120)
2. Reduce el número de barras del visualizador (línea ~79)
3. Aumenta los intervalos de actualización

### Quiero desactivarlo temporalmente
1. Ve a Owncast Admin → Appearance
2. Borra el contenido de "Custom CSS" y "Custom Javascript"
3. Guarda

## 📱 Responsive Design
Las animaciones son responsive y se adaptan a:
- Desktop (1920px+)
- Tablet (768px-1920px)
- Mobile (< 768px)

## 🎨 Colores de KUFF
```css
Cyan Principal:  #00d9ff
Cyan Oscuro:     #0099cc
Cyan Claro:      #00ffff
Negro:           #000000
Gris:            #b0b0b0
```

## 📝 Notas
- Los archivos originales de Owncast NO se modifican
- Todo es CSS/JS externo e inyectado
- Se puede desactivar en cualquier momento
- Compatible con todas las versiones de Owncast 0.1.x

## 🆘 Soporte
Si tienes problemas:
1. Verifica la consola del navegador (F12)
2. Asegúrate de copiar TODO el código
3. Verifica que guardaste en los campos correctos
4. Haz hard refresh del navegador

---

**Creado para KUFF DJ** 🎵
Mantiene la identidad visual cyan y agrega animaciones reactivas profesionales.
