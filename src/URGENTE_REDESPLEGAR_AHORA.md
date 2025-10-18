# 🚨 URGENTE: REDESPLEGAR EDGE FUNCTION

## ⚠️ PROBLEMA ACTUAL

La app NO está funcionando porque el código en Supabase es el **VIEJO**.

**Error actual:**
```
❌ Profile fetch failed: {
  "error": "Route not found",
  "method": "GET",
  "path": "/make-server-636f4a29/auth/profile"  ❌ INCORRECTO - PREFIJO DUPLICADO
}
```

**Debería ser:**
```
✅ Profile fetch success: {
  "path": "/auth/profile"  ✅ CORRECTO - SIN PREFIJO
}
```

---

## 🔧 SOLUCIÓN: REDESPLEGAR EN 3 MINUTOS

### PASO 1: Abrir Supabase Edge Functions

1. **Abre este link:** https://supabase.com/dashboard/project/jxvikpmfcpzyjjksmhnd/functions
2. Deberías ver una lista de funciones
3. **Busca:** `make-server-636f4a29`
4. **Clic** en el nombre de la función

---

### PASO 2: Editar el Código

1. Verás un **editor de código** con el código viejo
2. **Selecciona TODO** el código (Ctrl+A en Windows, Cmd+A en Mac)
3. **Borra** todo (Delete o Backspace)
4. Ahora el editor debe estar **vacío**

---

### PASO 3: Copiar el Código Nuevo

**OPCIÓN A - Desde este proyecto de Figma Make:**

Si estás viendo este archivo en Figma Make:
1. Abre el archivo: `/supabase/functions/make-server-636f4a29/index.ts`
2. **Selecciona TODO** el contenido (Ctrl+A o Cmd+A)
3. **Copia** (Ctrl+C o Cmd+C)
4. Vuelve al editor de Supabase
5. **Pega** el código (Ctrl+V o Cmd+V)

**OPCIÓN B - Desde tu computadora local:**

Si descargaste el proyecto a tu computadora:
1. Abre el archivo de tu computadora:
   ```
   supabase/functions/make-server-636f4a29/index.ts
   ```
   
2. **Selecciona TODO** el contenido (Ctrl+A o Cmd+A)
3. **Copia** (Ctrl+C o Cmd+C)
4. Vuelve al editor de Supabase
5. **Pega** el código (Ctrl+V o Cmd+V)

---

### PASO 4: Verificar el Código

**MUY IMPORTANTE:** Antes de desplegar, verifica que el código tenga esto:

Busca la línea ~143 (debe decir):
```typescript
app.get('/auth/profile', async (c) => {
```
✅ **CORRECTO** - Empieza con `/auth/profile`

Si dice esto, **ES INCORRECTO**:
```typescript
app.get('/make-server-636f4a29/auth/profile', async (c) => {
```
❌ **INCORRECTO** - Tiene prefijo duplicado

---

### PASO 5: Desplegar

1. Busca el botón **"Deploy"** (arriba a la derecha, color azul)
2. **Clic** en Deploy
3. Espera 10-30 segundos
4. Deberías ver: **"Deployed successfully"** ✅

---

### PASO 6: Verificar que Funciona

Abre tu terminal y ejecuta:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dmlrcG1mY3B6eWpqa3NtaG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzA3NDksImV4cCI6MjA3NTc0Njc0OX0.Y9s2e1Z8c0UTwUbzQ7u08-975t8vqhlHL-WmYyJ_sjU" \
https://jxvikpmfcpzyjjksmhnd.supabase.co/functions/v1/make-server-636f4a29/health
```

✅ **Si funciona**, verás:
```json
{
  "success": true,
  "message": "🚀 Edge Function is running!",
  "endpoints": {
    "auth": "/auth/profile, /auth/signup",     ✅ SIN prefijo
    "checkins": "/checkins",
    "health": "/health"
  }
}
```

❌ **Si aún dice** `/make-server-636f4a29/auth/...`, el código viejo aún está desplegado. Repite desde el PASO 1.

---

### PASO 7: Probar la App

1. Ve a tu app: **Camino de Restauración**
2. Recarga la página (F5 o Ctrl+R)
3. Intenta **hacer login**
4. **¡Debería funcionar ahora!** 🎉

---

## 📝 NOTAS IMPORTANTES

### ¿Por qué pasó esto?
- El código LOCAL (en tu computadora) está correcto ✅
- El código en SUPABASE estaba desactualizado ❌
- Necesitas sincronizar: computadora → Supabase

### ¿Qué hace el código nuevo?
- Las rutas NO tienen prefijo duplicado
- `/auth/profile` en vez de `/make-server-636f4a29/auth/profile`
- Esto hace que las URLs funcionen correctamente

---

## ❓ SI TIENES PROBLEMAS

### Error: "Function not found"
→ Ve a https://supabase.com/dashboard/project/jxvikpmfcpzyjjksmhnd/functions
→ Verifica que exista la función `make-server-636f4a29`
→ Si no existe, créala primero

### Error: "Deploy failed"
→ Verifica que copiaste TODO el código (debe tener ~312 líneas)
→ Verifica que no tenga errores de sintaxis
→ Intenta desplegar de nuevo

### La app aún no funciona después de desplegar
→ Ejecuta el comando curl del PASO 6
→ Si el curl funciona pero la app no, limpia el caché:
  - Abre DevTools (F12)
  - Clic derecho en el botón de recargar
  - Selecciona "Empty Cache and Hard Reload"

---

## 🎯 RESUMEN RÁPIDO

1. Ve a Supabase Edge Functions
2. Abre `make-server-636f4a29`
3. Borra todo el código viejo
4. Copia y pega el código de `index.ts` local
5. Verifica que `/auth/profile` NO tenga prefijo
6. Deploy
7. Prueba con curl
8. Recarga la app

**Tiempo estimado:** 3-5 minutos ⏱️

---

## ✅ DESPUÉS DE DESPLEGAR

La app debería:
- ✅ Permitir login
- ✅ Cargar el perfil del usuario
- ✅ Mostrar el dashboard
- ✅ Funcionar normalmente

Si todo funciona, puedes continuar usando la app normalmente. 🚀
