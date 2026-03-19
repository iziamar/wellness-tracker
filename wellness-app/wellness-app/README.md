# My Wellness Tracker

A gamified PWA habit tracker built for PCOS + ADHD management. Syncs across all devices via Supabase.

---

## Setup (15 minutes total)

### 1. Supabase (free, cross-device sync)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (any name, any region, remember the DB password)
3. Once the project loads, go to **SQL Editor → New query**
4. Paste the contents of `supabase_migration.sql` and click **Run**
5. Go to **Settings → API**
6. Copy your **Project URL** and **anon public** key
7. Open `app.js` and replace the placeholders at the top:

```js
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

> **Auth note**: By default Supabase requires email confirmation. To skip this during development:
> Settings → Authentication → Email → disable "Confirm email"

---

### 2. GitHub Pages (free hosting)

```bash
# In your GitHub account, create a new repo called "wellness" (or anything)
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/wellness.git
git branch -M main
git push -u origin main
```

Then in the repo on GitHub:
- Go to **Settings → Pages**
- Source: **Deploy from a branch**
- Branch: **main**, folder: **/ (root)**
- Click Save

Your URL will be: `https://YOUR_USERNAME.github.io/wellness`

It takes ~60 seconds to go live after the first push.

---

### 3. Add to your home screen

**iPhone (Safari):**
1. Open your GitHub Pages URL in Safari
2. Tap the Share button (box with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Tap Add

**Android (Chrome):**
1. Open the URL in Chrome
2. Tap the three-dot menu
3. Tap **Add to Home screen**

**iPad:**
Same as iPhone — use Safari.

**Desktop:**
Bookmark it, or in Chrome click the install icon in the address bar.

---

### 4. Icons (optional but nice)

The icons were pre-generated. If you want to regenerate them:

```bash
pip install Pillow
python3 generate_icons.py
```

---

## File structure

```
wellness/
├── index.html          # App shell + auth UI
├── styles.css          # All styling (mobile-first, dark mode)
├── data.js             # All habits and rewards defined here
├── app.js              # All logic: auth, state, rendering
├── sw.js               # Service worker (offline support)
├── manifest.json       # PWA manifest
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
├── supabase_migration.sql   # Run this in Supabase SQL editor
└── generate_icons.py        # Regenerate icons if needed
```

---

## Customising

**Adding a habit:** Open `data.js` and add to the `HABITS` array:
```js
{ id:'my_habit', cat:'Wellness', label:'MH', name:'My new habit',
  pts:10, energy:2, note:'Brief description', color:'#534AB7', maxPerDay:1 },
```

**Adding a reward:** Open `data.js` and add to the `REWARDS` array:
```js
{ id:'r_new', name:'My reward', cost:200, note:'Description' },
```

**Changing point values:** Edit the `pts` field on any habit in `data.js`.

---

## How sync works

- **Signed in**: State saves to Supabase automatically ~1.5s after any change. All your devices read from the same row.
- **Not signed in**: State saves to localStorage on that device only.
- **Offline**: App works fully offline (service worker caches everything). Changes sync automatically when you're back online.

---

## Points system — weighting rationale

Points are weighted by **activation energy**, not health importance:

| Energy level | Points range | Examples |
|---|---|---|
| 1 — Effortless | 5 pts | Supplements, water, face wash |
| 2 — Easy | 8–15 pts | Meals, walks, bed made |
| 3 — Moderate | 15–25 pts | Shower, no-sugar day, sleep goals |
| 4 — Hard | 25–40 pts | Hair wash, meal prep, used pause rule |
| 5 — Very hard | 40–60 pts | Full workout, laundry put away, full clean |

**Streak bonuses:**
- 3+ consecutive days: +20% points
- 7+ consecutive days: +50% points

---

## Tech stack

- Vanilla JS — no framework, no build step, deploys as static files
- Supabase — auth + PostgreSQL via REST
- Service Worker — offline PWA support
- GitHub Pages — free hosting
