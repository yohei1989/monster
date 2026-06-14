/* ====================================================
   POCKET CREATURE - game.js (v2)
   実画像版・モンスター主役育成ゲーム
   ==================================================== */

'use strict';

// ====================================================
// CREATURE DATA
// ====================================================
const CREATURES = {
  // ===== 火属性 =====
  pofu:        { name:'ポフ',         nameEn:'POFU',    type:'火', typeIcon:'🔥', stage:0, evo:'nemuri_pofu', img:'pofu' },
  nemuri_pofu: { name:'カロリゴン',   nameEn:'KALI',    type:'火', typeIcon:'🔥', stage:1, evo:'hinodamaru',  img:'nemuri_pofu' },
  hinodamaru:  { name:'ヒノタマル',   nameEn:'HINO',    type:'火', typeIcon:'🔥', stage:2, evo:'gyokka',      img:'hinodamaru' },
  gyokka:      { name:'業火ノ徘徊者', nameEn:'GYOKKA',  type:'火', typeIcon:'🔥', stage:3, evo:null,          img:'gyokka' },

  // ===== 水属性 =====
  mizune:      { name:'ミズネ',   nameEn:'MIZUNE',   type:'水', typeIcon:'💧', stage:0, evo:'ameyura',   img:'mizune' },
  ameyura:     { name:'アメユラ', nameEn:'AMEYURA',  type:'水', typeIcon:'💧', stage:1, evo:'namiochi',  img:'ameyura' },
  namiochi:    { name:'ナミオロチ',nameEn:'NAMIOCHI', type:'水', typeIcon:'💧', stage:2, evo:'shinkai',   img:'namiochi' },
  shinkai:     { name:'深海王',   nameEn:'SHINKAI',  type:'水', typeIcon:'💧', stage:3, evo:null,         img:'shinkai' },

  // ===== 草属性 =====
  mokoriifu:   { name:'モコリーフ', nameEn:'MOKO',   type:'草', typeIcon:'🌿', stage:0, evo:'kokemi',    img:'mokoriifu' },
  kokemi:      { name:'コケミ',    nameEn:'KOKEMI',  type:'草', typeIcon:'🌿', stage:1, evo:'harune',    img:'kokemi' },
  harune:      { name:'ハルネ',    nameEn:'HARUNE',  type:'草', typeIcon:'🌿', stage:2, evo:'shizukusa', img:'harune' },
  shizukusa:   { name:'シズクサ',  nameEn:'SHIZU',   type:'草', typeIcon:'🌿', stage:3, evo:null,        img:'shizukusa' },

  // ===== 闇属性 =====
  yofukashi:   { name:'ヨフカシ',  nameEn:'YOFU',   type:'闇', typeIcon:'🌙', stage:0, evo:'neochi',    img:'yofukashi' },
  neochi:      { name:'ネオチ',    nameEn:'NEOCHI', type:'闇', typeIcon:'🌙', stage:1, evo:'mayoi',     img:'neochi' },
  mayoi:       { name:'マヨイ',    nameEn:'MAYOI',  type:'闇', typeIcon:'🌙', stage:2, evo:'kurokage',  img:'mayoi' },
  kurokage:    { name:'クロカゲ',  nameEn:'KURO',   type:'闇', typeIcon:'🌙', stage:3, evo:null,        img:'kurokage' },

  // ===== 光属性 =====
  pikari:      { name:'ピカリ',    nameEn:'PIKARI', type:'光', typeIcon:'⭐', stage:0, evo:'nemuhika',  img:'pikari' },
  nemuhika:    { name:'ネムヒカ',  nameEn:'NEMUHI', type:'光', typeIcon:'⭐', stage:1, evo:'hoshimi',   img:'nemuhika' },
  hoshimi:     { name:'ホシミ',    nameEn:'HOSHI',  type:'光', typeIcon:'⭐', stage:2, evo:'hareru',    img:'hoshimi' },
  hareru:      { name:'ハレル',    nameEn:'HARERU', type:'光', typeIcon:'⭐', stage:3, evo:null,        img:'hareru' },

  // ===== 特殊属性 =====
  bagumi:      { name:'バグミ',    nameEn:'BAGUMI',  type:'特殊', typeIcon:'❓', stage:0, evo:'terebi_mi', img:'bagumi' },
  terebi_mi:   { name:'テレビミ',  nameEn:'TEREBI',  type:'特殊', typeIcon:'❓', stage:1, evo:'noizu',     img:'terebi_mi' },
  noizu:       { name:'ノイズ',    nameEn:'NOIZU',   type:'特殊', typeIcon:'❓', stage:2, evo:'kaibutsu',  img:'noizu' },
  kaibutsu:    { name:'カイブツ',  nameEn:'KAIBU',   type:'特殊', typeIcon:'❓', stage:3, evo:null,        img:'kaibutsu' },
};

