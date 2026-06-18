// PARTIDA RAPIDA - VERSION 7.9.0 CUATRO EN RAYA + SALAS
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
  { id:'pong', name:{es:'Pong',va:'Pong'}, icon:'PONG', art:'pong-art', desc:{es:'Pong vertical contra CPU. Mueve la pala inferior de izquierda a derecha y evita que la bola pase por abajo.',va:'Pong vertical contra CPU. Mou la pala inferior d’esquerra a dreta i evita que la bola passe per baix.'}, active:true, modes:['cpu'], help:{es:'Pong gana quien llega antes a 5 puntos. Las salas de Pong quedan desactivadas por ahora.',va:'En Pong guanya qui arriba abans a 5 punts. Les sales de Pong queden desactivades de moment.'} },
  { id:'snake', name:{es:'Serpiente',va:'Serp'}, icon:'🐍🍎', art:'snake-art', desc:{es:'Come manzanas, crece y aguanta cada vez con más velocidad.',va:'Menja pomes, creix i aguanta cada vegada amb més velocitat.'}, active:true, modes:['cpu'], help:{es:'Serpiente suma por tiempo y por manzanas. La velocidad aumenta progresivamente.',va:'Serp suma per temps i per pomes. La velocitat augmenta progressivament.'} },
  { id:'tictac', name:{es:'Tres en raya',va:'Tres en ratlla'}, icon:'❌⭕', art:'tictac-art', desc:{es:'El clásico de siempre contra CPU o sala por turnos.',va:'El clàssic de sempre contra CPU o sala per torns.'}, active:true, modes:['cpu','room','join'], help:{es:'Tres en raya puntúa por victoria, empate y rapidez. En sala juegan dos usuarios por turnos.',va:'Tres en ratlla puntua per victòria, empat i rapidesa. En sala juguen dos usuaris per torns.'} },
  { id:'connect4', name:{es:'Cuatro en raya',va:'Quatre en ratlla'}, icon:'🔴🟡', art:'connect-art', desc:{es:'Conecta cuatro fichas antes que tu rival. Rápido, táctico y perfecto para salas.',va:'Connecta quatre fitxes abans que el teu rival. Ràpid, tàctic i perfecte per a sales.'}, active:true, modes:['cpu','room','join'], help:{es:'Cuatro en raya puntúa por victoria, empate y rapidez. En sala juegan dos usuarios por turnos.',va:'Quatre en ratlla puntua per victòria, empat i rapidesa. En sala juguen dos usuaris per torns.'} },
  { id:'shooter', name:{es:'Matamarcianos',va:'Matamarcians'}, icon:'🚀👾', art:'shooter-art', desc:{es:'Arcade espacial local contra CPU. Destruye oleadas, recoge bombas y derrota al jefe final de cada pantalla.',va:'Arcade espacial local contra CPU. Destruïx onades, arreplega bombes i derrota el cap final de cada pantalla.'}, active:true, modes:['cpu'], help:{es:'Matamarcianos puntúa por enemigos, jefes finales, vidas conservadas y pantallas superadas. Las bombas aparecen al azar al destruir marcianos.',va:'Matamarcians puntua per enemics, caps finals, vides conservades i pantalles superades. Les bombes apareixen a l’atzar en destruir marcians.'} },
  { id:'memory', name:{es:'Memory',va:'Memory'}, icon:'⭐❔', art:'memory-art', desc:{es:'Encuentra parejas antes de gastar demasiados movimientos. Partida corta, visual y perfecta para ranking.',va:'Troba parelles abans de gastar massa moviments. Partida curta, visual i perfecta per a rànquing.'}, active:true, modes:['cpu'], help:{es:'Memory puntúa por parejas encontradas, pocos movimientos y rapidez. Es modo individual por ranking.',va:'Memory puntua per parelles trobades, pocs moviments i rapidesa. És mode individual per rànquing.'} },
  { id:'liar', name:{es:'Mentiroso',va:'Mentider'}, icon:'🎲🤥', art:'liar-art', desc:{es:'Juego de dados y faroles. Ideal para salas online cuando esté activado.',va:'Joc de daus i farols. Ideal per a sales en línia quan estiga activat.'}, active:false, modes:[], help:{es:'Pendiente de desarrollo. Es uno de los siguientes candidatos por ser rápido y adictivo.',va:'Pendent de desenvolupament. És un dels pròxims candidats perquè és ràpid i addictiu.'} },
  { id:'blackjack', name:{es:'Blackjack',va:'Blackjack'}, icon:'🂡21', art:'card-art', desc:{es:'Cartas rápidas contra banca. Llegar a 21 sin pasarse.',va:'Cartes ràpides contra banca. Arribar a 21 sense passar-se.'}, active:false, modes:[], help:{es:'Pendiente de desarrollo.',va:'Pendent de desenvolupament.'} },
  { id:'sieteymedio', name:{es:'Siete y medio',va:'Set i mig'}, icon:'🃏7½', art:'card-art', desc:{es:'Clásico de baraja española contra banca.',va:'Clàssic de baralla espanyola contra banca.'}, active:false, modes:[], help:{es:'Pendiente de desarrollo.',va:'Pendent de desenvolupament.'} },
  { id:'generala', name:{es:'Generala',va:'Generala'}, icon:'🎲🎲', art:'dice-art', desc:{es:'Dados, combinaciones y ranking. Partidas cortas por puntuación.',va:'Daus, combinacions i rànquing. Partides curtes per puntuació.'}, active:false, modes:[], help:{es:'Pendiente de desarrollo.',va:'Pendent de desenvolupament.'} },
  { id:'parchis', name:{es:'Parchís',va:'Parxís'}, icon:'🎲', art:'parchis-art', desc:{es:'Partidas por sala para hasta 4 jugadores.',va:'Partides per sala per a fins a 4 jugadors.'}, active:false, modes:[], help:{es:'Ranking pendiente.',va:'Rànquing pendent.'} }
];
const achievements = [
  { id:'first_game', name:{es:'Primera partida',va:'Primera partida'}, desc:{es:'Juega tu primera partida.',va:'Juga la teua primera partida.'} },
  { id:'pong_win', name:{es:'Golpe maestro',va:'Colp mestre'}, desc:{es:'Gana una partida de Pong contra la CPU.',va:'Guanya una partida de Pong contra la CPU.'} },
  { id:'snake_60', name:{es:'Un minuto vivo',va:'Un minut viu'}, desc:{es:'Aguanta 60 segundos en Serpiente.',va:'Aguanta 60 segons en Serp.'} },
  { id:'tic_win', name:{es:'Tres en raya',va:'Tres en ratlla'}, desc:{es:'Gana una ronda de Tres en raya.',va:'Guanya una ronda de Tres en ratlla.'} },
  { id:'room_created', name:{es:'Anfitrión',va:'Amfitrió'}, desc:{es:'Crea tu primera sala.',va:'Crea la teua primera sala.'} },
  { id:'room_joined', name:{es:'Invitado',va:'Convidat'}, desc:{es:'Únete a una sala con código.',va:'Unix-te a una sala amb codi.'} },
  { id:'memory_clear', name:{es:'Buena memoria',va:'Bona memòria'}, desc:{es:'Completa una partida de Memory.',va:'Completa una partida de Memory.'} },
  { id:'connect4_win', name:{es:'Cuatro conectado',va:'Quatre connectat'}, desc:{es:'Gana una partida de Cuatro en raya.',va:'Guanya una partida de Quatre en ratlla.'} },
  { id:'shooter_boss', name:{es:'Cazador espacial',va:'Caçador espacial'}, desc:{es:'Derrota tu primer jefe final en Matamarcianos.',va:'Derrota el teu primer cap final en Matamarcians.'} },
  { id:'streak_3', name:{es:'Racha de 3',va:'Ratxa de 3'}, desc:{es:'Consigue tres resultados positivos seguidos.',va:'Aconseguix tres resultats positius seguits.'} }
];

