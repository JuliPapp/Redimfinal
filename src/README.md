# Camino de Restauración - Setup

## Configuración de la Edge Function en Supabase

### 1. Crear la Tabla KV

Ve al SQL Editor en Supabase y ejecuta:

```sql
CREATE TABLE IF NOT EXISTS public.kv_store_636f4a29 (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.kv_store_636f4a29 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can do everything" 
ON public.kv_store_636f4a29
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
```

### 2. Desplegar la Edge Function

1. Ve a **Edge Functions** en el dashboard de Supabase
2. Crea una nueva función con el nombre: `make-server-636f4a29`
3. Copia el código del archivo `/supabase/functions/make-server-636f4a29/index.ts`
4. Pégalo en el editor de Supabase
5. Despliega la función

### 3. Verificar el Despliegue

Abre esta URL en tu navegador:
```
https://jxvikpmfcpzyjjksmhnd.supabase.co/functions/v1/make-server-636f4a29/health
```

Deberías ver:
```json
{
  "success": true,
  "message": "🚀 Edge Function is running!",
  ...
}
```

## Configuración del Admin

**Email:** admin@admin.com  
**Nombre:** ADMIN  
**Password:** 30093009

## Estructura del Proyecto

- `/supabase/functions/make-server-636f4a29/index.ts` - Edge Function principal (LA QUE SE DESPLIEGA)
- `/supabase/functions/server/` - Código de referencia/desarrollo (NO se despliega)
- `/utils/api.ts` - URLs y helpers del API
- `/components/` - Componentes React de la aplicación

## Notas Importantes

- La Edge Function se llama `make-server-636f4a29` (NO `cb33f25a`)
- La tabla KV se llama `kv_store_636f4a29`
- El archivo en `/supabase/functions/server/index.tsx` es solo para referencia
- La API de OpenAI ya está configurada con la variable de entorno `OPENAI_API_KEY`
