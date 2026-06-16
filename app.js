const STORAGE_USERS = 'partida_rapida_users_v7';
const STORAGE_SESSION = 'partida_rapida_session_v7';
const STORAGE_SCORES = 'partida_rapida_scores_v7';
const STORAGE_ROOMS = 'partida_rapida_rooms_v7';
const STORAGE_ACHIEVEMENTS = 'partida_rapida_achievements_v7';
const STORAGE_SETTINGS = 'partida_rapida_settings_v7';

const CPU_AVATAR = '🤖';
const avatars = ['🙂','😎','👾','🐍','🎮','🏓','⭐','🏆','🦊','🐱','🐵','🧩'];
let selectedAvatar = avatars[0];
const badWords = ['puta','puto','mierda','gilipollas','cabron','cabrón','coño','joder','maricon','maricón','subnormal','imbecil','imbécil','polla','zorra','fuck','shit','bitch','asshole'];
const games = [
  { id:'pong', name:{es:'Pong',va:'Pong'}, icon:'PONG', art:'pong-art', desc:{es:'Reflejos contra CPU. La CPU mejora, pero también puede fallar.',va:'Reflexos contra CPU. La CPU millora, però també pot fallar.'}, active:true, modes:['cpu','room','join'], help:{es:'Pong suma puntos por aguantar en juego, golpear la pelota y marcar. La dificultad sube con el tiempo.',va:'Pong suma punts per aguantar en joc, colpejar la pilota i marcar. La dificultat puja amb el temps.'} },
  { id:'snake', name:{es:'Serpiente',va:'Serp'}, icon:'🐍🍎', art:'snake-art', desc:{es:'Come manzanas, crece y aguanta cada vez con más velocidad.',va:'Menja pomes, creix i aguanta cada vegada amb més velocitat.'}, active:true, modes:['cpu'], help:{es:'Serpiente suma por tiempo y por manzanas. La velocidad aumenta progresivamente.',va:'Serp suma per temps i per pomes. La velocitat augmenta progressivament.'} },
  { id:'tictac', name:{es:'Tres en raya',va:'Tres en ratlla'}, icon:'❌⭕', art:'tictac-art', desc:{es:'El clásico de siempre contra una CPU que mejora por rondas.',va:'El clàssic de sempre contra una CPU que millora per rondes.'}, active:true, modes:['cpu','room','join'], help:{es:'Tres en raya puntúa por victoria, empate y rapidez. La CPU empieza fallona y mejora con cada ronda.',va:'Tres en ratlla puntua per victòria, empat i rapidesa. La CPU comença fallona i millora amb cada ronda.'} },
  { id:'connect4', name:{es:'Cuatro en raya',va:'Quatre en ratlla'}, icon:'🔴🟡', art:'connect-art', desc:{es:'Conecta cuatro fichas antes que tu rival.',va:'Connecta quatre fitxes abans que el teu rival.'}, active:false, modes:[], help:{es:'Ranking pendiente.',va:'Rànquing pendent.'} },
  { id:'memory', name:{es:'Memory',va:'Memory'}, icon:'⭐❔', art:'memory-art', desc:{es:'Encuentra parejas y suma puntos.',va:'Troba parelles i suma punts.'}, active:false, modes:[], help:{es:'Ranking pendiente.',va:'Rànquing pendent.'} },
  { id:'parchis', name:{es:'Parchís',va:'Parxís'}, icon:'🎲', art:'parchis-art', desc:{es:'Partidas por sala para hasta 4 jugadores.',va:'Partides per sala per a fins a 4 jugadors.'}, active:false, modes:[], help:{es:'Ranking pendiente.',va:'Rànquing pendent.'} }
];
const achievements = [
  { id:'first_game', name:{es:'Primera partida',va:'Primera partida'}, desc:{es:'Juega tu primera partida.',va:'Juga la teua primera partida.'} },
  { id:'pong_win', name:{es:'Golpe maestro',va:'Colp mestre'}, desc:{es:'Gana una partida de Pong contra la CPU.',va:'Guanya una partida de Pong contra la CPU.'} },
  { id:'snake_60', name:{es:'Un minuto vivo',va:'Un minut viu'}, desc:{es:'Aguanta 60 segundos en Serpiente.',va:'Aguanta 60 segons en Serp.'} },
  { id:'tic_win', name:{es:'Tres en raya',va:'Tres en ratlla'}, desc:{es:'Gana una ronda de Tres en raya.',va:'Guanya una ronda de Tres en ratlla.'} },
  { id:'room_created', name:{es:'Anfitrión',va:'Amfitrió'}, desc:{es:'Crea tu primera sala.',va:'Crea la teua primera sala.'} },
  { id:'room_joined', name:{es:'Invitado',va:'Convidat'}, desc:{es:'Únete a una sala con código.',va:'Unix-te a una sala amb codi.'} },
  { id:'streak_3', name:{es:'Racha de 3',va:'Ratxa de 3'}, desc:{es:'Consigue tres resultados positivos seguidos.',va:'Aconseguix tres resultats positius seguits.'} }
];

const $ = (id) => document.getElementById(id);
const screens = { auth:$('authScreen'), home:$('homeScreen'), pong:$('pongScreen'), snake:$('snakeScreen'), tictac:$('tictacScreen') };
let currentUser = null;
let activeRanking = 'pong';
let rankingScope = 'weekly';
let audioCtx = null;
let soundEnabled = getJson(STORAGE_SETTINGS, { sound:false }).sound === true;
let pong = null;
let snake = null;
let tic = null;

let uiLang = 'es';
let pendingModalAction = null;

