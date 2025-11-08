# 🎯 PROMPT PARA CONFIGURAR OWNCAST - KUFF DJ

## Copia y pega este prompt completo a tu servidor o asistente:

---

**INSTRUCCIÓN:** Necesito instalar y configurar un servidor Owncast para streaming en vivo que se integrará con el sitio web kuffdj.net. El servidor debe estar optimizado para streaming de DJ sets en vivo.

## ESPECIFICACIONES DEL SERVIDOR

**Dominio:** stream.kuffdj.net (o el que tengas disponible)

**Servidor:** Ubuntu 20.04+ con:
- 4 CPU cores
- 8GB RAM
- 50GB disco
- IP pública estática

**Puertos requeridos:** 80 (HTTP), 443 (HTTPS), 1935 (RTMP), 8080 (Owncast)

## TAREAS A REALIZAR

### 1. INSTALACIÓN BASE

```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar dependencias
apt install curl nginx certbot python3-certbot-nginx ufw -y

# Crear directorio Owncast
mkdir -p /opt/owncast && cd /opt/owncast

# Instalar Owncast (última versión)
curl -s https://owncast.online/install.sh | bash
chmod +x owncast
```

### 2. CONFIGURAR NGINX CON SSL

Crear `/etc/nginx/sites-available/owncast` con:

```nginx
server {
    listen 80;
    server_name stream.kuffdj.net;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name stream.kuffdj.net;

    ssl_certificate /etc/letsencrypt/live/stream.kuffdj.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/stream.kuffdj.net/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    # CORS para kuffdj.net
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept" always;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /ws {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /hls/ {
        proxy_pass http://127.0.0.1:8080/hls/;
        add_header Cache-Control no-cache;
        add_header Access-Control-Allow-Origin "*";
    }
}
```

```bash
# Habilitar sitio
ln -s /etc/nginx/sites-available/owncast /etc/nginx/sites-enabled/
nginx -t

# Obtener certificado SSL
certbot --nginx -d stream.kuffdj.net --non-interactive --agree-tos --email admin@kuffdj.net

# Reiniciar NGINX
systemctl restart nginx
```

### 3. CONFIGURAR OWNCAST

Editar `/opt/owncast/data/config.yaml`:

```yaml
name: "KUFF DJ Live"
summary: "KUFF DJ performing live"
instanceURL: https://stream.kuffdj.net

rtmpServerPort: 1935
webServerPort: 8080
webServerIP: 127.0.0.1

# IMPORTANTE: Generar stream key seguro
streamKey: "live_GENERAR_CLAVE_ALEATORIA_32_CARACTERES"

videoSettings:
  numberOfPlaylistItems: 3
  segmentLengthSeconds: 2

  videoQualityVariants:
    - isVideoPassthrough: false
      videoBitrate: 4000
      outputStreamBitrate: 4000
      audioBitrate: 160
      scaledWidth: 1920
      scaledHeight: 1080
      framerate: 30
      cpuUsageLevel: 3
      encoderPreset: veryfast

    - isVideoPassthrough: false
      videoBitrate: 2000
      outputStreamBitrate: 2000
      audioBitrate: 128
      scaledWidth: 1280
      scaledHeight: 720
      framerate: 30
      cpuUsageLevel: 2
      encoderPreset: veryfast

federation:
  enabled: true
  isPrivate: false
  username: kuffdj
```

### 4. CREAR SYSTEMD SERVICE

Crear `/etc/systemd/system/owncast.service`:

```ini
[Unit]
Description=Owncast
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
# Activar e iniciar
systemctl daemon-reload
systemctl enable owncast
systemctl start owncast
```

### 5. CONFIGURAR FIREWALL

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 1935/tcp
ufw allow 22/tcp
ufw --force enable
```

### 6. VERIFICAR INSTALACIÓN

```bash
# Estado del servicio
systemctl status owncast

# Verificar API
curl https://stream.kuffdj.net/api/status

# Verificar HLS
curl https://stream.kuffdj.net/hls/stream.m3u8

# Ver logs
journalctl -u owncast -f
```

## SALIDA REQUERIDA

Una vez completada la instalación, proporcionar:

```
✅ SERVIDOR OWNCAST CONFIGURADO PARA KUFF

URL del servidor: https://stream.kuffdj.net
HLS Stream URL: https://stream.kuffdj.net/hls/stream.m3u8
API Status: https://stream.kuffdj.net/api/status

CREDENCIALES RTMP (para OBS):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Server: rtmp://stream.kuffdj.net:1935
Stream Key: [LA CLAVE GENERADA EN CONFIG.YAML]

ADMIN PANEL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
URL: https://stream.kuffdj.net/admin
Usuario: admin
Password: [CONTRASEÑA MOSTRADA EN PRIMER INICIO]

VARIABLES PARA .ENV DEL SITIO WEB:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OWNCAST_SERVER_URL=https://stream.kuffdj.net
OWNCAST_RTMP_URL=rtmp://stream.kuffdj.net:1935
OWNCAST_STREAM_KEY=[TU STREAM KEY]

CONFIGURACIÓN OBS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Service: Custom
Server: rtmp://stream.kuffdj.net:1935
Stream Key: [TU STREAM KEY]
Bitrate: 4000 kbps
Encoder: x264 / NVENC
Keyframe Interval: 2
Preset: veryfast
Resolution: 1920x1080
FPS: 30
```

## COMANDOS ÚTILES

```bash
# Reiniciar Owncast
systemctl restart owncast

# Ver logs en tiempo real
journalctl -u owncast -f

# Ver estado del servidor
htop
iftop

# Backup configuración
cp -r /opt/owncast/data /opt/owncast/data.backup.$(date +%Y%m%d)

# Actualizar Owncast
cd /opt/owncast
systemctl stop owncast
curl -s https://owncast.online/install.sh | bash
systemctl start owncast
```

---

**IMPORTANTE:**
1. Guardar la contraseña de admin que aparece en el primer inicio
2. Generar una stream key segura y única
3. Verificar que todos los endpoints responden antes de reportar como completado
4. Asegurar que CORS esté habilitado para permitir embedding en kuffdj.net

**OBJETIVO FINAL:** El stream debe aparecer automáticamente en `https://kuffdj.net/live` cuando alguien haga streaming al servidor Owncast.
