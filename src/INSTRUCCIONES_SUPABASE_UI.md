# 📋 COPIAR Y DESPLEGAR DESDE SUPABASE UI

Como estás en Figma Make (entorno web), necesitas hacer esto manualmente en Supabase.

---

## 🚀 PASOS EXACTOS

### PASO 1: Copiar el Código Correcto

1. **En Figma Make, abre este archivo:**
   - Carpeta: `supabase` → `functions` → `server`
   - Archivo: `index.tsx`

2. **Selecciona TODO el código:**
   - Clic dentro del editor
   - Presiona `Ctrl+A` (Windows) o `Cmd+A` (Mac)
   - Presiona `Ctrl+C` (Windows) o `Cmd+C` (Mac)

---

### PASO 2: Ir a Supabase y Pegar el Código

1. **Abre Supabase en tu navegador:**
   ```
   https://supabase.com/dashboard/project/jxvikpmfcpzyjjksmhnd/functions
   ```

2. **Clic en la función `make-server-636f4a29`**

3. **BORRA todo el código viejo:**
   - Selecciona todo (`Ctrl+A` o `Cmd+A`)
   - Presiona `Delete`

4. **PEGA el código nuevo:**
   - Presiona `Ctrl+V` (Windows) o `Cmd+V` (Mac`)

5. **Verifica que la línea ~151 diga:**
   ```typescript
   app.get('/auth/profile', async (c) => {
   ```
   ✅ **CORRECTO** - Sin prefijo duplicado

---

### PASO 3: Desplegar

1. **Clic en el botón "Deploy"** (azul, arriba a la derecha)

2. **Espera 30-60 segundos**
   - Verás un mensaje "Deploying..."
   - Luego "Deployed successfully"

---

### PASO 4: Verificar

Abre una nueva pestaña del navegador y ve a:

```
https://jxvikpmfcpzyjjksmhnd.supabase.co/functions/v1/make-server-636f4a29/health
```

✅ **Deberías ver:**
```json
{
  "status": "ok",
  "message": "Server is healthy",
  "timestamp": "2025-10-18T..."
}
```

---

### PASO 5: Probar tu App

1. **Recarga tu app** (F5)
2. **Haz login:**
   - Email: `admin@test.com`
   - Password: `30093009`

3. **¡Debería funcionar!** 🎉

---

## ❓ SI NO FUNCIONA

### El código no cabe en el editor de Supabase

- Intenta en Chrome (navegador recomendado)
- Limpia caché: `Ctrl+Shift+R`
- Pega por partes (no recomendado)

### Sigue dando error 404

- Verifica que pegaste TODO el código (debe tener ~2802 líneas)
- Verifica que desplegaste en la función correcta: `make-server-636f4a29`
- Espera 2 minutos y prueba de nuevo

### El botón "Deploy" no aparece

- Asegúrate de estar editando la función, no solo viéndola
- Busca un botón "Edit" y haz clic primero

---

## 📝 IMPORTANTE

**El archivo correcto es:**
- Ubicación: `supabase/functions/server/index.tsx`
- Tamaño: ~2802 líneas
- Primera ruta: `app.get('/auth/profile', ...)` (línea ~151)
- Sin prefijos duplicados

**El archivo incorrecto (NO USAR):**
- ~~`supabase/functions/make-server-636f4a29/index.ts`~~ (no existe actualmente)

---

## ✅ RESUMEN

1. Copia `/supabase/functions/server/index.tsx` en Figma Make
2. Ve a Supabase UI
3. Abre función `make-server-636f4a29`
4. Borra todo
5. Pega el código copiado
6. Deploy
7. Espera 30s
8. Prueba `/health`
9. Recarga app
10. ¡Listo! 🎉

**Tiempo estimado: 3-5 minutos**
