# ✅ CHECKLIST DE DESPLIEGUE

Sigue estos pasos en orden y marca cada uno cuando lo completes:

---

## 📋 PASOS

### 1️⃣ Copiar código en Figma Make
- [ ] Abrí el archivo: `/supabase/functions/server/index.tsx`
- [ ] Seleccioné TODO: `Ctrl + A`
- [ ] Copié: `Ctrl + C`

### 2️⃣ Abrir Supabase Dashboard
- [ ] Abrí: https://supabase.com/dashboard/project/jxvikpmfcpzyjjksmhnd/functions
- [ ] Inicié sesión correctamente
- [ ] Veo la lista de Edge Functions

### 3️⃣ Encontrar la función
- [ ] Veo la función: `make-server-636f4a29`
- [ ] Hice clic en ella
- [ ] Se abrió la página de detalles

### 4️⃣ Editar función
- [ ] Encontré el botón "Edit"
- [ ] Hice clic en "Edit"
- [ ] Se abrió el editor de código

### 5️⃣ Reemplazar código
- [ ] Seleccioné TODO el código viejo: `Ctrl + A`
- [ ] Borré: `Delete`
- [ ] Pegué código nuevo: `Ctrl + V`
- [ ] Verifiqué línea ~151 dice: `/auth/profile` (SIN `/make-server-636f4a29/`)

### 6️⃣ Desplegar
- [ ] Encontré el botón "Deploy"
- [ ] Hice clic en "Deploy"
- [ ] Vi mensaje "Deploying..."
- [ ] Esperé 1-2 minutos
- [ ] Vi mensaje "Function deployed successfully"

### 7️⃣ Verificar
- [ ] Abrí: https://jxvikpmfcpzyjjksmhnd.supabase.co/functions/v1/make-server-636f4a29/health
- [ ] Vi respuesta: `{"status":"ok","message":"Server is healthy"}`

### 8️⃣ Probar app
- [ ] Volví a la app en Figma Make
- [ ] Recargué: `F5`
- [ ] Hice login: `admin@test.com` / `30093009`
- [ ] ¡Login exitoso! 🎉

---

## ❌ SI ALGO FALLA

Marca dónde te atascaste y busca ayuda en estos archivos:

- **Paso 2 falla:** Ver "Problemas comunes" en `SOLUCION_FINAL.md`
- **Paso 4 falla:** Ver "No veo el botón Edit" en `SOLUCION_FINAL.md`
- **Paso 7 falla:** Ver "Sigue dando error 404" en `SOLUCION_FINAL.md`
- **Paso 8 falla:** Vuelve al Paso 7 y verifica `/health`

---

## 📊 ESTADO ACTUAL

¿En qué paso estás?

- [ ] Aún no empecé
- [ ] Paso 1 (copiando código)
- [ ] Paso 2 (abriendo Supabase)
- [ ] Paso 3 (buscando función)
- [ ] Paso 4 (editando)
- [ ] Paso 5 (reemplazando código)
- [ ] Paso 6 (desplegando)
- [ ] Paso 7 (verificando)
- [ ] Paso 8 (probando app)
- [ ] ¡COMPLETADO! ✅

---

## 🆘 AYUDA RÁPIDA

**Error 404 en /health:**
```
El código NO se desplegó correctamente.
Vuelve al Paso 5 y verifica que pegaste TODO el código.
```

**Error al abrir Supabase:**
```
Prueba en modo incógnito: Ctrl + Shift + N
O espera 15 minutos y vuelve a intentar.
```

**No veo "Deploy":**
```
Busca: "Save", "Save and deploy", o ícono de guardar 💾
```

---

## ⏱️ TIEMPO ESTIMADO

- Pasos 1-5: **1 minuto**
- Paso 6 (espera): **1-2 minutos**
- Pasos 7-8: **30 segundos**

**Total: ~3 minutos** ⚡

---

¡Buena suerte! 🚀