const STARTERS = {
  '火':'pofu', '水':'mizune', '草':'mokoriifu',
  '闇':'yofukashi', '光':'pikari', '特殊':'bagumi',
};

// ====================================================
// GAME STATE
// ====================================================
const SAVE_KEY = 'pocketcreature_v3';
let G = null;

function freshState() {
  const types = Object.keys(STARTERS);
  const t = types[Math.floor(Math.random() * types.length)];
  return {
    id:           STARTERS[t],
    charId:       genId(),
    born:         Date.now(),
    lastSeen:     Date.now(),
    // Hidden stats
    fullness:     80,
    happiness:    70,
    cleanliness:  100,
    evoPoints:    0,
    battleWins:   0,
    // Daily
    gohanUsed:    0,
    tokkunUsed:   0,
    unchiCount:   0,
    lastDay:      dayKey(),
    unchiHours:   genUnchiHours(),
    spawnedHours: [],
    // Records
    discovered:   [STARTERS[t]],
    history:      [],
  };
}

function genId() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({length:6}, () => c[Math.floor(Math.random()*c.length)]).join('');
}
function dayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function genUnchiHours() {
  const n = 1 + Math.floor(Math.random() * 3);
  const h = [];
  for (let i=0;i<n;i++) h.push(8 + Math.floor(Math.random()*14));
  return h.sort((a,b)=>a-b);
}

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      G = JSON.parse(raw);
      if (!G.charId) G.charId = genId();
      if (!G.discovered) G.discovered = [G.id];
      if (!G.history) G.history = [];
      if (!G.unchiHours) G.unchiHours = genUnchiHours();
      if (!G.spawnedHours) G.spawnedHours = [];
    } else {
      G = freshState();
    }
  } catch(e) { G = freshState(); }
}
function save() {
  G.lastSeen = Date.now();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(G)); } catch(e) {}
  // Also save as "shared" so opponents can find us
  try { localStorage.setItem(`pc_sh_${G.charId}`, JSON.stringify(G)); } catch(e) {}
}

// ====================================================
// TIME / PERIOD
// ====================================================
function period() {
  const h = new Date().getHours();
  if (h>=5  && h<9)  return 'morning';
  if (h>=9  && h<17) return 'afternoon';
  if (h>=17 && h<20) return 'evening';
  if (h>=20 && h<23) return 'night';
  return 'midnight';
}
const PERIOD_ICONS = { morning:'☀', afternoon:'🌤', evening:'🌇', night:'🌙', midnight:'💤' };

function isSleeping() {
  const p = period();
  return p==='night' || p==='midnight';
}

// ====================================================
// DAILY RESET
// ====================================================
function checkReset() {
  const today = dayKey();
  if (G.lastDay !== today) {
    G.lastDay = today;
    G.gohanUsed  = 0;
    G.tokkunUsed = 0;
    G.unchiCount = 0;
    G.unchiHours = genUnchiHours();
    G.spawnedHours = [];
    // Overnight decay
    G.fullness    = Math.max(10, G.fullness - 30);
    G.happiness   = Math.max(10, G.happiness - 10);
    if (G.unchiCount > 0) {
      G.cleanliness = Math.max(10, G.cleanliness - 20);
      G.happiness   = Math.max(5,  G.happiness   - 10);
    }
    save();
  }
}

// ====================================================
// UNCHI SPAWN
// ====================================================
function checkUnchi() {
  const h = new Date().getHours();
  for (const t of G.unchiHours) {
    if (h >= t && !G.spawnedHours.includes(t) && G.unchiCount < 3) {
      G.spawnedHours.push(t);
      G.unchiCount = Math.min(3, G.unchiCount + 1);
      setSpeech('💩 でたよ！');
      save();
      renderUI();
      break;
    }
  }
}

// ====================================================
// EVOLUTION
// ====================================================
const EVO_THRESHOLD = 100;

