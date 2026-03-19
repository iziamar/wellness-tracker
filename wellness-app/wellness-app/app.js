// ─────────────────────────────────────────────────────────────────────────────
// CONFIG — replace these with your own Supabase project values
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://lihhkvjybkinwlgkjkvs.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_b23HFPGtLc20fDvxlP5ang_1OeTVq6W';

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE INIT
// ─────────────────────────────────────────────────────────────────────────────
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─────────────────────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────────────────────
let STATE = {
  points: 0,
  alltime: 0,
  todayPts: 0,
  todayKey: '',
  logged: {},       // { habitId: count } for today
  streaks: {},      // { habitId: { count, lastDate } }
  history: [],      // [{ ts, name, pts, bonus, type }]
  redeemed: {},     // { rewardId: count }
  overallStreak: 0, // consecutive days with at least 1 habit
  lastActiveDate: '',
};

let currentUser = null;
let activeTab = 'log';
let activeCat = 'All';
let menuOpen = false;
let saveTimer = null;

// ─────────────────────────────────────────────────────────────────────────────
// PERSISTENCE — Supabase with localStorage fallback
// ─────────────────────────────────────────────────────────────────────────────
const LS_KEY = 'wellness_state_v3';

function loadLocal() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) STATE = { ...STATE, ...JSON.parse(raw) };
  } catch (_) {}
}

function saveLocal() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(STATE)); } catch (_) {}
}

async function loadRemote() {
  if (!currentUser) return;
  try {
    const { data, error } = await sb
      .from('wellness_state')
      .select('state')
      .eq('user_id', currentUser.id)
      .single();
    if (error || !data) return;
    const remote = data.state;
    // Merge: take whichever alltime is higher
    if (remote && remote.alltime >= STATE.alltime) {
      STATE = { ...STATE, ...remote };
      saveLocal();
    }
  } catch (_) {}
}

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(pushRemote, 1500);
}

async function pushRemote() {
  if (!currentUser) return;
  try {
    await sb.from('wellness_state').upsert({
      user_id: currentUser.id,
      state: STATE,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  } catch (_) {}
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────────────────────
function authTab(tab) {
  document.getElementById('auth-login').style.display = tab === 'login' ? '' : 'none';
  document.getElementById('auth-signup').style.display = tab === 'signup' ? '' : 'none';
  document.querySelectorAll('#auth-tabs .tab').forEach((t, i) => {
    t.classList.toggle('active', (i === 0) === (tab === 'login'));
  });
  clearAuthError();
}

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.style.display = '';
}

function clearAuthError() {
  document.getElementById('auth-error').style.display = 'none';
}

async function signIn() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-pass').value;
  if (!email || !pass) { showAuthError('Please fill in all fields.'); return; }
  const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });
  if (error) { showAuthError(error.message); return; }
  currentUser = data.user;
  await bootApp();
}

async function signUp() {
  const email = document.getElementById('signup-email').value.trim();
  const pass = document.getElementById('signup-pass').value;
  const confirm = document.getElementById('signup-confirm').value;
  if (!email || !pass) { showAuthError('Please fill in all fields.'); return; }
  if (pass !== confirm) { showAuthError('Passwords do not match.'); return; }
  if (pass.length < 6) { showAuthError('Password must be at least 6 characters.'); return; }
  const { data, error } = await sb.auth.signUp({ email, password: pass });
  if (error) { showAuthError(error.message); return; }
  currentUser = data.user;
  toast('Account created! Welcome.', 'success');
  await bootApp();
}

async function signInAnon() {
  currentUser = null;
  loadLocal();
  bootApp(true);
}