const $ = (id) => document.getElementById(id);
const screens = { auth:$('authScreen'), home:$('homeScreen'), gameDetail:$('gameDetailScreen'), pong:$('pongScreen'), snake:$('snakeScreen'), tictac:$('tictacScreen'), memory:$('memoryScreen'), connect4:$('connect4Screen'), shooter:$('shooterScreen') };
let currentUser = null;
let activeRanking = 'pong';
let selectedGameId = null;
let rankingScope = 'weekly';
let audioCtx = null;
let soundEnabled = getJson(STORAGE_SETTINGS, { sound:false }).sound === true;
let pong = null;
let snake = null;
let tic = null;
let memory = null;
let connect4 = null;
let shooter = null;
let roomPollTimer = null;
let pongRoomSyncTimer = null;
let ticRoomSyncTimer = null;
let connect4RoomSyncTimer = null;

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
    loginTab:'Entrar', registerTab:'Nuevo jugador', user:'Usuario', newUser:'Nuevo usuario', pin:'Contraseña', lang:'Idioma', langToggle:'CAS/VAL', enter:'Entrar', createPlayer:'Crear jugador', chooseAvatar:'Elige tu avatar', authHint:'Si ya tienes jugador, entra con tu usuario y PIN de 4 cifras.', registerHint:'El PIN se guarda protegido en Supabase y no se muestra en claro.', brandOverline:'Juegos de siempre', brandText:'Entra, elige un juego clásico y echa una partida corta en cualquier momento.', badge1:'Sin instalación', badge2:'PIN de 4 cifras', badge3:'Ranking', mainScreen:'Pantalla principal', hello:'Hola', logout:'Salir', heroTitle:'¿Echamos una partida?', heroText:'Pong, Serpiente, Tres en raya, Memory, Cuatro en raya y Matamarcianos están activos.', quickPlay:'🎮 Jugar ahora', sound:'Sonido', off:'OFF', on:'ON', player:'Jugador', games:'Juegos disponibles', quickGames:'Partidas rápidas', openGame:'Entrar', gameData:'Datos del juego', availableModes:'Modos disponibles', roomsDisabled:'Salas desactivadas por ahora', rankingByGame:'Ranking por juego', top10:'Top 10', weekly:'Semanal', all:'Histórico', achievements:'Logros', gamesCount:'Partidas', points:'Puntos', bestGame:'Mejor juego', streak:'Racha', level:'Nivel', novice:'Novato', fan:'Aficionado', fast:'Rápido', master:'Maestro', legend:'Leyenda', cpu:'CPU', playCpu:'Jugar contra CPU', createRoom:'Crear sala', enterCode:'Introducir código', roomCode:'Código de sala', enterRoom:'Entrar en sala', coming:'🔒 Próximamente', soon:'En breve más juegos…', noGames:'Sin partidas', thisWeek:'Esta semana', historical:'Histórico', scoreSystem:'Sistema de puntos', rankingPending:'Ranking pendiente.', pongOver:'Pong contra CPU', pongTitle:'{player} vs CPU', pause:'Pausa', back:'Volver', difficulty:'Dificultad', fail:'FALLO', point:'PUNTO', paused:'PAUSA', snakeOver:'Serpiente', snakeTitle:'Come, crece y aguanta', restart:'Reiniciar', speed:'Velocidad', length:'Longitud', pongHint:'Gana quien llega antes a 5 puntos. PC: teclas ← → o ratón. Móvil: botones inferiores o tocar la pantalla.', snakeHint:'PC: flechas. Móvil: botones. La velocidad aumenta cuanto más aguantas.', ticOver:'Tres en raya contra CPU', ticTitle:'Jugador ❌ vs CPU ⭕', newRound:'Nueva ronda', rounds:'Rondas', yourTurn:'Te toca. Elige una casilla.', cpuThinking:'Piensa la CPU...', ticHint:'La CPU mejora con las rondas, pero en niveles bajos también puede fallar.', memoryOver:'Memory', memoryTitle:'Encuentra las parejas', moves:'Movimientos', pairs:'Parejas', memoryHint:'Toca dos cartas. Si coinciden, quedan descubiertas. Menos movimientos y menos tiempo dan más puntos.', result:'Resultado', accept:'Aceptar', newGame:'Partida nueva', menu:'Salir al menú principal', lostMaster:'Has perdido. Se te asignan 2 puntos de consolación.', wonMaster:'Has ganado. ¡Enhorabuena!', totalSaved:'Total guardado: {points} puntos.', roomCreated:'Sala creada por {user}. Comparte este código:', copy:'Copiar', share:'Compartir', roomReal:'Sala online experimental con Supabase.', roomNotFound:'Sala no encontrada', roomNotFoundText:'Comprueba el código. La sala debe estar creada en Supabase y seguir esperando invitado.', ownCode:'Código propio', ownCodeText:'Has introducido el código de tu propia sala. Pásaselo a otro usuario.', playerJoined:'Jugador unido', playerJoinedText:'Te has unido a la sala {code}. La partida online real se conectará después.', codeCopied:'Código copiado', inviteCopied:'Invitación copiada', roomInvite:'Únete a mi sala de {game} en Partida Rápida. Código: {code}', invalidLogin:'Usuario o contraseña incorrectos.', userExists:'Ese usuario ya existe. Elige otro.', userLength:'El usuario debe tener entre 3 y 18 caracteres.', userChars:'Usa solo letras, números, guion o guion bajo. Sin espacios.', userBad:'Ese nombre de usuario no está permitido.', pinBad:'La contraseña debe ser un número de 4 cifras.', unlocked:'Logro desbloqueado', consolationDetail:'Consolación', winDetail:'Victoria', draw:'Empate', drawText:'Empate. Se guarda la puntuación y puedes jugar otra ronda.', cpuAvatar:'Avatar exclusivo de la CPU', firstTo5:'Gana quien llega antes a 5 puntos', waitingGuest:'Esperando a otro jugador…', roomPlayerJoined:'Jugador conectado. La sala empieza ahora.', roomOnline:'Sala online experimental con Supabase. Mantén esta pantalla abierta hasta que se una otro jugador.', onlineRoom:'Sala online', host:'Anfitrión', guest:'Invitado', connected:'Conectado', syncWarning:'Modo online experimental: puede ir algo menos fluido que contra CPU.', roomWin:'Has ganado la sala de Pong.', roomLoss:'Has perdido la sala de Pong. Se te asignan 2 puntos de consolación.', ticRoomOver:'Tres en raya online', ticRoomTitle:'Sala de Tres en raya', opponentTurn:'Turno del rival. Espera su jugada.', ticRoomWin:'Has ganado la sala de Tres en raya.', ticRoomLoss:'Has perdido la sala de Tres en raya. Se te asignan 2 puntos de consolación.', ticRoomDraw:'Empate en la sala de Tres en raya.', connect4Over:'Cuatro en raya', connect4Title:'Conecta cuatro fichas', connect4Hint:'Toca una columna para soltar ficha. Contra CPU o por sala online experimental.', connect4RoomOver:'Cuatro en raya online', connect4RoomWin:'Has ganado la sala de Cuatro en raya.', connect4RoomLoss:'Has perdido la sala de Cuatro en raya. Se te asignan 2 puntos de consolación.', connect4RoomDraw:'Empate en la sala de Cuatro en raya.', chooseColumn:'Te toca. Elige una columna.', fullColumn:'Columna llena. Elige otra.', countdown:'{num}'
  },
  va:{
    loginTab:'Entrar', registerTab:'Nou jugador', user:'Usuari', newUser:'Nou usuari', pin:'Contrasenya', lang:'Idioma', langToggle:'CAS/VAL', enter:'Entrar', createPlayer:'Crear jugador', chooseAvatar:'Tria el teu avatar', authHint:'Si ja tens jugador, entra amb el teu usuari i PIN de 4 xifres.', registerHint:'El PIN es guarda protegit en Supabase i no es mostra en clar.', brandOverline:'Jocs de sempre', brandText:'Entra, tria un joc clàssic i juga una partida curta en qualsevol moment.', badge1:'Sense instal·lació', badge2:'PIN de 4 xifres', badge3:'Rànquing', mainScreen:'Pantalla principal', hello:'Hola', logout:'Eixir', heroTitle:'Fem una partida?', heroText:'Pong, Serp, Tres en ratlla, Memory i Quatre en ratlla estan actius. En breu més jocs…', quickPlay:'🎮 Jugar ara', sound:'So', off:'OFF', on:'ON', player:'Jugador', games:'Jocs disponibles', quickGames:'Partides ràpides', openGame:'Entrar', gameData:'Dades del joc', availableModes:'Modes disponibles', roomsDisabled:'Sales desactivades de moment', rankingByGame:'Rànquing per joc', top10:'Top 10', weekly:'Setmanal', all:'Històric', achievements:'Assoliments', gamesCount:'Partides', points:'Punts', bestGame:'Millor joc', streak:'Ratxa', level:'Nivell', novice:'Novell', fan:'Aficionat', fast:'Ràpid', master:'Mestre', legend:'Llegenda', cpu:'CPU', playCpu:'Jugar contra CPU', createRoom:'Crear sala', enterCode:'Introduir codi', roomCode:'Codi de sala', enterRoom:'Entrar en sala', coming:'🔒 Pròximament', soon:'En breu més jocs…', noGames:'Sense partides', thisWeek:'Esta setmana', historical:'Històric', scoreSystem:'Sistema de punts', rankingPending:'Rànquing pendent.', pongOver:'Pong contra CPU', pongTitle:'{player} contra CPU', pause:'Pausa', back:'Tornar', difficulty:'Dificultat', fail:'FALLADA', point:'PUNT', paused:'PAUSA', snakeOver:'Serp', snakeTitle:'Menja, creix i aguanta', restart:'Reiniciar', speed:'Velocitat', length:'Longitud', pongHint:'Guanya qui arriba abans a 5 punts. PC: tecles ← → o ratolí. Mòbil: botons inferiors o tocar la pantalla.', snakeHint:'PC: fletxes. Mòbil: botons. La velocitat augmenta com més aguantes.', ticOver:'Tres en ratlla contra CPU', ticTitle:'Jugador ❌ contra CPU ⭕', newRound:'Nova ronda', rounds:'Rondes', yourTurn:'Et toca. Tria una casella.', cpuThinking:'La CPU pensa...', ticHint:'La CPU millora amb les rondes, però en nivells baixos també pot fallar.', memoryOver:'Memory', memoryTitle:'Troba les parelles', moves:'Moviments', pairs:'Parelles', memoryHint:'Toca dues cartes. Si coincidixen, queden descobertes. Menys moviments i menys temps donen més punts.', result:'Resultat', accept:'Acceptar', newGame:'Partida nova', menu:'Eixir al menú principal', lostMaster:'Has perdut. Se t’assignen 2 punts de consolació.', wonMaster:'Has guanyat. Enhorabona!', totalSaved:'Total guardat: {points} punts.', roomCreated:'Sala creada per {user}. Compartix este codi:', copy:'Copiar', share:'Compartir', roomReal:'Sala en línia experimental amb Supabase.', roomNotFound:'Sala no trobada', roomNotFoundText:'Comprova el codi. La sala ha d’estar creada en Supabase i continuar esperant convidat.', ownCode:'Codi propi', ownCodeText:'Has introduït el codi de la teua pròpia sala. Passa-li’l a un altre usuari.', playerJoined:'Jugador unit', playerJoinedText:'T’has unit a la sala {code}. La partida en línia real es connectarà després.', codeCopied:'Codi copiat', inviteCopied:'Invitació copiada', roomInvite:'Unix-te a la meua sala de {game} en Partida Rápida. Codi: {code}', invalidLogin:'Usuari o contrasenya incorrectes.', userExists:'Eixe usuari ja existix. Tria’n un altre.', userLength:'L’usuari ha de tindre entre 3 i 18 caràcters.', userChars:'Usa només lletres, números, guionet o guionet baix. Sense espais.', userBad:'Eixe nom d’usuari no està permés.', pinBad:'La contrasenya ha de ser un número de 4 xifres.', unlocked:'Assoliment desbloquejat', consolationDetail:'Consolació', winDetail:'Victòria', draw:'Empat', drawText:'Empat. Es guarda la puntuació i pots jugar una altra ronda.', cpuAvatar:'Avatar exclusiu de la CPU', firstTo5:'Guanya qui arriba abans a 5 punts', waitingGuest:'Esperant un altre jugador…', roomPlayerJoined:'Jugador connectat. La sala comença ara.', roomOnline:'Sala en línia experimental amb Supabase. Mantín esta pantalla oberta fins que s’unisca un altre jugador.', onlineRoom:'Sala en línia', host:'Amfitrió', guest:'Convidat', connected:'Connectat', syncWarning:'Mode en línia experimental: pot anar un poc menys fluid que contra CPU.', roomWin:'Has guanyat la sala de Pong.', roomLoss:'Has perdut la sala de Pong. Se t’assignen 2 punts de consolació.', ticRoomOver:'Tres en ratlla en línia', ticRoomTitle:'Sala de Tres en ratlla', opponentTurn:'Torn del rival. Espera la seua jugada.', ticRoomWin:'Has guanyat la sala de Tres en ratlla.', ticRoomLoss:'Has perdut la sala de Tres en ratlla. Se t’assignen 2 punts de consolació.', ticRoomDraw:'Empat en la sala de Tres en ratlla.', connect4Over:'Quatre en ratlla', connect4Title:'Connecta quatre fitxes', connect4Hint:'Toca una columna per a soltar fitxa. Contra CPU o per sala en línia experimental.', connect4RoomOver:'Quatre en ratlla en línia', connect4RoomWin:'Has guanyat la sala de Quatre en ratlla.', connect4RoomLoss:'Has perdut la sala de Quatre en ratlla. Se t’assignen 2 punts de consolació.', connect4RoomDraw:'Empat en la sala de Quatre en ratlla.', chooseColumn:'Et toca. Tria una columna.', fullColumn:'Columna plena. Tria’n una altra.', countdown:'{num}'
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
  const pairs={loginTab:'loginTab',registerTab:'registerTab',helloText:'hello',authUserLabel:'user',authPinLabel:'pin',loginLangLabel:'lang',registerUserLabel:'newUser',registerPinLabel:'pin',registerLangLabel:'lang',loginSubmit:'enter',registerSubmit:'createPlayer',chooseAvatarLabel:'chooseAvatar',authHint:'authHint',registerHint:'registerHint',brandOverline:'brandOverline',brandText:'brandText',badgeInstall:'badge1',badgePin:'badge2',badgeRanking:'badge3',topOverline:'mainScreen',logoutBtn:'logout',heroTitle:'heroTitle',heroText:'heroText',quickPlayBtn:'quickPlay',gamesPanelTitle:'games',gamesPanelPill:'quickGames',rankingTitle:'rankingByGame',rankingPill:'top10',weeklyRankBtn:'weekly',allRankBtn:'all',achievementsTitle:'achievements',profileSmallPlayer:'player',profileSmallGames:'gamesCount',profileSmallPoints:'points',profileSmallBest:'bestGame',profileSmallStreak:'streak',pausePongBtn:'pause',restartSnakeBtn:'restart',restartTicBtn:'newRound',scoreHelpLabel:'scoreSystem',detailOverline:'gameData',detailModesTitle:'availableModes',detailBackBtn:'back',pongOverline:'pongOver',pongHint:'pongHint',pongPlayerSmall:'player',pongCpuSmall:'cpu',pongDifficultyLabel:'difficulty',snakeOverline:'snakeOver',snakeTitle:'snakeTitle',ticOverline:'ticOver',ticTitle:'ticTitle',snakeHint:'snakeHint',snakePointsSmall:'points',snakeSpeedLabel:'speed',snakeLengthSmall:'length',ticHint:'ticHint',ticPointsSmall:'points',ticDifficultyLabel:'difficulty',ticRoundsSmall:'rounds',memoryOverline:'memoryOver',memoryTitle:'memoryTitle',memoryPointsSmall:'points',memoryMovesSmall:'moves',memoryPairsSmall:'pairs',memoryHint:'memoryHint',restartMemoryBtn:'newGame',connect4Overline:'connect4Over',connect4Title:'connect4Title',connect4PointsSmall:'points',connect4DifficultyLabel:'difficulty',connect4RoundsSmall:'rounds',connect4Hint:'connect4Hint',restartConnect4Btn:'newRound',modalOk:'accept',modalNewGame:'newGame',modalMenu:'menu'};
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
  ['topAvatar','heroAvatar','profileAvatar','detailAvatar','pongAvatar','snakeAvatar','ticAvatar','memoryAvatar','connect4Avatar','shooterAvatar'].forEach(id => { const el=$(id); if(el) el.textContent = av; });
}
function seedDemoRanking(){
  if(getJson(STORAGE_SCORES, []).length) return;
  setJson(STORAGE_SCORES, [
    {game:'pong', user:'GameMaster', avatar:'👾', points:340, detail:'Demo', createdAt:nowIso()},
    {game:'pong', user:'RetroPlayer', avatar:'😎', points:270, detail:'Demo', createdAt:nowIso()},
    {game:'snake', user:'SnakeLover', avatar:'🐍', points:420, detail:'Demo', createdAt:nowIso()},
    {game:'snake', user:'MetroPlayer', avatar:'🎮', points:260, detail:'Demo', createdAt:nowIso()},
    {game:'tictac', user:'TresRaya', avatar:'⭐', points:180, detail:'Demo', createdAt:nowIso()},
    {game:'connect4', user:'CuatroPro', avatar:'🏆', points:210, detail:'Demo', createdAt:nowIso()},
    {game:'shooter', user:'NeoLaser', avatar:'🚀', points:1450, detail:'Demo', createdAt:nowIso()}
  ]);
}
function renderGames(){
  const list = $('gamesList'); list.innerHTML = '';
  games.forEach(g => {
    const card = document.createElement('article');
    card.className = `game-card game-row ${g.active ? '' : 'disabled'}`;
    const name = localize(g.name);
    const desc = localize(g.desc);
    card.innerHTML = `<div class="game-art ${g.art}">${gameArt(g)}<strong>${name}</strong></div><div class="game-info"><h4>${name}</h4><p>${desc}</p></div><div class="game-enter"><button class="primary-btn" type="button" data-action="detail" data-game="${g.id}">${t('openGame')}</button></div>`;
    list.appendChild(card);
  });
}
function gameArt(g){
  if(g.id==='pong') return '<span class="paddle top"></span><span class="net horizontal"></span><span class="ball"></span><span class="paddle bottom"></span>';
  return `<span>${g.icon}</span>`;
}
function renderGameDetail(gameId){
  const g = games.find(item => item.id === gameId);
  if(!g) return;
  selectedGameId = gameId;
  $('detailTitle').textContent = localize(g.name);
  $('detailDescription').textContent = localize(g.desc);
  $('detailHelp').textContent = g.help ? localize(g.help) : t('rankingPending');
  $('detailPreview').className = `detail-preview game-art ${g.art}`;
  $('detailPreview').innerHTML = `${gameArt(g)}<strong>${localize(g.name)}</strong>`;
  const actions = $('detailActions');
  actions.innerHTML = gameButtons(g);
  const roomBox = $('detailRoomBox');
  const joinBox = $('detailJoinBox');
  roomBox.className = 'room-box hidden'; roomBox.innerHTML = '';
  joinBox.className = 'room-box hidden';
  joinBox.innerHTML = `<label>${t('roomCode')}<input id="joinCode-${g.id}" maxlength="6" placeholder="Ej. A7K2Q" /></label><button class="primary-btn small" type="button" data-action="join-confirm" data-game="${g.id}">${t('enterRoom')}</button>`;
  switchScreen('gameDetail');
}
function gameButtons(g){
  if(!g.active) return `<span class="pill">${t('coming')}</span>`;
  const cpu = g.modes.includes('cpu') ? `<button class="primary-btn" type="button" data-action="cpu" data-game="${g.id}">${t('playCpu')}</button>` : '';
  const room = g.modes.includes('room') ? `<button class="secondary-btn" type="button" data-action="room" data-game="${g.id}">${t('createRoom')}</button>` : '';
  const join = g.modes.includes('join') ? `<button class="secondary-btn" type="button" data-action="join" data-game="${g.id}">${t('enterCode')}</button>` : '';
  const disabledRooms = g.id === 'pong' ? `<span class="pill">${t('roomsDisabled')}</span>` : '';
  return cpu + room + join + disabledRooms;
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
  if(game==='memory' && meta.result==='win') awardAchievement('memory_clear');
  if(game==='connect4' && meta.result==='win') awardAchievement('connect4_win');
  if(game==='shooter' && meta.bosses >= 1) awardAchievement('shooter_boss');
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
async function createRoom(gameId){
  if(gameId === 'pong') return showModal(t('roomsDisabled'), t('roomsDisabled'));
  if(!['tictac','connect4'].includes(gameId)) return showModal(t('roomNotFound'), t('roomNotFoundText'));
  if(!cloudEnabled() || !cloudSessionToken()){
    return showModal(t('roomNotFound'), 'Para probar salas reales necesitas entrar con un jugador conectado a Supabase.');
  }
  try{
    const row = await window.PartidaRapidaSupabase.createRoom(cloudSessionToken(), gameId);
    if(!row?.ok) return showModal(t('roomNotFound'), row?.message || t('roomNotFoundText'));
    awardAchievement('room_created'); renderAchievements();
    const code = row.code;
    const box = $(`roomBox-${gameId}`) || $('detailRoomBox');
    if(!box) return showModal(t('roomNotFound'), t('roomNotFoundText'));
    box.innerHTML = `<p>${t('roomCreated',{user:escapeHtml(currentUser.user)})}</p><div class="copy-row"><input id="generatedCode-${gameId}" readonly value="${code}" /><button class="mini-btn" type="button" data-action="copy" data-game="${gameId}">${t('copy')}</button><button class="mini-btn" type="button" data-action="share" data-game="${gameId}">${t('share')}</button></div><p class="hint"><strong>${t('waitingGuest')}</strong><br>${t('roomOnline')}</p>`;
    box.classList.remove('hidden'); const joinBox=$(`joinBox-${gameId}`) || $('detailJoinBox'); if(joinBox) joinBox.classList.add('hidden');
    waitForGuest(code, gameId);
  }catch(err){
    console.error('Error creando sala online en Supabase:', err);
    showModal(t('roomNotFound'), err?.message || t('roomNotFoundText'));
  }
}
async function waitForGuest(code, gameId){
  clearRoomPoll();
  roomPollTimer = setInterval(async () => {
    if(!currentUser || !cloudEnabled()) return clearRoomPoll();
    try{
      const room = await window.PartidaRapidaSupabase.getRoom(cloudSessionToken(), code);
      if(room?.ok && room.status === 'playing' && room.guest_username){
        clearRoomPoll();
        showModal(t('connected'), t('roomPlayerJoined'));
        setTimeout(()=>{ closeModal(); startOnlineRoom(room, 'host'); }, 750);
      }
    }catch(err){ console.warn('No se pudo consultar sala.', err); }
  }, 1800);
}
function clearRoomPoll(){ if(roomPollTimer){ clearInterval(roomPollTimer); roomPollTimer = null; } }
function clearPongRoomSync(){ if(pongRoomSyncTimer){ clearInterval(pongRoomSyncTimer); pongRoomSyncTimer = null; } }
async function joinRoom(gameId){
  const code = $(`joinCode-${gameId}`).value.trim().toUpperCase();
  if(gameId === 'pong') return showModal(t('roomsDisabled'), t('roomsDisabled'));
  if(!['tictac','connect4'].includes(gameId)) return showModal(t('roomNotFound'), t('roomNotFoundText'));
  if(!code) return showModal(t('roomNotFound'), t('roomNotFoundText'));
  if(!cloudEnabled() || !cloudSessionToken()){
    return showModal(t('roomNotFound'), 'Para entrar en una sala real necesitas iniciar sesión con Supabase.');
  }
  try{
    const room = await window.PartidaRapidaSupabase.joinRoom(cloudSessionToken(), code, gameId);
    if(!room?.ok) return showModal(t('roomNotFound'), room?.message || t('roomNotFoundText'));
    awardAchievement('room_joined'); renderAchievements();
    showModal(t('playerJoined'), t('playerJoinedText',{code}));
    setTimeout(()=>{ closeModal(); startOnlineRoom(room, 'guest'); }, 750);
  }catch(err){
    console.error('Error entrando en sala online de Supabase:', err);
    showModal(t('roomNotFound'), err?.message || t('roomNotFoundText'));
  }
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
function modalNewGame(){ const gameId=pendingModalAction; closeModal(); if(gameId==='tictac-room') return resetTicRoomRound(); if(gameId==='connect4-room') return resetConnect4RoomRound(); if(gameId) startGame(gameId); }
function modalMenu(){ closeModal(); stopAllGames(); enterHome(); }
function updateGameLabels(){
  const set=(id,txt)=>{const el=$(id); if(el) el.textContent=txt;};
  set('pongLevelLabel', t('difficulty'));
  if(pong && pong.mode === 'room'){
    set('pongOverline', t('onlineRoom'));
    set('pongPlayerSmall', currentUser?.user || t('player'));
    set('pongCpuSmall', pong.opponentName || t('guest'));
    const title=$('pongTitle'); if(title) title.textContent = `${currentUser?.user || t('player')} vs ${pong.opponentName || t('guest')}`;
  } else {
    set('pongOverline', t('pongOver'));
    set('pongCpuSmall', t('cpu')); set('pongPlayerSmall', t('player'));
    const title=$('pongTitle'); if(title) title.textContent = t('pongTitle',{player:currentUser?.user || t('player')});
  }
  set('snakeLevelLabel', t('speed')); set('snakeLengthLabel', t('length')); set('snakeScoreSmall', t('points'));
  set('ticLevelLabel', t('difficulty')); set('ticRoundsLabel', t('rounds')); set('ticPointsSmall', t('points'));
  set('memoryOverline', t('memoryOver')); set('memoryTitle', t('memoryTitle')); set('memoryPointsSmall', t('points')); set('memoryMovesSmall', t('moves')); set('memoryPairsSmall', t('pairs')); set('memoryHint', t('memoryHint'));
  set('connect4Overline', t('connect4Over')); set('connect4Title', t('connect4Title')); set('connect4PointsSmall', t('points')); set('connect4DifficultyLabel', t('difficulty')); set('connect4RoundsSmall', t('rounds')); set('connect4Hint', t('connect4Hint')); if(connect4 && connect4.mode==='room'){ set('connect4Overline', t('connect4RoomOver')); set('connect4Hint', t('syncWarning')); }
}
function startGame(gameId){ if(gameId==='pong') startPong(); if(gameId==='snake') startSnake(); if(gameId==='tictac') startTicTac(); if(gameId==='memory') startMemory(); if(gameId==='connect4') startConnect4(); if(gameId==='shooter') startShooter(); }
function stopAllGames(){ clearRoomPoll(); clearPongRoomSync(); stopPong(); stopSnake(); stopTicTac(); stopMemory(); stopConnect4(); stopShooter(); }
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
function startPong(){ stopAllGames(); setVisibleAvatars(); switchScreen('pong'); initPong('cpu'); }
function startOnlineRoom(room, role){
  if(room?.game === 'tictac') return startTicRoom(room, role);
  if(room?.game === 'connect4') return startConnect4Room(room, role);
  return startPongRoom(room, role);
}
function startPongRoom(room, role){
  stopAllGames(); setVisibleAvatars(); switchScreen('pong'); initPong('room', room, role);
}
function initPong(mode='cpu', room=null, role='host'){
  const canvas=$('pongCanvas'), ctx=canvas.getContext('2d');
  const isRoom = mode === 'room';
  const opponentName = isRoom ? (role === 'host' ? room.guest_username : room.host_username) : t('cpu');
  pong={canvas,ctx,running:true,paused:false,finished:false,mode,role,roomCode:room?.code||'',opponentName:opponentName||t('guest'),lastSync:0,keys:{left:false,right:false},player:{x:canvas.width/2-58,y:canvas.height-34,w:116,h:12,score:0},cpu:{x:canvas.width/2-58,y:22,w:116,h:12,score:0,miss:0},ball:{x:canvas.width/2,y:canvas.height/2,r:8,vx:0,vy:0},points:0,level:1,last:performance.now(),start:performance.now(),countdown:null};
  resetPongBall(-1);
  updatePongHud();
  requestAnimationFrame(pongLoop);
}
function stopPong(){ if(pong) pong.running=false; clearPongRoomSync(); pong=null; }
function pongLoop(now){ if(!pong || !pong.running) return; const dt=Math.min(32, now-pong.last)/16.67; pong.last=now; if(!pong.paused){ if(pong.mode==='room') updatePongRoom(dt); else updatePong(dt); } drawPong(); requestAnimationFrame(pongLoop); }
function controlLocalPaddle(dt){
  if(!pong) return;
  const paddle = pong.player;
  const move=7.4*dt; if(pong.keys.left) paddle.x-=move; if(pong.keys.right) paddle.x+=move; paddle.x=clamp(paddle.x,0,pong.canvas.width-paddle.w);
}
function updatePong(dt){
  const {canvas,player,cpu,ball}=pong;
  if(handlePongCountdown(dt)) return;
  const elapsed=(performance.now()-pong.start)/1000;
  pong.level = 1 + Math.floor(elapsed/18) + Math.floor(pong.points/160);
  pong.points += 0.055 * pong.level * dt;
  controlLocalPaddle(dt);
  const cpuCenter=cpu.x+cpu.w/2, ballCenter=ball.x; const cpuSpeed=clamp(2.8+pong.level*.42,3,7.4)*dt;
  const mistakeChance=clamp(0.28 - pong.level*0.018, 0.07, 0.28);
  if(Math.random()<0.012) cpu.miss = Math.random()<mistakeChance ? (Math.random()>.5?1:-1)*(42 + Math.random()*90) : 0;
  const target=ballCenter + cpu.miss; if(cpuCenter < target-10) cpu.x+=cpuSpeed; if(cpuCenter > target+10) cpu.x-=cpuSpeed; cpu.x=clamp(cpu.x,0,canvas.width-cpu.w);
  ball.x += ball.vx*dt; ball.y += ball.vy*dt;
  if(ball.x<ball.r || ball.x>canvas.width-ball.r){ ball.vx*=-1; nudgePongBall(ball); playSound('point'); }
  if(hitPaddle(ball,player) && ball.vy>0){ ball.vy=-Math.abs(ball.vy)-0.16; addPongAngle(ball,player); stabilizePongAngle(ball); pong.points+=12; playSound('point'); }
  if(hitPaddle(ball,cpu) && ball.vy<0){ ball.vy=Math.abs(ball.vy)+0.12; addPongAngle(ball,cpu); stabilizePongAngle(ball); playSound('point'); }
  if(ball.y < -ball.r){ player.score++; pong.points+=80; flash('pongFlash',t('point')); resetPongBall(1); }
  if(ball.y > canvas.height+ball.r){ cpu.score++; flash('pongFlash',t('fail')); resetPongBall(-1); }
  if(player.score>=5 || cpu.score>=5) return finishPong(); updatePongHud();
}
function updatePongRoom(dt){
  const {canvas,player,cpu,ball}=pong;
  if(handlePongCountdown(dt)) return;
  controlLocalPaddle(dt);
  if(pong.role !== 'host') return updatePongHud();
  const elapsed=(performance.now()-pong.start)/1000;
  pong.level = 1 + Math.floor(elapsed/22);
  pong.points += 0.035 * pong.level * dt;
  ball.x += ball.vx*dt; ball.y += ball.vy*dt;
  if(ball.y<ball.r || ball.y>canvas.height-ball.r){ ball.vy*=-1; playSound('point'); }
  if(hitPaddle(ball,player) && ball.vx<0){ ball.vx=Math.abs(ball.vx)+0.14; addPongAngle(ball,player); pong.points+=10; playSound('point'); }
  if(hitPaddle(ball,cpu) && ball.vx>0){ ball.vx=-Math.abs(ball.vx)-0.14; addPongAngle(ball,cpu); playSound('point'); }
  if(ball.x < -ball.r){ cpu.score++; flash('pongFlash',t('fail')); resetPongBall(1); }
  if(ball.x > canvas.width+ball.r){ player.score++; pong.points+=70; flash('pongFlash',t('point')); resetPongBall(-1); }
  if(player.score>=5 || cpu.score>=5) return finishPongRoom(player.score>=5 ? 'host' : 'guest');
  updatePongHud();
}
function startPongRoomSync(){
  clearPongRoomSync();
  pongRoomSyncTimer = setInterval(syncPongRoom, 180);
}
async function syncPongRoom(){
  if(!pong || pong.mode !== 'room' || !cloudEnabled() || !cloudSessionToken() || pong.finished) return;
  try{
    if(pong.role === 'host'){
      const room = await window.PartidaRapidaSupabase.getRoom(cloudSessionToken(), pong.roomCode);
      const st = room?.state || {};
      if(typeof st.guestY === 'number') pong.cpu.y = clamp(st.guestY,0,pong.canvas.height-pong.cpu.h);
      const state = {
        status:'playing', target:5, hostY:pong.player.y, guestY:pong.cpu.y,
        ball:{x:pong.ball.x,y:pong.ball.y,vx:pong.ball.vx,vy:pong.ball.vy},
        hostScore:pong.player.score, guestScore:pong.cpu.score, level:pong.level
      };
      await window.PartidaRapidaSupabase.updateRoomState(cloudSessionToken(), pong.roomCode, state, 'playing');
    } else {
      const room = await window.PartidaRapidaSupabase.getRoom(cloudSessionToken(), pong.roomCode);
      const st = room?.state || {};
      if(st.status === 'ended') return finishPongRoom(st.winnerRole || 'host', st);
      if(st.ball){ pong.ball.x=Number(st.ball.x)||pong.ball.x; pong.ball.y=Number(st.ball.y)||pong.ball.y; pong.ball.vx=Number(st.ball.vx)||pong.ball.vx; pong.ball.vy=Number(st.ball.vy)||pong.ball.vy; }
      if(typeof st.hostY === 'number') pong.cpu.y = clamp(st.hostY,0,pong.canvas.height-pong.cpu.h);
      if(typeof st.hostScore === 'number') pong.cpu.score = st.hostScore;
      if(typeof st.guestScore === 'number') pong.player.score = st.guestScore;
      pong.level = Number(st.level)||pong.level;
      await window.PartidaRapidaSupabase.updateRoomState(cloudSessionToken(), pong.roomCode, {guestY:pong.player.y}, 'playing');
      updatePongHud();
    }
  }catch(err){ console.warn('Error sincronizando Pong online.', err); }
}
async function finishPongRoom(winnerRole, remoteState=null){
  if(!pong || pong.finished) return;
  pong.finished = true;
  const won = winnerRole === pong.role;
  const hostScore = pong.role === 'host' ? pong.player.score : pong.cpu.score;
  const guestScore = pong.role === 'guest' ? pong.player.score : pong.cpu.score;
  const points = won ? Math.round((pong.points || 0) + 160) : 2;
  if(pong.role === 'host' && !remoteState && cloudEnabled()){
    try{
      const state = {status:'ended', winnerRole, target:5, hostY:pong.player.y, guestY:pong.cpu.y, ball:pong.ball, hostScore, guestScore, level:pong.level};
      await window.PartidaRapidaSupabase.updateRoomState(cloudSessionToken(), pong.roomCode, state, 'finished');
    }catch(err){ console.warn('No se pudo cerrar sala online.', err); }
  }
  saveScore('pong', points, won ? `${hostScore}-${guestScore}` : t('consolationDetail'), {result:won?'win':'loss', mode:'room'});
  playSound(won?'win':'fail');
  stopPong();
  const text = `${won ? t('roomWin') : t('roomLoss')} ${t('totalSaved',{points})}`;
  setTimeout(()=>{ showResultModal(won ? t('winDetail') : t('result'), text, 'pong'); }, 650);
}
function resetPongBall(direction){
  if(!pong) return;
  const {canvas,ball}=pong;
  ball.x=canvas.width/2; ball.y=canvas.height/2; ball.vx=0; ball.vy=0;
  pong.countdown = {start:performance.now(), duration:3000, direction};
}
function handlePongCountdown(dt){
  if(!pong || !pong.countdown) return false;
  controlLocalPaddle(dt);
  const {canvas,cpu}=pong;
  const centerTarget = canvas.width/2 - cpu.w/2;
  cpu.x += (centerTarget - cpu.x) * 0.05 * dt;
  const elapsed = performance.now() - pong.countdown.start;
  if(elapsed >= pong.countdown.duration){
    const direction = pong.countdown.direction || -1;
    pong.countdown = null;
    pong.ball.vy = direction*(4.2 + pong.level*.18);
    pong.ball.vx = (Math.random()>.5?1:-1)*(2.4+Math.random()*2.8);
    stabilizePongAngle(pong.ball);
  }
  updatePongHud();
  return true;
}
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
  ctx.strokeStyle='rgba(255,255,255,.62)'; ctx.setLineDash([10,14]); ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(24,canvas.height/2); ctx.lineTo(canvas.width-24,canvas.height/2); ctx.stroke(); ctx.setLineDash([]);
  drawPaddle(ctx,player,'#fff'); drawPaddle(ctx,cpu,'#fff'); ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.9)'; ctx.font='800 16px system-ui'; ctx.textAlign='center'; ctx.fillText(t('firstTo5'),canvas.width/2,canvas.height/2-16);
  if(pong.countdown){ const remaining=Math.max(0, pong.countdown.duration-(performance.now()-pong.countdown.start)); const num=Math.max(1, Math.ceil(remaining/1000)); ctx.fillStyle='rgba(0,0,0,.42)'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle='#fff'; ctx.font='1000 76px system-ui'; ctx.textAlign='center'; ctx.fillText(String(num),canvas.width/2,canvas.height/2+26); }
  if(pong.paused){ ctx.fillStyle='rgba(0,0,0,.45)'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle='#fff'; ctx.font='900 34px system-ui'; ctx.textAlign='center'; ctx.fillText(t('paused'),canvas.width/2,canvas.height/2); }
}
function drawPaddle(ctx,p,color){ ctx.fillStyle=color; roundRect(ctx,p.x,p.y,p.w,p.h,6); ctx.fill(); }
function roundRect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function hitPaddle(ball,p){ return ball.x-ball.r < p.x+p.w && ball.x+ball.r > p.x && ball.y+ball.r > p.y && ball.y-ball.r < p.y+p.h; }
function addPongAngle(ball,paddle){
  const relative=clamp((ball.x-(paddle.x+paddle.w/2))/(paddle.w/2),-1,1);
  const previousSpin = clamp(ball.vx*0.18,-0.65,0.65);
  const randomSpin = (Math.random()-.5)*0.55;
  ball.vx = relative*5.4 + previousSpin + randomSpin;
}
function stabilizePongAngle(ball){
  const minX = 1.45;
  const maxX = 6.2;
  if(Math.abs(ball.vx) < minX){
    const sign = ball.vx === 0 ? (Math.random()>.5?1:-1) : Math.sign(ball.vx);
    ball.vx = sign * (minX + Math.random()*0.85);
  }
  ball.vx = clamp(ball.vx, -maxX, maxX);
  const minY = 3.6;
  if(Math.abs(ball.vy) < minY){
    const signY = ball.vy === 0 ? (Math.random()>.5?1:-1) : Math.sign(ball.vy);
    ball.vy = signY * minY;
  }
}
function nudgePongBall(ball){
  ball.vx += (Math.random()-.5)*0.35;
  stabilizePongAngle(ball);
}

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


