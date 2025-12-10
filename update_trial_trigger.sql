-- Actualizar la función handle_new_user para asignar automáticamente el periodo de prueba
-- Ejecuta este script en el Editor SQL de Supabase

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    nombre,
    tipo,
    subscription_status,
    plan_type,
    trial_start_date,
    trial_end_date,
    updated_at
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email), -- Usa el email como nombre si no hay nombre
    COALESCE(new.raw_user_meta_data ->> 'user_type', 'usuario'),
    'trial',          -- Estado inicial: trial
    'pro',            -- Plan inicial: pro
    NOW(),            -- Inicio del trial: ahora
    NOW() + INTERVAL '30 days', -- Fin del trial: en 30 días
    NOW()
  );
  RETURN new;
END;
$$;
