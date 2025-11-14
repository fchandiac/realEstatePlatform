#!/bin/bash

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    DEPLOY SCRIPT - PM2                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

PROJECT_ROOT="/root/apps/realEstatePlatform"

# Step 1: List current PM2 processes
echo "📋 STEP 1: LISTANDO PROCESOS ACTUALES DE PM2"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 list
echo ""

# Step 2: Stop and delete all PM2 processes
echo "🛑 STEP 2: DETENIENDO Y ELIMINANDO PROCESOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 delete all || true
sleep 2
echo "✅ Todos los procesos han sido eliminados"
echo ""

# Step 3: Verify PM2 is clean
echo "✔️  VERIFICANDO ESTADO LIMPIO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 list
echo ""

# Step 4: Build Backend
echo "🏗️  STEP 3: COMPILANDO BACKEND"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd "$PROJECT_ROOT/backend"
npm run build
echo "✅ Backend compilado exitosamente"
echo ""

# Step 5: Build Frontend
echo "🏗️  STEP 4: COMPILANDO FRONTEND"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd "$PROJECT_ROOT/frontend"
npm run build
echo "✅ Frontend compilado exitosamente"

# Copy public folder to standalone
echo "📁 Copiando archivos estáticos..."
if [ -d "$PROJECT_ROOT/frontend/public" ]; then
  rm -rf "$PROJECT_ROOT/frontend/.next/standalone/public"
  cp -r "$PROJECT_ROOT/frontend/public" "$PROJECT_ROOT/frontend/.next/standalone/public"
  echo "✅ Carpeta public copiada"
fi

# Copy .next/static to standalone (CSS, JS, etc)
if [ -d "$PROJECT_ROOT/frontend/.next/static" ]; then
  rm -rf "$PROJECT_ROOT/frontend/.next/standalone/.next/static"
  cp -r "$PROJECT_ROOT/frontend/.next/static" "$PROJECT_ROOT/frontend/.next/standalone/.next/static"
  echo "✅ Carpeta .next/static copiada (estilos y scripts)"
fi
echo ""

# Step 6: Start applications from ecosystem.config.js
echo "🚀 STEP 5: INICIANDO APLICACIONES CON PM2"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd "$PROJECT_ROOT"
pm2 start ecosystem.config.js
sleep 3
echo ""

# Step 7: Show final status
echo "📊 STEP 6: ESTADO FINAL DE PROCESOS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
pm2 list
echo ""

# Step 8: Show logs preview
echo "📝 STEP 7: INFORMACIÓN DE LOGS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Para ver logs en tiempo real:"
echo "  Backend:  pm2 logs realestate-backend"
echo "  Frontend: pm2 logs realestate-frontend"
echo "  Todos:    pm2 logs"
echo ""
echo "Para más información:"
echo "  pm2 monitor  - Monitor interactivo"
echo "  pm2 save     - Guardar configuración"
echo "  pm2 startup  - Auto-inicio al reiniciar"
echo ""
echo "URLs de acceso:"
echo "  Backend:  http://72.61.6.232:3000"
echo "  Frontend: http://72.61.6.232:3001"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║               ✅ DEPLOY COMPLETADO EXITOSAMENTE              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
