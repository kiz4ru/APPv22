-- Helper function to get user's role from user_profiles table
create or replace function public.get_my_role()
returns text
language sql
security definer
stable
as $$
  select role from public.user_profiles where id = auth.uid();
$$;

-- Tabla de perfiles de usuario mejorada para BETAv2
create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  last_name text not null, -- nombres y apellidos
  email text unique, -- para búsquedas rápidas y relaciones
  phone text unique, -- opcional, para verificación o contacto
  birthdate date, -- mejor que solo edad
  age int, -- puedes calcularla desde birthdate si quieres
  gender text, -- para filtros y matching
  country text, -- país de residencia
  city text, -- ciudad de residencia
  bio text, -- breve descripción del usuario 
  role text default 'user', -- 'user', 'admin', 'moderator', etc.
  is_verified boolean default false, -- para control de verificación
  is_active boolean default true, -- para desactivar cuentas
  onboarding_completed boolean default false, -- para saber si terminó el registro inicial
  last_login timestamp with time zone, -- última vez que accedió
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  deleted_at timestamp with time zone -- para soft delete
);

-- Índices útiles para búsquedas
create index idx_user_profiles_email on public.user_profiles(email);
create index idx_user_profiles_phone on public.user_profiles(phone);
create index idx_user_profiles_country on public.user_profiles(country);
create index idx_user_profiles_city on public.user_profiles(city);
create index idx_user_profiles_is_active on public.user_profiles(is_active);

-- Habilitar RLS
alter table public.user_profiles enable row level security;

-- Puedes añadir policies aquí según tu lógica de acceso.
-- Solo el usuario puede ver/modificar su perfil

create policy "Usuarios pueden ver su perfil"
  on public.user_profiles
  for select
  using (auth.uid() = id);

create policy "Usuarios pueden modificar su perfil"
  on public.user_profiles
  for update
  using (auth.uid() = id);

-- Policy para que los admins puedan ver todos los perfiles
create policy "Admins pueden ver todos los perfiles"
  on public.user_profiles
  for SELECT
  using (public.get_my_role() = 'admin');

-- Policy para que los admins puedan modificar todos los perfiles
create policy "Admins pueden modificar todos los perfiles"
  on public.user_profiles
  for UPDATE
  using (public.get_my_role() = 'admin');

-- Policy para que los admins puedan borrar cualquier perfil
create policy "Admins pueden borrar cualquier perfil"
  on public.user_profiles
  for delete
  using (public.get_my_role() = 'admin');

-- Los usuario puede ver los perfiles de otros usuarios
create policy "Usuarios pueden ver perfiles de otros usuarios"
  on public.user_profiles
  for select
  using (auth.uid() != id AND is_active = true);

-- Policy para que los usuarios puedan borrar (soft delete) su propio perfil
create policy "Usuarios pueden borrar (soft delete) su propio perfil"
  on public.user_profiles
  for delete
  using (auth.uid() = id);

-- (Opcional) Policy para que los admins puedan ver/modificar todos los perfiles
-- using (auth.role() = 'authenticated' AND (auth.uid() = id OR role = 'admin'))

--Añade restricciones CHECK para validar edad mínima, formato de email, etc.
alter table public.user_profiles
  add constraint chk_age_min CHECK (age >= 18);

---Agrega un trigger para actualizar automáticamente el campo updated_at en cada modificación de perfil:
create or replace function update_updated_at_column()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

create trigger trg_update_user_profiles_updated_at
before update on public.user_profiles
for each row execute function update_updated_at_column();

-- Agrega un trigger para calcular la edad automáticamente desde la fecha de nacimiento
create or replace function update_age_from_birthdate()
returns trigger as $$
begin
  -- Para INSERT, o si birthdate cambia en UPDATE
  if TG_OP = 'INSERT' or (TG_OP = 'UPDATE' and NEW.birthdate is distinct from OLD.birthdate) then
    if NEW.birthdate is not null then
      NEW.age := date_part('year', age(NEW.birthdate));
    else
      NEW.age := null; -- Si birthdate se vuelve null, age también
    end if;
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger trg_update_age_from_birthdate
before insert or update on public.user_profiles
for each row execute function update_age_from_birthdate();

