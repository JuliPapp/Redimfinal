# 🏗️ Arquitectura de "Camino de Restauración"

## Diagrama de Flujo Completo

```
┌───────────────────────────────────────────────────────────────┐
│                    NAVEGADOR (Usuario)                         │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │           Figma Make App (React + Tailwind)             │  │
│  │                                                          │  │
│  │  • AuthScreen.tsx      (Login/Signup)                   │  │
│  │  • HomeScreen.tsx      (Dashboard)                      │  │
│  │  • CheckInScreen.tsx   (Check-ins)                      │  │
│  │  • AdminPanel.tsx      (Panel PDFs)                     │  │
│  │  • ... otros componentes                                 │  │
│  └─────────────┬───────────────────────────────────────────┘  │
└────────────────┼──────────────────────────────────────────────┘
                 │
                 │ fetch() con Authorization header
                 │
    ┌────────────▼──────────────────┐
    │  Supabase Auth                │
    │  /auth/v1/token               │
    │                               │
    │  • Valida email/password      │
    │  • Genera access_token        │
    │  • Gestiona sesiones          │
    └────────────┬──────────────────┘
                 │
                 │ access_token
                 │
    ┌────────────▼──────────────────────────────────────────┐
    │  Edge Function (Deno + Hono)                          │
    │  make-server-636f4a29                                 │
    │  /supabase/functions/server/index.tsx                 │
    │                                                        │
    │  Rutas:                                                │
    │  • GET  /health                                        │
    │  • GET  /auth/profile                                  │
    │  • POST /auth/signup                                   │
    │  • POST /checkins                                      │
    │  • POST /checkin/start-conversation                    │
    │  • POST /admin/upload-pdf                              │
    │  • ... 50+ rutas más                                   │
    └────────────┬──────────────────────────────────────────┘
                 │
                 │ Consultas SQL
                 │
    ┌────────────▼──────────────────┐      ┌──────────────────┐
    │  PostgreSQL Database          │      │  OpenAI API      │
    │  (Supabase)                   │◄─────┤                  │
    │                               │      │  • gpt-4         │
    │  • kv_store_636f4a29         │      │  • Análisis      │
    │    (Tabla principal)          │      │  • Planes        │
    │                               │      │  • Vectores      │
    └───────────────────────────────┘      └──────────────────┘
```

---

## 🔄 Flujo de Login (Paso a Paso)

### 1️⃣ Usuario hace login

**Archivo:** `/components/AuthScreen.tsx` (línea 90)

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@test.com',
  password: '30093009'
});
```

**Request:**
```
POST https://jxvikpmfcpzyjjksmhnd.supabase.co/auth/v1/token
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "30093009"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "user": { "id": "...", "email": "admin@test.com" }
}
```

---

### 2️⃣ Cliente obtiene el perfil del usuario

**Archivo:** `/components/AuthScreen.tsx` (línea 117)

```typescript
const response = await fetch(API_URLS.profile(), {
  headers: {
    'Authorization': `Bearer ${data.session.access_token}`
  }
});
```

**Request:**
```
GET https://jxvikpmfcpzyjjksmhnd.supabase.co/functions/v1/make-server-636f4a29/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 3️⃣ Edge Function valida el token

**Archivo:** `/supabase/functions/server/index.tsx` (línea 151)

```typescript
app.get('/auth/profile', async (c) => {
  try {
    const user = await verifyUser(c.req.header('Authorization'));
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const profile = await getUserProfile(user.id);
    return c.json({ profile });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});
```

**¿Qué hace `verifyUser`?**
```typescript
async function verifyUser(authHeader: string) {
  const token = authHeader?.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getUser(token);
  return data.user;
}
```

---

### 4️⃣ Servidor consulta la base de datos

**Archivo:** `/supabase/functions/server/index.tsx` (línea 158)

```typescript
const profile = await getUserProfile(user.id);
```

**¿Qué hace `getUserProfile`?**
```typescript
async function getUserProfile(userId: string) {
  const value = await kv.get(`user:${userId}:profile`);
  return value || { id: userId, email: '...', role: 'disciple' };
}
```

**SQL ejecutado:**
```sql
SELECT value FROM kv_store_636f4a29 
WHERE key = 'user:abc123:profile';
```

---

### 5️⃣ Respuesta final al cliente

**Response:**
```json
{
  "profile": {
    "id": "abc-123-def-456",
    "email": "admin@test.com",
    "name": "ADMIN",
    "role": "admin",
    "gender": "masculino",
    "age": 30,
    "leader_id": null
  }
}
```

**Archivo:** `/components/AuthScreen.tsx` (línea 168)

