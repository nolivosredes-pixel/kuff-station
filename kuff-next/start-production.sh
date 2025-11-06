#!/bin/bash

# Script de inicio rápido para KUFF Website con PM2
# Este script construye y despliega la aplicación en producción

echo "🎵 KUFF Website - Inicio de Producción con PM2"
echo "=============================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar si existe .env
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: No se encontró el archivo .env${NC}"
    echo "Por favor, copia .env.example a .env y configura tus variables:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    exit 1
fi

echo "✅ Archivo .env encontrado"
echo ""

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error al instalar dependencias${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
    echo ""
fi

# Construir la aplicación
echo "🔨 Construyendo aplicación para producción..."
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al construir la aplicación${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Aplicación construida exitosamente${NC}"
echo ""

# Verificar si ya hay una instancia corriendo
if pm2 list | grep -q "kuff-website"; then
    echo "🔄 Reiniciando aplicación existente..."
    npm run pm2:restart
else
    echo "🚀 Iniciando aplicación con PM2..."
    npm run pm2:start
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al iniciar con PM2${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}=============================================="
echo "✅ ¡Aplicación iniciada exitosamente!"
echo "==============================================${NC}"
echo ""
echo "📊 Estado de la aplicación:"
npm run pm2:status
echo ""
echo "🌐 La aplicación está corriendo en:"
echo "   http://localhost:3000"
echo ""
echo "📝 Comandos útiles:"
echo "   Ver logs:      npm run pm2:logs"
echo "   Ver estado:    npm run pm2:status"
echo "   Monitorear:    npm run pm2:monit"
echo "   Reiniciar:     npm run pm2:restart"
echo "   Detener:       npm run pm2:stop"
echo ""
echo "🔐 Panel de Admin:"
echo "   http://localhost:3000/admin"
echo ""
echo -e "${YELLOW}💡 Tip: Para que la app se inicie automáticamente al reiniciar el servidor:${NC}"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
