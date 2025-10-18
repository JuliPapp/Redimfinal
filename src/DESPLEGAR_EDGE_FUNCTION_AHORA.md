# 🚀 REDESPLEGAR EDGE FUNCTION - CÓDIGO ACTUALIZADO

## ✅ ¡BUENA NOTICIA!
La Edge Function **SÍ está funcionando** cuando usas el Authorization header:
```bash
curl -H "Authorization: Bearer TU_ANON_KEY" \
https://jxvikpmfcpzyjjksmhnd.supabase.co/functions/v1/make-server-636f4a29/health
```

## ⚠️ PROBLEMA ACTUAL
El código desplegado en Supabase es el **VIEJO**. Necesitas actualizar con el código corregido.

**Evidencia:** La respuesta del servidor muestra:
```json
"endpoints": {
  "auth": "/make-server-636f4a29/auth/profile",  ❌ INCORRECTO
  "health": "/make-server-636f4a29/health"      ❌ INCORRECTO  
}
```

**Debe ser:**
```json
"endpoints": {
  "auth": "/auth/profile",  ✅ CORRECTO
  "health": "/health"       ✅ CORRECTO
}
```

---

## 🔧 SOLUCIÓN: REDESPLEGAR CON CÓDIGO ACTUALIZADO

### PASO 1: REDESPLEGAR con el Código Actualizado

La función ya existe en Supabase, solo necesitas **actualizar el código**.

1. Ve a Supabase: https://supabase.com/dashboard/project/jxvikpmfcpzyjjksmhnd
2. Ve a **Edge Functions** (icono ⚡ en el menú izquierdo)
3. Clic en la función **`make-server-636f4a29`** (debería aparecer en la lista)
4. Verás el editor con el código viejo
5. **BORRA TODO** el código del editor
6. Abre el archivo local: **`/supabase/functions/make-server-636f4a29/index.ts`**
7. **COPIA TODO** el contenido (Ctrl+A → Ctrl+C)
8. **PEGA** en el editor de Supabase (Ctrl+V)
9. Verifica que el código tenga esta línea (alrededor de la línea 291):
   ```typescript
   endpoints: {
     auth: '/auth/profile, /auth/signup',  // ✅ SIN prefijo
     checkins: '/checkins',
     health: '/health'
   }
   ```
10. Clic en **Deploy** (botón azul arriba a la derecha)
11. Espera hasta ver **"Deployed successfully"** ✅

---

### PASO 2: Verificar el Redespliegue

Ejecuta este comando en tu terminal:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dmlrcG1mY3B6eWpqa3NtaG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzA3NDksImV4cCI6MjA3NTc0Njc0OX0.Y9s2e1Z8c0UTwUbzQ7u08-975t8vqhlHL-WmYyJ_sjU" \
https://jxvikpmfcpzyjjksmhnd.supabase.co/functions/v1/make-server-636f4a29/health
```

✅ **Si el redespliegue fue exitoso**, ahora verás:
```json
{
  "success": true,
  "message": "🚀 Edge Function is running!",
  "timestamp": "2025-10-18T...",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/auth/profile, /auth/signup",     ✅ SIN prefijo
    "checkins": "/checkins",                    ✅ SIN prefijo
    "health": "/health"                         ✅ SIN prefijo
  }
}
```

❌ **Si aún ves el prefijo** `/make-server-636f4a29/auth/...`, significa que NO se desplegó el código nuevo. Repite el PASO 1.

---

### PASO 3: Probar la App

1. **Recarga** la aplicación web (F5 o Ctrl+R)
2. Intenta **hacer login** con tus credenciales
3. **Debería funcionar ahora** ✨

**¿Por qué ahora funciona?**
- La app frontend YA está configurada para enviar el Authorization header
- El servidor YA acepta peticiones con el anon key
- Solo faltaba actualizar el código en Supabase

---

---

## 📝 RESUMEN DE CAMBIOS

### ✅ Lo que YA estaba bien:
- Frontend configurado para enviar Authorization header ✅
- Tabla KV creada en Supabase ✅
- Edge Function desplegada ✅
- Supabase acepta peticiones con anon key ✅

### ⚠️ Lo que estaba MAL:
- El código desplegado era el viejo (con prefijos duplicados) ❌
- Rutas incorrectas: `/make-server-636f4a29/auth/profile` en vez de `/auth/profile`

### 🔧 Lo que acabas de hacer:
- Redesplegar con el código actualizado
- Ahora las rutas son correctas: `/auth/profile`, `/auth/signup`, etc.

---

## ❓ SI AÚN HAY PROBLEMAS

**Error 401 al hacer login:**
- Verifica que desplegaste el código NUEVO (revisa el PASO 2)
- Verifica que la app esté enviando el header: `Authorization: Bearer <token>`

**Error 404:**
- Verifica que la función se llame exactamente `make-server-636f4a29`
- Verifica la URL: debe ser `.../functions/v1/make-server-636f4a29/auth/signup`

**Errores en consola:**
- Abre DevTools (F12) → Console
- Copia el error completo y revisa qué endpoint está fallando