```typescript
onAuthSuccess(data.user, profileData.profile, isSpecialAdmin);
```

**Cliente muestra el dashboard** ✅

---

## 🔴 PROBLEMA ACTUAL

### ❌ Código VIEJO en Supabase

El código desplegado en Supabase tiene las rutas con prefijo duplicado:

```typescript
// ❌ CÓDIGO VIEJO (Supabase actual)
app.get('/make-server-636f4a29/auth/profile', async (c) => { ... });
```

Por eso cuando el cliente llama a:
```
GET /make-server-636f4a29/auth/profile
```

El servidor espera:
```
GET /make-server-636f4a29/make-server-636f4a29/auth/profile
```

**Resultado:** Error 404 "Route not found"

---

### ✅ Código CORRECTO (Figma Make)

```typescript
// ✅ CÓDIGO CORRECTO (/supabase/functions/server/index.tsx)
app.get('/auth/profile', async (c) => { ... });
```

El servidor correctamente maneja:
```
GET /make-server-636f4a29/auth/profile
```

**Resultado:** Perfil cargado correctamente ✅

---

## 📊 Estado Actual de los Componentes

| Componente | Estado | Ubicación |
|------------|--------|-----------|
| **Supabase Client** | ✅ Correcto | `/utils/supabase/client.ts` |
| **API Helper** | ✅ Correcto | `/utils/api.ts` |
| **AuthScreen** | ✅ Correcto | `/components/AuthScreen.tsx` |
| **Código del Servidor** | ✅ Correcto | `/supabase/functions/server/index.tsx` |
| **Código Desplegado** | ❌ Viejo | `make-server-636f4a29` en Supabase |

---

## 🚀 Solución

**No hay cambios de código necesarios.**

Solo necesitas copiar el archivo correcto de Figma Make a Supabase:

1. Copiar: `/supabase/functions/server/index.tsx` (Figma Make)
2. Pegar en: `make-server-636f4a29` (Supabase Dashboard)
3. Deploy
4. Verificar: `/health` debe responder `{"status":"ok"}`

---

## 🔧 Tecnologías Utilizadas

### Frontend (Figma Make)
- **React 18** - Framework UI
- **Tailwind CSS v4** - Estilos
- **Supabase JS Client** - Autenticación y base de datos
- **ShadCN UI** - Componentes
- **Lucide React** - Iconos

### Backend (Edge Function)
- **Deno** - Runtime JavaScript/TypeScript
- **Hono** - Framework web minimalista
- **Supabase JS** - Cliente para base de datos
- **OpenAI SDK** - Integración con GPT-4

### Infraestructura
- **Supabase Auth** - Autenticación
- **Supabase PostgreSQL** - Base de datos
- **Supabase Edge Functions** - Serverless functions
- **Supabase Storage** - Almacenamiento de PDFs

---

## 📝 Variables de Entorno

El Edge Function usa estas variables (auto-configuradas por Supabase):

```bash
SUPABASE_URL=https://jxvikpmfcpzyjjksmhnd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=*** (secret)
SUPABASE_ANON_KEY=eyJhbGci...
OPENAI_API_KEY=sk-*** (configurada)
```

---

## 🔍 Debugging

### Ver logs del Edge Function:

1. Abre: https://supabase.com/dashboard/project/jxvikpmfcpzyjjksmhnd/functions
2. Clic en: `make-server-636f4a29`
3. Tab: "Logs"
4. Verás los console.log() del servidor

### Ver logs del cliente:

1. Abre DevTools: `F12`
2. Tab: "Console"
3. Verás los logs de `AuthScreen.tsx`

### Ejemplo de logs correctos:

```
📡 Fetching profile from: https://...make-server-636f4a29/auth/profile
📡 Profile response status: 200
✅ Profile loaded: admin@test.com admin
✅ Iniciando sesión como LÍDER
📋 Rol: admin
```

### Ejemplo de logs con error:

```
📡 Fetching profile from: https://...make-server-636f4a29/auth/profile
📡 Profile response status: 404
❌ Profile fetch failed: {error: 'Route not found', path: '/make-server-636f4a29/auth/profile'}
Login error: Error: 🚨 URGENTE: El código en Supabase es VIEJO
```

---

## ✅ Checklist de Verificación

- [ ] `/utils/supabase/client.ts` se conecta a Supabase
- [ ] Login con Supabase Auth funciona
- [ ] Access token se obtiene correctamente
- [ ] Request a `/auth/profile` se hace con token
- [ ] `/health` responde `{"status":"ok"}`
- [ ] Login completo funciona sin error 404

---

¿Necesitas más información? Lee [`SOLUCION_FINAL.md`](./SOLUCION_FINAL.md)