function cloudEnabled(){
  return Boolean(window.PartidaRapidaSupabase && window.PartidaRapidaSupabase.enabled());
}
function normalizeCloudPlayer(player){
  if(!player) return null;
  return {
    id: player.id,
    sessionToken: player.sessionToken,
    user: player.user,
    avatar: player.avatar || avatars[0],
    lang: player.lang || 'es',
    isAdmin: player.isAdmin === true,
    streak: 0
  };
}
function cloudSessionToken(){ return currentUser?.sessionToken || currentUser?.session_token || null; }
const i18n = {
  es:{
    loginTab:'Entrar', registerTab:'Nuevo jugador', user:'Usuario', newUser:'Nuevo usuario', pin:'Contraseña', lang:'Idioma', langToggle:'CAS/VAL', enter:'Entrar', createPlayer:'Crear jugador', chooseAvatar:'Elige tu avatar', authHint:'Si ya tienes jugador, entra con tu usuario y PIN de 4 cifras.', registerHint:'El PIN se guarda protegido en Supabase y no se muestra en claro.', brandOverline:'Juegos de siempre', brandText:'Entra, elige un juego clásico y echa una partida corta en cualquier momento.', badge1:'Sin instalación', badge2:'PIN de 4 cifras', badge3:'Ranking', mainScreen:'Pantalla principal', hello:'Hola', logout:'Salir', heroTitle:'¿Echamos una partida?', heroText:'Pong, Serpiente y Tres en raya están activos. En breve más juegos…', quickPlay:'🎮 Jugar ahora', sound:'Sonido', off:'OFF', on:'ON', player:'Jugador', games:'Juegos disponibles', quickGames:'Partidas rápidas', rankingByGame:'Ranking por juego', top10:'Top 10', weekly:'Semanal', all:'Histórico', achievements:'Logros', gamesCount:'Partidas', points:'Puntos', bestGame:'Mejor juego', streak:'Racha', level:'Nivel', novice:'Novato', fan:'Aficionado', fast:'Rápido', master:'Maestro', legend:'Leyenda', cpu:'CPU', playCpu:'Jugar contra CPU', createRoom:'Crear sala', enterCode:'Introducir código', roomCode:'Código de sala', enterRoom:'Entrar en sala', coming:'🔒 Próximamente', soon:'En breve más juegos…', noGames:'Sin partidas', thisWeek:'Esta semana', historical:'Histórico', scoreSystem:'Sistema de puntos', rankingPending:'Ranking pendiente.', pongOver:'Pong contra CPU', pongTitle:'{player} vs CPU', pause:'Pausa', back:'Volver', difficulty:'Dificultad', fail:'FALLO', point:'PUNTO', paused:'PAUSA', snakeOver:'Serpiente', snakeTitle:'Come, crece y aguanta', restart:'Reiniciar', speed:'Velocidad', length:'Longitud', pongHint:'PC: ratón o teclas ↑ ↓. Móvil: botones inferiores o tocar la pantalla.', snakeHint:'PC: flechas. Móvil: botones. La velocidad aumenta cuanto más aguantas.', ticOver:'Tres en raya contra CPU', ticTitle:'Jugador ❌ vs CPU ⭕', newRound:'Nueva ronda', rounds:'Rondas', yourTurn:'Te toca. Elige una casilla.', cpuThinking:'Piensa la CPU...', ticHint:'La CPU mejora con las rondas, pero en niveles bajos también puede fallar.', result:'Resultado', accept:'Aceptar', newGame:'Partida nueva', menu:'Salir al menú principal', lostMaster:'Has perdido. Se te asignan 2 puntos de consolación.', wonMaster:'Has ganado. ¡Enhorabuena!', totalSaved:'Total guardado: {points} puntos.', roomCreated:'Sala creada por {user}. Comparte este código:', copy:'Copiar', share:'Compartir', roomReal:'La sala real online se conectará con Supabase Realtime en la siguiente fase.', roomNotFound:'Sala no encontrada', roomNotFoundText:'Comprueba el código. En esta versión la sala queda simulada localmente.', ownCode:'Código propio', ownCodeText:'Has introducido el código de tu propia sala. Pásaselo a otro usuario.', playerJoined:'Jugador unido', playerJoinedText:'Te has unido a la sala {code}. La partida online real se conectará después.', codeCopied:'Código copiado', inviteCopied:'Invitación copiada', roomInvite:'Únete a mi sala de {game} en Partida Rápida. Código: {code}', invalidLogin:'Usuario o contraseña incorrectos.', userExists:'Ese usuario ya existe. Elige otro.', userLength:'El usuario debe tener entre 3 y 18 caracteres.', userChars:'Usa solo letras, números, guion o guion bajo. Sin espacios.', userBad:'Ese nombre de usuario no está permitido.', pinBad:'La contraseña debe ser un número de 4 cifras.', unlocked:'Logro desbloqueado', consolationDetail:'Consolación', winDetail:'Victoria', draw:'Empate', drawText:'Empate. Se guarda la puntuación y puedes jugar otra ronda.', cpuAvatar:'Avatar exclusivo de la CPU'
  },
  va:{
    loginTab:'Entrar', registerTab:'Nou jugador', user:'Usuari', newUser:'Nou usuari', pin:'Contrasenya', lang:'Idioma', langToggle:'CAS/VAL', enter:'Entrar', createPlayer:'Crear jugador', chooseAvatar:'Tria el teu avatar', authHint:'Si ja tens jugador, entra amb el teu usuari i PIN de 4 xifres.', registerHint:'El PIN es guarda protegit en Supabase i no es mostra en clar.', brandOverline:'Jocs de sempre', brandText:'Entra, tria un joc clàssic i juga una partida curta en qualsevol moment.', badge1:'Sense instal·lació', badge2:'PIN de 4 xifres', badge3:'Rànquing', mainScreen:'Pantalla principal', hello:'Hola', logout:'Eixir', heroTitle:'Fem una partida?', heroText:'Pong, Serp i Tres en ratlla estan actius. En breu més jocs…', quickPlay:'🎮 Jugar ara', sound:'So', off:'OFF', on:'ON', player:'Jugador', games:'Jocs disponibles', quickGames:'Partides ràpides', rankingByGame:'Rànquing per joc', top10:'Top 10', weekly:'Setmanal', all:'Històric', achievements:'Assoliments', gamesCount:'Partides', points:'Punts', bestGame:'Millor joc', streak:'Ratxa', level:'Nivell', novice:'Novell', fan:'Aficionat', fast:'Ràpid', master:'Mestre', legend:'Llegenda', cpu:'CPU', playCpu:'Jugar contra CPU', createRoom:'Crear sala', enterCode:'Introduir codi', roomCode:'Codi de sala', enterRoom:'Entrar en sala', coming:'🔒 Pròximament', soon:'En breu més jocs…', noGames:'Sense partides', thisWeek:'Esta setmana', historical:'Històric', scoreSystem:'Sistema de punts', rankingPending:'Rànquing pendent.', pongOver:'Pong contra CPU', pongTitle:'{player} contra CPU', pause:'Pausa', back:'Tornar', difficulty:'Dificultat', fail:'FALLADA', point:'PUNT', paused:'PAUSA', snakeOver:'Serp', snakeTitle:'Menja, creix i aguanta', restart:'Reiniciar', speed:'Velocitat', length:'Longitud', pongHint:'PC: ratolí o tecles ↑ ↓. Mòbil: botons inferiors o tocar la pantalla.', snakeHint:'PC: fletxes. Mòbil: botons. La velocitat augmenta com més aguantes.', ticOver:'Tres en ratlla contra CPU', ticTitle:'Jugador ❌ contra CPU ⭕', newRound:'Nova ronda', rounds:'Rondes', yourTurn:'Et toca. Tria una casella.', cpuThinking:'La CPU pensa...', ticHint:'La CPU millora amb les rondes, però en nivells baixos també pot fallar.', result:'Resultat', accept:'Acceptar', newGame:'Partida nova', menu:'Eixir al menú principal', lostMaster:'Has perdut. Se t’assignen 2 punts de consolació.', wonMaster:'Has guanyat. Enhorabona!', totalSaved:'Total guardat: {points} punts.', roomCreated:'Sala creada per {user}. Compartix este codi:', copy:'Copiar', share:'Compartir', roomReal:'La sala real en línia es connectarà amb Supabase Realtime en la fase següent.', roomNotFound:'Sala no trobada', roomNotFoundText:'Comprova el codi. En esta versió la sala queda simulada localment.', ownCode:'Codi propi', ownCodeText:'Has introduït el codi de la teua pròpia sala. Passa-li’l a un altre usuari.', playerJoined:'Jugador unit', playerJoinedText:'T’has unit a la sala {code}. La partida en línia real es connectarà després.', codeCopied:'Codi copiat', inviteCopied:'Invitació copiada', roomInvite:'Unix-te a la meua sala de {game} en Partida Rápida. Codi: {code}', invalidLogin:'Usuari o contrasenya incorrectes.', userExists:'Eixe usuari ja existix. Tria’n un altre.', userLength:'L’usuari ha de tindre entre 3 i 18 caràcters.', userChars:'Usa només lletres, números, guionet o guionet baix. Sense espais.', userBad:'Eixe nom d’usuari no està permés.', pinBad:'La contrasenya ha de ser un número de 4 xifres.', unlocked:'Assoliment desbloquejat', consolationDetail:'Consolació', winDetail:'Victòria', draw:'Empat', drawText:'Empat. Es guarda la puntuació i pots jugar una altra ronda.', cpuAvatar:'Avatar exclusiu de la CPU'
  }
};
function t(key, vars={}){ let txt=(i18n[uiLang]&&i18n[uiLang][key]) || i18n.es[key] || key; Object.entries(vars).forEach(([k,v])=>{ txt=txt.replaceAll(`{${k}}`, v); }); return txt; }
function currentLang(){ return currentUser?.lang || uiLang || 'es'; }
function setLang(lang){
  uiLang = lang === 'va' ? 'va' : 'es';
  document.documentElement.lang = uiLang === 'va' ? 'ca-valencia' : 'es';
  if(!currentUser){ const settings=getJson(STORAGE_SETTINGS, {}); settings.lang=uiLang; setJson(STORAGE_SETTINGS, settings); }
  const rl=$('registerLang'); if(rl) rl.value=uiLang;
  const ll=$('loginLang'); if(ll) ll.value=uiLang;
  applyI18n();
  if(screens.home && screens.home.classList.contains('active')){ renderGames(); renderRanking(); renderAchievements(); renderProfile(); }
  updateGameLabels();
}
function persistCurrentUserLanguage(){
  if(!currentUser) return;
  currentUser.lang = uiLang;
  const users=getJson(STORAGE_USERS, []);
  const idx=users.findIndex(u=>u.user===currentUser.user);
  if(idx>=0){ users[idx]={...users[idx], lang:uiLang}; setJson(STORAGE_USERS, users); }
  setJson(STORAGE_SESSION, currentUser);
  if(cloudEnabled() && cloudSessionToken()){
    window.PartidaRapidaSupabase.setLanguage(cloudSessionToken(), uiLang).catch(console.warn);
  }
}
function toggleLanguage(){
  setLang(uiLang === 'es' ? 'va' : 'es');
  persistCurrentUserLanguage();
}
function localize(value){ return typeof value === 'object' ? (value[uiLang] || value.es || '') : value; }
function applyI18n(){
  const pairs={loginTab:'loginTab',registerTab:'registerTab',helloText:'hello',authUserLabel:'user',authPinLabel:'pin',loginLangLabel:'lang',registerUserLabel:'newUser',registerPinLabel:'pin',registerLangLabel:'lang',loginSubmit:'enter',registerSubmit:'createPlayer',chooseAvatarLabel:'chooseAvatar',authHint:'authHint',registerHint:'registerHint',brandOverline:'brandOverline',brandText:'brandText',badgeInstall:'badge1',badgePin:'badge2',badgeRanking:'badge3',topOverline:'mainScreen',logoutBtn:'logout',heroTitle:'heroTitle',heroText:'heroText',quickPlayBtn:'quickPlay',gamesPanelTitle:'games',gamesPanelPill:'quickGames',rankingTitle:'rankingByGame',rankingPill:'top10',weeklyRankBtn:'weekly',allRankBtn:'all',achievementsTitle:'achievements',profileSmallPlayer:'player',profileSmallGames:'gamesCount',profileSmallPoints:'points',profileSmallBest:'bestGame',profileSmallStreak:'streak',pausePongBtn:'pause',restartSnakeBtn:'restart',restartTicBtn:'newRound',scoreHelpLabel:'scoreSystem',pongOverline:'pongOver',pongHint:'pongHint',pongPlayerSmall:'player',pongCpuSmall:'cpu',pongDifficultyLabel:'difficulty',snakeOverline:'snakeOver',snakeTitle:'snakeTitle',ticOverline:'ticOver',ticTitle:'ticTitle',snakeHint:'snakeHint',snakePointsSmall:'points',snakeSpeedLabel:'speed',snakeLengthSmall:'length',ticHint:'ticHint',ticPointsSmall:'points',ticDifficultyLabel:'difficulty',ticRoundsSmall:'rounds',modalOk:'accept',modalNewGame:'newGame',modalMenu:'menu'};
  for(const [id,key] of Object.entries(pairs)){ const el=$(id); if(el) el.textContent=t(key); }
  document.querySelectorAll('.backHome').forEach(b=>b.textContent=t('back'));
  document.querySelectorAll('.lang-toggle').forEach(b=>b.textContent=t('langToggle'));
  updateSoundButton();
}