// MEMORY
function startMemory(){ stopAllGames(); setVisibleAvatars(); switchScreen('memory'); initMemory(); }
function initMemory(){
  const symbols=['🍎','⭐','🎲','🚀','🐍','🏆','🧩','🎮'];
  const cards=shuffle([...symbols,...symbols]).map((symbol,index)=>({id:index,symbol,open:false,matched:false}));
  memory={cards,first:null,second:null,locked:false,moves:0,pairs:0,points:0,start:performance.now(),running:true};
  renderMemoryBoard(); updateMemoryHud();
}
function stopMemory(){ memory=null; }
function renderMemoryBoard(){
  const board=$('memoryBoard'); if(!board || !memory) return;
  board.innerHTML='';
  memory.cards.forEach(card=>{
    const btn=document.createElement('button');
    btn.className=`memory-card ${card.open||card.matched?'open':''} ${card.matched?'matched':''}`;
    btn.type='button'; btn.dataset.id=card.id;
    btn.textContent = card.open || card.matched ? card.symbol : '?';
    btn.addEventListener('click',()=>flipMemoryCard(card.id));
    board.appendChild(btn);
  });
}
function flipMemoryCard(id){
  if(!memory || memory.locked) return;
  const card=memory.cards.find(c=>c.id===id);
  if(!card || card.open || card.matched) return;
  card.open=true;
  if(memory.first===null){ memory.first=id; renderMemoryBoard(); return; }
  memory.second=id; memory.moves++;
  const a=memory.cards.find(c=>c.id===memory.first), b=card;
  if(a && b && a.symbol===b.symbol){
    a.matched=b.matched=true; memory.first=null; memory.second=null; memory.pairs++; memory.points += Math.max(45, 100 - memory.moves*2); playSound('point');
    renderMemoryBoard(); updateMemoryHud();
    if(memory.pairs===8) return finishMemory();
  } else {
    memory.locked=true; playSound('fail'); renderMemoryBoard(); updateMemoryHud();
    setTimeout(()=>{ if(!memory) return; if(a) a.open=false; if(b) b.open=false; memory.first=null; memory.second=null; memory.locked=false; renderMemoryBoard(); updateMemoryHud(); }, 650);
  }
  updateMemoryHud();
}
function updateMemoryHud(){
  if(!memory) return;
  const elapsed=(performance.now()-memory.start)/1000;
  const timeBonus=Math.max(0, Math.round(180-elapsed*2));
  const movePenalty=memory.moves*7;
  const live=Math.max(0, Math.round(memory.points + timeBonus - movePenalty));
  $('memoryScore').textContent=live; $('memoryMoves').textContent=memory.moves; $('memoryPairs').textContent=`${memory.pairs}/8`;
}
function finishMemory(){
  if(!memory || !memory.running) return;
  memory.running=false;
  const elapsed=(performance.now()-memory.start)/1000;
  const points=Math.max(80, Math.round(memory.points + Math.max(0,200-elapsed*2) - memory.moves*6));
  saveScore('memory', points, `${t('moves')} ${memory.moves}`, {result:'win', mode:'solo', elapsed});
  playSound('win');
  setTimeout(()=>{ showResultModal(t('memoryOver'), `${t('wonMaster')} ${t('totalSaved',{points})}`, 'memory'); }, 350);
}
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
  return arr;
}


