-- Partida Rápida V7 - Supabase bien planteado desde el inicio
-- Objetivo: usuarios sin correo, PIN de 4 cifras sin guardar en claro, avatares, idioma, ranking y administración básica.
-- Ejecutar completo en Supabase > SQL Editor.

create extension if not exists pgcrypto;

-- Limpieza segura para reinstalar durante pruebas.
drop function if exists pr_admin_set_active(uuid, uuid, boolean);
drop function if exists pr_admin_reset_pin(uuid, uuid, text);
drop function if exists pr_admin_list_players(uuid);
drop function if exists pr_get_my_stats(uuid);
drop function if exists pr_get_ranking(text, text, integer);
drop function if exists pr_record_score(uuid, text, integer, text, text, text);
drop function if exists pr_set_language(uuid, text);
drop function if exists pr_login_player(text, text);
drop function if exists pr_register_player(text, text, text, text);
drop function if exists pr_require_player(uuid);
drop function if exists pr_username_norm(text);

drop table if exists pr_scores cascade;
drop table if exists pr_sessions cascade;
drop table if exists pr_players cascade;
drop table if exists pr_blocked_words cascade;

create table pr_blocked_words (
  word text primary key
);

insert into pr_blocked_words(word) values
('puta'),('puto'),('mierda'),('gilipollas'),('cabron'),('cabrón'),('coño'),('joder'),('maricon'),('maricón'),('subnormal'),('imbecil'),('imbécil'),('polla'),('zorra'),('fuck'),('shit'),('bitch'),('asshole')
on conflict do nothing;

create table pr_players (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  username_norm text not null unique,
  pin_hash text not null,
  avatar_code text not null,
  language text not null default 'es' check (language in ('es','va')),
  is_admin boolean not null default false,
  is_active boolean not null default true,
  failed_attempts integer not null default 0,
  locked_until timestamptz,
  total_points integer not null default 0,
  created_at timestamptz not null default now(),
  last_login timestamptz
);

