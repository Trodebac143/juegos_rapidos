PARTIDA RÁPIDA V7
=================

Objetivo de esta versión:
- Mantener la app funcional en local si Supabase no está configurado.
- Dejar preparada la integración correcta con Supabase desde el inicio.
- Usuarios sin correo, pero con PIN de 4 cifras sin guardar en claro.
- Avatar e idioma guardados por jugador.
- Ranking real por juego cuando Supabase esté activado.
- Administración básica prevista desde Supabase.

ARCHIVOS IMPORTANTES
--------------------
index.html
styles.css
app.js
supabase-config.js
supabase-api.js
supabase_partida_rapida_v7.sql

PASOS PARA ACTIVAR SUPABASE
---------------------------
1. Crear proyecto en Supabase.
2. Abrir SQL Editor.
3. Ejecutar completo el archivo: supabase_partida_rapida_v7.sql
4. Abrir supabase-config.js.
5. Pegar:
   - Project URL
   - anon public key
6. Subir todos los archivos a GitHub Pages o probar en local.

GESTIÓN ADMINISTRATIVA INICIAL
------------------------------
Durante la fase inicial, la gestión administrativa se hace desde Supabase.

Puedes consultar la tabla:
- pr_players

Pero el PIN no se guarda visible. Se guarda como hash en:
- pin_hash

Por tanto, si un usuario olvida su PIN, no debes leerlo: debes restablecerlo.

Para convertir un usuario en administrador:

update pr_players
set is_admin = true
where username_norm = 'nombre_usuario';

Para desactivar un usuario directamente:

update pr_players
set is_active = false
where username_norm = 'nombre_usuario';

Para cambiar un PIN manualmente desde SQL, puedes usar:

update pr_players
set pin_hash = crypt('1234', gen_salt('bf', 8)),
    failed_attempts = 0,
    locked_until = null
where username_norm = 'nombre_usuario';

IMPORTANTE
----------
Esta versión NO usa Supabase Auth con correo.
La seguridad es moderada para una app sencilla, pero no es nivel bancario.
La mejora importante es que el PIN no queda guardado en claro y la app usa funciones RPC controladas.

SIGUIENTE PASO RECOMENDADO
--------------------------
V7.1: añadir un pequeño panel de administración dentro de la app solo para usuarios is_admin.