// CUATRO EN RAYA
function startConnect4(){ stopAllGames(); setVisibleAvatars(); switchScreen('connect4'); connect4={mode:'cpu',role:'host',board:createConnect4Board(),locked:false,rounds:0,points:0,level:1,started:performance.now(),scoreSaved:false}; updateGameLabels(); newConnect4Round(); }
function startConnect4Room(room, role){
  stopAllGames(); setVisibleAvatars(); switchScreen('connect4');
  connect4={mode:'room',role,roomCode:room.code,board:createConnect4Board(),locked:false,rounds:0,points:0,level:1,started:performance.now(),scoreSaved:false,hostUsername:room.host_username,guestUsername:room.guest_username};
  updateGameLabels();
  $('connect4Overline').textContent=t('connect4RoomOver');
  $('connect4Title').textContent=`${room.host_username || t('host')} 🔴 vs ${room.guest_username || t('guest')} 🟡`;
  const st=normalizeConnect4State(room.state);
  if(role==='host' && (!room.state || !Array.isArray(room.state.board))){ updateConnect4RoomState(makeConnect4State(createConnect4Board(),'host','playing')).catch(console.warn); }
  applyConnect4RoomState(st);
  startConnect4RoomSync();
}
function stopConnect4(){ clearConnect4RoomSync(); connect4=null; }
function clearConnect4RoomSync(){ if(connect4RoomSyncTimer){ clearInterval(connect4RoomSyncTimer); connect4RoomSyncTimer=null; } }
function startConnect4RoomSync(){ clearConnect4RoomSync(); connect4RoomSyncTimer=setInterval(syncConnect4Room, 1200); }
function createConnect4Board(){ return Array.from({length:6},()=>Array(7).fill('')); }
function newConnect4Round(){
  if(!connect4) return;
  if(connect4.mode==='room') return resetConnect4RoomRound();
  connect4.board=createConnect4Board(); connect4.locked=false; connect4.started=performance.now(); connect4.level=1+Math.floor(connect4.rounds/2); connect4.scoreSaved=false;
  $('connect4Status').textContent=t('chooseColumn'); updateConnect4Hud(); renderConnect4Board();
}
function updateConnect4Hud(){ if(!connect4) return; $('connect4Points').textContent=connect4.points; $('connect4Rounds').textContent=connect4.rounds; $('connect4Level').textContent=connect4.level; updateGameLabels(); if(connect4.mode==='room'){ $('connect4Overline').textContent=t('connect4RoomOver'); $('connect4Hint').textContent=t('syncWarning'); } }
function renderConnect4Board(winLine=[]){
  const board=$('connect4Board'); if(!board) return; board.innerHTML='';
  const values=connect4?connect4.board:createConnect4Board();
  for(let r=0;r<6;r++){
    for(let c=0;c<7;c++){
      const btn=document.createElement('button'); btn.type='button'; btn.className=`connect4-cell ${values[r][c]?'filled':''} ${winLine.some(([rr,cc])=>rr===r&&cc===c)?'win':''}`; btn.dataset.col=c; btn.textContent=values[r][c] || '';
      btn.addEventListener('click',()=>playerConnect4Move(c)); board.appendChild(btn);
    }
  }
}
function dropConnect4(board,col,mark){ for(let r=5;r>=0;r--){ if(!board[r][col]){ board[r][col]=mark; return r; } } return -1; }
function validConnect4Cols(board){ return Array.from({length:7},(_,i)=>i).filter(c=>!board[0][c]); }
function playerConnect4Move(col){
  if(!connect4 || connect4.locked) return;
  if(connect4.mode==='room') return playerConnect4RoomMove(col);
  const row=dropConnect4(connect4.board,col,'🔴');
  if(row<0){ $('connect4Status').textContent=t('fullColumn'); return; }
  renderConnect4Board(); const res=checkConnect4Board(connect4.board); if(res) return finishConnect4(res);
  connect4.locked=true; $('connect4Status').textContent=t('cpuThinking'); setTimeout(cpuConnect4Move, 420);
}
function cpuConnect4Move(){
  if(!connect4) return;
  const col=chooseConnect4CpuCol(); if(col===-1) return finishConnect4({winner:'draw',line:[]});
  dropConnect4(connect4.board,col,'🟡'); renderConnect4Board(); const res=checkConnect4Board(connect4.board); if(res) return finishConnect4(res);
  connect4.locked=false; $('connect4Status').textContent=t('chooseColumn');
}
function chooseConnect4CpuCol(){
  const board=connect4.board; const valid=validConnect4Cols(board); if(!valid.length) return -1;
  const mistakeChance=clamp(0.42-connect4.level*0.055,0.10,0.42);
  if(Math.random()>mistakeChance){
    for(const c of valid){ const copy=board.map(r=>[...r]); dropConnect4(copy,c,'🟡'); if(checkConnect4Board(copy)?.winner==='🟡') return c; }
    for(const c of valid){ const copy=board.map(r=>[...r]); dropConnect4(copy,c,'🔴'); if(checkConnect4Board(copy)?.winner==='🔴') return c; }
    const centerOrder=[3,2,4,1,5,0,6].filter(c=>valid.includes(c)); if(centerOrder.length) return centerOrder[0];
  }
  return valid[Math.floor(Math.random()*valid.length)];
}
function checkConnect4Board(board){
  const dirs=[[0,1],[1,0],[1,1],[1,-1]];
  for(let r=0;r<6;r++) for(let c=0;c<7;c++){
    const mark=board[r][c]; if(!mark) continue;
    for(const [dr,dc] of dirs){ const line=[[r,c]]; for(let k=1;k<4;k++){ const rr=r+dr*k, cc=c+dc*k; if(rr<0||rr>=6||cc<0||cc>=7||board[rr][cc]!==mark) break; line.push([rr,cc]); } if(line.length===4) return {winner:mark,line}; }
  }
  if(validConnect4Cols(board).length===0) return {winner:'draw',line:[]};
  return null;
}
function finishConnect4(res){
  connect4.locked=true; connect4.rounds++;
  let gained=0,result='',title='',msg=''; const timeBonus=Math.max(0,30-Math.floor((performance.now()-connect4.started)/1000));
  if(res.winner==='🔴'){ gained=100+connect4.level*18+timeBonus; result='win'; title=t('wonMaster'); msg=`${t('wonMaster')} ${t('totalSaved',{points:connect4.points+gained})}`; playSound('win'); awardAchievement('connect4_win'); }
  else if(res.winner==='🟡'){ gained=2; result='loss'; title=t('result'); msg=`${t('lostMaster')} ${t('totalSaved',{points:gained})}`; playSound('fail'); }
  else { gained=25; result='draw'; title=t('draw'); msg=`${t('drawText')} ${t('totalSaved',{points:connect4.points+gained})}`; playSound('point'); }
  connect4.points=result==='loss'?gained:connect4.points+gained; updateConnect4Hud(); renderConnect4Board(res.line||[]);
  saveScore('connect4', connect4.points, result==='loss'?t('consolationDetail'):`${connect4.rounds} ${t('rounds').toLowerCase()}`, {result});
  setTimeout(()=>showResultModal(title,msg,'connect4'),500);
}
function normalizeConnect4State(st){
  st=st||{}; let board=createConnect4Board();
  if(Array.isArray(st.board) && st.board.length===6){ board=st.board.map(row=>Array.isArray(row)?row.slice(0,7).map(v=>v==='🔴'||v==='🟡'?v:''):Array(7).fill('')); while(board.length<6) board.push(Array(7).fill('')); board=board.map(row=>{ while(row.length<7) row.push(''); return row; }); }
  return {board,turn:st.turn==='guest'?'guest':'host',status:st.status||'playing',winnerRole:st.winnerRole||null,result:st.result||null,line:Array.isArray(st.line)?st.line:[]};
}
function makeConnect4State(board,turn,status='playing',extra={}){ return {board,turn,status,...extra}; }
async function updateConnect4RoomState(state,status){ return await window.PartidaRapidaSupabase.updateRoomState(cloudSessionToken(), connect4.roomCode, state, status || state.status || 'playing'); }
function applyConnect4RoomState(st){
  if(!connect4 || connect4.mode!=='room') return;
  connect4.board=st.board; connect4.locked=st.status==='finished' || st.turn!==connect4.role; renderConnect4Board(st.line||[]); updateConnect4Hud();
  if(st.status==='finished') return finishConnect4RoomFromState(st);
  $('connect4Status').textContent=st.turn===connect4.role?t('chooseColumn'):t('opponentTurn');
}
function resetConnect4RoomRound(){
  if(!connect4 || connect4.mode!=='room') return startConnect4();
  connect4.scoreSaved=false; const state=makeConnect4State(createConnect4Board(),'host','playing',{result:null,winnerRole:null,line:[]}); applyConnect4RoomState(state); updateConnect4RoomState(state,'playing').catch(err=>showModal(t('roomNotFound'),err?.message||t('roomNotFoundText')));
}
async function syncConnect4Room(){
  if(!connect4 || connect4.mode!=='room' || !cloudEnabled() || !cloudSessionToken()) return;
  try{ const room=await window.PartidaRapidaSupabase.getRoom(cloudSessionToken(),connect4.roomCode); if(room?.ok){ connect4.hostUsername=room.host_username; connect4.guestUsername=room.guest_username; applyConnect4RoomState(normalizeConnect4State(room.state)); } }catch(err){ console.warn('No se pudo sincronizar Cuatro en raya online.',err); }
}
async function playerConnect4RoomMove(col){
  const mark=connect4.role==='host'?'🔴':'🟡'; const nextTurn=connect4.role==='host'?'guest':'host'; const board=connect4.board.map(r=>[...r]);
  const row=dropConnect4(board,col,mark); if(row<0){ $('connect4Status').textContent=t('fullColumn'); return; }
  connect4.board=board; connect4.locked=true; renderConnect4Board(); $('connect4Status').textContent=t('opponentTurn');
  const res=checkConnect4Board(board); let state;
  if(res){ let result='draw',winnerRole=null; if(res.winner==='🔴'){ result='win'; winnerRole='host'; } if(res.winner==='🟡'){ result='win'; winnerRole='guest'; } state=makeConnect4State(board,nextTurn,'finished',{result,winnerRole,line:res.line}); await updateConnect4RoomState(state,'finished'); applyConnect4RoomState(state); }
  else { state=makeConnect4State(board,nextTurn,'playing'); await updateConnect4RoomState(state,'playing'); }
}
function finishConnect4RoomFromState(st){
  if(!connect4 || connect4.scoreSaved) return;
  connect4.scoreSaved=true; connect4.locked=true; renderConnect4Board(st.line||[]);
  const won=st.winnerRole===connect4.role; const draw=st.result==='draw'||!st.winnerRole; const gained=draw?25:(won?100:2); const result=draw?'draw':(won?'win':'loss');
  connect4.points=gained; updateConnect4Hud(); if(won){ playSound('win'); awardAchievement('connect4_win'); } else if(draw) playSound('point'); else playSound('fail');
  saveScore('connect4',gained,draw?t('draw'):(won?t('winDetail'):t('consolationDetail')),{result,mode:'room'});
  const msg=draw?`${t('connect4RoomDraw')} ${t('totalSaved',{points:gained})}`:`${won?t('connect4RoomWin'):t('connect4RoomLoss')} ${t('totalSaved',{points:gained})}`;
  setTimeout(()=>showResultModal(draw?t('draw'):(won?t('winDetail'):t('result')),msg,'connect4-room'),500);
}

