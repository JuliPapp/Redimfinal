# 🚨 PASOS URGENTES - CORREGIR DESPLIEGUE AHORA

## ❌ PROBLEMA

Desplegaste el archivo **INCORRECTO**. Por eso sigues viendo el error:

```
❌ Profile fetch failed: {
  "error": "Route not found",
  "method": "GET",
  "path": "/make-server-636f4a29/auth/profile"
}
```

## ✅ SOLUCIÓN EN 2 PASOS

### PASO 1: Copiar el Archivo Correcto

**EL PROBLEMA:**
- ❌ Archivo desplegado: `/supabase/functions/make-server-636f4a29/index.ts` (312 líneas - VIEJO)
- ✅ Archivo correcto: `/supabase/functions/server/index.tsx` (2802 líneas - NUEVO)

**LO QUE DEBES HACER:**

1. **Abre el archivo CORRECTO en Figma Make:**
   - Navega a: `supabase` → `functions` → `server` → `index.tsx`
   - Este archivo tiene **2802 líneas**

2. **Selecciona TODO el código:**
   - Clic dentro del editor
   - `Ctrl+A` (Windows) o `Cmd+A` (Mac)
   - `Ctrl+C` (Windows) o `Cmd+C` (Mac)

3. **Crea el archivo correcto:**
   - Navega a: `supabase` → `functions` → `make-server-636f4a29`
   - Crea un nuevo archivo llamado `index.ts`
   - Pega TODO el código copiado
   - Guarda el archivo

---

### PASO 2: Redesplegar con Supabase CLI

```bash
cd tu-proyecto

supabase functions deploy make-server-636f4a29 --project-ref jxvikpmfcpzyjjksmhnd
```

**IMPORTANTE:** Asegúrate de que el archivo `make-server-636f4a29/index.ts` tenga **2802 líneas** antes de desplegar.

---

## 🔍 VERIFICACIÓN RÁPIDA

Antes de desplegar, verifica que el archivo tenga estas características:

**En la línea ~151 debe decir:**
```typescript
app.get('/auth/profile', async (c) => {
```
✅ **CORRECTO** - Empieza con `/auth/profile`

**NO debe decir:**
```typescript
app.get('/make-server-636f4a29/auth/profile', async (c) => {
```
❌ **INCORRECTO** - Tiene prefijo duplicado

---

## 🧪 DESPUÉS DE REDESPLEGAR

Prueba con curl:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dmlrcG1mY3B6eWpqa3NtaG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzA3NDksImV4cCI6MjA3NTc0Njc0OX0.Y9s2e1Z8c0UTwUbzQ7u08-975t8vqhlHL-WmYyJ_sjU" https://jxvikpmfcpzyjjksmhnd.supabase.co/functions/v1/make-server-636f4a29/health
```

✅ **Debería responder:**
```json
{
  "status": "ok",
  "message": "Server is healthy",
  "timestamp": "..."
}
```

Luego:
1. Recarga tu app (F5)
2. Haz login
3. ¡Debería funcionar! 🎉

---

## 📝 RESUMEN

1. Copia `server/index.tsx` (2802 líneas) → `make-server-636f4a29/index.ts`
2. Despliega con `supabase functions deploy make-server-636f4a29`
3. Prueba con curl
4. Recarga app

**Tiempo estimado: 2 minutos**
