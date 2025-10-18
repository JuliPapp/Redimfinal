# 🎯 PASOS SIMPLES PARA DESPLEGAR

## ✅ LO QUE HAREMOS

El código correcto está en:
```
/supabase/functions/server/index.tsx
```

Pero Supabase busca en:
```
/supabase/functions/make-server-636f4a29/index.ts
```

**Solución:** Copiar el archivo desde Figma Make → Supabase Dashboard.

---

## 📋 INSTRUCCIONES PASO A PASO

### **PASO 1: Abrir el código correcto**

En Figma Make (donde estás ahora):

1. Haz clic en: `/supabase/functions/server/index.tsx`
2. Verás el código completo (2802 líneas)

### **PASO 2: Seleccionar TODO el código**

1. Haz clic dentro del editor de código
2. Presiona: **Ctrl + A** (Windows) o **Cmd + A** (Mac)
   - Esto selecciona TODO el código
3. Presiona: **Ctrl + C** (Windows) o **Cmd + C** (Mac)
   - Esto copia el código

### **PASO 3: Ir a Supabase Dashboard**

1. Abre esta URL en una nueva pestaña:
   ```
   https://supabase.com/dashboard/project/jxvikpmfcpzyjjksmhnd/functions
   ```

2. Verás una lista de funciones ("Edge Functions")

3. Busca la función llamada: **`make-server-636f4a29`**

4. Haz clic en: **`make-server-636f4a29`**

### **PASO 4: Editar la función**

1. En la página de la función, busca el botón: **"Edit"** (arriba a la derecha)

2. Haz clic en: **"Edit"**

3. Se abrirá un editor de código

### **PASO 5: Reemplazar el código viejo**

1. **Selecciona TODO** el código viejo:
   - Presiona: **Ctrl + A** (Windows) o **Cmd + A** (Mac)

2. **Borra** el código viejo:
   - Presiona: **Delete** o **Backspace**

3. **Pega** el código nuevo que copiaste:
   - Presiona: **Ctrl + V** (Windows) o **Cmd + V** (Mac)

4. **VERIFICA** que el código se pegó correctamente:
   - Busca la línea ~151
   - Debe decir: `app.get('/auth/profile', async (c) => {`
   - ✅ Correcto si dice: `/auth/profile`
   - ❌ Incorrecto si dice: `/make-server-636f4a29/auth/profile`

### **PASO 6: Guardar y desplegar**

1. Busca el botón: **"Deploy"** o **"Save and deploy"** (abajo del editor)

2. Haz clic en: **"Deploy"**

3. **ESPERA 1-2 minutos** mientras Supabase despliega

4. Verás un mensaje: **"Function deployed successfully"** ✅

### **PASO 7: Verificar que funcionó**

1. Abre esta URL en una nueva pestaña:
   ```
   https://jxvikpmfcpzyjjksmhnd.supabase.co/functions/v1/make-server-636f4a29/health
   ```

2. **DEBERÍAS VER:**
   ```json
   {
     "status": "ok",
     "message": "Server is healthy",
     "timestamp": "2025-10-18T..."
   }
   ```

3. **SI VES ESTO:** ✅ ¡Funcionó!

4. **SI VES ERROR 404:** ❌ Algo salió mal, repite desde PASO 4

### **PASO 8: Probar la app**

1. Vuelve a tu app en Figma Make

2. Recarga la página: **F5**

3. Haz login:
   - Email: `admin@test.com`
   - Password: `30093009`

4. **¡Debería funcionar!** 🎉

---

## 🚨 PROBLEMAS COMUNES

### "Failed to fetch (api.supabase.com)"

Supabase está teniendo problemas. Soluciones:

1. **Espera 10-15 minutos** y prueba de nuevo
2. **Prueba en otro navegador** (Chrome, Firefox, Edge)
3. **Limpia caché:** Ctrl + Shift + Delete
4. **Modo incógnito:** Ctrl + Shift + N
5. **Desactiva extensiones** (AdBlock, VPN)

### "El código sigue dando error 404"

Revisa el PASO 5, punto 4:
- El código NO debe tener `/make-server-636f4a29` en las rutas
- Las rutas deben ser: `/auth/profile`, `/health`, etc.
- **NO:** `/make-server-636f4a29/auth/profile`

### "No veo el botón 'Edit'"

Puede tener otro nombre:
- "Edit function"
- "Edit code"  
- "Modify"
- Ícono de lápiz ✏️

---

## ✅ CHECKLIST RÁPIDO

- [ ] Abrí `/supabase/functions/server/index.tsx`
- [ ] Copié TODO el código (Ctrl+A, Ctrl+C)
- [ ] Abrí Supabase Dashboard
- [ ] Encontré función `make-server-636f4a29`
- [ ] Hice clic en "Edit"
- [ ] Borré el código viejo (Ctrl+A, Delete)
- [ ] Pegué el código nuevo (Ctrl+V)
- [ ] Verifiqué que diga `/auth/profile` (sin prefijo)
- [ ] Hice clic en "Deploy"
- [ ] Esperé 1-2 minutos
- [ ] Verifiqué `/health` → `{"status":"ok"}`
- [ ] Recar gué app (F5)
- [ ] Hice login exitosamente

---

## 🆘 SI NADA FUNCIONA

Dime exactamente en qué paso te quedaste atascado:

- ¿Puedes abrir Supabase Dashboard?
- ¿Ves la función `make-server-636f4a29`?
- ¿Puedes hacer clic en "Edit"?
- ¿Se pegó el código correctamente?
- ¿El botón "Deploy" funciona?
- ¿Qué error ves en `/health`?

**Te ayudaré específicamente con ese paso.**