// TRES EN RAYA
function startTicTac(){ stopAllGames(); setVisibleAvatars(); switchScreen('tictac'); tic={mode:'cpu',board:Array(9).fill(''),locked:false,rounds:0,points:0,level:1,started:performance.now()}; updateGameLabels(); renderTicBoard(); newTicRound(); }
function startTicRoom(room, role){
  stopAllGames(); setVisibleAvatars(); switchScreen('tictac');
  tic={mode:'room',role,roomCode:room.code,board:Array(9).fill(''),locked:false,rounds:0,points:0,level:1,started:performance.now(),scoreSaved:false,hostUsername:room.host_username,guestUsername:room.guest_username};
  updateGameLabels();
  $('ticOverline').textContent = t('ticRoomOver');
  $('ticTitle').textContent = `${room.host_username || t('host')} ❌ vs ${room.guest_username || t('guest')} ⭕`;
  const st = normalizeTicState(room.state);
  if(role === 'host' && (!room.state || !Array.isArray(room.state.board))){
    updateTicRoomState(makeTicState(Array(9).fill(''), 'host', 'playing')).catch(console.warn);
  }
  applyTicRoomState(st);
  startTicRoomSync();
}
function stopTicTac(){ clearTicRoomSync(); tic=null; }
function clearTicRoomSync(){ if(ticRoomSyncTimer){ clearInterval(ticRoomSyncTimer); ticRoomSyncTimer=null; } }
function startTicRoomSync(){ clearTicRoomSync(); ticRoomSyncTimer=setInterval(syncTicRoom, 1200); }
async function syncTicRoom(){
  if(!tic || tic.mode!=='room' || !cloudEnabled() || !cloudSessionToken()) return;
  try{
    const room = await window.PartidaRapidaSupabase.getRoom(cloudSessionToken(), tic.roomCode);
    if(room?.ok){ tic.hostUsername=room.host_username; tic.guestUsername=room.guest_username; applyTicRoomState(normalizeTicState(room.state)); }
  }catch(err){ console.warn('No se pudo sincronizar Tres en raya online.', err); }
}
function normalizeTicState(st){
  st = st || {};
  const board = Array.isArray(st.board) && st.board.length===9 ? st.board.map(v => v==='❌'||v==='⭕'?v:'') : Array(9).fill('');
  return { board, turn: st.turn==='guest'?'guest':'host', status: st.status || 'playing', winnerRole: st.winnerRole || null, result: st.result || null, line: Array.isArray(st.line)?st.line:[] };
}
function makeTicState(board, turn, status='playing', extra={}){ return {board, turn, status, ...extra}; }
async function updateTicRoomState(state, status){
  return await window.PartidaRapidaSupabase.updateRoomState(cloudSessionToken(), tic.roomCode, state, status || state.status || 'playing');
}
function applyTicRoomState(st){
  if(!tic || tic.mode!=='room') return;
  tic.board = st.board;
  tic.locked = st.status === 'finished' || st.turn !== tic.role;
  renderTicBoard(st.line || []);
  updateTicHud();
  if(st.status === 'finished') return finishTicRoomFromState(st);
  $('ticStatus').textContent = st.turn === tic.role ? t('yourTurn') : t('opponentTurn');
}
function resetTicRoomRound(){
  if(!tic || tic.mode!=='room') return startTicTac();
  tic.scoreSaved=false;
  const state = makeTicState(Array(9).fill(''), 'host', 'playing', {result:null,winnerRole:null,line:[]});
  applyTicRoomState(state);
  updateTicRoomState(state, 'playing').catch(err=>showModal(t('roomNotFound'), err?.message || t('roomNotFoundText')));
}
function newTicRound(){
  if(!tic) return;
  if(tic.mode==='room') return resetTicRoomRound();
  tic.board=Array(9).fill(''); tic.locked=false; tic.started=performance.now(); tic.level=1+Math.floor(tic.rounds/2); $('ticStatus').textContent=t('yourTurn'); updateTicHud(); renderTicBoard();
}
function updateTicHud(){ if(!tic) return; $('ticPoints').textContent=tic.points; $('ticRounds').textContent=tic.rounds; $('ticLevel').textContent=tic.level; updateGameLabels(); if(tic.mode==='room'){ $('ticOverline').textContent=t('ticRoomOver'); $('ticHint').textContent=t('syncWarning'); } }
function renderTicBoard(winLine=[]){ const board=$('ticBoard'); board.innerHTML=''; const values = tic ? tic.board : Array(9).fill(''); values.forEach((v,i)=>{ const b=document.createElement('button'); b.className=`tic-cell ${winLine.includes(i)?'win':''}`; b.textContent=v; b.type='button'; b.addEventListener('click',()=>playerTicMove(i)); board.appendChild(b); }); }
function playerTicMove(i){
  if(!tic || tic.locked || tic.board[i]) return;
  if(tic.mode==='room') return playerTicRoomMove(i);
  tic.board[i]='❌'; renderTicBoard(); const res=checkTic(); if(res) return finishTic(res); tic.locked=true; $('ticStatus').textContent=t('cpuThinking'); setTimeout(cpuTicMove, 420);
}
async function playerTicRoomMove(i){
  const mark = tic.role === 'host' ? '❌' : '⭕';
  const nextTurn = tic.role === 'host' ? 'guest' : 'host';
  const board = [...tic.board]; board[i]=mark;
  tic.board=board; tic.locked=true; renderTicBoard(); $('ticStatus').textContent=t('opponentTurn');
  const res = checkTicBoard(board);
  let state;
  if(res){
    let result = 'draw', winnerRole = null;
    if(res.winner==='❌'){ result='win'; winnerRole='host'; }
    if(res.winner==='⭕'){ result='win'; winnerRole='guest'; }
    state = makeTicState(board, nextTurn, 'finished', {result, winnerRole, line:res.line});
    await updateTicRoomState(state, 'finished');
    applyTicRoomState(state);
  }else{
    state = makeTicState(board, nextTurn, 'playing');
    await updateTicRoomState(state, 'playing');
  }
}
function cpuTicMove(){ if(!tic) return; const move=chooseCpuMove(); if(move !== -1) tic.board[move]='⭕'; renderTicBoard(); const res=checkTic(); if(res) return finishTic(res); tic.locked=false; $('ticStatus').textContent=t('yourTurn'); }
function chooseCpuMove(){ const empty=tic.board.map((v,i)=>v?null:i).filter(v=>v!==null); const mistakeChance=clamp(0.38 - tic.level*0.055, 0.08, 0.38); if(Math.random()<mistakeChance){ const m=empty[Math.floor(Math.random()*empty.length)]; setTimeout(()=>{ const cells=[...document.querySelectorAll('.tic-cell')]; if(cells[m]) cells[m].classList.add('fail'); }, 20); return m; } const win=findBestLine('⭕'); if(win!==-1) return win; const block=findBestLine('❌'); if(block!==-1) return block; if(tic.board[4]==='') return 4; const corners=[0,2,6,8].filter(i=>tic.board[i]===''); if(corners.length) return corners[Math.floor(Math.random()*corners.length)]; return empty[Math.floor(Math.random()*empty.length)] ?? -1; }
function findBestLine(mark){ const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; for(const line of lines){ const vals=line.map(i=>tic.board[i]); if(vals.filter(v=>v===mark).length===2 && vals.includes('')) return line[vals.indexOf('')]; } return -1; }
function checkTic(){ return checkTicBoard(tic.board); }
function checkTicBoard(board){ const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; for(const line of lines){ const [a,b,c]=line; if(board[a] && board[a]===board[b] && board[a]===board[c]) return {winner:board[a], line}; } if(board.every(Boolean)) return {winner:'draw', line:[]}; return null; }
function finishTic(res){
  tic.locked=true; tic.rounds++;
  let gained=0, result=''; let title='', msg='';
  const timeBonus=Math.max(0, 25-Math.floor((performance.now()-tic.started)/1000));
  if(res.winner==='❌'){ gained=80+tic.level*15+timeBonus; result='win'; title=t('wonMaster'); msg=`${t('wonMaster')} ${t('totalSaved',{points: tic.points + gained})}`; playSound('win'); }
  else if(res.winner==='⭕'){ gained=2; result='loss'; title=t('result'); msg=`${t('lostMaster')} ${t('totalSaved',{points:gained})}`; playSound('fail'); }
  else { gained=20; result='draw'; title=t('draw'); msg=`${t('drawText')} ${t('totalSaved',{points: tic.points + gained})}`; playSound('point'); }
  tic.points = result==='loss' ? gained : tic.points + gained;
  updateTicHud(); renderTicBoard(res.line);
  saveScore('tictac', tic.points, result=== 'loss' ? t('consolationDetail') : `${tic.rounds} ${t('rounds').toLowerCase()}`, {result});
  if(result==='win') awardAchievement('tic_win');
  setTimeout(()=>{ showResultModal(title, msg, 'tictac'); }, 500);
}
function finishTicRoomFromState(st){
  if(!tic || tic.scoreSaved) return;
  tic.scoreSaved = true; tic.locked=true; renderTicBoard(st.line || []);
  const won = st.winnerRole === tic.role;
  const draw = st.result === 'draw' || !st.winnerRole;
  let gained = draw ? 20 : (won ? 80 : 2);
  let result = draw ? 'draw' : (won ? 'win' : 'loss');
  tic.points = gained; updateTicHud();
  if(won){ playSound('win'); awardAchievement('tic_win'); }
  else if(draw) playSound('point'); else playSound('fail');
  saveScore('tictac', gained, draw ? t('draw') : (won ? t('winDetail') : t('consolationDetail')), {result, mode:'room'});
  const msg = draw ? `${t('ticRoomDraw')} ${t('totalSaved',{points:gained})}` : `${won ? t('ticRoomWin') : t('ticRoomLoss')} ${t('totalSaved',{points:gained})}`;
  setTimeout(()=>{ showResultModal(draw ? t('draw') : (won ? t('winDetail') : t('result')), msg, 'tictac-room'); }, 500);
}


