# 🚨 INSTRUCCIONES: Copiar Código Correcto a Supabase

## ❌ PROBLEMA ACTUAL
Tu Edge Function en Supabase tiene código VIEJO que causa error 404.

## ✅ SOLUCIÓN
Necesitas copiar el código CORRECTO desde este proyecto a Supabase.

---

## 📍 UBICACIÓN DEL CÓDIGO CORRECTO

El código correcto está en:
```
/supabase/functions/server/index.tsx
```

Este archivo tiene **2802 líneas** y contiene TODAS las rutas de la API.

---

## 🔧 PASOS PARA COPIAR EL CÓDIGO

### OPCIÓN 1: Copiar desde Figma Make (RECOMENDADO)

1. **Abre este proyecto en Figma Make**
   
2. **Navega al archivo:**
   - Carpeta: `supabase/functions/server/`
   - Archivo: `index.tsx`
   
3. **Selecciona TODO el código:**
   - Clic dentro del editor
   - Presiona `Ctrl+A` (Windows) o `Cmd+A` (Mac)
   
4. **Copia el código:**
   - Presiona `Ctrl+C` (Windows) o `Cmd+C` (Mac)

5. **Ve a Supabase:**
   - Abre: https://supabase.com/dashboard/project/jxvikpmfcpzyjjksmhnd/functions
   - Clic en la función `make-server-636f4a29`
   
6. **Reemplaza el código:**
   - Selecciona TODO el código viejo (`Ctrl+A` o `Cmd+A`)
   - Borra todo (`Delete` o `Backspace`)
   - Pega el código nuevo (`Ctrl+V` o `Cmd+V`)
   
7. **Verifica el código:**
   - Busca la línea ~151
   - Debe decir: `app.get('/auth/profile', async (c) => {`
   - ✅ **CORRECTO**: Empieza con `/auth/profile`
   - ❌ **INCORRECTO**: Si dice `/make-server-636f4a29/auth/profile`
   
8. **Despliega:**
   - Clic en botón "Deploy" (azul, arriba a la derecha)
   - Espera 30 segundos
   - Verifica que diga "Deployed successfully"

---

### OPCIÓN 2: Copiar desde tu computadora local

Si descargaste el proyecto:

1. **Abre el archivo en tu editor:**
   ```
   supabase/functions/server/index.tsx
   ```

2. **Selecciona y copia TODO:**
   - `Ctrl+A` o `Cmd+A` para seleccionar todo
   - `Ctrl+C` o `Cmd+C` para copiar

3. **Sigue los pasos 5-8 de la OPCIÓN 1** (arriba)

---

## 🧪 VERIFICAR QUE FUNCIONA

### Test 1: Health Check

Ejecuta en tu terminal:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dmlrcG1mY3B6eWpqa3NtaG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzA3NDksImV4cCI6MjA3NTc0Njc0OX0.Y9s2e1Z8c0UTwUbzQ7u08-975t8vqhlHL-WmYyJ_sjU" https://jxvikpmfcpzyjjksmhnd.supabase.co/functions/v1/make-server-636f4a29/health
```

✅ **Respuesta correcta:**
```json
{
  "success": true,
  "message": "Server is running!",
  "timestamp": "2025-10-18T..."
}
```

❌ **Si sigue dando 404**, repite el proceso y verifica que copiaste TODO el código.

### Test 2: Auth Profile

Ejecuta en tu terminal (reemplaza YOUR_TOKEN con tu token):
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://jxvikpmfcpzyjjksmhnd.supabase.co/functions/v1/make-server-636f4a29/auth/profile
```

✅ **Debería devolver tu perfil** (no 404)

### Test 3: Probar la App

1. Recarga la página de la app (F5)
2. Intenta hacer login
3. **¡Debería funcionar!** 🎉

---

## ❓ SOLUCIÓN DE PROBLEMAS

### "El código es muy grande, se corta al pegar"

→ Asegúrate de copiar TODO el archivo completo (2802 líneas)
→ Si el editor de Supabase no acepta todo, intenta:
  - Usar un navegador diferente (Chrome recomendado)
  - Limpiar caché del navegador
  - Pegar en bloques más pequeños (no recomendado)

### "Deploy failed"

→ Verifica que no haya errores de sintaxis
→ Asegúrate de que copiaste el archivo completo
→ Intenta de nuevo

### "404 después de desplegar"

→ Verifica que desplegaste en la función correcta: `make-server-636f4a29`
→ Espera 1-2 minutos y prueba de nuevo
→ Limpia caché del navegador (Ctrl+Shift+R)

### "No puedo encontrar el archivo /supabase/functions/server/index.tsx"

→ Asegúrate de estar en el proyecto correcto en Figma Make
→ Navega a la carpeta usando el explorador de archivos
→ El archivo debe estar visible en la estructura de carpetas

---

## 📝 NOTAS IMPORTANTES

### ¿Por qué NO usar /supabase/functions/make-server-636f4a29/index.ts?

Ese archivo solo tiene **312 líneas** y es una versión SIMPLIFICADA y DESACTUALIZADA.

El archivo CORRECTO es:
- `/supabase/functions/server/index.tsx` ← ✅ **USAR ESTE**
- **2802 líneas**
- Todas las rutas incluidas
- Código actualizado

### ¿Qué rutas incluye el código correcto?

- ✅ Auth (`/auth/profile`, `/auth/signup`, `/auth/create-leader`)
- ✅ Community (`/leaders`, `/disciples`, `/my-leader`)  
- ✅ Check-ins (`/checkins`, `/checkins-stats`)
- ✅ Meetings (`/meetings`, `/time-slots`)
- ✅ Library (`/library`)
- ✅ Admin (`/admin/assistant-status`, `/admin/files`)
- ✅ Y muchas más...

### Diferencia clave

**Código VIEJO** ❌ (en Supabase actualmente):
```typescript
app.get('/make-server-636f4a29/auth/profile', ...)
```
Tiene el prefijo duplicado, causa 404.

**Código NUEVO** ✅ (en server/index.tsx):
```typescript
app.get('/auth/profile', ...)
```
Sin prefijo duplicado, funciona correctamente.

---

## ✅ DESPUÉS DE DESPLEGAR

Tu app debería:
- ✅ Permitir login/signup
- ✅ Cargar perfiles correctamente
- ✅ Mostrar dashboards
- ✅ Funcionar completamente

🎉 **¡Listo! Tu app está funcionando correctamente.**

---

## 📞 ¿NECESITAS AYUDA?

Si después de seguir estos pasos la app aún no funciona:

1. Verifica los logs de Supabase:
   - Ve a: https://supabase.com/dashboard/project/jxvikpmfcpzyjjksmhnd/logs/edge-functions
   - Busca errores en la función `make-server-636f4a29`

2. Verifica la consola del navegador:
   - Abre DevTools (F12)
   - Ve a la pestaña "Console"
   - Busca errores en rojo

3. Comparte los errores que veas para obtener más ayuda.
