# Guía de PM2 para KUFF Website

PM2 es un process manager que mantiene tu aplicación Next.js ejecutándose 24/7, incluso después de reinicios del servidor.

## 🚀 Inicio Rápido

### 1. Construir la aplicación para producción

```bash
npm run build
```

### 2. Iniciar con PM2

```bash
npm run pm2:start
```

¡Listo! Tu aplicación ahora está corriendo en segundo plano y se reiniciará automáticamente si falla.

## 📋 Comandos Disponibles

### Gestión Básica

```bash
# Iniciar la aplicación
npm run pm2:start

# Detener la aplicación
npm run pm2:stop

# Reiniciar la aplicación
npm run pm2:restart

# Eliminar de PM2
npm run pm2:delete
```

### Monitoreo

```bash
# Ver logs en tiempo real
npm run pm2:logs

# Ver estado de las aplicaciones
npm run pm2:status

# Monitor interactivo (CPU, memoria, etc)
npm run pm2:monit
```

## 🔧 Comandos Directos de PM2

Si prefieres usar PM2 directamente:

```bash
# Lista de procesos
pm2 list

# Logs de la aplicación
pm2 logs kuff-website

# Ver métricas en tiempo real
pm2 monit

# Reiniciar después de cambios
pm2 restart kuff-website

# Detener
pm2 stop kuff-website

# Eliminar
pm2 delete kuff-website
```

## 🔄 Workflow Completo para Producción

### Configuración Inicial

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# 3. Construir para producción
npm run build

# 4. Iniciar con PM2
npm run pm2:start
```

### Actualizar la Aplicación

Cuando hagas cambios en el código:

```bash
# 1. Detener PM2
npm run pm2:stop

# 2. Pull cambios (si usas git)
git pull

# 3. Instalar nuevas dependencias (si las hay)
npm install

# 4. Re-construir
npm run build

# 5. Reiniciar con PM2
npm run pm2:restart
```

## 🌐 PM2 con Startup (Auto-inicio en Reboot)

Para que tu aplicación se inicie automáticamente cuando el servidor reinicie:

```bash
# 1. Guardar la configuración actual de PM2
pm2 save

# 2. Generar script de startup
pm2 startup

# 3. Ejecutar el comando que PM2 te muestre
# (será algo como: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u tu-usuario --hp /home/tu-usuario)
```

Después de hacer esto, tu aplicación se iniciará automáticamente al reiniciar el servidor.

## 📊 Configuración Avanzada

El archivo `ecosystem.config.js` contiene la configuración de PM2:

```javascript
module.exports = {
  apps: [
    {
      name: 'kuff-website',
      script: 'npm',
      args: 'start',
      instances: 1,          // Número de instancias
      autorestart: true,     // Reinicio automático si falla
      watch: false,          // No observar cambios de archivos
      max_memory_restart: '1G', // Reiniciar si usa más de 1GB
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

### Modificar el Puerto

Para cambiar el puerto, edita `ecosystem.config.js`:

```javascript
env: {
  NODE_ENV: 'production',
  PORT: 8080  // Cambiar a tu puerto deseado
}
```

## 🐛 Solución de Problemas

### La aplicación no inicia

```bash
# Ver logs de errores
npm run pm2:logs

# Verificar el estado
npm run pm2:status
```

### Reiniciar desde cero

```bash
# Detener y eliminar
npm run pm2:delete

# Limpiar cache de Next.js
rm -rf .next

# Re-construir y reiniciar
npm run build
npm run pm2:start
```

### Ver uso de recursos

```bash
# Monitor en tiempo real
npm run pm2:monit
```

## 🔒 Seguridad

### Variables de Entorno

Asegúrate de que tu archivo `.env` tenga permisos correctos:

```bash
chmod 600 .env
```

### Actualizar Secretos

Si cambias las variables de entorno:

```bash
# 1. Editar .env
nano .env

# 2. Reiniciar la aplicación
npm run pm2:restart
```

## 📈 Monitoreo en Producción

### PM2 Plus (Opcional)

Para monitoreo avanzado en la nube:

1. Regístrate en [pm2.io](https://pm2.io)
2. Vincula tu servidor:
   ```bash
   pm2 link [secret-key] [public-key]
   ```

### Logs Persistentes

Los logs de PM2 se guardan en:
- `~/.pm2/logs/kuff-website-out.log` (stdout)
- `~/.pm2/logs/kuff-website-error.log` (stderr)

Para rotar logs:

```bash
pm2 install pm2-logrotate
```

## 🆚 PM2 vs Vercel

### Usa PM2 si:
- ✅ Tienes tu propio servidor VPS/dedicado
- ✅ Necesitas control total del servidor
- ✅ Quieres costos predecibles

### Usa Vercel si:
- ✅ Quieres deployment automático desde Git
- ✅ No quieres administrar servidores
- ✅ Quieres CDN global automático
- ✅ Buscas la opción más fácil y rápida

**Recomendación**: Para la mayoría de casos, **Vercel es más fácil**. Usa PM2 solo si necesitas tu propio servidor.

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs: `npm run pm2:logs`
2. Verifica el estado: `npm run pm2:status`
3. Consulta la [documentación de PM2](https://pm2.keymetrics.io/)

---

**Nota**: Recuerda que PM2 es para servidores propios. Si despliegas en Vercel, no necesitas PM2 (Vercel maneja todo automáticamente).