// MATAMARCIANOS
function startShooter(){
  stopAllGames(); setVisibleAvatars(); switchScreen('shooter'); initShooter();
}
function stopShooter(){
  if(shooter?.raf) cancelAnimationFrame(shooter.raf);
  shooter = null;
}
function initShooter(){
  const canvas=$('shooterCanvas'); if(!canvas) return;
  const ctx=canvas.getContext('2d');
  shooter={canvas,ctx,score:0,lives:5,maxLives:7,health:100,maxHealth:100,bombs:0,maxBombs:3,level:1,nextLife:5000,bosses:0,kills:0,killsForBoss:24,enemies:[],bullets:[],enemyBullets:[],powerups:[],particles:[],stars:[],boss:null,player:{x:190,y:420,w:30,h:36,speed:340},axis:0,fire:false,fireCd:0,bombCd:0,inv:0,hitInv:0,respawn:false,paused:false,finished:false,last:0,raf:null};
  resizeShooter(); spawnShooterStars(); spawnShooterWave(); updateShooterHud(); showShooterMsg('NIVEL 1',900); shooter.raf=requestAnimationFrame(loopShooter);
}
function resizeShooter(){
  if(!shooter) return; const rect=shooter.canvas.getBoundingClientRect(); const dpr=Math.max(1,Math.min(2,window.devicePixelRatio||1));
  shooter.w=Math.max(300,Math.floor(rect.width)); shooter.h=Math.max(420,Math.floor(rect.height)); shooter.dpr=dpr;
  shooter.canvas.width=Math.floor(shooter.w*dpr); shooter.canvas.height=Math.floor(shooter.h*dpr); shooter.ctx.setTransform(dpr,0,0,dpr,0,0);
  shooter.player.x=clamp(shooter.player.x||shooter.w/2,24,shooter.w-24); shooter.player.y=shooter.h-54; spawnShooterStars();
}
function spawnShooterStars(){
  if(!shooter) return; const n=Math.floor((shooter.w*shooter.h)/5200);
  shooter.stars=Array.from({length:n},()=>({x:Math.random()*shooter.w,y:Math.random()*shooter.h,r:Math.random()*1.4+.4,s:10+Math.random()*26}));
}
function updateShooterHud(){
  if(!shooter) return;
  $('shooterScore').textContent=Math.round(shooter.score);
  $('shooterLives').textContent='♥'.repeat(Math.max(0,shooter.lives));
  $('shooterBombs').textContent='💣 '+shooter.bombs;
  const hpPct=Math.max(0,Math.min(100,Math.round((shooter.health/shooter.maxHealth)*100)));
  const bar=$('shooterHealthBar');
  const txt=$('shooterHealthText');
  if(bar){
    bar.style.width=hpPct+'%';
    const hue=Math.round((hpPct/100)*120);
    bar.style.background=`linear-gradient(90deg,hsl(${hue},78%,46%),hsl(${Math.max(0,hue-18)},86%,55%))`;
  }
  if(txt) txt.textContent=hpPct+'%';
}
function showShooterMsg(text,ms=900){ const el=$('shooterFlash'); if(!el) return; el.textContent=text; el.classList.remove('hidden'); clearTimeout(showShooterMsg.t); showShooterMsg.t=setTimeout(()=>el.classList.add('hidden'),ms); }
function spawnShooterWave(){
  if(!shooter || shooter.boss) return; const rows=Math.min(5,2+Math.floor(shooter.level/2)); const cols=Math.min(7,4+Math.floor(shooter.level/2)); const gap=shooter.w/(cols+1);
  for(let r=0;r<rows;r++){ for(let c=0;c<cols;c++){ const hp=shooter.level>=3 && r===0 ? 2 : 1; shooter.enemies.push({x:gap*(c+1),y:52+r*34,w:25,h:20,hp,maxHp:hp,vx:(22+shooter.level*7)*(r%2?-1:1),shoot:.7+Math.random()*2.5,color:(r+c+shooter.level)%5}); }}
}
function spawnShooterBoss(){
  shooter.boss={x:shooter.w/2,y:84,w:Math.min(145,shooter.w*.44),h:68,hp:24+shooter.level*8,maxHp:24+shooter.level*8,vx:70+shooter.level*8,shoot:.8}; shooter.enemies=[]; shooter.enemyBullets=[]; showShooterMsg('¡ALERTA!\nJEFE FINAL',1200);
}
function nextShooterLevel(){
  shooter.level++; shooter.kills=0; shooter.killsForBoss=24+shooter.level*6; shooter.boss=null; shooter.enemyBullets=[]; shooter.bullets=[]; shooter.powerups=[]; showShooterMsg('PANTALLA\nSUPERADA',1300); setTimeout(()=>{ if(shooter && !shooter.finished) spawnShooterWave(); },850);
}
function loopShooter(t){
  if(!shooter) return; const now=t/1000; const dt=Math.min(.033,now-(shooter.last||now)); shooter.last=now; if(!shooter.paused && !shooter.finished) updateShooter(dt); drawShooter(); shooter.raf=requestAnimationFrame(loopShooter);
}
function updateShooter(dt){
  if(shooter.respawn) return; shooter.fireCd=Math.max(0,shooter.fireCd-dt); shooter.bombCd=Math.max(0,shooter.bombCd-dt); shooter.inv=Math.max(0,shooter.inv-dt); shooter.hitInv=Math.max(0,shooter.hitInv-dt);
  shooter.stars.forEach(s=>{s.y+=s.s*dt*(1+shooter.level*.07); if(s.y>shooter.h){s.y=-3;s.x=Math.random()*shooter.w;}});
  shooter.player.x=clamp(shooter.player.x+shooter.axis*shooter.player.speed*dt,22,shooter.w-22); if(shooter.fire) shooterFire();
  shooter.bullets.forEach(b=>b.y+=b.vy*dt); shooter.bullets=shooter.bullets.filter(b=>b.y>-20);
  shooter.enemyBullets.forEach(b=>{b.x+=(b.vx||0)*dt;b.y+=b.vy*dt;}); shooter.enemyBullets=shooter.enemyBullets.filter(b=>b.y<shooter.h+25 && b.x>-30 && b.x<shooter.w+30);
  updateShooterEnemies(dt); updateShooterBoss(dt); updateShooterPowerups(dt); updateShooterParticles(dt); collideShooter();
  if(!shooter.boss && shooter.enemies.length===0){ if(shooter.kills>=shooter.killsForBoss) spawnShooterBoss(); else spawnShooterWave(); }
}
function updateShooterEnemies(dt){
  let reverse=false; shooter.enemies.forEach(e=>{e.x+=e.vx*dt; e.y+=(5+shooter.level*1.4)*dt; if(e.x<18||e.x>shooter.w-18) reverse=true; e.shoot-=dt; if(e.shoot<=0 && Math.random()<.32){ shooter.enemyBullets.push({x:e.x,y:e.y+14,vx:(Math.random()-.5)*Math.min(70,shooter.level*12),vy:145+shooter.level*18,r:4}); e.shoot=Math.max(.8,2.7-shooter.level*.16)+Math.random()*1.2; } if(e.y>shooter.player.y-34) shooterTakeDamage(50);});
  if(reverse) shooter.enemies.forEach(e=>{e.vx*=-1;e.y+=10;});
}
function updateShooterBoss(dt){
  const b=shooter.boss; if(!b) return; b.x+=b.vx*dt; if(b.x<b.w/2+8||b.x>shooter.w-b.w/2-8) b.vx*=-1; b.shoot-=dt; if(b.shoot<=0){ const arr=shooter.level>=4?[-.85,-.45,0,.45,.85]:[-.55,0,.55]; arr.forEach(a=>shooter.enemyBullets.push({x:b.x,y:b.y+b.h/2,vx:a*125,vy:175+shooter.level*18,r:5})); b.shoot=Math.max(.45,1.15-shooter.level*.08); }
}
function updateShooterPowerups(dt){ shooter.powerups.forEach(p=>p.y+=p.vy*dt); shooter.powerups=shooter.powerups.filter(p=>p.y<shooter.h+30); }
function updateShooterParticles(dt){ shooter.particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.98;p.vy*=.98;p.life-=dt;}); shooter.particles=shooter.particles.filter(p=>p.life>0); }
function shooterFire(){ if(!shooter || shooter.fireCd>0 || shooter.respawn) return; shooter.bullets.push({x:shooter.player.x,y:shooter.player.y-23,vy:-560,r:3}); shooter.fireCd=Math.max(.13,.22-shooter.level*.01); }
function shooterUseBomb(){
  if(!shooter || shooter.bombs<=0 || shooter.bombCd>0 || shooter.respawn || shooter.finished) return;
  shooter.bombs--;
  shooter.bombCd=.55;
  updateShooterHud();

  // Onda expansiva: arma especial ofensiva.
  shooterExplode(shooter.player.x,shooter.player.y,'#ffd33d',90);
  shooterExplode(shooter.w/2,shooter.h*.45,'#ff9b2f',55);

  let destroyed=0;
  const smallWave = shooter.enemies.length <= 18;
  const radius = smallWave ? 9999 : Math.max(170, shooter.w*.48);

  for(const e of [...shooter.enemies]){
    const d=Math.hypot(e.x-shooter.player.x,e.y-shooter.player.y);
    if(d <= radius){
      rm(shooter.enemies,e);
      shooter.kills++;
      destroyed++;
      shooter.score += 120 + shooter.level*12;
      shooterExplode(e.x,e.y,'#ff9b2f',18);
    }else{
      // Si hay una oleada muy grande, los enemigos lejanos quedan dañados.
      e.hp = Math.max(1, e.hp-2);
      shooterExplode(e.x,e.y,'#ffd33d',6);
    }
  }

  if(shooter.boss){
    const damage = 9 + shooter.level*4; // Mucho más que un disparo normal.
    shooter.boss.hp -= damage;
    shooter.score += 150 + shooter.level*30;
    shooterExplode(shooter.boss.x,shooter.boss.y,'#ff3b4f',38);
    if(shooter.boss.hp<=0){
      shooterBossDown();
      return;
    }
  }

  showShooterMsg(destroyed ? `BOMBA
-${destroyed} ENEMIGOS` : 'BOMBA', 650);
  if(!shooter.boss && shooter.enemies.length===0){
    if(shooter.kills>=shooter.killsForBoss) spawnShooterBoss();
    else spawnShooterWave();
  }
  updateShooterHud();
}
function collideShooter(){
  for(const bullet of [...shooter.bullets]){
    for(const e of [...shooter.enemies]){ if(Math.hypot(bullet.x-e.x,bullet.y-e.y)<22){ rm(shooter.bullets,bullet); e.hp--; shooterExplode(e.x,e.y,e.hp>0?'#31d8ff':'#ff9b2f',8); if(e.hp<=0){ rm(shooter.enemies,e); shooter.kills++; shooter.score+=100+shooter.level*10; const dropRoll=Math.random(); if(dropRoll<.05 && shooter.bombs<shooter.maxBombs) shooter.powerups.push({x:e.x,y:e.y,vy:105,r:13,type:'bomb'}); else if(dropRoll<.13 && shooter.health<shooter.maxHealth) shooter.powerups.push({x:e.x,y:e.y,vy:105,r:13,type:'repair'}); if(shooter.kills>=shooter.killsForBoss && shooter.enemies.length<=2 && !shooter.boss) spawnShooterBoss(); } break; }}
    const b=shooter.boss; if(b && bullet.x>b.x-b.w/2 && bullet.x<b.x+b.w/2 && bullet.y>b.y-b.h/2 && bullet.y<b.y+b.h/2){ rm(shooter.bullets,bullet); b.hp--; shooterExplode(bullet.x,bullet.y,'#31d8ff',5); if(b.hp<=0) shooterBossDown(); }
  }
  for(const b of [...shooter.enemyBullets]) if(shooter.inv<=0 && Math.hypot(b.x-shooter.player.x,b.y-shooter.player.y)<22){ rm(shooter.enemyBullets,b); shooterTakeDamage(25); return; }
  for(const e of [...shooter.enemies]) if(shooter.inv<=0 && Math.hypot(e.x-shooter.player.x,e.y-shooter.player.y)<29){ rm(shooter.enemies,e); shooterTakeDamage(45); return; }
  for(const p of [...shooter.powerups]) if(Math.hypot(p.x-shooter.player.x,p.y-shooter.player.y)<30){ rm(shooter.powerups,p); if(p.type==='repair'){ shooterRepair(35); }else{ shooter.bombs=Math.min(shooter.maxBombs,shooter.bombs+1); updateShooterHud(); showShooterMsg('+💣',420); } }
  if(shooter.score>=shooter.nextLife){ if(shooter.lives<shooter.maxLives){ shooter.lives++; showShooterMsg('+1 VIDA',800); } shooter.nextLife+=5000; }
  updateShooterHud();
}
function shooterBossDown(){ shooter.score+=1000+shooter.level*300; shooter.bosses++; shooterExplode(shooter.boss.x,shooter.boss.y,'#ffd33d',90); nextShooterLevel(); updateShooterHud(); playSound('win'); }

