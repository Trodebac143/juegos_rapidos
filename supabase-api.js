// Partida Rápida - capa de acceso a Supabase mediante funciones RPC.
// No se leen ni escriben tablas directamente desde la app.
(function(){
  let client = null;

  function enabled(){
    const cfg = window.PARTIDA_RAPIDA_SUPABASE || {};
    return Boolean(cfg.url && cfg.anonKey && window.supabase);
  }

  function getClient(){
    if(!enabled()) return null;
    if(!client){
      client = window.supabase.createClient(window.PARTIDA_RAPIDA_SUPABASE.url, window.PARTIDA_RAPIDA_SUPABASE.anonKey);
    }
    return client;
  }

  function first(data){
    return Array.isArray(data) ? data[0] : data;
  }

  async function rpc(name, args){
    const sb = getClient();
    if(!sb) throw new Error('Supabase no está configurado.');
    const { data, error } = await sb.rpc(name, args || {});
    if(error) throw error;
    return data;
  }

  function normalizePlayer(row){
    if(!row) return null;
    return {
      id: row.player_id,
      sessionToken: row.session_token,
      user: row.username,
      avatar: row.avatar_code,
      lang: row.language,
      isAdmin: row.is_admin === true,
      streak: 0
    };
  }

  async function registerPlayer(username, pin, avatar, language){
    const row = first(await rpc('pr_register_player', {
      p_username: username,
      p_pin: pin,
      p_avatar_code: avatar,
      p_language: language
    }));
    return { ok: row?.ok === true, message: row?.message || '', player: normalizePlayer(row) };
  }

  async function loginPlayer(username, pin){
    const row = first(await rpc('pr_login_player', { p_username: username, p_pin: pin }));
    return { ok: row?.ok === true, message: row?.message || '', player: normalizePlayer(row) };
  }

  async function setLanguage(sessionToken, language){
    return first(await rpc('pr_set_language', { p_session_token: sessionToken, p_language: language }));
  }

  async function recordScore(sessionToken, game, points, result, mode, detail){
    return first(await rpc('pr_record_score', {
      p_session_token: sessionToken,
      p_game: game,
      p_points: points,
      p_result: result || '',
      p_mode: mode || 'cpu',
      p_detail: detail || ''
    }));
  }

  async function getRanking(game, scope){
    return await rpc('pr_get_ranking', { p_game: game, p_scope: scope || 'weekly', p_limit: 10 });
  }

  async function getMyStats(sessionToken){
    return first(await rpc('pr_get_my_stats', { p_session_token: sessionToken }));
  }

  async function adminListPlayers(sessionToken){
    return await rpc('pr_admin_list_players', { p_admin_session_token: sessionToken });
  }

  async function adminResetPin(sessionToken, playerId, newPin){
    return first(await rpc('pr_admin_reset_pin', {
      p_admin_session_token: sessionToken,
      p_player_id: playerId,
      p_new_pin: newPin
    }));
  }

  async function adminSetActive(sessionToken, playerId, active){
    return first(await rpc('pr_admin_set_active', {
      p_admin_session_token: sessionToken,
      p_player_id: playerId,
      p_is_active: active
    }));
  }


  async function createRoom(sessionToken, game){
    return first(await rpc('pr_create_room', { p_session_token: sessionToken, p_game: game }));
  }

  async function joinRoom(sessionToken, code, game){
    return first(await rpc('pr_join_room', { p_session_token: sessionToken, p_code: code, p_game: game }));
  }

  async function getRoom(sessionToken, code){
    return first(await rpc('pr_get_room', { p_session_token: sessionToken, p_code: code }));
  }

  async function updateRoomState(sessionToken, code, state, status){
    return first(await rpc('pr_update_room_state', { p_session_token: sessionToken, p_code: code, p_state: state || {}, p_status: status || null }));
  }

  window.PartidaRapidaSupabase = {
    enabled,
    registerPlayer,
    loginPlayer,
    setLanguage,
    recordScore,
    getRanking,
    getMyStats,
    adminListPlayers,
    adminResetPin,
    adminSetActive,
    createRoom,
    joinRoom,
    getRoom,
    updateRoomState
  };
})();