-- Si quieres que al hacer un DELETE se marque el campo deleted_at en vez de borrar realmente el registro:
create or replace function public.handle_soft_delete_user_profile()
returns trigger as $$
begin
  -- Actualizar la fila para marcarla como eliminada, desactivarla y anonimizar datos sensibles
  update public.user_profiles
  set
    deleted_at = timezone('utc'::text, now()),
    is_active = false,
    -- Anonimizar email y teléfono para permitir re-registro y mantener unicidad
    email = OLD.id || '_' || OLD.email,
    phone = CASE WHEN OLD.phone IS NOT NULL THEN OLD.id || '_' || OLD.phone ELSE NULL END
  where id = OLD.id;

  -- Cancelar la operación DELETE original
  return NULL;
end;
$$ language plpgsql security definer;

-- Primero, eliminamos el trigger antiguo si existe con el nombre anterior por si acaso
DROP TRIGGER IF EXISTS trg_soft_delete_user_profile ON public.user_profiles;

create trigger trg_handle_soft_delete_user_profile
before delete on public.user_profiles
for each row execute procedure public.handle_soft_delete_user_profile();

-- Tabla de fotos de usuario
-- Mejorada para BETAv2
create table public.user_photos (
  id serial primary key,
  user_id uuid references public.user_profiles(id) on delete cascade,
  url text not null,
  is_main boolean default false, -- para marcar la foto principal
  order_index int default 0,     -- para ordenar las fotos
  is_approved boolean default false, -- para fotos que necesitan aprobación
  is_visible boolean default true, -- para mostrar/ocultar fotos
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create index idx_user_photos_user_id on public.user_photos(user_id);

--TRIGGER trigger para máximo 4 fotos:
create or replace function check_max_photos()
returns trigger as $$
begin
  -- Contar las fotos existentes para el usuario ANTES de la inserción actual
  if (select count(*) from public.user_photos where user_id = NEW.user_id) >= 4 then
    raise exception 'No puedes subir más de 4 fotos. Límite máximo: 4.';
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger trg_check_max_photos
before insert on public.user_photos
for each row execute function check_max_photos();

-- Policies RLS recomendadas para user_photos
alter table public.user_photos enable row level security;

-- Policy para ver solo tus fotos
create policy "Usuarios pueden ver sus fotos"
  on public.user_photos
  for select
  using (auth.uid() = user_id);

-- Policy para insertar solo tus fotos
create policy "Usuarios pueden subir sus fotos"
  on public.user_photos
  for insert
  with check (auth.uid() = user_id);

-- Policy para actualizar solo tus fotos
create policy "Usuarios pueden actualizar sus fotos"
  on public.user_photos
  for update
  using (auth.uid() = user_id);

-- Policy para borrar solo tus fotos
create policy "Usuarios pueden borrar sus fotos"
  on public.user_photos
  for delete
  using (auth.uid() = user_id);

-- Tabla de preferencias de usuario
create table public.user_preferences (
  id serial primary key,
  user_id uuid references public.user_profiles(id) on delete cascade,
  is_smoker boolean default false,         -- ¿Fumador?
  has_pets boolean default false,          -- ¿Tiene mascotas?
  notifications_enabled boolean default true, -- ¿Recibe notificaciones?
  language text,                           -- Idioma preferido
  preferred_country text,                  -- País preferido para buscar
  preferred_city text,                     -- Ciudad preferida para buscar
  min_age int,                             -- Edad mínima de búsqueda
  max_age int,                             -- Edad máxima de búsqueda
  gender_preference text,                  -- Preferencia de género para matching
  show_only_verified boolean default false, -- Solo mostrar usuarios verificados
  show_only_active boolean default true,   -- Solo mostrar usuarios activos
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create unique index idx_user_preferences_user_id on public.user_preferences(user_id);

-- Policies RLS para user_preferences
alter table public.user_preferences enable row level security;

create policy "Usuarios pueden ver sus preferencias"
  on public.user_preferences
  for select
  using (auth.uid() = user_id);

create policy "Usuarios pueden modificar sus preferencias"
  on public.user_preferences
  for update
  using (auth.uid() = user_id);

create policy "Usuarios pueden crear sus preferencias"
  on public.user_preferences
  for insert
  with check (auth.uid() = user_id);

create policy "Usuarios pueden borrar sus preferencias"
  on public.user_preferences
  for delete
  using (auth.uid() = user_id);