function checkEvo() {
  const c = CREATURES[G.id];
  if (!c || !c.evo) return;
  const bonus = Math.min(G.battleWins * 2, 20);
  if (G.evoPoints + bonus >= EVO_THRESHOLD) doEvo(c.evo);
}

function doEvo(nextId) {
  const next = CREATURES[nextId];
  if (!next) return;
  const dev = document.getElementById('device');
  dev.classList.add('shake');
  setTimeout(() => dev.classList.remove('shake'), 700);

  setSpeech('……！！\nなにかが……！！');

  setTimeout(() => {
    G.id = nextId;
    G.evoPoints = 0;
    if (!G.discovered.includes(nextId)) G.discovered.push(nextId);
    save();
    renderUI();
    setSpeech(`${next.name}に\nしんかした！！`);

    const dev2 = document.getElementById('device');
    dev2.classList.add('shake');
    setTimeout(() => dev2.classList.remove('shake'), 600);
  }, 1600);
}

// ====================================================
// SPEECH
// ====================================================
let speechTimer = null;
function setSpeech(text, persist) {
  const el = document.getElementById('speech-text');
  if (el) el.textContent = text;
  if (!persist) {
    clearTimeout(speechTimer);
    speechTimer = setTimeout(() => setSpeech(idleSpeech()), 3500);
  }
}

function idleSpeech() {
  const c = CREATURES[G.id];
  const nearEvo = c && c.evo && G.evoPoints >= 70;
  if (nearEvo) return 'なにか変わりそう…✨';

  const p = period();
  const msgs = {
    morning:   ['おはよう！','きょうも よろしく！','ねむい…'],
    afternoon: ['ひまだなぁ','ぼーっとしてる…','ごろごろ…'],
    evening:   ['とっくん したいな！','がんばるぞ！','うごきたい！'],
    night:     ['おなかすいた…','ごはん ほしいな','むぎゅ…'],
    midnight:  ['zzz…','すやすや…','おやすみ…'],
  };
  const arr = msgs[p] || msgs.afternoon;
  return arr[Math.floor(Date.now() / 9000) % arr.length];
}

// ====================================================
// ACTION FLASH
// ====================================================
function flash(text) {
  const el = document.getElementById('action-flash');
  el.textContent = text;
  el.style.display = 'block';
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'flash-in-out 2.2s forwards';
  setTimeout(() => { el.style.display = 'none'; }, 2200);
}

// ====================================================
// ACTIONS
// ====================================================
function doGohan() {
  if (G.gohanUsed >= 2) { setSpeech('もうたべすぎ！'); return; }
  if (isSleeping()) { setSpeech('ねてるよ…'); return; }
  G.gohanUsed++;
  G.fullness    = Math.min(100, G.fullness + 35);
  G.happiness   = Math.min(100, G.happiness + 5);
  G.evoPoints   = Math.min(99, G.evoPoints + 3);
  setSpeech('もぐもぐ♪\nおいしい！');
  flash(`ごはん！ あと${2-G.gohanUsed}回`);
  save(); renderUI(); checkEvo();
}

function doSouji() {
  if (G.unchiCount === 0) { setSpeech('もうきれいだよ！'); return; }
  G.unchiCount    = 0;
  G.spawnedHours  = [];
  G.cleanliness   = Math.min(100, G.cleanliness + 40);
  G.happiness     = Math.min(100, G.happiness + 8);
  G.evoPoints     = Math.min(99, G.evoPoints + 2);
  setSpeech('きれいになった！\nありがとう♪');
  flash('そうじ完了！ ✨');
  save(); renderUI();
}

function doTokkun() {
  if (G.tokkunUsed >= 2) { setSpeech('つかれた…もう無理…'); return; }
  if (isSleeping())       { setSpeech('ねてるよ…おきられない'); return; }
  const p = period();
  const gain = p === 'evening' ? 8 : 5;
  G.tokkunUsed++;
  G.evoPoints  = Math.min(99, G.evoPoints + gain);
  G.happiness  = Math.min(100, G.happiness + 5);
  G.fullness   = Math.max(0, G.fullness - 10);
  setSpeech(p==='evening' ? 'ばっちり！\nさいこうだ！' : 'がんばった！\nえらい！');
  flash(`とっくん！(+${gain}pt)`);
  const dev = document.getElementById('device');
  dev.classList.add('shake');
  setTimeout(() => dev.classList.remove('shake'), 600);
  save(); renderUI(); checkEvo();
}