create table pr_sessions (
  token uuid primary key default gen_random_uuid(),
  player_id uuid not null references pr_players(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '30 days'
);

create table pr_scores (
  id bigserial primary key,
  player_id uuid not null references pr_players(id) on delete cascade,
  game text not null check (game in ('pong','snake','tictac','connect4','memory','parchis')),
  points integer not null check (points >= 0 and points <= 999999),
  result text not null default '' check (result in ('','win','loss','draw','score')),
  mode text not null default 'cpu' check (mode in ('cpu','room','solo')),
  detail text,
  created_at timestamptz not null default now()
);

create index pr_scores_game_created_idx on pr_scores(game, created_at desc);
create index pr_scores_player_idx on pr_scores(player_id);
create index pr_sessions_player_idx on pr_sessions(player_id);

create or replace function pr_username_norm(p_username text)
returns text
language sql
immutable
as $$
  select lower(trim(coalesce(p_username,'')))
$$;

create or replace function pr_require_player(p_session_token uuid)
returns pr_players
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player pr_players;
begin
  select p.* into v_player
  from pr_sessions s
  join pr_players p on p.id = s.player_id
  where s.token = p_session_token
    and s.expires_at > now()
    and p.is_active = true;

  if not found then
    raise exception 'Sesión no válida o caducada';
  end if;

  return v_player;
end;
$$;

create or replace function pr_register_player(
  p_username text,
  p_pin text,
  p_avatar_code text,
  p_language text default 'es'
)
returns table(
  ok boolean,
  message text,
  session_token uuid,
  player_id uuid,
  username text,
  avatar_code text,
  language text,
  is_admin boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_username text := trim(coalesce(p_username,''));
  v_norm text := pr_username_norm(p_username);
  v_player pr_players;
  v_token uuid;
  v_word text;
begin
  if v_username !~ '^[A-Za-z0-9_ÁÉÍÓÚÜÑáéíóúüñ-]{3,18}$' then
    return query select false, 'Usuario no válido. Usa 3 a 18 caracteres, sin espacios.', null::uuid, null::uuid, null::text, null::text, null::text, false;
    return;
  end if;

  if p_pin !~ '^[0-9]{4}$' then
    return query select false, 'El PIN debe tener exactamente 4 cifras.', null::uuid, null::uuid, null::text, null::text, null::text, false;
    return;
  end if;

  if coalesce(p_avatar_code,'') = '' or p_avatar_code = '🤖' then
    return query select false, 'Avatar no permitido.', null::uuid, null::uuid, null::text, null::text, null::text, false;
    return;
  end if;

  if coalesce(p_language,'es') not in ('es','va') then
    return query select false, 'Idioma no válido.', null::uuid, null::uuid, null::text, null::text, null::text, false;
    return;
  end if;

  select word into v_word
  from pr_blocked_words
  where v_norm like '%' || lower(word) || '%'
  limit 1;

  if v_word is not null then
    return query select false, 'Ese nombre de usuario no está permitido.', null::uuid, null::uuid, null::text, null::text, null::text, false;
    return;
  end if;

  insert into pr_players(username, username_norm, pin_hash, avatar_code, language)
  values (v_username, v_norm, crypt(p_pin, gen_salt('bf', 8)), p_avatar_code, p_language)
  returning * into v_player;

  insert into pr_sessions(player_id) values (v_player.id) returning token into v_token;

  return query select true, 'Jugador creado correctamente.', v_token, v_player.id, v_player.username, v_player.avatar_code, v_player.language, v_player.is_admin;
exception
  when unique_violation then
    return query select false, 'Ese usuario ya existe. Elige otro.', null::uuid, null::uuid, null::text, null::text, null::text, false;
end;
$$;

create or replace function pr_login_player(p_username text, p_pin text)
returns table(
  ok boolean,
  message text,
  session_token uuid,
  player_id uuid,
  username text,
  avatar_code text,
  language text,
  is_admin boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_norm text := pr_username_norm(p_username);
  v_player pr_players;
  v_token uuid;
begin
  select * into v_player from pr_players where username_norm = v_norm;

  if not found then
    return query select false, 'Usuario o PIN incorrectos.', null::uuid, null::uuid, null::text, null::text, null::text, false;
    return;
  end if;

  if v_player.is_active = false then
    return query select false, 'Usuario desactivado.', null::uuid, null::uuid, null::text, null::text, null::text, false;
    return;
  end if;

  if v_player.locked_until is not null and v_player.locked_until > now() then
    return query select false, 'Usuario bloqueado temporalmente por varios intentos fallidos.', null::uuid, null::uuid, null::text, null::text, null::text, false;
    return;
  end if;

  if v_player.pin_hash <> crypt(p_pin, v_player.pin_hash) then
    update pr_players
    set failed_attempts = failed_attempts + 1,
        locked_until = case when failed_attempts + 1 >= 5 then now() + interval '15 minutes' else locked_until end
    where id = v_player.id;

    return query select false, 'Usuario o PIN incorrectos.', null::uuid, null::uuid, null::text, null::text, null::text, false;
    return;
  end if;

  update pr_players
  set failed_attempts = 0,
      locked_until = null,
      last_login = now()
  where id = v_player.id
  returning * into v_player;

  insert into pr_sessions(player_id) values (v_player.id) returning token into v_token;

  return query select true, 'Entrada correcta.', v_token, v_player.id, v_player.username, v_player.avatar_code, v_player.language, v_player.is_admin;
end;
$$;

create or replace function pr_set_language(p_session_token uuid, p_language text)
returns table(ok boolean, message text, language text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player pr_players;
begin
  v_player := pr_require_player(p_session_token);
  if p_language not in ('es','va') then
    return query select false, 'Idioma no válido.', v_player.language;
    return;
  end if;

  update pr_players set language = p_language where id = v_player.id;
  return query select true, 'Idioma actualizado.', p_language;
end;
$$;

create or replace function pr_record_score(
  p_session_token uuid,
  p_game text,
  p_points integer,
  p_result text default '',
  p_mode text default 'cpu',
  p_detail text default ''
)
returns table(ok boolean, message text, score_id bigint)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player pr_players;
  v_score_id bigint;
begin
  v_player := pr_require_player(p_session_token);

  if p_game not in ('pong','snake','tictac','connect4','memory','parchis') then
    return query select false, 'Juego no válido.', null::bigint;
    return;
  end if;

  if p_result not in ('','win','loss','draw','score') then p_result := ''; end if;
  if p_mode not in ('cpu','room','solo') then p_mode := 'cpu'; end if;

  insert into pr_scores(player_id, game, points, result, mode, detail)
  values (v_player.id, p_game, greatest(0, least(coalesce(p_points,0), 999999)), p_result, p_mode, left(coalesce(p_detail,''), 120))
  returning id into v_score_id;

  update pr_players
  set total_points = total_points + greatest(0, least(coalesce(p_points,0), 999999))
  where id = v_player.id;

  return query select true, 'Puntuación guardada.', v_score_id;
end;
$$;

create or replace function pr_get_ranking(p_game text, p_scope text default 'weekly', p_limit integer default 10)
returns table(
  username text,
  avatar_code text,
  points integer,
  result text,
  mode text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select p.username, p.avatar_code, s.points, s.result, s.mode, s.created_at
  from pr_scores s
  join pr_players p on p.id = s.player_id
  where p.is_active = true
    and s.game = p_game
    and (p_scope <> 'weekly' or s.created_at >= now() - interval '7 days')
  order by s.points desc, s.created_at asc
  limit greatest(1, least(coalesce(p_limit,10), 50));
$$;

create or replace function pr_get_my_stats(p_session_token uuid)
returns table(total_games integer, total_points integer, best_game text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player pr_players;
begin
  v_player := pr_require_player(p_session_token);
  return query
  with by_game as (
    select game, sum(points)::integer as pts
    from pr_scores
    where player_id = v_player.id
    group by game
    order by pts desc
    limit 1
  )
  select
    (select count(*)::integer from pr_scores where player_id = v_player.id),
    coalesce((select sum(points)::integer from pr_scores where player_id = v_player.id), 0),
    (select game from by_game);
end;
$$;

create or replace function pr_admin_list_players(p_admin_session_token uuid)
returns table(
  player_id uuid,
  username text,
  avatar_code text,
  language text,
  is_admin boolean,
  is_active boolean,
  total_points integer,
  created_at timestamptz,
  last_login timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin pr_players;
begin
  v_admin := pr_require_player(p_admin_session_token);
  if v_admin.is_admin = false then
    raise exception 'No autorizado';
  end if;

  return query
  select id, username, avatar_code, language, is_admin, is_active, total_points, created_at, last_login
  from pr_players
  order by created_at desc;
end;
$$;

create or replace function pr_admin_reset_pin(p_admin_session_token uuid, p_player_id uuid, p_new_pin text)
returns table(ok boolean, message text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin pr_players;
begin
  v_admin := pr_require_player(p_admin_session_token);
  if v_admin.is_admin = false then raise exception 'No autorizado'; end if;
  if p_new_pin !~ '^[0-9]{4}$' then
    return query select false, 'El nuevo PIN debe tener 4 cifras.';
    return;
  end if;

  update pr_players
  set pin_hash = crypt(p_new_pin, gen_salt('bf', 8)), failed_attempts = 0, locked_until = null
  where id = p_player_id;

  return query select true, 'PIN restablecido.';
end;
$$;

create or replace function pr_admin_set_active(p_admin_session_token uuid, p_player_id uuid, p_is_active boolean)
returns table(ok boolean, message text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin pr_players;
begin
  v_admin := pr_require_player(p_admin_session_token);
  if v_admin.is_admin = false then raise exception 'No autorizado'; end if;

  update pr_players set is_active = p_is_active where id = p_player_id;
  return query select true, case when p_is_active then 'Usuario activado.' else 'Usuario desactivado.' end;
end;
$$;

-- RLS activado. La app no opera directamente sobre tablas: usa funciones RPC controladas.
alter table pr_players enable row level security;
alter table pr_sessions enable row level security;
alter table pr_scores enable row level security;
alter table pr_blocked_words enable row level security;

revoke all on table pr_players from anon, authenticated;
revoke all on table pr_sessions from anon, authenticated;
revoke all on table pr_scores from anon, authenticated;
revoke all on table pr_blocked_words from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant execute on function pr_register_player(text,text,text,text) to anon, authenticated;
grant execute on function pr_login_player(text,text) to anon, authenticated;
grant execute on function pr_set_language(uuid,text) to anon, authenticated;
grant execute on function pr_record_score(uuid,text,integer,text,text,text) to anon, authenticated;
grant execute on function pr_get_ranking(text,text,integer) to anon, authenticated;
grant execute on function pr_get_my_stats(uuid) to anon, authenticated;
grant execute on function pr_admin_list_players(uuid) to anon, authenticated;
grant execute on function pr_admin_reset_pin(uuid,uuid,text) to anon, authenticated;
grant execute on function pr_admin_set_active(uuid,uuid,boolean) to anon, authenticated;

-- Crea tu primer administrador manualmente después de crear su usuario en la app:
-- update pr_players set is_admin = true where username_norm = 'tu_usuario';