function getJson(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function setJson(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
function nowIso(){ return new Date().toISOString(); }
function weekAgoTime(){ return Date.now() - 7*24*60*60*1000; }
function isWeekly(score){ return score.createdAt ? new Date(score.createdAt).getTime() >= weekAgoTime() : false; }
function gameName(gameId){ const g=games.find(g=>g.id===gameId); return g ? localize(g.name) : gameId; }
function avatarFor(user){ if(!user) return avatars[0]; return user.avatar || avatars[0]; }
function currentAchievementIds(){ const all=getJson(STORAGE_ACHIEVEMENTS, {}); return all[currentUser?.user] || []; }
function setCurrentAchievementIds(ids){ const all=getJson(STORAGE_ACHIEVEMENTS, {}); if(currentUser) all[currentUser.user]=ids; setJson(STORAGE_ACHIEVEMENTS, all); }
function normalizeUserName(name){ return name.trim().toLowerCase(); }
function stripAccents(s){ return s.normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
function validateUserName(name){
  const clean = normalizeUserName(name);
  if(clean.length < 3 || clean.length > 18) return t('userLength');
  if(!/^[a-z0-9_áéíóúñü-]+$/i.test(clean)) return t('userChars');
  const compact = stripAccents(clean);
  if(badWords.some(w => compact.includes(stripAccents(w)))) return t('userBad');
  return '';
}
function validatePin(pin){ return /^\d{4}$/.test(pin) ? '' : t('pinBad'); }
function showMessage(text, type='error'){ const box = $('authMessage'); box.textContent = text; box.className = `message ${type}`; }
function escapeHtml(str){ return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
function switchScreen(name){ Object.values(screens).forEach(s => s.classList.remove('active')); screens[name].classList.add('active'); }
function switchTab(tab){ const login = tab === 'login'; $('loginTab').classList.toggle('active', login); $('registerTab').classList.toggle('active', !login); $('loginForm').classList.toggle('active', login); $('registerForm').classList.toggle('active', !login); showMessage('', 'ok'); }

function renderAvatarPicker(){
  const grid = $('avatarGrid');
  grid.innerHTML = '';
  avatars.forEach(avatar => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `avatar-option ${avatar === selectedAvatar ? 'selected' : ''}`;
    btn.textContent = avatar;
    btn.setAttribute('aria-label', `Avatar ${avatar}`);
    btn.addEventListener('click', () => { selectedAvatar = avatar; renderAvatarPicker(); });
    grid.appendChild(btn);
  });
}
function setVisibleAvatars(){
  const av = avatarFor(currentUser);
  ['topAvatar','heroAvatar','profileAvatar','pongAvatar','snakeAvatar','ticAvatar'].forEach(id => { const el=$(id); if(el) el.textContent = av; });
}
function seedDemoRanking(){
  if(getJson(STORAGE_SCORES, []).length) return;
  setJson(STORAGE_SCORES, [
    {game:'pong', user:'GameMaster', avatar:'👾', points:340, detail:'Demo', createdAt:nowIso()},
    {game:'pong', user:'RetroPlayer', avatar:'😎', points:270, detail:'Demo', createdAt:nowIso()},
    {game:'snake', user:'SnakeLover', avatar:'🐍', points:420, detail:'Demo', createdAt:nowIso()},
    {game:'snake', user:'MetroPlayer', avatar:'🎮', points:260, detail:'Demo', createdAt:nowIso()},
    {game:'tictac', user:'TresRaya', avatar:'⭐', points:180, detail:'Demo', createdAt:nowIso()}
  ]);
}
function renderGames(){
  const list = $('gamesList'); list.innerHTML = '';
  games.forEach(g => {
    const card = document.createElement('article');
    card.className = `game-card ${g.active ? '' : 'disabled'}`;
    const name = localize(g.name);
    const desc = localize(g.desc);
    card.innerHTML = `<div class="game-art ${g.art}">${gameArt(g)}<strong>${name}</strong></div><div class="game-info"><h4>${name}</h4><p>${desc}</p><div class="game-actions">${gameButtons(g)}</div><div id="roomBox-${g.id}" class="room-box hidden"></div><div id="joinBox-${g.id}" class="room-box hidden"><label>${t('roomCode')}<input id="joinCode-${g.id}" maxlength="6" placeholder="Ej. A7K2Q" /></label><button class="primary-btn small" type="button" data-action="join-confirm" data-game="${g.id}">${t('enterRoom')}</button></div></div>`;
    list.appendChild(card);
  });
}
function gameArt(g){
  if(g.id==='pong') return '<span class="paddle left"></span><span class="net"></span><span class="ball"></span><span class="paddle right"></span>';
  return `<span>${g.icon}</span>`;
}
function gameButtons(g){
  if(!g.active) return `<span class="pill">${t('coming')}</span>`;
  const cpu = `<button class="primary-btn" type="button" data-action="cpu" data-game="${g.id}">${t('playCpu')}</button>`;
  const room = g.modes.includes('room') ? `<button class="secondary-btn" type="button" data-action="room" data-game="${g.id}">${t('createRoom')}</button>` : '';
  const join = g.modes.includes('join') ? `<button class="secondary-btn" type="button" data-action="join" data-game="${g.id}">${t('enterCode')}</button>` : '';
  return cpu + room + join;
}
function renderRankingTabs(){
  const tabs = $('rankingTabs'); tabs.innerHTML = '';
  games.filter(g => g.active).forEach(g => {
    const btn = document.createElement('button');
    btn.className = `ranking-tab ${activeRanking===g.id?'active':''}`;
    btn.type = 'button';
    btn.textContent = localize(g.name);
    btn.addEventListener('click', () => { activeRanking = g.id; renderRanking(); });
    tabs.appendChild(btn);
  });
}
async function renderRanking(){
  renderRankingTabs();
  const selected = games.find(g => g.id === activeRanking);
  $('scoreHelpText').textContent = selected?.help ? localize(selected.help) : t('rankingPending');
  $('weeklyRankBtn').classList.toggle('active', rankingScope === 'weekly');
  $('allRankBtn').classList.toggle('active', rankingScope === 'all');

  let scores;
  if(cloudEnabled()){
    try{
      const rows = await window.PartidaRapidaSupabase.getRanking(activeRanking, rankingScope);
      scores = rows.map(r => ({ user:r.username, avatar:r.avatar_code, points:r.points, createdAt:r.created_at, result:r.result }));
    } catch(err){
      console.warn('No se pudo cargar ranking de Supabase. Se usa ranking local.', err);
      scores = null;
    }
  }

  if(!scores){
    scores = getJson(STORAGE_SCORES, []).filter(s => s.game === activeRanking);
    if(rankingScope === 'weekly') scores = scores.filter(isWeekly);
    scores = scores.sort((a,b) => b.points - a.points).slice(0,10);
  }

  const list = $('rankingList'); list.innerHTML = '';
  if(!scores.length){ list.innerHTML = `<li><span class="rank">-</span><strong>${t('noGames')}</strong><small>${rankingScope==='weekly'?t('thisWeek'):t('historical')}</small></li>`; return; }
  scores.forEach((score,index) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="rank">${index+1}</span><strong>${escapeHtml(score.avatar || '🙂')} ${escapeHtml(score.user)}</strong><small>${score.points} ${t('points').toLowerCase()}</small>`;
    list.appendChild(li);
  });
}
function saveScore(game, points, detail, meta={}){
  const rounded = Math.max(0, Math.round(points));
  const scores = getJson(STORAGE_SCORES, []);
  scores.push({ game, user:currentUser.user, avatar:avatarFor(currentUser), points:rounded, detail, createdAt:nowIso(), result:meta.result || '' });
  setJson(STORAGE_SCORES, scores);

  if(cloudEnabled() && cloudSessionToken()){
    window.PartidaRapidaSupabase.recordScore(cloudSessionToken(), game, rounded, meta.result || '', meta.mode || 'cpu', detail || '')
      .then(()=>renderRanking())
      .catch(err => console.warn('No se pudo guardar puntuación en Supabase.', err));
  }

  updateStreak(meta.result);
  awardAchievement('first_game');
  if(game==='pong' && meta.result==='win') awardAchievement('pong_win');
  if(game==='snake' && meta.elapsed >= 60) awardAchievement('snake_60');
  if(game==='tictac' && meta.result==='win') awardAchievement('tic_win');
  activeRanking = game;
  renderRanking(); renderProfile(); renderAchievements();
}
async function login(userName, pin){
  const clean = normalizeUserName(userName);
  const pinError = validatePin(pin); if(pinError) return showMessage(pinError);

  if(cloudEnabled()){
    try{
      const result = await window.PartidaRapidaSupabase.loginPlayer(clean, pin);
      if(!result.ok || !result.player) return showMessage(result.message || t('invalidLogin'));
      currentUser = normalizeCloudPlayer(result.player);
      setJson(STORAGE_SESSION, currentUser);
      setLang(currentUser.lang || 'es');
      enterHome();
      return;
    } catch(err){
      console.warn('Error de login Supabase:', err);
      return showMessage('No se pudo conectar con Supabase. Revisa la configuración.');
    }
  }

  const users = getJson(STORAGE_USERS, []);
  const user = users.find(u => u.user === clean && u.pin === pin);
  if(!user) return showMessage(t('invalidLogin'));
  if(!user.avatar || user.avatar === CPU_AVATAR) user.avatar = avatars[0];
  const idx=users.findIndex(u=>u.user===user.user); if(idx>=0){ users[idx]=user; setJson(STORAGE_USERS, users); }
  currentUser = user; setJson(STORAGE_SESSION, user); setLang(user.lang); enterHome();
}
async function register(userName, pin){
  const clean = normalizeUserName(userName);
  const userError = validateUserName(clean); if(userError) return showMessage(userError);
  const pinError = validatePin(pin); if(pinError) return showMessage(pinError);
  const lang = $('registerLang')?.value || uiLang || 'es';
  const avatar = selectedAvatar === CPU_AVATAR ? avatars[0] : selectedAvatar;

  if(cloudEnabled()){
    try{
      const result = await window.PartidaRapidaSupabase.registerPlayer(clean, pin, avatar, lang);
      if(!result.ok || !result.player) return showMessage(result.message || t('userExists'));
      currentUser = normalizeCloudPlayer(result.player);
      setJson(STORAGE_SESSION, currentUser);
      setLang(currentUser.lang || lang);
      enterHome();
      return;
    } catch(err){
      console.warn('Error de registro Supabase:', err);
      return showMessage('No se pudo crear el jugador en Supabase. Revisa la configuración.');
    }
  }

  const users = getJson(STORAGE_USERS, []);
  if(users.some(u => u.user === clean)) return showMessage(t('userExists'));
  const user = { user:clean, pin, avatar, lang, streak:0, createdAt:nowIso() };
  users.push(user); setJson(STORAGE_USERS, users); currentUser = user; setJson(STORAGE_SESSION, user); setLang(user.lang); enterHome();
}
function enterHome(){
  stopAllGames();
  $('currentUserName').textContent = currentUser.user;
  $('playerLabel').textContent = currentUser.user;
  setLang(currentUser.lang || uiLang);
  setVisibleAvatars();
  renderGames(); renderRanking(); renderProfile(); renderAchievements(); updateSoundButton(); updateGameLabels(); switchScreen('home');
}
function logout(){ currentUser = null; localStorage.removeItem(STORAGE_SESSION); stopAllGames(); switchScreen('auth'); }
function randomCode(){ const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let code=''; for(let i=0;i<5;i++) code += alphabet[Math.floor(Math.random()*alphabet.length)]; return code; }
function createRoom(gameId){
  const code = randomCode();
  const rooms = getJson(STORAGE_ROOMS, []);
  rooms.push({code, game:gameId, host:currentUser.user, avatar:avatarFor(currentUser), status:'waiting', createdAt:nowIso()});
  setJson(STORAGE_ROOMS, rooms); awardAchievement('room_created');
  const box = $(`roomBox-${gameId}`);
  box.innerHTML = `<p>${t('roomCreated',{user:escapeHtml(currentUser.user)})}</p><div class="copy-row"><input id="generatedCode-${gameId}" readonly value="${code}" /><button class="mini-btn" type="button" data-action="copy" data-game="${gameId}">${t('copy')}</button><button class="mini-btn" type="button" data-action="share" data-game="${gameId}">${t('share')}</button></div><p class="hint">${t('roomReal')}</p>`;
  box.classList.remove('hidden'); const joinBox=$(`joinBox-${gameId}`); if(joinBox) joinBox.classList.add('hidden'); renderAchievements();
}
function joinRoom(gameId){
  const code = $(`joinCode-${gameId}`).value.trim().toUpperCase();
  const rooms = getJson(STORAGE_ROOMS, []);
  const room = rooms.find(r => r.code === code && r.game === gameId);
  if(!room) return showModal(t('roomNotFound'), t('roomNotFoundText'));
  if(room.host === currentUser.user) return showModal(t('ownCode'), t('ownCodeText'));
  room.guest = currentUser.user; room.guestAvatar = avatarFor(currentUser); room.status = 'ready'; setJson(STORAGE_ROOMS, rooms);
  awardAchievement('room_joined'); renderAchievements(); showModal(t('playerJoined'), t('playerJoinedText',{code}));
}
function showModal(title,text){
  pendingModalAction = null;
  $('modalTitle').textContent = title; $('modalText').textContent = text;
  $('modalOk').classList.remove('hidden'); $('modalNewGame').classList.add('hidden'); $('modalMenu').classList.add('hidden');
  $('modal').classList.remove('hidden');
}
function showResultModal(title, text, gameId){
  pendingModalAction = gameId;
  $('modalTitle').textContent = title; $('modalText').textContent = text;
  $('modalOk').classList.add('hidden'); $('modalNewGame').classList.remove('hidden'); $('modalMenu').classList.remove('hidden');
  $('modal').classList.remove('hidden');
}
function closeModal(){ $('modal').classList.add('hidden'); pendingModalAction = null; }
function modalNewGame(){ const gameId=pendingModalAction; closeModal(); if(gameId) startGame(gameId); }
function modalMenu(){ closeModal(); stopAllGames(); enterHome(); }
function updateGameLabels(){
  const set=(id,txt)=>{const el=$(id); if(el) el.textContent=txt;};
  set('pongLevelLabel', t('difficulty')); set('pongCpuSmall', t('cpu')); set('pongPlayerSmall', t('player'));
  set('snakeLevelLabel', t('speed')); set('snakeLengthLabel', t('length')); set('snakeScoreSmall', t('points'));
  set('ticLevelLabel', t('difficulty')); set('ticRoundsLabel', t('rounds')); set('ticPointsSmall', t('points'));
  const title=$('pongTitle'); if(title) title.textContent = t('pongTitle',{player:currentUser?.user || t('player')});
}
function startGame(gameId){ if(gameId==='pong') startPong(); if(gameId==='snake') startSnake(); if(gameId==='tictac') startTicTac(); }
function stopAllGames(){ stopPong(); stopSnake(); stopTicTac(); }
function flash(id, text){
  const el = $(id); el.textContent = text; el.classList.remove('hidden'); void el.offsetWidth; el.classList.add('hidden');
  setTimeout(()=>el.classList.remove('hidden'), 10); setTimeout(()=>el.classList.add('hidden'), 620);
  const wrap = el.closest('.canvas-wrap'); if(wrap){ wrap.classList.remove('shake'); void wrap.offsetWidth; wrap.classList.add('shake'); setTimeout(()=>wrap.classList.remove('shake'), 360); }
  playSound('fail');
}
function playSound(type='point'){
  if(!soundEnabled) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc=audioCtx.createOscillator(); const gain=audioCtx.createGain();
    const map={point:620,fail:150,win:820,food:520,click:360};
    osc.frequency.value=map[type] || 420; osc.type=type==='fail'?'sawtooth':'sine';
    gain.gain.setValueAtTime(0.055,audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.16);
    osc.connect(gain); gain.connect(audioCtx.destination); osc.start(); osc.stop(audioCtx.currentTime+0.18);
  }catch{}
}
function updateSoundButton(){ const btn=$('soundToggleBtn'); if(btn) btn.textContent = `${t('sound')}: ${soundEnabled ? t('on') : t('off')}`; }
function toggleSound(){ soundEnabled=!soundEnabled; setJson(STORAGE_SETTINGS,{sound:soundEnabled}); updateSoundButton(); playSound('click'); }

// PONG
function startPong(){ stopAllGames(); setVisibleAvatars(); switchScreen('pong'); initPong(); }
function initPong(){
  const canvas=$('pongCanvas'), ctx=canvas.getContext('2d');
  pong={canvas,ctx,running:true,paused:false,keys:{up:false,down:false},player:{x:26,y:160,w:12,h:92,score:0},cpu:{x:canvas.width-38,y:160,w:12,h:92,score:0,miss:0},ball:{x:canvas.width/2,y:canvas.height/2,r:8,vx:4.2,vy:2.6},points:0,level:1,last:performance.now(),start:performance.now()};
  updatePongHud(); requestAnimationFrame(pongLoop);
}
function stopPong(){ if(pong) pong.running=false; pong=null; }
function pongLoop(now){ if(!pong || !pong.running) return; const dt=Math.min(32, now-pong.last)/16.67; pong.last=now; if(!pong.paused) updatePong(dt); drawPong(); requestAnimationFrame(pongLoop); }
function updatePong(dt){
  const {canvas,player,cpu,ball}=pong; const elapsed=(performance.now()-pong.start)/1000;
  pong.level = 1 + Math.floor(elapsed/18) + Math.floor(pong.points/160);
  pong.points += 0.055 * pong.level * dt;
  const move=6.8*dt; if(pong.keys.up) player.y-=move; if(pong.keys.down) player.y+=move; player.y=clamp(player.y,0,canvas.height-player.h);
  const cpuCenter=cpu.y+cpu.h/2, ballCenter=ball.y; const cpuSpeed=clamp(2.8+pong.level*.42,3,7.6)*dt;
  const mistakeChance=clamp(0.26 - pong.level*0.018, 0.06, 0.26);
  if(Math.random()<0.012) cpu.miss = Math.random()<mistakeChance ? 38 + Math.random()*78 : 0;
  const target=ballCenter + cpu.miss; if(cpuCenter < target-10) cpu.y+=cpuSpeed; if(cpuCenter > target+10) cpu.y-=cpuSpeed; cpu.y=clamp(cpu.y,0,canvas.height-cpu.h);
  ball.x += ball.vx*dt; ball.y += ball.vy*dt;
  if(ball.y<ball.r || ball.y>canvas.height-ball.r){ ball.vy*=-1; playSound('point'); }
  if(hitPaddle(ball,player) && ball.vx<0){ ball.vx=Math.abs(ball.vx)+0.16; addPongAngle(ball,player); pong.points+=12; playSound('point'); }
  if(hitPaddle(ball,cpu) && ball.vx>0){ ball.vx=-Math.abs(ball.vx)-0.12; addPongAngle(ball,cpu); playSound('point'); }
  if(ball.x < -ball.r){ cpu.score++; flash('pongFlash',t('fail')); resetPongBall(1); }
  if(ball.x > canvas.width+ball.r){ player.score++; pong.points+=80; flash('pongFlash',t('point')); resetPongBall(-1); }
  if(player.score>=5 || cpu.score>=5) return finishPong(); updatePongHud();
}
function resetPongBall(direction){ const {canvas,ball}=pong; ball.x=canvas.width/2; ball.y=canvas.height/2; ball.vx=direction*(4.2 + pong.level*.18); ball.vy=(Math.random()>.5?1:-1)*(2.2+Math.random()*2.4); }
function finishPong(){
  const won=pong.player.score>pong.cpu.score;
  const points=won ? Math.round(pong.points + 160) : 2;
  saveScore('pong', points, won ? `${pong.player.score}-${pong.cpu.score}` : t('consolationDetail'), {result:won?'win':'loss'});
  playSound(won?'win':'fail'); stopPong();
  const title = won ? t('wonMaster') : t('lostMaster');
  const text = `${title} ${t('totalSaved',{points})}`;
  setTimeout(()=>{ showResultModal(won ? t('winDetail') : t('result'), text, 'pong'); }, 650);
}

function updatePongHud(){ if(!pong) return; $('pongPlayerScore').textContent=pong.player.score; $('pongCpuScore').textContent=pong.cpu.score; $('pongLivePoints').textContent=Math.round(pong.points); $('pongLevel').textContent=pong.level; updateGameLabels(); }
function drawPong(){
  const {ctx,canvas,player,cpu,ball}=pong; ctx.fillStyle='#18233d'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='rgba(255,255,255,.05)'; for(let x=0;x<canvas.width;x+=38){ ctx.fillRect(x,0,1,canvas.height); } for(let y=0;y<canvas.height;y+=38){ ctx.fillRect(0,y,canvas.width,1); }
  ctx.strokeStyle='rgba(255,255,255,.62)'; ctx.setLineDash([10,14]); ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(canvas.width/2,24); ctx.lineTo(canvas.width/2,canvas.height-24); ctx.stroke(); ctx.setLineDash([]);
  drawPaddle(ctx,player,'#fff'); drawPaddle(ctx,cpu,'#fff'); ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill();
  if(pong.paused){ ctx.fillStyle='rgba(0,0,0,.45)'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle='#fff'; ctx.font='900 34px system-ui'; ctx.textAlign='center'; ctx.fillText(t('paused'),canvas.width/2,canvas.height/2); }
}
function drawPaddle(ctx,p,color){ ctx.fillStyle=color; roundRect(ctx,p.x,p.y,p.w,p.h,6); ctx.fill(); }
function roundRect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function hitPaddle(ball,p){ return ball.x-ball.r < p.x+p.w && ball.x+ball.r > p.x && ball.y+ball.r > p.y && ball.y-ball.r < p.y+p.h; }
function addPongAngle(ball,paddle){ const relative=(ball.y-(paddle.y+paddle.h/2))/(paddle.h/2); ball.vy=relative*5.2; }

// SERPIENTE
function startSnake(){ stopAllGames(); setVisibleAvatars(); switchScreen('snake'); initSnake(); }
function initSnake(){ const canvas=$('snakeCanvas'), ctx=canvas.getContext('2d'); snake={canvas,ctx,running:true,cell:20,dir:{x:1,y:0},next:{x:1,y:0},body:[{x:8,y:12},{x:7,y:12},{x:6,y:12}],food:{x:18,y:12},score:0,level:1,lastMove:0,interval:155,start:performance.now()}; placeFood(); updateSnakeHud(); requestAnimationFrame(snakeLoop); }
function stopSnake(){ if(snake) snake.running=false; snake=null; }
function snakeLoop(now){ if(!snake || !snake.running) return; const elapsed=(now-snake.start)/1000; snake.level=1+Math.floor(elapsed/20)+Math.floor((snake.body.length-3)/5); snake.interval=Math.max(62,155-snake.level*9); snake.score += 0.018 * snake.level; if(now-snake.lastMove > snake.interval){ snake.lastMove=now; moveSnake(); } drawSnake(); updateSnakeHud(); requestAnimationFrame(snakeLoop); }
function moveSnake(){ snake.dir=snake.next; const head={x:snake.body[0].x+snake.dir.x,y:snake.body[0].y+snake.dir.y}; const max=snake.canvas.width/snake.cell; const collision=head.x<0||head.y<0||head.x>=max||head.y>=max||snake.body.some(p=>p.x===head.x&&p.y===head.y); if(collision) return finishSnake(t('fail')); snake.body.unshift(head); if(head.x===snake.food.x&&head.y===snake.food.y){ snake.score += 60 + snake.level*8; playSound('food'); placeFood(); } else { snake.body.pop(); } }
function placeFood(){ const max=snake.canvas.width/snake.cell; do{ snake.food={x:Math.floor(Math.random()*max),y:Math.floor(Math.random()*max)}; } while(snake.body.some(p=>p.x===snake.food.x&&p.y===snake.food.y)); }
function updateSnakeHud(){ if(!snake) return; $('snakeScore').textContent=Math.round(snake.score); $('snakeLevel').textContent=snake.level; $('snakeLength').textContent=snake.body.length; }
function finishSnake(reason){
  const base=Math.round(snake.score); const points=base + 2; const elapsed=(performance.now()-snake.start)/1000; const length=$('snakeLength').textContent;
  flash('snakeFlash', reason); stopSnake(); saveScore('snake', points, `${t('length')} ${length}`, {result:'loss', elapsed});
  const text = `${t('lostMaster')} ${t('totalSaved',{points})}`;
  setTimeout(()=>{ showResultModal(t('snakeOver'), text, 'snake'); }, 650);
}

function drawSnake(){ const {ctx,canvas,cell,body,food}=snake; ctx.fillStyle='#dff5c8'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.strokeStyle='rgba(59,43,32,.10)'; for(let i=0;i<=canvas.width;i+=cell){ ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(canvas.width,i); ctx.stroke(); } ctx.fillStyle='#e84c3d'; roundRect(ctx,food.x*cell+3,food.y*cell+3,cell-6,cell-6,6); ctx.fill(); body.forEach((p,i)=>{ ctx.fillStyle=i===0?'#2f7b35':'#4f9b45'; roundRect(ctx,p.x*cell+2,p.y*cell+2,cell-4,cell-4,6); ctx.fill(); }); }
function changeSnakeDir(dir){ if(!snake) return; const dirs={up:{x:0,y:-1},down:{x:0,y:1},left:{x:-1,y:0},right:{x:1,y:0}}; const n=dirs[dir]; if(!n) return; if(n.x === -snake.dir.x && n.y === -snake.dir.y) return; snake.next=n; }

// TRES EN RAYA
function startTicTac(){ stopAllGames(); setVisibleAvatars(); switchScreen('tictac'); tic={board:Array(9).fill(''),locked:false,rounds:0,points:0,level:1,started:performance.now()}; updateGameLabels(); renderTicBoard(); newTicRound(); }
function stopTicTac(){ tic=null; }
function newTicRound(){ if(!tic) return; tic.board=Array(9).fill(''); tic.locked=false; tic.started=performance.now(); tic.level=1+Math.floor(tic.rounds/2); $('ticStatus').textContent=t('yourTurn'); updateTicHud(); renderTicBoard(); }
function updateTicHud(){ if(!tic) return; $('ticPoints').textContent=tic.points; $('ticRounds').textContent=tic.rounds; $('ticLevel').textContent=tic.level; updateGameLabels(); }
function renderTicBoard(winLine=[]){ const board=$('ticBoard'); board.innerHTML=''; const values = tic ? tic.board : Array(9).fill(''); values.forEach((v,i)=>{ const b=document.createElement('button'); b.className=`tic-cell ${winLine.includes(i)?'win':''}`; b.textContent=v; b.type='button'; b.addEventListener('click',()=>playerTicMove(i)); board.appendChild(b); }); }
function playerTicMove(i){ if(!tic || tic.locked || tic.board[i]) return; tic.board[i]='❌'; renderTicBoard(); const res=checkTic(); if(res) return finishTic(res); tic.locked=true; $('ticStatus').textContent=t('cpuThinking'); setTimeout(cpuTicMove, 420); }
function cpuTicMove(){ if(!tic) return; const move=chooseCpuMove(); if(move !== -1) tic.board[move]='⭕'; renderTicBoard(); const res=checkTic(); if(res) return finishTic(res); tic.locked=false; $('ticStatus').textContent=t('yourTurn'); }
function chooseCpuMove(){ const empty=tic.board.map((v,i)=>v?null:i).filter(v=>v!==null); const mistakeChance=clamp(0.38 - tic.level*0.055, 0.08, 0.38); if(Math.random()<mistakeChance){ const m=empty[Math.floor(Math.random()*empty.length)]; setTimeout(()=>{ const cells=[...document.querySelectorAll('.tic-cell')]; if(cells[m]) cells[m].classList.add('fail'); }, 20); return m; } const win=findBestLine('⭕'); if(win!==-1) return win; const block=findBestLine('❌'); if(block!==-1) return block; if(tic.board[4]==='') return 4; const corners=[0,2,6,8].filter(i=>tic.board[i]===''); if(corners.length) return corners[Math.floor(Math.random()*corners.length)]; return empty[Math.floor(Math.random()*empty.length)] ?? -1; }
function findBestLine(mark){ const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; for(const line of lines){ const vals=line.map(i=>tic.board[i]); if(vals.filter(v=>v===mark).length===2 && vals.includes('')) return line[vals.indexOf('')]; } return -1; }
function checkTic(){ const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; for(const line of lines){ const [a,b,c]=line; if(tic.board[a] && tic.board[a]===tic.board[b] && tic.board[a]===tic.board[c]) return {winner:tic.board[a], line}; } if(tic.board.every(Boolean)) return {winner:'draw', line:[]}; return null; }
function finishTic(res){
  tic.locked=true; tic.rounds++;
  let gained=0, result='draw', title=t('draw'), msg=t('drawText');
  const timeBonus=Math.max(0, 25-Math.floor((performance.now()-tic.started)/1000));
  if(res.winner==='❌'){ gained=80+tic.level*15+timeBonus; result='win'; title=t('wonMaster'); msg=`${t('wonMaster')} ${t('totalSaved',{points: tic.points + gained})}`; playSound('win'); }
  else if(res.winner==='⭕'){ gained=2; result='loss'; title=t('lostMaster'); msg=`${t('lostMaster')} ${t('totalSaved',{points: gained})}`; playSound('fail'); }
  else { gained=20; result='draw'; title=t('draw'); msg=`${t('drawText')} ${t('totalSaved',{points: tic.points + gained})}`; playSound('point'); }
  tic.points = result==='loss' ? gained : tic.points + gained;
  updateTicHud(); renderTicBoard(res.line);
  saveScore('tictac', tic.points, result=== 'loss' ? t('consolationDetail') : `${tic.rounds} ${t('rounds').toLowerCase()}`, {result});
  setTimeout(()=>{ showResultModal(title, msg, 'tictac'); }, 500);
}


function totalUserScores(){ return getJson(STORAGE_SCORES, []).filter(s=>s.user===currentUser?.user); }
function profileLevel(totalPoints){ if(totalPoints >= 2500) return {level:5, name:t('legend')}; if(totalPoints >= 1200) return {level:4, name:t('master')}; if(totalPoints >= 600) return {level:3, name:t('fast')}; if(totalPoints >= 200) return {level:2, name:t('fan')}; return {level:1, name:t('novice')}; }
function renderProfile(){
  if(!currentUser) return;
  const scores=totalUserScores(); const total=scores.reduce((sum,s)=>sum+(s.points||0),0); const lvl=profileLevel(total); const byGame={}; scores.forEach(s=>byGame[s.game]=(byGame[s.game]||0)+s.points); const best=Object.entries(byGame).sort((a,b)=>b[1]-a[1])[0];
  $('profileName').textContent=currentUser.user; $('profileLevel').textContent=`${t('level')} ${lvl.level} · ${lvl.name}`; $('profileGames').textContent=scores.length; $('profilePoints').textContent=Math.round(total); $('profileBestGame').textContent=best ? gameName(best[0]) : '-'; $('profileStreak').textContent=currentUser.streak || 0; setVisibleAvatars(); updateGameLabels();
}
function updateStreak(result){
  if(!currentUser) return; const positive = result === 'win' || result === 'draw' || result === 'score'; currentUser.streak = positive ? (currentUser.streak || 0) + 1 : 0;
  const users=getJson(STORAGE_USERS, []); const idx=users.findIndex(u=>u.user===currentUser.user); if(idx>=0){ users[idx]={...users[idx], streak:currentUser.streak, avatar:avatarFor(currentUser)}; setJson(STORAGE_USERS, users); setJson(STORAGE_SESSION, currentUser); }
  if(currentUser.streak >= 3) awardAchievement('streak_3');
}
function awardAchievement(id){
  if(!currentUser) return; const ids=currentAchievementIds(); if(ids.includes(id)) return; ids.push(id); setCurrentAchievementIds(ids);
  const ach=achievements.find(a=>a.id===id); if(ach){ setTimeout(()=>showModal(t('unlocked'), `${localize(ach.name)}: ${localize(ach.desc)}`), 160); playSound('win'); }
}
function renderAchievements(){
  const ids=currentAchievementIds(); const box=$('achievementsList'); $('achievementCount').textContent=`${ids.length}/${achievements.length}`; box.innerHTML='';
  achievements.forEach(a=>{ const unlocked=ids.includes(a.id); const item=document.createElement('div'); item.className=`achievement ${unlocked?'unlocked':''}`; item.innerHTML=`<span>${unlocked?'🏆':'🔒'}</span><div><strong>${localize(a.name)}</strong><small>${localize(a.desc)}</small></div>`; box.appendChild(item); });
}
function quickPlay(){ const active=games.filter(g=>g.active); const chosen=active[Math.floor(Math.random()*active.length)]; if(chosen) startGame(chosen.id); }
async function shareRoomCode(gameId){ const code=$(`generatedCode-${gameId}`)?.value; if(!code) return; const text=t('roomInvite',{game:gameName(gameId),code}); try{ if(navigator.share) await navigator.share({title:'Partida Rápida', text}); else { await navigator.clipboard.writeText(text); showModal(t('inviteCopied'), text); } } catch { showModal(t('roomCode'), text); } }
function bindEvents(){
  $('loginTab').addEventListener('click',()=>switchTab('login')); $('registerTab').addEventListener('click',()=>switchTab('register'));
  const doLogin = async () => login($('loginUser').value,$('loginPin').value);
  const doRegister = async () => register($('registerUser').value,$('registerPin').value);
  $('loginForm').addEventListener('submit',async e=>{e.preventDefault(); await doLogin();});
  $('registerForm').addEventListener('submit',async e=>{e.preventDefault(); await doRegister();});
  $('loginSubmit').addEventListener('click',async e=>{ e.preventDefault(); await doLogin(); });
  $('registerSubmit').addEventListener('click',async e=>{ e.preventDefault(); await doRegister(); });
  $('logoutBtn').addEventListener('click',logout); $('modalOk').addEventListener('click',closeModal); $('modalNewGame').addEventListener('click',modalNewGame); $('modalMenu').addEventListener('click',modalMenu); $('registerLang')?.addEventListener('change',e=>setLang(e.target.value)); $('loginLang')?.addEventListener('change',e=>setLang(e.target.value)); document.querySelectorAll('.lang-toggle').forEach(b=>b.addEventListener('click',toggleLanguage)); $('quickPlayBtn').addEventListener('click',quickPlay); $('soundToggleBtn').addEventListener('click',toggleSound); $('weeklyRankBtn').addEventListener('click',()=>{rankingScope='weekly'; renderRanking();}); $('allRankBtn').addEventListener('click',()=>{rankingScope='all'; renderRanking();});
  document.addEventListener('click', async e => { const btn=e.target.closest('button'); if(!btn) return; const action=btn.dataset.action, gameId=btn.dataset.game; if(action==='cpu') startGame(gameId); if(action==='room') createRoom(gameId); if(action==='join'){ $(`joinBox-${gameId}`).classList.toggle('hidden'); const rb=$(`roomBox-${gameId}`); if(rb) rb.classList.add('hidden'); } if(action==='join-confirm') joinRoom(gameId); if(action==='copy'){ const code=$(`generatedCode-${gameId}`).value; try{ await navigator.clipboard.writeText(code); showModal(t('codeCopied'), `${t('roomCode')}: ${code}`); } catch { showModal(t('roomCode'), code); } } if(action==='share') shareRoomCode(gameId); });
  document.querySelectorAll('.backHome').forEach(b=>b.addEventListener('click',()=>{ closeModal(); stopAllGames(); enterHome(); })); $('pausePongBtn').addEventListener('click',()=>{ if(pong) pong.paused=!pong.paused; }); $('restartSnakeBtn').addEventListener('click',startSnake); $('restartTicBtn').addEventListener('click',newTicRound);
  window.addEventListener('keydown', e => { if(pong){ if(e.key==='ArrowUp') pong.keys.up=true; if(e.key==='ArrowDown') pong.keys.down=true; } if(snake){ if(e.key==='ArrowUp') changeSnakeDir('up'); if(e.key==='ArrowDown') changeSnakeDir('down'); if(e.key==='ArrowLeft') changeSnakeDir('left'); if(e.key==='ArrowRight') changeSnakeDir('right'); } });
  window.addEventListener('keyup', e => { if(!pong) return; if(e.key==='ArrowUp') pong.keys.up=false; if(e.key==='ArrowDown') pong.keys.down=false; });
  $('pongCanvas').addEventListener('pointermove', e => { if(!pong) return; const rect=pong.canvas.getBoundingClientRect(); const y=((e.clientY-rect.top)/rect.height)*pong.canvas.height; pong.player.y=clamp(y-pong.player.h/2,0,pong.canvas.height-pong.player.h); });
  const hold=(key,val)=>()=>{ if(pong) pong.keys[key]=val; }; $('upBtn').addEventListener('pointerdown',hold('up',true)); $('upBtn').addEventListener('pointerup',hold('up',false)); $('upBtn').addEventListener('pointerleave',hold('up',false)); $('downBtn').addEventListener('pointerdown',hold('down',true)); $('downBtn').addEventListener('pointerup',hold('down',false)); $('downBtn').addEventListener('pointerleave',hold('down',false));
  document.querySelectorAll('.snake-controls button').forEach(b=>b.addEventListener('click',()=>changeSnakeDir(b.dataset.dir)));
}
function init(){ if(!cloudEnabled()) seedDemoRanking(); renderAvatarPicker(); bindEvents(); setLang(getJson(STORAGE_SETTINGS, {}).lang || 'es'); updateSoundButton(); const session=getJson(STORAGE_SESSION,null); if(session){ currentUser=session; if(!currentUser.avatar || currentUser.avatar === CPU_AVATAR) currentUser.avatar=avatars[0]; setLang(currentUser.lang || 'es'); enterHome(); } else { switchScreen('auth'); } }
init();
