# 🎨 Tema Personalizado KUFF para Owncast

## 📋 Instrucciones de Instalación

### Paso 1: Subir el Logo de KUFF a Owncast

1. Ve a tu panel de administración de Owncast: `https://tu-owncast-server.com/admin`
2. Ve a **Configuration** → **General** → **Appearance**
3. En **Logo**, sube el logo de KUFF (archivo: `/public/assets/images/kuff-white.png`)
4. Guarda los cambios

### Paso 2: Agregar JavaScript Personalizado

1. En el panel de admin de Owncast, ve a **Configuration** → **Web**
2. Busca la sección **"Custom Javascript"**
3. Copia TODO el código del archivo `owncast-custom.js`
4. Pégalo en el campo de texto
5. Haz clic en **Save**

### Paso 3: (Opcional) Personalizar Colores

Si quieres cambiar los colores del tema cyan de KUFF, edita estas variables al inicio del JavaScript:

```javascript
:root {
  --kuff-cyan: #00d9ff;          // Color principal cyan
  --kuff-cyan-dark: #0099cc;     // Cyan oscuro
  --kuff-cyan-light: #00ffff;    // Cyan claro
  --kuff-bg-dark: #000000;       // Fondo negro
  --kuff-bg-darker: #0a0a0a;     // Fondo negro más oscuro
}
```

### Paso 4: Verificar

1. Visita tu página de Owncast (no admin): `https://tu-owncast-server.com`
2. Deberías ver:
   - Fondo negro con gradientes cyan
   - Formas circulares animadas flotando
   - Logo con efecto de brillo cyan
   - Botones y elementos en color cyan (#00d9ff)
   - Animaciones suaves

## 🎨 Características del Tema

### Animaciones Incluidas

1. **Formas de Fondo Flotantes**
   - 3 círculos animados con bordes cyan
   - Movimiento suave en diferentes direcciones

2. **Logo con Brillo**
   - Efecto de glow pulsante en cyan
   - Sombras animadas

3. **Gradientes de Fondo**
   - Gradiente radial cyan suave
   - Pulsación de 8 segundos

4. **Indicador LIVE**
   - Punto parpadeante blanco
   - Pulso de sombra roja y cyan
   - Badge con animación

5. **Botones Interactivos**
   - Hover con elevación
   - Sombra cyan brillante
   - Transiciones suaves

### Elementos Personalizados

- **Chat**: Fondo oscuro translúcido con bordes cyan
- **Mensajes**: Borde izquierdo cyan
- **Nombres de usuario**: Color cyan
- **Botones**: Cyan con hover effect
- **Links**: Cyan con glow en hover
- **Input fields**: Bordes cyan con focus effect
- **Scrollbar**: Cyan personalizado
- **Video player**: Bordes redondeados con sombra cyan

## 📱 Compatibilidad

✅ Desktop (Chrome, Firefox, Safari, Edge)
✅ Mobile (iOS Safari, Chrome Mobile)
✅ Tablet
✅ Todos los temas de Owncast

## 🔧 Personalización Adicional

### Cambiar URL del Logo

Si quieres usar el logo directamente desde kuffdj.net:

Encuentra esta sección en el código:

```javascript
// Update logo to KUFF logo
const updateLogo = () => {
  const logoImages = document.querySelectorAll('img[alt*="logo"], img[src*="logo"], .logo img, header img');

  logoImages.forEach(img => {
    // Cambiar a URL del logo de KUFF
    img.src = 'https://kuffdj.net/assets/images/kuff-white.png';
    img.alt = 'KUFF DJ';
  });
};
```

### Agregar Texto Personalizado

Para cambiar el título:

```javascript
// Update site title
const titleElements = document.querySelectorAll('h1, .title');
titleElements.forEach(title => {
  title.textContent = 'KUFF DJ Live Stream';
});
```

### Modificar Velocidad de Animaciones

Cambia los tiempos en estas líneas:

```css
animation: kuff-pulse 8s ease-in-out infinite;     /* Gradiente de fondo */
animation: kuff-float 6s ease-in-out infinite;     /* Formas flotantes */
animation: kuff-logo-glow 2s ease-in-out infinite; /* Brillo del logo */
```

## 🐛 Solución de Problemas

### El tema no se aplica
1. Verifica que guardaste el JavaScript
2. Limpia el caché del navegador (Ctrl + Shift + R)
3. Abre la consola del navegador (F12) y busca errores

### Las animaciones son lentas
1. Reduce el número de formas flotantes (de 3 a 2)
2. Aumenta los tiempos de animación
3. Verifica el rendimiento del servidor

### El logo no cambia
1. Asegúrate de subir el logo en la configuración de Owncast
2. Si usas URL externa, verifica que sea accesible (sin CORS errors)

### Los colores no son correctos
1. Verifica que las variables CSS estén al inicio del código
2. Asegúrate de usar `!important` en los estilos críticos

## 📊 Rendimiento

El tema está optimizado para:
- **Peso mínimo**: Solo CSS y JavaScript vanilla
- **Sin librerías externas**: No requiere jQuery u otras dependencias
- **GPU-accelerated**: Animaciones usando transform y opacity
- **Lazy loading**: Los elementos se crean solo cuando es necesario

## 🎯 Resultado Final

Tu página de Owncast tendrá el mismo look and feel que `https://kuffdj.net/live`:
- ✅ Mismo esquema de colores cyan
- ✅ Mismas animaciones de fondo
- ✅ Mismo efecto de brillo en el logo
- ✅ Mismos estilos de botones
- ✅ Misma experiencia visual

## 📞 Integración con kuffdj.net

Una vez configurado, el stream de Owncast aparecerá automáticamente en `kuffdj.net/live` cuando estés en vivo, con el mismo tema visual en ambos sitios.

---

**🎉 ¡Listo! Tu servidor Owncast ahora tiene el estilo visual de KUFF DJ**