function shooterTakeDamage(amount){
  if(!shooter || shooter.respawn || shooter.finished || shooter.inv>0 || shooter.hitInv>0) return;
  shooter.health=Math.max(0,shooter.health-amount);
  shooter.hitInv=.38;
  shooterExplode(shooter.player.x,shooter.player.y,'#ff3b4f',16);
  updateShooterHud();
  if(shooter.health<=0) shooterLoseLife();
}
function shooterRepair(amount){
  if(!shooter) return;
  shooter.health=Math.min(shooter.maxHealth,shooter.health+amount);
  updateShooterHud();
  showShooterMsg('+RESISTENCIA',520);
}
function shooterLoseLife(){
  if(!shooter || shooter.respawn || shooter.inv>0 || shooter.finished) return; shooterExplode(shooter.player.x,shooter.player.y,'#31d8ff',36); shooter.lives--; updateShooterHud(); playSound('fail');
  if(shooter.lives<=0) return finishShooter(); shooter.respawn=true; shooter.bullets=[]; shooter.enemyBullets=[]; shooter.powerups=[]; let n=3; showShooterMsg(String(n),800); const int=setInterval(()=>{ if(!shooter){clearInterval(int);return;} n--; if(n>0) showShooterMsg(String(n),800); else{ clearInterval(int); shooter.player.x=shooter.w/2; shooter.health=shooter.maxHealth; updateShooterHud(); shooter.respawn=false; shooter.inv=2.2; showShooterMsg('¡YA!',500); } },900);
}
function finishShooter(){
  if(!shooter || shooter.finished) return; shooter.finished=true; const finalPoints=Math.round(shooter.score + shooter.bosses*250 + Math.max(0,shooter.lives)*80); const bosses=shooter.bosses; const lvl=shooter.level; stopShooter(); saveScore('shooter', finalPoints, `Nivel ${lvl} · Jefes ${bosses}`, {result:finalPoints>0?'score':'loss', mode:'cpu', bosses}); setTimeout(()=>showResultModal('Fin de partida', `Puntuación guardada: ${finalPoints} puntos. Nivel alcanzado: ${lvl}. Jefes derrotados: ${bosses}.`, 'shooter'),550);
}
function drawShooter(){
  if(!shooter) return; const c=shooter.ctx,w=shooter.w,h=shooter.h; const bgs=[['#05132e','#0a2e6e','#03050f'],['#13072e','#53208d','#03050f'],['#061d24','#0b665e','#03050f'],['#1d1225','#6b283a','#03050f'],['#260910','#8b1d28','#03050f']]; const bg=bgs[(shooter.level-1)%bgs.length]; const g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,bg[0]); g.addColorStop(.45,bg[1]); g.addColorStop(1,bg[2]); c.fillStyle=g; c.fillRect(0,0,w,h);
  c.globalAlpha=.18; c.fillStyle=shooter.level%2?'#9a54ff':'#2dd9ff'; c.beginPath(); c.arc(w*(.22+((shooter.level*17)%35)/100),h*.15,42+(shooter.level%3)*10,0,Math.PI*2); c.fill(); c.globalAlpha=1;
  shooter.stars.forEach(s=>{c.fillStyle='rgba(255,255,255,.85)'; c.beginPath(); c.arc(s.x,s.y,s.r,0,Math.PI*2); c.fill();}); drawShooterEnemies(c); drawShooterBoss(c); drawShooterBullets(c); drawShooterPowerups(c); drawShooterPlayer(c); drawShooterParticles(c);
}
function drawShooterPlayer(c){ if(shooter.respawn) return; if(shooter.inv>0 && Math.floor(shooter.inv*12)%2===0) return; const p=shooter.player; c.save(); c.translate(p.x,p.y); c.fillStyle='#eff7ff'; c.beginPath(); c.moveTo(0,-25); c.lineTo(16,18); c.lineTo(0,10); c.lineTo(-16,18); c.closePath(); c.fill(); c.fillStyle='#e73845'; c.fillRect(-6,-6,12,22); c.fillStyle='#31d8ff'; c.beginPath(); c.arc(0,-8,6,0,Math.PI*2); c.fill(); c.fillStyle='#ff9b2f'; c.beginPath(); c.moveTo(-9,20); c.lineTo(-2,33); c.lineTo(3,20); c.closePath(); c.fill(); c.beginPath(); c.moveTo(9,20); c.lineTo(2,33); c.lineTo(-3,20); c.closePath(); c.fill(); c.restore(); }
function drawShooterEnemies(c){ const colors=['#2df06f','#31d8ff','#ffd33d','#ff7a2d','#bc5cff']; shooter.enemies.forEach(e=>{ c.save(); c.translate(e.x,e.y); c.fillStyle=colors[e.color]; c.beginPath(); c.roundRect(-14,-10,28,20,8); c.fill(); c.fillStyle='#081126'; c.beginPath(); c.arc(-6,-2,3,0,Math.PI*2); c.arc(6,-2,3,0,Math.PI*2); c.fill(); if(e.maxHp>1){c.fillStyle='#fff';c.fillRect(-10,-17,20*(e.hp/e.maxHp),3);} c.restore(); }); }
function drawShooterBoss(c){ const b=shooter.boss; if(!b) return; c.save(); c.translate(b.x,b.y); c.fillStyle='#3a1b66'; c.beginPath(); c.roundRect(-b.w/2,-b.h/2,b.w,b.h,22); c.fill(); c.fillStyle='#542ba0'; c.beginPath(); c.moveTo(-b.w/2+10,0); c.lineTo(-b.w/2-34,26); c.lineTo(-b.w/2+18,30); c.closePath(); c.fill(); c.beginPath(); c.moveTo(b.w/2-10,0); c.lineTo(b.w/2+34,26); c.lineTo(b.w/2-18,30); c.closePath(); c.fill(); c.fillStyle='#ff334a'; c.beginPath(); c.arc(0,0,15,0,Math.PI*2); c.fill(); c.restore(); const bw=shooter.w*.74,x=(shooter.w-bw)/2; c.fillStyle='rgba(255,255,255,.2)'; c.fillRect(x,12,bw,8); c.fillStyle='#ff3b4f'; c.fillRect(x,12,bw*Math.max(0,b.hp/b.maxHp),8); }
function drawShooterBullets(c){ shooter.bullets.forEach(b=>{c.fillStyle='#31d8ff';c.beginPath();c.arc(b.x,b.y,b.r,0,Math.PI*2);c.fill();}); shooter.enemyBullets.forEach(b=>{c.fillStyle='#ff642d';c.beginPath();c.arc(b.x,b.y,b.r,0,Math.PI*2);c.fill();}); }
function drawShooterPowerups(c){ shooter.powerups.forEach(p=>{const isRepair=p.type==='repair'; c.save();c.translate(p.x,p.y);c.fillStyle=isRepair?'#36e875':'#ffd33d';c.shadowColor=isRepair?'#36e875':'#ffd33d';c.shadowBlur=14;c.beginPath();c.arc(0,0,p.r,0,Math.PI*2);c.fill();c.shadowBlur=0;c.font='17px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillStyle=isRepair?'#062512':'#1b1200';c.fillText(isRepair?'🛢️':'💣',0,1);c.restore();}); }
function drawShooterParticles(c){ shooter.particles.forEach(p=>{c.globalAlpha=Math.max(0,p.life/.8);c.fillStyle=p.color;c.beginPath();c.arc(p.x,p.y,p.r,0,Math.PI*2);c.fill();c.globalAlpha=1;}); }
function shooterExplode(x,y,color,count){ for(let i=0;i<count;i++){ const a=Math.random()*Math.PI*2,sp=40+Math.random()*160; shooter.particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:.25+Math.random()*.55,color,r:1+Math.random()*3}); } }
function rm(arr,item){ const i=arr.indexOf(item); if(i>=0) arr.splice(i,1); }
function setShooterAxis(v){ if(shooter) shooter.axis=v; const k=$('shooterStickKnob'); if(k) k.style.transform=`translateX(${v*34}px)`; }


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
  const ids=currentAchievementIds(); const box=$('achievementsList'); if(!box) return; $('achievementCount').textContent=`${ids.length}/${achievements.length}`; box.innerHTML='';
  achievements.forEach(a=>{ const unlocked=ids.includes(a.id); const item=document.createElement('div'); item.className=`achievement ${unlocked?'unlocked':''}`; item.innerHTML=`<span>${unlocked?'🏆':'🔒'}</span><div><strong>${localize(a.name)}</strong><small>${localize(a.desc)}</small></div>`; box.appendChild(item); });
}
function quickPlay(){ const active=games.filter(g=>g.active); const chosen=active[Math.floor(Math.random()*active.length)]; if(chosen) renderGameDetail(chosen.id); }