// ====================================================
// BATTLE
// ====================================================
function getPower(s) {
  const c = CREATURES[s.id];
  if (!c) return 0;
  const sm = [1, 1.5, 2, 3][c.stage] || 1;
  const wb = Math.min((s.battleWins||0)*2, 20);
  const ep = (s.evoPoints||0)*0.3;
  const st = ((s.fullness||50)+(s.happiness||50)+(s.cleanliness||50))/3;
  return Math.floor(sm*50 + st + wb + ep);
}

function simulateOpponent(idStr) {
  // Check actual saved data first
  try {
    const raw = localStorage.getItem(`pc_sh_${idStr.toUpperCase()}`);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  // Deterministic seed-based opponent
  if (!/^[A-Z2-9]{6}$/.test(idStr.toUpperCase())) return null;
  const seed = idStr.split('').reduce((a,c)=>a*31+c.charCodeAt(0),0);
  const types = Object.keys(STARTERS);
  const t = types[Math.abs(seed) % types.length];
  const chain = Object.keys(CREATURES).filter(k=>CREATURES[k].type===t);
  const stage = Math.abs(seed>>4) % 4;
  const stageChain = chain.filter(k=>CREATURES[k].stage<=Math.min(stage,chain.length-1));
  const cid = stageChain[Math.abs(seed>>8) % stageChain.length] || chain[0];
  return {
    id: cid,
    charId: idStr.toUpperCase(),
    evoPoints:  Math.abs(seed*7)%100,
    battleWins: Math.abs(seed*3)%15,
    fullness:   50+Math.abs(seed)%50,
    happiness:  40+Math.abs(seed>>2)%60,
    cleanliness:50+Math.abs(seed>>3)%50,
  };
}

function doBattle(idStr) {
  const opp = simulateOpponent(idStr.trim().toUpperCase());
  if (!opp) {
    showResult('エラー', `<p class="result-details">IDが見つかりません。<br>正しいIDを確認してください。</p>`);
    return;
  }
  const myP  = getPower(G);
  const oppP = getPower(opp);
  const myR  = myP  * (0.85 + Math.random()*.30);
  const oppR = oppP * (0.85 + Math.random()*.30);
  const win  = myR > oppR;

  const mc = CREATURES[G.id];
  const oc = CREATURES[opp.id] || {name:'???', typeIcon:'?'};

  G.history.unshift({ date:new Date().toLocaleDateString('ja'), oppId:idStr.toUpperCase(), oppName:oc.name, myName:mc.name, win });
  if (G.history.length > 20) G.history = G.history.slice(0,20);

  if (win) {
    G.battleWins = (G.battleWins||0)+1;
    G.evoPoints  = Math.min(99, G.evoPoints+5);
    setSpeech('かった！！\nやったぁ！');
  } else {
    G.happiness = Math.max(0, G.happiness-10);
    setSpeech('まけた…\nくやしい…');
  }
  save(); renderUI(); checkEvo();

  showResult(
    win ? '🏆 WIN !' : '💀 LOSE...',
    `<div class="result-win-label">${win ? '🏆' : '💀'}</div>
     <div class="result-details">
       ${mc.typeIcon} ${mc.name}<br>
       パワー: ${Math.floor(myR)}<br>
       <br>── vs ──<br><br>
       ${oc.typeIcon} ${oc.name}<br>
       パワー: ${Math.floor(oppR)}
     </div>`
  );
}

// ====================================================
// MODAL SYSTEM
// ====================================================
function showOverlay(id) {
  document.getElementById('overlay').style.display = 'flex';
  ['modal-battle','modal-zukan','modal-result','modal-share'].forEach(m => {
    document.getElementById(m).style.display = m===id ? 'block' : 'none';
  });
}
function hideOverlay() {
  document.getElementById('overlay').style.display = 'none';
}
function showResult(title, html) {
  document.getElementById('result-head').textContent  = title;
  document.getElementById('result-body').innerHTML    = html;
  showOverlay('modal-result');
}

// ====================================================
// ZUKAN
// ====================================================
function buildZukan() {
  const grid = document.getElementById('zukan-grid');
  grid.innerHTML = '';
  Object.entries(CREATURES).forEach(([id, c]) => {
    const found = G.discovered.includes(id);
    const card  = document.createElement('div');
    card.className = 'zukan-card' + (found ? '' : ' undiscovered');

    const img = document.createElement('img');
    img.src = (found && CREATURE_IMAGES[c.img]) ? CREATURE_IMAGES[c.img] : '';
    img.alt = found ? c.name : '???';

    const name = document.createElement('div');
    name.className = 'z-name';
    name.textContent = found ? c.name : '???';

    const type = document.createElement('div');
    type.className = 'z-type';
    type.textContent = found ? c.typeIcon : '?';

    card.appendChild(img); card.appendChild(name); card.appendChild(type);
    grid.appendChild(card);
  });
}

// ====================================================
// SHARE CARD
// ====================================================
function buildShare() {
  const c    = CREATURES[G.id];
  const days = Math.floor((Date.now()-G.born)/86400000);
  const pow  = getPower(G);

  document.getElementById('share-card').innerHTML = `
    <img src="${CREATURE_IMAGES[c.img]||''}" alt="${c.name}">
    <span class="sc-name">${c.typeIcon} ${c.name}</span>
    <span class="sc-stats">
      Day ${days} ／ パワー ${pow}<br>
      勝利数: ${G.battleWins||0} ／ ID: ${G.charId}
    </span>
  `;
  document.getElementById('share-id-disp').textContent = G.charId;

  const txt = encodeURIComponent(
    `#POCKETCREATURE\n${c.typeIcon} ${c.name}を育てています！\nID: ${G.charId}\n挑戦してください！`
  );
  document.getElementById('share-x').href = `https://x.com/intent/post?text=${txt}`;
}

// ====================================================
// BATTLE HISTORY
// ====================================================
function buildHistory() {
  const el = document.getElementById('history-list');
  if (!G.history.length) {
    el.innerHTML = '<p class="hint-text" style="text-align:center">まだバトル履歴がありません</p>';
    return;
  }
  el.innerHTML = G.history.map(r => `
    <div class="hist-record ${r.win?'win':'lose'}">
      ${r.date} ${r.win?'🏆 WIN':'💀 LOSE'}<br>
      ${r.myName} vs ${r.oppName} (${r.oppId})
    </div>
  `).join('');
}

// ====================================================
// RENDER UI
// ====================================================
function renderUI() {
  const c = CREATURES[G.id];
  if (!c) return;

  // Header
  const now = new Date();
  document.getElementById('time-display').textContent =
    `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  document.getElementById('period-icon').textContent  = PERIOD_ICONS[period()] || '☀';
  document.getElementById('creature-name-disp').textContent = c.name;
  document.getElementById('creature-type-disp').textContent = c.typeIcon;
  document.getElementById('day-count').textContent =
    `day ${Math.floor((Date.now()-G.born)/86400000)}`;

  // Creature image
  const img = document.getElementById('creature-img');
  const src = CREATURE_IMAGES[c.img];
  if (src) img.src = src;

  // Sleep overlay
  const sleeping = isSleeping();
  document.getElementById('sleep-overlay').style.display = sleeping ? 'flex' : 'none';
  img.style.opacity = sleeping ? '0.6' : '1';
  img.style.animation = sleeping ? 'none' : 'idle-float 3s ease-in-out infinite';

  // Evolution aura
  const nearEvo = c.evo && G.evoPoints >= 70;
  document.getElementById('evo-rings').style.display = nearEvo ? 'flex' : 'none';

  // Status icons
  const icons = [];
  if (G.unchiCount > 0) for(let i=0;i<G.unchiCount;i++) icons.push('💩');
  if (G.fullness   < 30) icons.push('🍽️');
  if (sleeping)          icons.push('💤');
  if (nearEvo)           icons.push('✨');

  const row = document.getElementById('status-row');
  row.innerHTML = icons.map(i=>`<span class="status-icon">${i}</span>`).join('');

  // Limit pills
  const gc = 2 - G.gohanUsed;
  const tc = 2 - G.tokkunUsed;
  document.getElementById('cnt-gohan').textContent  = gc;
  document.getElementById('cnt-tokkun').textContent = tc;
  document.getElementById('cnt-unchi').textContent  = G.unchiCount;

  document.getElementById('lim-gohan').classList.toggle('used', gc<=0);
  document.getElementById('lim-tokkun').classList.toggle('used', tc<=0);

  // My IDs
  ['my-id-disp','share-id-disp'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = G.charId;
  });

  // Button states
  const gDis = G.gohanUsed>=2 || sleeping;
  const tDis = G.tokkunUsed>=2 || sleeping;
  const sDis = G.unchiCount===0;

  const btnG = document.getElementById('btn-gohan');
  const btnT = document.getElementById('btn-tokkun');
  const btnS = document.getElementById('btn-souji');

  btnG.classList.toggle('disabled', gDis);
  btnT.classList.toggle('disabled', tDis);
  btnS.classList.toggle('disabled', sDis);
  btnG.disabled = gDis;
  btnT.disabled = tDis;
  btnS.disabled = sDis;
}

// ====================================================
// COPY TO CLIPBOARD
// ====================================================
function copyText(text, btn) {
  const orig = btn.textContent;
  navigator.clipboard.writeText(text).then(()=>{
    btn.textContent='コピー済！';
    setTimeout(()=>{btn.textContent=orig;},1500);
  }).catch(()=>{
    const ta=document.createElement('textarea');
    ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    btn.textContent='コピー済！';
    setTimeout(()=>{btn.textContent=orig;},1500);
  });
}

// ====================================================
// EVENTS
// ====================================================
function initEvents() {
  // Action buttons
  document.getElementById('btn-gohan').addEventListener('click',  doGohan);
  document.getElementById('btn-souji').addEventListener('click',  doSouji);
  document.getElementById('btn-tokkun').addEventListener('click', doTokkun);

  document.getElementById('btn-battle').addEventListener('click', () => {
    document.getElementById('tab-c').classList.add('active');
    document.getElementById('tab-h').classList.remove('active');
    document.getElementById('pane-c').style.display='block';
    document.getElementById('pane-h').style.display='none';
    showOverlay('modal-battle');
  });

  document.getElementById('btn-zukan').addEventListener('click', () => {
    buildZukan(); showOverlay('modal-zukan');
  });

  // Tab switching
  document.getElementById('tab-c').addEventListener('click', () => {
    document.getElementById('tab-c').classList.add('active');
    document.getElementById('tab-h').classList.remove('active');
    document.getElementById('pane-c').style.display='block';
    document.getElementById('pane-h').style.display='none';
  });
  document.getElementById('tab-h').addEventListener('click', () => {
    document.getElementById('tab-h').classList.add('active');
    document.getElementById('tab-c').classList.remove('active');
    document.getElementById('pane-h').style.display='block';
    document.getElementById('pane-c').style.display='none';
    buildHistory();
  });

  // Do battle
  document.getElementById('do-battle').addEventListener('click', () => {
    const v = document.getElementById('opp-id-input').value.trim().toUpperCase();
    if (v.length < 4) { setSpeech('IDを入れてね！'); return; }
    if (v === G.charId) { setSpeech('じぶんとは たたかえない！'); return; }
    hideOverlay();
    setTimeout(()=>doBattle(v), 150);
  });

  // Copy buttons
  document.getElementById('copy-id').addEventListener('click', e =>
    copyText(G.charId, e.currentTarget));
  document.getElementById('copy-share-id').addEventListener('click', e =>
    copyText(G.charId, e.currentTarget));

  // Share button (long-press creature image or via battle close)
  document.getElementById('creature-img').addEventListener('dblclick', () => {
    buildShare(); showOverlay('modal-share');
  });

  // Close buttons
  document.getElementById('close-battle').addEventListener('click',  hideOverlay);
  document.getElementById('close-zukan').addEventListener('click',   hideOverlay);
  document.getElementById('close-result').addEventListener('click',  hideOverlay);
  document.getElementById('close-share').addEventListener('click',   hideOverlay);
  document.getElementById('overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('overlay')) hideOverlay();
  });
}

// ====================================================
// PERIODIC TASKS
// ====================================================
function tick() {
  checkReset();
  checkUnchi();
  renderUI();
  setSpeech(idleSpeech(), true);
}

// ====================================================
// MAIN INIT
// ====================================================
function init() {
  loadState();
  checkReset();
  initEvents();
  renderUI();
  setSpeech(idleSpeech(), true);

  // Every minute: check unchi, update UI
  setInterval(tick, 60000);
  // Clock update every 10s
  setInterval(() => {
    const now = new Date();
    const el = document.getElementById('time-display');
    if (el) el.textContent =
      `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    document.getElementById('period-icon').textContent = PERIOD_ICONS[period()]||'☀';
  }, 10000);
  // Idle speech cycle every 12s
  setInterval(() => setSpeech(idleSpeech(), true), 12000);
}

window.addEventListener('DOMContentLoaded', init);
