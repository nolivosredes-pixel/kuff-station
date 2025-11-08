# 🎥 Configuración de Owncast para KUFF DJ

## Prompt para Configurar el Servidor Owncast

Necesito configurar un servidor Owncast para streaming en vivo que se integre con el sitio web kuffdj.net. A continuación los requisitos y configuración necesaria:

---

## 📋 REQUISITOS DEL SISTEMA

**Servidor Linux** (Ubuntu 20.04 o superior recomendado) con:
- 2 CPU cores mínimo (4 cores recomendado)
- 4GB RAM mínimo (8GB recomendado para alta calidad)
- 20GB espacio en disco
- Puertos abiertos: 80, 443, 1935, 8080

---

## 🚀 INSTALACIÓN PASO A PASO

### 1. Instalar Owncast

```bash
# Conectar al servidor via SSH
ssh root@tu-servidor-ip

# Crear directorio para Owncast
mkdir -p /opt/owncast
cd /opt/owncast

# Descargar la última versión de Owncast
curl -s https://owncast.online/install.sh | bash

# Dar permisos de ejecución
chmod +x owncast
```

### 2. Configuración Inicial

```bash
# Iniciar Owncast por primera vez
./owncast

# Esto creará el archivo de configuración en:
# /opt/owncast/data/config.yaml
```

**IMPORTANTE:** Al iniciar por primera vez, verás la contraseña de administrador en la terminal. ¡Guárdala!

### 3. Configurar NGINX como Reverse Proxy

```bash
# Instalar NGINX
apt update
apt install nginx -y

# Crear configuración para Owncast
nano /etc/nginx/sites-available/owncast
```

Pegar esta configuración (reemplaza `stream.kuffdj.net` con tu dominio):

```nginx
server {
    listen 80;
    server_name stream.kuffdj.net;

    # Redirigir a HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name stream.kuffdj.net;

    # Certificados SSL (configurar después con Certbot)
    ssl_certificate /etc/letsencrypt/live/stream.kuffdj.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/stream.kuffdj.net/privkey.pem;

    # Configuración SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # CORS Headers para permitir embedding en kuffdj.net
    add_header Access-Control-Allow-Origin "https://kuffdj.net" always;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept, Authorization" always;
    add_header Access-Control-Allow-Credentials "true" always;

    # Configuración de proxy para Owncast
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket support para chat
    location /ws {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # HLS streaming
    location /hls/ {
        proxy_pass http://127.0.0.1:8080/hls/;
        add_header Cache-Control no-cache;
        add_header Access-Control-Allow-Origin "*";
    }

    # Límites de tamaño para uploads
    client_max_body_size 50M;
}
```

```bash
# Habilitar el sitio
ln -s /etc/nginx/sites-available/owncast /etc/nginx/sites-enabled/

# Verificar configuración
nginx -t

# NO reiniciar NGINX todavía (necesitamos SSL primero)
```

### 4. Instalar Certificado SSL con Let's Encrypt

```bash
# Instalar Certbot
apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
certbot --nginx -d stream.kuffdj.net

# Responder las preguntas:
# - Email: tu-email@ejemplo.com
# - Aceptar términos: Yes
# - Compartir email: No (opcional)

# Ahora sí, reiniciar NGINX
systemctl restart nginx
```

### 5. Configurar Owncast

```bash
# Editar configuración de Owncast
nano /opt/owncast/data/config.yaml
```

Configuración recomendada para KUFF:

```yaml
name: KUFF DJ Live
summary: "KUFF DJ performing live"
logo: logo.png
nsfw: false
tags:
  - music
  - DJ
  - live
  - electronic

instanceURL: https://stream.kuffdj.net

videoSettings:
  videoQualityVariants:
    # Alta calidad
    - isVideoPassthrough: false
      videoBitrate: 4000
      outputStreamBitrate: 4000
      audioPassthrough: true
      audioBitrate: 160
      encoderPreset: veryfast
      scaledWidth: 1920
      scaledHeight: 1080
      framerate: 30
      cpuUsageLevel: 3

    # Calidad media
    - isVideoPassthrough: false
      videoBitrate: 2000
      outputStreamBitrate: 2000
      audioPassthrough: true
      audioBitrate: 128
      encoderPreset: veryfast
      scaledWidth: 1280
      scaledHeight: 720
      framerate: 30
      cpuUsageLevel: 2

    # Baja calidad (móviles)
    - isVideoPassthrough: false
      videoBitrate: 800
      outputStreamBitrate: 800
      audioPassthrough: true
      audioBitrate: 96
      encoderPreset: veryfast
      scaledWidth: 854
      scaledHeight: 480
      framerate: 24
      cpuUsageLevel: 1

rtmpServerPort: 1935

webServerPort: 8080
webServerIP: 127.0.0.1

# Configuración de streaming
streamKey: GENERA_UNA_CLAVE_SEGURA_AQUI

# Latencia baja
videoSettings:
  numberOfPlaylistItems: 3
  segmentLengthSeconds: 2

s3:
  enabled: false

# Habilitar API
federation:
  enabled: true
  isPrivate: false
  username: kuffdj
```

### 6. Crear Systemd Service para Auto-inicio

```bash
# Crear service file
nano /etc/systemd/system/owncast.service
```

Pegar:

```ini
[Unit]
Description=Owncast streaming server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/owncast
ExecStart=/opt/owncast/owncast
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
# Habilitar y iniciar el servicio
systemctl daemon-reload
systemctl enable owncast
systemctl start owncast

# Verificar que está corriendo
systemctl status owncast
```

