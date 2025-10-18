# 🔧 Configuración de Supabase para "Camino de Restauración"

## 📋 Tabla de Contenidos
1. [Estructura del Proyecto en Supabase](#estructura)
2. [Configuración de Edge Functions](#edge-functions)
3. [Variables de Entorno](#variables)
4. [Base de Datos](#base-de-datos)
5. [Storage (Almacenamiento)](#storage)
6. [Autenticación](#autenticacion)
7. [Checklist de Verificación](#checklist)

---

## 📁 Estructura del Proyecto en Supabase {#estructura}

Tu proyecto en Supabase debe tener esta estructura:

```
Tu Proyecto Supabase (jxvikpmfcpzyjjksmhnd)
│
├── 🔐 Authentication
│   └── Providers: Email (habilitado)
│
├── 🗄️ Database
│   ├── Tables
│   │   ├── profiles
│   │   └── kv_store_636f4a29
│   └── SQL Editor (ejecutar SQL_CREAR_TABLAS.sql)
│
├── 📦 Storage
│   └── Buckets
│       └── make-636f4a29-pdfs (private)
│
└── ⚡ Edge Functions
    └── server/
        ├── index.tsx
        ├── admin_routes.tsx
        └── kv_store.tsx
```

---

## ⚡ Edge Functions {#edge-functions}

### 1. Crear la función en Supabase Dashboard

**Pasos:**

1. Ve a **Edge Functions** en el dashboard
2. Click en **"New Function"**
3. Nombre: `server` (importante: debe ser exactamente "server")
4. Selecciona **TypeScript**

### 2. Copiar el código

**Archivo 1: `index.tsx`**
- Copiar todo el contenido de `/supabase/functions/server/index.tsx`
- Pegarlo en el editor de Supabase

**Archivo 2: `admin_routes.tsx`**
- Crear un nuevo archivo en la función llamado `admin_routes.tsx`
- Copiar el contenido de `/supabase/functions/server/admin_routes.tsx`

**Archivo 3: `kv_store.tsx`**
- Crear un nuevo archivo en la función llamado `kv_store.tsx`
- Copiar el contenido de `/supabase/functions/server/kv_store.tsx`

### 3. Configuración de la función

En el dashboard de Supabase, en la sección de **Edge Functions > server > Settings**:

```toml
[functions.server]
verify_jwt = false
```

**⚠️ IMPORTANTE:** El nombre debe ser `server`, no `make-server-636f4a29`

---

## 🔐 Variables de Entorno {#variables}

En **Edge Functions > server > Secrets**, configura estas variables:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `SUPABASE_URL` | `https://jxvikpmfcpzyjjksmhnd.supabase.co` | URL del proyecto |
| `SUPABASE_SERVICE_ROLE_KEY` | (desde Settings > API) | Clave de servicio |
| `SUPABASE_ANON_KEY` | (desde Settings > API) | Clave pública |
| `OPENAI_API_KEY` | `sk-...` | Tu API key de OpenAI |

### Cómo obtener las claves:

1. **SUPABASE_URL**: Settings > API > Project URL
2. **SUPABASE_SERVICE_ROLE_KEY**: Settings > API > service_role (secret)
3. **SUPABASE_ANON_KEY**: Settings > API > anon public

**⚠️ NUNCA** compartas la `SUPABASE_SERVICE_ROLE_KEY` públicamente.

---

## 🗄️ Base de Datos {#base-de-datos}

### 1. Ejecutar SQL

1. Ve a **SQL Editor** en Supabase Dashboard
2. Crea una nueva query
3. Copia y pega **TODO** el contenido de `SQL_CREAR_TABLAS.sql`
4. Click en **RUN**

### 2. Verificar tablas creadas

Deberías ver estas tablas en **Database > Tables**:

#### Tabla `profiles`
```sql
Columnas:
- id (UUID, PK)
- email (TEXT)
- name (TEXT)
- gender (TEXT, nullable)
- age (INTEGER, nullable)
- role (TEXT, default: 'disciple')
- leader_id (UUID, FK)
- leader_request_id (UUID, FK)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Tabla `kv_store_636f4a29`
```sql
Columnas:
- key (TEXT, PK)
- value (JSONB)
```

### 3. Verificar RLS (Row Level Security)

- La tabla `profiles` debe tener **RLS habilitado** ✅
- Debe tener 3 políticas creadas:
  1. "Users can view own profile"
  2. "Users can update own profile"
  3. "Service role has full access"

---

## 📦 Storage (Almacenamiento) {#storage}

### Crear bucket para PDFs

El backend creará automáticamente el bucket `make-636f4a29-pdfs` cuando subas el primer PDF desde el panel de admin.

**Si quieres crearlo manualmente:**

1. Ve a **Storage** en el dashboard
2. Click en **"New bucket"**
3. Nombre: `make-636f4a29-pdfs`
4. Acceso: **Private** (importante)
5. Click en **Create bucket**

---

## 🔐 Autenticación {#autenticacion}

### Configurar Email Provider

1. Ve a **Authentication > Providers**
2. Asegúrate que **Email** esté habilitado ✅
3. Configura:
   - **Enable Email provider**: ON
   - **Confirm email**: OFF (para desarrollo)
   - **Secure email change**: OFF (para desarrollo)

### Usuario Admin

Crear el usuario admin:

1. **Opción A - Desde la app:**
   - Email: cualquier email válido
   - Nombre: `ADMIN` (debe ser exactamente "ADMIN" en mayúsculas)
   - Contraseña: `30093009`
   - Registrarse normalmente

2. **Opción B - Desde Supabase Dashboard:**
   - Ve a **Authentication > Users**
   - Click en **Add user**
   - Email: tu email
   - Password: `30093009`
   - Luego actualiza en **Database > profiles**:
     - name: `ADMIN`
     - role: `admin`

---

## ✅ Checklist de Verificación {#checklist}

### Pre-despliegue

- [ ] **Edge Function "server" creada**
  - [ ] 3 archivos copiados (index.tsx, admin_routes.tsx, kv_store.tsx)
  - [ ] Función desplegada correctamente
  - [ ] Config: `verify_jwt = false`

- [ ] **Variables de entorno configuradas**
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] SUPABASE_ANON_KEY
  - [ ] OPENAI_API_KEY

- [ ] **Base de datos configurada**
  - [ ] SQL ejecutado sin errores
  - [ ] Tabla `profiles` existe
  - [ ] Tabla `kv_store_636f4a29` existe
  - [ ] RLS habilitado en `profiles`
  - [ ] 3 políticas creadas

- [ ] **Autenticación configurada**
  - [ ] Email provider habilitado
  - [ ] Confirm email: OFF

### Post-despliegue

- [ ] **Función accesible**
  - URL: `https://jxvikpmfcpzyjjksmhnd.supabase.co/functions/v1/server/auth/profile`
  - Debe responder (aunque sea con error 401 sin token)

- [ ] **Usuario admin creado**
  - Email válido registrado
  - Name: "ADMIN"
  - Role: "admin"
  - Password: "30093009"

- [ ] **OpenAI funcionando**
  - API key válida en variables de entorno
  - Prueba creando un check-in y generando plan

---

## 🔍 Verificar que todo funciona

### Test 1: Edge Function

Abre en el navegador:
```
https://jxvikpmfcpzyjjksmhnd.supabase.co/functions/v1/server/health
```

Debería responder:
```json
{"status": "ok", "message": "Server is running"}
```

### Test 2: Base de datos

En SQL Editor:
```sql
SELECT * FROM profiles LIMIT 1;
SELECT * FROM kv_store_636f4a29 LIMIT 1;
```

Ambos deben ejecutarse sin error (aunque estén vacíos).

### Test 3: Autenticación

Intenta registrarte en la app. Si funciona, todo está bien ✅

---

## 🚨 Problemas Comunes

### Error: "Route not found"

**Causa:** La función se desplegó con nombre incorrecto.

**Solución:**
1. Verifica en Edge Functions que se llame exactamente `server`
2. Si no, renombra o crea una nueva función con nombre `server`

### Error: "Failed to fetch"

**Causa:** La función no está desplegada o tiene errores.

**Solución:**
1. Ve a Edge Functions > server > Logs
2. Lee los errores
3. Verifica que todos los archivos estén copiados
4. Verifica las variables de entorno

### Error: "Unauthorized" o "JWT verification failed"

**Causa:** `verify_jwt = true` en la configuración.

**Solución:**
1. Cambia a `verify_jwt = false` en la configuración de la función
2. Redespliega la función

### Error: "Table does not exist"

**Causa:** El SQL no se ejecutó correctamente.

**Solución:**
1. Ve a SQL Editor
2. Copia y pega TODO el contenido de `SQL_CREAR_TABLAS.sql`
3. Ejecuta (RUN)
4. Verifica que no haya errores rojos

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs:**
   - Edge Functions > server > Logs
   - Database > Logs

2. **Usa el test HTML:**
   - Abre `test-endpoints.html` en el navegador
   - Prueba cada endpoint

3. **Verifica las variables:**
   - Settings > API
   - Edge Functions > server > Secrets

---

## 🎯 URL Final de la Función

Tu Edge Function debe estar accesible en:

```
https://jxvikpmfcpzyjjksmhnd.supabase.co/functions/v1/server
```

**Rutas de ejemplo:**
- `/auth/profile` → Obtener perfil del usuario
- `/checkins` → Obtener/crear check-ins
- `/library` → Biblioteca espiritual
- `/admin/files` → Archivos PDF del admin

---

## ✨ ¡Listo!

Si completaste todo el checklist, tu app debería funcionar perfectamente. 🎉

**Siguiente paso:** Abre la app y regístrate como usuario admin.