async function shareRoomCode(gameId){ const code=$(`generatedCode-${gameId}`)?.value; if(!code) return; const text=t('roomInvite',{game:gameName(gameId),code}); try{ if(navigator.share) await navigator.share({title:'Partida Rápida', text}); else { await navigator.clipboard.writeText(text); showModal(t('inviteCopied'), text); } } catch { showModal(t('roomCode'), text); } }

function installMobileOptimizations(){
  const preventOnGame = (e) => {
    if(e.target.closest && e.target.closest('.game-screen.active')) e.preventDefault();
  };
  ['touchmove','gesturestart','gesturechange','gestureend'].forEach(type => {
    document.addEventListener(type, preventOnGame, { passive:false });
  });
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if(now - lastTouchEnd <= 300 && e.target.closest && e.target.closest('button, canvas, .tic-cell, .game-screen.active')){
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive:false });
  document.querySelectorAll('canvas, .mobile-controls button, .snake-controls button, .tic-cell').forEach(el => {
    el.addEventListener('pointerdown', ev => ev.preventDefault(), { passive:false });
  });
}

function bindEvents(){
  $('loginTab').addEventListener('click',()=>switchTab('login')); $('registerTab').addEventListener('click',()=>switchTab('register'));
  const doLogin = async () => login($('loginUser').value,$('loginPin').value);
  const doRegister = async () => register($('registerUser').value,$('registerPin').value);
  $('loginForm').addEventListener('submit',async e=>{e.preventDefault(); await doLogin();});
  $('registerForm').addEventListener('submit',async e=>{e.preventDefault(); await doRegister();});
  $('loginSubmit').addEventListener('click',async e=>{ e.preventDefault(); await doLogin(); });
  $('registerSubmit').addEventListener('click',async e=>{ e.preventDefault(); await doRegister(); });
  $('logoutBtn').addEventListener('click',logout); $('modalOk').addEventListener('click',closeModal); $('modalNewGame').addEventListener('click',modalNewGame); $('modalMenu').addEventListener('click',modalMenu); $('registerLang')?.addEventListener('change',e=>setLang(e.target.value)); $('loginLang')?.addEventListener('change',e=>setLang(e.target.value)); document.querySelectorAll('.lang-toggle').forEach(b=>b.addEventListener('click',toggleLanguage)); $('quickPlayBtn').addEventListener('click',quickPlay); $('soundToggleBtn').addEventListener('click',toggleSound); $('weeklyRankBtn').addEventListener('click',()=>{rankingScope='weekly'; renderRanking();}); $('allRankBtn').addEventListener('click',()=>{rankingScope='all'; renderRanking();});
  document.addEventListener('click', async e => { const btn=e.target.closest('button'); if(!btn) return; const action=btn.dataset.action, gameId=btn.dataset.game; if(action==='detail') renderGameDetail(gameId); if(action==='cpu') startGame(gameId); if(action==='room') createRoom(gameId); if(action==='join'){ const jb=$(`joinBox-${gameId}`) || $('detailJoinBox'); jb?.classList.toggle('hidden'); const rb=$(`roomBox-${gameId}`) || $('detailRoomBox'); if(rb) rb.classList.add('hidden'); } if(action==='join-confirm') joinRoom(gameId); if(action==='copy'){ const code=$(`generatedCode-${gameId}`).value; try{ await navigator.clipboard.writeText(code); showModal(t('codeCopied'), `${t('roomCode')}: ${code}`); } catch { showModal(t('roomCode'), code); } } if(action==='share') shareRoomCode(gameId); });
  document.querySelectorAll('.backHome').forEach(b=>b.addEventListener('click',()=>{ closeModal(); stopAllGames(); enterHome(); })); $('detailBackBtn')?.addEventListener('click',()=>{ closeModal(); enterHome(); }); $('pausePongBtn').addEventListener('click',()=>{ if(pong) pong.paused=!pong.paused; }); $('restartSnakeBtn').addEventListener('click',startSnake); $('restartTicBtn').addEventListener('click',newTicRound); $('restartMemoryBtn')?.addEventListener('click',startMemory); $('restartConnect4Btn')?.addEventListener('click',newConnect4Round);
  window.addEventListener('keydown', e => { if(pong){ if(e.key==='ArrowLeft') pong.keys.left=true; if(e.key==='ArrowRight') pong.keys.right=true; if(e.key==='ArrowUp') pong.keys.left=true; if(e.key==='ArrowDown') pong.keys.right=true; } if(snake){ if(e.key==='ArrowUp') changeSnakeDir('up'); if(e.key==='ArrowDown') changeSnakeDir('down'); if(e.key==='ArrowLeft') changeSnakeDir('left'); if(e.key==='ArrowRight') changeSnakeDir('right'); } if(shooter){ if(e.key==='ArrowLeft') setShooterAxis(-1); if(e.key==='ArrowRight') setShooterAxis(1); if(e.code==='Space') shooter.fire=true; if(e.key.toLowerCase()==='b') shooterUseBomb(); } });
  window.addEventListener('keyup', e => { if(pong){ if(e.key==='ArrowLeft') pong.keys.left=false; if(e.key==='ArrowRight') pong.keys.right=false; if(e.key==='ArrowUp') pong.keys.left=false; if(e.key==='ArrowDown') pong.keys.right=false; } if(shooter){ if(e.key==='ArrowLeft'||e.key==='ArrowRight') setShooterAxis(0); if(e.code==='Space') shooter.fire=false; } });
  $('pongCanvas').addEventListener('pointerdown', e => { if(e.cancelable) e.preventDefault(); if(!pong) return; const rect=pong.canvas.getBoundingClientRect(); const x=((e.clientX-rect.left)/rect.width)*pong.canvas.width; pong.player.x=clamp(x-pong.player.w/2,0,pong.canvas.width-pong.player.w); });
  $('pongCanvas').addEventListener('pointermove', e => { if(e.cancelable) e.preventDefault(); if(!pong) return; const rect=pong.canvas.getBoundingClientRect(); const x=((e.clientX-rect.left)/rect.width)*pong.canvas.width; pong.player.x=clamp(x-pong.player.w/2,0,pong.canvas.width-pong.player.w); });
  const hold=(key,val)=>(ev)=>{ if(ev && ev.cancelable) ev.preventDefault(); if(pong) pong.keys[key]=val; }; $('upBtn').addEventListener('pointerdown',hold('left',true)); $('upBtn').addEventListener('pointerup',hold('left',false)); $('upBtn').addEventListener('pointerleave',hold('left',false)); $('downBtn').addEventListener('pointerdown',hold('right',true)); $('downBtn').addEventListener('pointerup',hold('right',false)); $('downBtn').addEventListener('pointerleave',hold('right',false));
  document.querySelectorAll('.snake-controls button').forEach(b=>{ b.addEventListener('pointerdown',(ev)=>{ if(ev.cancelable) ev.preventDefault(); changeSnakeDir(b.dataset.dir); }); });
  $('pauseShooterBtn')?.addEventListener('click',()=>{ if(shooter){ shooter.paused=!shooter.paused; $('pauseShooterBtn').textContent=shooter.paused?'Seguir':'Pausa'; if(shooter.paused) showShooterMsg('PAUSA',999999); else $('shooterFlash')?.classList.add('hidden'); } });
  $('restartShooterBtn')?.addEventListener('click',startShooter);
  $('shooterBombBtn')?.addEventListener('pointerdown',e=>{ if(e.cancelable)e.preventDefault(); shooterUseBomb(); });
  $('shooterBombBtn')?.addEventListener('click',e=>{ if(e.cancelable)e.preventDefault(); });
  $('shooterFireBtn')?.addEventListener('pointerdown',e=>{ if(e.cancelable)e.preventDefault(); if(shooter){ shooter.fire=true; shooterFire(); } });
  ['pointerup','pointercancel','pointerleave'].forEach(type=>$('shooterFireBtn')?.addEventListener(type,()=>{ if(shooter) shooter.fire=false; }));
  let shooterMovePointer=null; const mz=$('shooterMoveZone'); mz?.addEventListener('pointerdown',e=>{ shooterMovePointer=e.pointerId; mz.setPointerCapture(e.pointerId); const r=mz.getBoundingClientRect(); setShooterAxis(clamp((e.clientX-(r.left+r.width/2))/(r.width*.34),-1,1)); });
  mz?.addEventListener('pointermove',e=>{ if(e.pointerId!==shooterMovePointer)return; const r=mz.getBoundingClientRect(); const axis=clamp((e.clientX-(r.left+r.width/2))/(r.width*.34),-1,1); setShooterAxis(Math.abs(axis)<.12?0:axis); });
  ['pointerup','pointercancel'].forEach(type=>mz?.addEventListener(type,e=>{ if(e.pointerId===shooterMovePointer){ shooterMovePointer=null; setShooterAxis(0); } }));
  window.addEventListener('resize',resizeShooter);
}

if(!CanvasRenderingContext2D.prototype.roundRect){ CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){ const rr=Math.min(r,w/2,h/2); this.beginPath(); this.moveTo(x+rr,y); this.arcTo(x+w,y,x+w,y+h,rr); this.arcTo(x+w,y+h,x,y+h,rr); this.arcTo(x,y+h,x,y,rr); this.arcTo(x,y,x+w,y,rr); this.closePath(); return this; }; }

function init(){ installMobileOptimizations(); if(!cloudEnabled()) seedDemoRanking(); renderAvatarPicker(); bindEvents(); setLang(getJson(STORAGE_SETTINGS, {}).lang || 'es'); updateSoundButton(); const session=getJson(STORAGE_SESSION,null); if(session){ currentUser=session; if(!currentUser.avatar || currentUser.avatar === CPU_AVATAR) currentUser.avatar=avatars[0]; setLang(currentUser.lang || 'es'); enterHome(); } else { switchScreen('auth'); } }
init();
