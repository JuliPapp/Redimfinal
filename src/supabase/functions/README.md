# 🔧 Supabase Edge Functions

## ⚠️ Errores de TypeScript en VS Code

**Si ves errores rojos en `index.tsx`, no te preocupes - son FALSOS POSITIVOS.**

### Por qué ocurre:

Este archivo está diseñado para **Deno** (runtime de Supabase), no para Node.js/TypeScript regular que usa VS Code.

### Errores comunes que verás:

- ❌ `Cannot find module 'npm:hono'`
- ❌ `Cannot find name 'Deno'`
- ❌ `Parameter 'c' implicitly has an 'any' type`

### ✅ El código funciona perfectamente en Supabase

Estos errores **NO afectan** el funcionamiento de la aplicación en Supabase. Son solo advertencias de VS Code.

---

## 🚀 Cómo desplegar

### Archivo a desplegar:
```
/supabase/functions/server/index.tsx
```

### Dónde desplegarlo:
1. Ve a: https://supabase.com/dashboard/project/jxvikpmfcpzyjjksmhnd/functions
2. Clic en: `make-server-636f4a29`
3. Clic en: "Edit"
4. Copia TODO el contenido de `index.tsx`
5. Pega y haz clic en: "Deploy"

---

## 📁 Estructura

```
/supabase/functions/server/
├── index.tsx          ← SERVIDOR PRINCIPAL (2800+ líneas)
├── kv_store.tsx       ← Utilidad de base de datos (protegido)
└── admin_routes.tsx   ← Rutas administrativas
```

### Archivos importantes:

- **`index.tsx`**: Servidor completo con todas las rutas
- **`kv_store.tsx`**: **NO EDITAR** - Archivo protegido
- **`admin_routes.tsx`**: Lógica de administración de PDFs

---

## 🔍 Cómo verificar que está desplegado

Abre esta URL en tu navegador:
```
https://jxvikpmfcpzyjjksmhnd.supabase.co/functions/v1/make-server-636f4a29/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "message": "Server is healthy",
  "timestamp": "2025-10-18T...",
  "version": "2.0",
  "routes": 50
}
```

Si ves esta respuesta, ¡todo está funcionando! ✅

---

## 🐛 Solucionar errores de VS Code (Opcional)

Si los errores rojos te molestan, puedes:

### Opción 1: Instalar extensión de Deno

1. Instala: [Deno extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
2. Recarga VS Code
3. Los errores deberían desaparecer

### Opción 2: Ignorar el archivo

Agrega a tu `.vscode/settings.json`:
```json
{
  "typescript.validate.enable": true,
  "deno.enablePaths": ["./supabase/functions"]
}
```

### Opción 3: Simplemente ignorarlos

El código funciona perfectamente en Supabase. Los errores de VS Code no afectan nada.

---

## 📚 Documentación de Deno

- [Deno Runtime](https://deno.land/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Hono Framework](https://hono.dev/)

---

## ❓ FAQ

### ¿Por qué usar Deno en lugar de Node.js?

Supabase Edge Functions usan Deno porque:
- ✅ Más seguro (permisos explícitos)
- ✅ Mejor para serverless
- ✅ Soporte nativo de TypeScript
- ✅ Imports desde URLs

### ¿Puedo ejecutar esto localmente?

Sí, pero necesitas instalar Deno:
```bash
# Instalar Deno
curl -fsSL https://deno.land/install.sh | sh

# Ejecutar (desde /supabase/functions/server/)
deno run --allow-net --allow-env index.tsx
```

Pero no es necesario - puedes desplegar directamente en Supabase.

### ¿Los errores afectan el build?

**NO.** Los errores son solo de VS Code. Supabase despliega y ejecuta el código sin problemas.

---

¿Necesitas ayuda? Lee [`/SOLUCION_FINAL.md`](../../SOLUCION_FINAL.md) en la raíz del proyecto.
