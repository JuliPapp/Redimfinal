#!/bin/bash

# Script para copiar el archivo correcto al lugar de despliegue

echo "🔄 Copiando archivo correcto..."

# Copiar server/index.tsx a make-server-636f4a29/index.ts
cp supabase/functions/server/index.tsx supabase/functions/make-server-636f4a29/index.ts

echo "✅ Archivo copiado exitosamente"
echo ""
echo "📊 Verificando tamaño del archivo..."
wc -l supabase/functions/make-server-636f4a29/index.ts

echo ""
echo "🚀 Ahora despliega con:"
echo "supabase functions deploy make-server-636f4a29 --project-ref jxvikpmfcpzyjjksmhnd"
