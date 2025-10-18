-- ============================================
-- CAMINO DE RESTAURACIÓN - Base de Datos
-- ============================================
-- Ejecuta este SQL en Supabase SQL Editor
-- https://supabase.com/dashboard/project/jxvikpmfcpzyjjksmhnd/sql
-- ============================================

-- ============================================
-- TABLA KV STORE
-- ============================================
-- Almacena check-ins, reuniones, configuraciones, etc.
-- en formato clave-valor con JSON

CREATE TABLE IF NOT EXISTS kv_store_636f4a29 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

-- Índice para búsquedas rápidas por clave
CREATE INDEX IF NOT EXISTS kv_store_636f4a29_key_idx ON kv_store_636f4a29(key);

-- ============================================
-- TABLA PROFILES
-- ============================================
-- Perfiles de usuarios (discípulos, líderes, admin)

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  gender TEXT,
  age INTEGER,
  role TEXT NOT NULL DEFAULT 'disciple',
  leader_id UUID REFERENCES profiles(id),
  leader_request_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_leader_id_idx ON profiles(leader_id);
CREATE INDEX IF NOT EXISTS profiles_leader_request_id_idx ON profiles(leader_request_id);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Controla quién puede ver/modificar qué datos

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden ver su propio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Los usuarios pueden actualizar su propio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Service role (backend) tiene acceso completo
-- Esto es necesario para que el backend funcione
DROP POLICY IF EXISTS "Service role has full access" ON profiles;
CREATE POLICY "Service role has full access" ON profiles
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- ✅ LISTO!
-- ============================================
-- Ahora puedes usar la app normalmente
-- ============================================
