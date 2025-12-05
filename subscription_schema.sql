-- 1. Agregar columnas de suscripción a la tabla profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS trial_start_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS trial_end_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'free';

-- 2. (Opcional) Agregar validación para los estados de suscripción
ALTER TABLE public.profiles
ADD CONSTRAINT check_subscription_status 
CHECK (subscription_status IN ('trial', 'active', 'inactive', 'cancelled'));

-- 3. Crear un índice para mejorar el rendimiento de las consultas por estado
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles(subscription_status);

-- Comentario:
-- Estas consultas asumen que la tabla 'profiles' ya existe (creada por el trigger de autenticación habitual en Supabase).
-- Si no existe, avísame y te doy el script completo de creación de la tabla.
