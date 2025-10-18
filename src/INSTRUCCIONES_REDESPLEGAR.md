# 🚀 INSTRUCCIONES PARA REDESPLEGAR EN SUPABASE

## 📊 Problema Identificado

El código en Supabase está **DESACTUALIZADO**. El error muestra:
```
path: '/make-server-636f4a29/auth/profile'
```

Pero debería recibir solo:
```
path: '/auth/profile'
```

Esto significa que el código desplegado en Supabase **aún tiene las rutas con el prefijo viejo**.

---

## ✅ SOLUCIÓN: Redesplegar la Función

### Opción 1: Copiar y Pegar en Supabase Dashboard (Más Fácil)

1. **Abre Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/jxvikpmfcpzyjjksmhnd
   ```

2. **Ve a Edge Functions:**
   - Click en "Edge Functions" en el menú lateral
   - Click en la función `make-server-636f4a29`

3. **Editar el código:**
   - Click en "Edit Function" o similar
   - Verás un editor de código

4. **Copia el contenido completo de `/supabase/functions/server/index.tsx`:**
   - En Figma Make, abre el archivo `/supabase/functions/server/index.tsx`
   - Selecciona TODO el contenido (Ctrl+A / Cmd+A)
   - Copia (Ctrl+C / Cmd+C)

5. **Pega en Supabase:**
   - Borra todo el código viejo en el editor de Supabase
   - Pega el código nuevo (Ctrl+V / Cmd+V)

6. **Guarda y Despliega:**
   - Click en "Deploy" o "Save"
   - Espera a que termine el despliegue (30-60 segundos)

7. **Verifica:**
   - Deberías ver un mensaje "Deployed successfully"

---

### Opción 2: Usar Supabase CLI (Más Avanzado)

Si tienes Supabase CLI instalado:

```bash
# Desde la carpeta raíz del proyecto
supabase functions deploy make-server-636f4a29
```

---

## 🔍 Verificación Post-Despliegue

Después de redesplegar, prueba la app nuevamente. Deberías ver:

✅ **Antes (ERROR):**
```
404 Not Found
path: '/make-server-636f4a29/auth/profile'
```

✅ **Después (CORRECTO):**
```
200 OK
{ profile: {...} }
```

---

## ⚠️ Notas Importantes

1. **Variables de Entorno:** Asegúrate de que estas variables estén configuradas en Supabase:
   - `OPENAI_API_KEY`
   - `ENCRYPTION_KEY` (opcional, se auto-genera si no existe)
   
2. **NO cambies el nombre de la función** - debe seguir siendo `make-server-636f4a29`

3. **El archivo `/supabase/functions/server/admin_routes.tsx`** contiene rutas adicionales que debes copiar al final de `index.tsx` si aún no están incluidas.

---

## 📋 Checklist de Despliegue

- [ ] Abrir Supabase Dashboard
- [ ] Navegar a Edge Functions → make-server-636f4a29
- [ ] Copiar TODO el contenido de `/supabase/functions/server/index.tsx`
- [ ] Pegar en el editor de Supabase (reemplazar todo)
- [ ] Verificar que las rutas NO tengan el prefijo `/make-server-636f4a29/`
- [ ] Guardar y desplegar
- [ ] Esperar confirmación "Deployed successfully"
- [ ] Probar la app nuevamente
- [ ] Verificar que el login funcione

---

## 🆘 Si Hay Errores

1. **Revisa los logs en Supabase:**
   ```
   Dashboard → Edge Functions → make-server-636f4a29 → Logs
   ```

2. **Verifica las variables de entorno:**
   ```
   Dashboard → Settings → Edge Functions → Secrets
   ```

3. **Asegúrate de que la tabla `profiles` exista:**
   ```sql
   -- Ejecuta esto en SQL Editor si es necesario
   -- (Revisa SQL_CREAR_TABLAS.sql)
   ```

---

**¡Listo para redesplegar!** 🚀