async function signOut() {
  await sb.auth.signOut();
  currentUser = null;
  STATE = { points:0, alltime:0, todayPts:0, todayKey:'', logged:{}, streaks:{}, history:[], redeemed:{}, overallStreak:0, lastActiveDate:'' };
  document.getElementById('app-screen').classList.remove('active');
  document.getElementById('auth-screen').classList.add('active');
  toast('Signed out.', '');
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────────────────────────────────────
async function bootApp(localOnly = false) {
  loadLocal();
  if (!localOnly && currentUser) await loadRemote();
  checkDayRollover();
  document.getElementById('auth-screen').classList.remove('active');
  document.getElementById('app-screen').classList.add('active');
  renderAll();
  registerServiceWorker();
}

function checkDayRollover() {
  const today = dateKey();
  if (STATE.todayKey !== today) {
    // New day — update overall streak
    if (STATE.lastActiveDate) {
      const last = new Date(STATE.lastActiveDate);
      const now = new Date(today);
      const diff = Math.round((now - last) / 86400000);
      STATE.overallStreak = diff === 1 ? (STATE.overallStreak || 0) + 1 : 0;
    }
    STATE.todayKey = today;
    STATE.todayPts = 0;
    STATE.logged = {};
  }
}

function dateKey() {
  return new Date().toISOString().slice(0, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// HABIT LOGGING
// ─────────────────────────────────────────────────────────────────────────────
function logHabit(id) {
  const habit = HABITS.find(h => h.id === id);
  if (!habit) return;

  const count = STATE.logged[id] || 0;
  if (count >= habit.maxPerDay) {
    toast('Already logged today!', 'error');
    return;
  }

  // Streak calculation
  const streakData = STATE.streaks[id] || { count: 0, lastDate: '' };
  const today = dateKey();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let newStreak;
  if (streakData.lastDate === today) {
    newStreak = streakData.count;
  } else if (streakData.lastDate === yesterday) {
    newStreak = streakData.count + 1;
  } else {
    newStreak = 1;
  }

  // Points with streak bonus
  let pts = habit.pts;
  let bonusLabel = '';
  if (newStreak >= 7) { pts = Math.round(pts * 1.5); bonusLabel = '+50% streak bonus'; }
  else if (newStreak >= 3) { pts = Math.round(pts * 1.2); bonusLabel = '+20% streak bonus'; }

  STATE.logged[id] = count + 1;
  STATE.points += pts;
  STATE.alltime += pts;
  STATE.todayPts += pts;
  STATE.streaks[id] = { count: newStreak, lastDate: today };
  STATE.lastActiveDate = today;

  STATE.history.unshift({
    date: today,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    name: habit.name,
    pts,
    bonus: bonusLabel,
    type: 'habit',
  });
  if (STATE.history.length > 200) STATE.history.splice(200);

  saveLocal();
  scheduleSave();
  checkDayRollover();
  renderAll();

  const msg = '+' + pts + ' pts' + (bonusLabel ? ' · ' + bonusLabel : '');
  toast(msg, 'success');
}

// ─────────────────────────────────────────────────────────────────────────────
// REWARD REDEMPTION
// ─────────────────────────────────────────────────────────────────────────────
function redeemReward(id) {
  const reward = REWARDS.find(r => r.id === id);
  if (!reward || STATE.points < reward.cost) return;
  STATE.points -= reward.cost;
  STATE.redeemed[id] = (STATE.redeemed[id] || 0) + 1;
  STATE.history.unshift({
    date: dateKey(),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    name: 'Reward: ' + reward.name,
    pts: -reward.cost,
    bonus: '',
    type: 'reward',
  });
  saveLocal();
  scheduleSave();
  renderAll();
  toast('Redeemed: ' + reward.name, 'reward');
}

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL SYSTEM
// ─────────────────────────────────────────────────────────────────────────────
function getLevelInfo(alltime) {
  let idx = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (alltime >= LEVELS[i].min) { idx = i; break; }
  }
  const cur = LEVELS[idx];
  const next = LEVELS[idx + 1];
  const progress = next
    ? (alltime - cur.min) / (next.min - cur.min)
    : 1;
  return { level: idx + 1, name: cur.name, color: cur.color, progress: Math.min(progress, 1), nextMin: next ? next.min : null };
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────────────────────────────────────────
function renderAll() {
  renderHeader();
  renderPointsBar();
  if (activeTab === 'log') renderHabits();
  if (activeTab === 'rewards') renderRewards();
  if (activeTab === 'history') renderHistory();
  if (activeTab === 'streaks') renderStreaks();
  if (activeTab === 'progress') renderProgress();
}

function renderHeader() {
  const li = getLevelInfo(STATE.alltime);
  document.getElementById('header-level').textContent = 'Lv ' + li.level;
  document.getElementById('header-level').style.background = li.color + '22';
  document.getElementById('header-level').style.color = li.color;
}

function renderPointsBar() {
  document.getElementById('pts-total').textContent = STATE.points.toLocaleString();
  document.getElementById('pts-today').textContent = STATE.todayPts.toLocaleString();
  document.getElementById('pts-alltime').textContent = STATE.alltime.toLocaleString();
  document.getElementById('pts-streak-days').textContent = STATE.overallStreak || 0;
  const li = getLevelInfo(STATE.alltime);
  const pct = Math.round(li.progress * 100);
  document.getElementById('xp-level-name').textContent = li.name;
  document.getElementById('xp-pct').textContent = li.nextMin
    ? pct + '% to level ' + (li.level + 1)
    : 'Max level reached';
  document.getElementById('xp-fill').style.width = pct + '%';
}

function renderHabits() {
  // Category filter chips
  const filterEl = document.getElementById('cat-filter');
  const cats = ['All', ...CATEGORIES];
  filterEl.innerHTML = cats.map(c => `
    <button class="cat-chip${activeCat === c ? ' active' : ''}"
      style="${activeCat === c ? 'background:' + (CAT_COLORS[c] || '#0F6E56') : ''}"
      onclick="setCat('${c}')">${c}</button>`).join('');

  const shown = activeCat === 'All'
    ? HABITS
    : HABITS.filter(h => h.cat === activeCat);

  const grouped = {};
  shown.forEach(h => {
    if (!grouped[h.cat]) grouped[h.cat] = [];
    grouped[h.cat].push(h);
  });

  let html = '';
  Object.entries(grouped).forEach(([cat, habits]) => {
    html += `<div class="habit-section">
      <div class="habit-section-title" style="color:${CAT_COLORS[cat]}">${cat}</div>`;
    habits.forEach(h => {
      const count = STATE.logged[h.id] || 0;
      const done = count >= h.maxPerDay;
      const streakData = STATE.streaks[h.id];
      const streak = streakData ? streakData.count : 0;
      const bonusLabel = streak >= 7 ? '+50%' : streak >= 3 ? '+20%' : '';
      const displayPts = streak >= 7 ? Math.round(h.pts * 1.5) : streak >= 3 ? Math.round(h.pts * 1.2) : h.pts;
      const streakClass = streak >= 7 ? 'hot' : '';

      html += `<div class="habit-card${done ? ' done' : ''}" onclick="logHabit('${h.id}')">
        <div class="habit-dot" style="background:${h.color}">${h.label}</div>
        <div class="habit-body">
          <div class="habit-name">${h.name}</div>
          <div class="habit-sub">
            <span>${h.note}</span>
            ${streak >= 2 ? `<span class="streak-pill ${streakClass}">${streak}d</span>` : ''}
            ${bonusLabel ? `<span class="streak-pill ${streakClass}">${bonusLabel}</span>` : ''}
            ${h.maxPerDay > 1 ? `<span>${count}/${h.maxPerDay}</span>` : ''}
          </div>
        </div>
        <div class="habit-pts-block">
          <div class="habit-pts-num" style="color:${done ? 'var(--teal)' : h.color}">${displayPts}</div>
          <span class="habit-pts-label">pts</span>
        </div>
        <div class="habit-check${done ? ' checked' : ''}"></div>
      </div>`;
    });
    html += `</div>`;
  });

  document.getElementById('habits-list').innerHTML = html;
}

function renderRewards() {
  document.getElementById('reward-pts-chip').textContent = STATE.points.toLocaleString() + ' pts';
  document.getElementById('rewards-grid').innerHTML = REWARDS.map(r => {
    const can = STATE.points >= r.cost;
    const count = STATE.redeemed[r.id] || 0;
    return `<div class="reward-card">
      <div class="reward-name">${r.name}</div>
      <div class="reward-cost">${r.cost.toLocaleString()}</div>
      <div class="reward-note">${r.note}</div>
      ${count > 0 ? `<div class="reward-count">Redeemed ${count}x</div>` : ''}
      <button class="reward-redeem${can ? ' affordable' : ''}"
        onclick="redeemReward('${r.id}')"
        ${can ? '' : 'disabled'}>
        ${can ? 'Redeem' : STATE.points.toLocaleString() + ' / ' + r.cost.toLocaleString()}
      </button>
    </div>`;
  }).join('');
}

function renderHistory() {
  if (!STATE.history.length) {
    document.getElementById('history-list').innerHTML =
      '<div class="empty-state">No activity yet.<br>Log your first habit to start your history.</div>';
    return;
  }

  // Group by date
  const grouped = {};
  STATE.history.slice(0, 100).forEach(h => {
    const label = h.date === dateKey() ? 'Today' :
      new Date(h.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(h);
  });

  let html = '';
  Object.entries(grouped).forEach(([day, items]) => {
    html += `<div class="history-day">
      <div class="history-day-label">${day}</div>`;
    items.forEach(item => {
      const pos = item.pts > 0;
      html += `<div class="history-item">
        <div>
          <div class="history-name">${item.name}</div>
          <span class="history-meta">${item.time}${item.bonus ? ' · ' + item.bonus : ''}</span>
        </div>
        <span class="history-pts ${pos ? 'positive' : 'negative'}">${pos ? '+' : ''}${item.pts}</span>
      </div>`;
    });
    html += `</div>`;
  });

  document.getElementById('history-list').innerHTML = html;
}

function renderStreaks() {
  const active = HABITS
    .map(h => ({ ...h, streak: STATE.streaks[h.id]?.count || 0 }))
    .filter(h => h.streak >= 1)
    .sort((a, b) => b.streak - a.streak);

  if (!active.length) {
    document.getElementById('streaks-list').innerHTML =
      '<div class="empty-state">No streaks yet.<br>Log any habit on consecutive days to build a streak.<br><br>3 days = +20% bonus points<br>7 days = +50% bonus points</div>';
    return;
  }

  document.getElementById('streaks-list').innerHTML = active.map(h => {
    const bonus = h.streak >= 7 ? '+50% pts earned' : h.streak >= 3 ? '+20% pts earned' : h.streak + 1 + ' more day' + (h.streak + 1 !== 1 ? 's' : '') + ' for bonus';
    const color = h.streak >= 7 ? '#993C1D' : h.streak >= 3 ? '#BA7517' : '#888780';
    return `<div class="streak-item">
      <div class="streak-num" style="color:${color}">${h.streak}</div>
      <div class="streak-body">
        <div class="streak-habit-name">${h.name}</div>
        <div class="streak-bonus" style="color:${color}">${bonus}</div>
      </div>
    </div>`;
  }).join('');
}

function renderProgress() {
  const li = getLevelInfo(STATE.alltime);
  const todayHabits = Object.values(STATE.logged).reduce((a, b) => a + b, 0);
  const totalPossible = HABITS.reduce((a, h) => a + h.maxPerDay, 0);

  const html = `
    <div class="progress-section">
      <div class="progress-grid">
        <div class="progress-card">
          <div class="progress-card-title">Level</div>
          <div class="progress-card-val" style="color:${li.color}">${li.level}</div>
          <div class="progress-card-sub">${li.name}</div>
        </div>
        <div class="progress-card">
          <div class="progress-card-title">Overall streak</div>
          <div class="progress-card-val">${STATE.overallStreak || 0}</div>
          <div class="progress-card-sub">consecutive days active</div>
        </div>
        <div class="progress-card">
          <div class="progress-card-title">Today's habits</div>
          <div class="progress-card-val">${todayHabits}</div>
          <div class="progress-card-sub">of ${totalPossible} possible</div>
        </div>
        <div class="progress-card">
          <div class="progress-card-title">Rewards redeemed</div>
          <div class="progress-card-val">${Object.values(STATE.redeemed).reduce((a,b)=>a+b,0)}</div>
          <div class="progress-card-sub">total redemptions</div>
        </div>
      </div>

      <div class="progress-card" style="margin-bottom:10px">
        <div class="progress-card-title">All-time points earned</div>
        <div class="progress-card-val">${STATE.alltime.toLocaleString()}</div>
        <div class="progress-card-sub">${STATE.points.toLocaleString()} available to spend</div>
      </div>

      <div class="section-header" style="padding-left:0"><h2 style="font-size:16px">Level roadmap</h2></div>
      <div class="level-list">
        ${LEVELS.map((lvl, i) => {
          const reached = STATE.alltime >= lvl.min;
          const isCurrent = li.level === i + 1;
          const dotClass = isCurrent ? 'current' : reached ? 'reached' : 'locked';
          return `<div class="level-row-item">
            <div class="level-dot ${dotClass}" style="${isCurrent ? 'background:'+lvl.color+';box-shadow:0 0 0 3px '+lvl.color+'33' : reached ? 'background:'+lvl.color : ''}"></div>
            <div class="level-row-name" style="color:${reached||isCurrent?'var(--text)':'var(--text3)'};font-weight:${isCurrent?'600':'400'}">
              Level ${i+1} — ${lvl.name}
            </div>
            <div class="level-row-pts">${lvl.min.toLocaleString()} pts</div>
          </div>`;
        }).join('')}
      </div>
    </div>`;

  document.getElementById('progress-content').innerHTML = html;
}

// ─────────────────────────────────────────────────────────────────────────────
// UI HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function setCat(cat) {
  activeCat = cat;
  renderHabits();
}

function showTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tab)?.classList.add('active');
  document.getElementById('nav-' + tab)?.classList.add('active');
  renderAll();
  // Scroll to top
  document.querySelector('.main-content')?.scrollTo(0, 0);
}

function toggleMenu() {
  menuOpen = !menuOpen;
  document.getElementById('dropdown-menu').style.display = menuOpen ? '' : 'none';
}

document.addEventListener('click', e => {
  if (menuOpen && !document.getElementById('menu-btn')?.contains(e.target) &&
      !document.getElementById('dropdown-menu')?.contains(e.target)) {
    menuOpen = false;
    document.getElementById('dropdown-menu').style.display = 'none';
  }
});

function toast(msg, type = '') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast' + (type ? ' ' + type : '');
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICE WORKER REGISTRATION
// ─────────────────────────────────────────────────────────────────────────────
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────────────────
(async () => {
  const { data: { session } } = await sb.auth.getSession();
  if (session?.user) {
    currentUser = session.user;
    await bootApp();
  }
  // Otherwise stay on auth screen
})();