### 7. Configurar Firewall

```bash
# Si usas UFW
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 1935/tcp
ufw allow 8080/tcp
ufw enable

# Verificar
ufw status
```

---

## 🔑 CREDENCIALES PARA KUFF WEBSITE

Una vez configurado, proporciona estos datos para integrar con kuffdj.net:

```bash
# Información del servidor Owncast:

OWNCAST_SERVER_URL=https://stream.kuffdj.net
OWNCAST_HLS_URL=https://stream.kuffdj.net/hls/stream.m3u8
OWNCAST_API_URL=https://stream.kuffdj.net/api/status

# Credenciales para streaming (OBS):
RTMP_URL=rtmp://stream.kuffdj.net:1935
STREAM_KEY=(la clave que pusiste en config.yaml)

# Admin Dashboard:
ADMIN_URL=https://stream.kuffdj.net/admin
ADMIN_PASSWORD=(la contraseña que te dio al instalar)
```

---

## 📺 CONFIGURACIÓN DE OBS STUDIO

Para hacer streaming a este servidor Owncast:

```
Settings → Stream
━━━━━━━━━━━━━━━━━━━━━━━━━━
Service: Custom
Server: rtmp://stream.kuffdj.net:1935
Stream Key: (tu stream key del config.yaml)

Settings → Output
━━━━━━━━━━━━━━━━━━━━━━━━━━
Output Mode: Advanced
Encoder: x264 o NVENC (si tienes NVIDIA)
Bitrate: 3000-5000 kbps
Keyframe Interval: 2
Preset: veryfast
Profile: high

Settings → Video
━━━━━━━━━━━━━━━━━━━━━━━━━━
Base Resolution: 1920x1080
Output Resolution: 1920x1080
FPS: 30
```

---

## 🧪 VERIFICACIÓN

1. **Verificar Owncast está corriendo:**
```bash
curl https://stream.kuffdj.net/api/status
```

Debería devolver JSON con `"online": false` (si no estás streaming)

2. **Verificar HLS endpoint:**
```bash
curl https://stream.kuffdj.net/hls/stream.m3u8
```

3. **Verificar RTMP acepta conexiones:**
```bash
telnet stream.kuffdj.net 1935
```

4. **Ver logs en tiempo real:**
```bash
journalctl -u owncast -f
```

---

## 🔧 MANTENIMIENTO

```bash
# Ver logs
journalctl -u owncast -n 100

# Reiniciar Owncast
systemctl restart owncast

# Actualizar Owncast
cd /opt/owncast
systemctl stop owncast
curl -s https://owncast.online/install.sh | bash
systemctl start owncast

# Backup de configuración
cp -r /opt/owncast/data /opt/owncast/data.backup
```

---

## 📊 MONITOREO

**Estadísticas en vivo:**
- Admin Panel: `https://stream.kuffdj.net/admin`
- API Status: `https://stream.kuffdj.net/api/status`
- Ver viewers: `https://stream.kuffdj.net/api/viewers`

**Recursos del servidor:**
```bash
# CPU y RAM
htop

# Ancho de banda
iftop

# Espacio en disco
df -h
```

---

## ⚠️ SOLUCIÓN DE PROBLEMAS

### Stream no se ve en kuffdj.net
```bash
# Verificar que Owncast está en línea
systemctl status owncast

# Ver logs de errores
journalctl -u owncast -n 50 | grep -i error

# Verificar CORS headers
curl -I https://stream.kuffdj.net/hls/stream.m3u8
```

### Alta latencia
```bash
# Editar config.yaml
nano /opt/owncast/data/config.yaml

# Ajustar:
segmentLengthSeconds: 2
numberOfPlaylistItems: 3

# Reiniciar
systemctl restart owncast
```

### Servidor lento
```bash
# Reducir calidad de video en config.yaml
# Usar menos variantes de calidad
# Reducir bitrate

# O aumentar recursos del servidor
```

---

## 📞 INTEGRACIÓN CON KUFF WEBSITE

Una vez el servidor Owncast esté funcionando, agregar estas variables en el archivo `.env` del sitio KUFF:

```bash
OWNCAST_SERVER_URL=https://stream.kuffdj.net
OWNCAST_RTMP_URL=rtmp://stream.kuffdj.net:1935
OWNCAST_STREAM_KEY=tu-stream-key-aqui
```

Luego:
1. Reiniciar el sitio web KUFF
2. Hacer stream desde OBS al servidor Owncast
3. El stream aparecerá automáticamente en `kuffdj.net/live`

---

## ✅ CHECKLIST FINAL

- [ ] Owncast instalado y corriendo
- [ ] NGINX configurado con SSL
- [ ] Certificado SSL activo (Let's Encrypt)
- [ ] Firewall configurado (puertos 80, 443, 1935, 8080)
- [ ] Owncast auto-inicia con systemd
- [ ] CORS configurado para kuffdj.net
- [ ] Stream key generado y guardado
- [ ] Probado con OBS
- [ ] API `/api/status` responde correctamente
- [ ] HLS endpoint accesible
- [ ] Credenciales entregadas para integración web

---

**🎉 ¡Listo para streaming!**

Cuando todo esté configurado, proporciona las credenciales (OWNCAST_SERVER_URL, RTMP_URL, STREAM_KEY) para integrar con kuffdj.net.
