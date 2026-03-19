const HABITS = [
  // ── Hydration ──────────────────────────────────────────────────────────────
  { id:'water1', cat:'Hydration', label:'W1', name:'Water litre 1 (before coffee)', pts:5,  energy:1, note:'Start the day hydrated', color:'#185FA5', maxPerDay:1 },
  { id:'water2', cat:'Hydration', label:'W2', name:'Water litre 2 (by lunch)',      pts:5,  energy:1, note:'Midday hydration check',  color:'#185FA5', maxPerDay:1 },
  { id:'water3', cat:'Hydration', label:'W3', name:'Water litre 3 (by dinner)',     pts:5,  energy:1, note:'Afternoon target',        color:'#185FA5', maxPerDay:1 },
  { id:'water4', cat:'Hydration', label:'W4', name:'Water litre 4 (evening)',       pts:5,  energy:1, note:'Reach your daily goal',   color:'#185FA5', maxPerDay:1 },

  // ── Meals ──────────────────────────────────────────────────────────────────
  { id:'meal_bf',    cat:'Meals', label:'BF', name:'Anchor breakfast eaten',          pts:10, energy:1, note:'Oat bowl or eggs & avocado',        color:'#3B6D11', maxPerDay:1 },
  { id:'meal_lunch', cat:'Meals', label:'LU', name:'Lunch as planned',                pts:10, energy:1, note:'Chicken bowl or tuna & white bean',  color:'#3B6D11', maxPerDay:1 },
  { id:'meal_dinner',cat:'Meals', label:'DN', name:'Dinner as planned',               pts:15, energy:2, note:'Salmon, chicken, or burger bowl',    color:'#3B6D11', maxPerDay:1 },
  { id:'meal_snack', cat:'Meals', label:'SN', name:'Healthy snack (walnuts/eggs)',    pts:8,  energy:1, note:'No sugar cravings given in to',       color:'#3B6D11', maxPerDay:2 },
  { id:'meal_prot',  cat:'Meals', label:'PR', name:'Hit protein goal (160g+)',        pts:20, energy:2, note:'Full day bonus — hardest target',     color:'#3B6D11', maxPerDay:1 },
  { id:'meal_nosg',  cat:'Meals', label:'NS', name:'Zero added sugar all day',        pts:25, energy:3, note:'Full day — serious willpower',        color:'#3B6D11', maxPerDay:1 },
  { id:'meal_flax',  cat:'Meals', label:'FL', name:'Ground flaxseed added to meal',   pts:5,  energy:1, note:'In yogurt, oats, or shake',           color:'#3B6D11', maxPerDay:1 },
  { id:'meal_walnuts',cat:'Meals',label:'WN', name:'Walnuts eaten today',             pts:5,  energy:1, note:'Daily LDL habit — must be consistent', color:'#3B6D11', maxPerDay:1 },
  { id:'meal_prep',  cat:'Meals', label:'MP', name:'Sunday meal prep completed',      pts:40, energy:4, note:'35 min of prep = whole week solved',  color:'#3B6D11', maxPerDay:1 },

  // ── Fitness ────────────────────────────────────────────────────────────────
  { id:'fit_workout',  cat:'Fitness', label:'EX', name:'Full workout completed',           pts:50, energy:5, note:'Mon/Thu/Sat — full session',      color:'#534AB7', maxPerDay:1 },
  { id:'fit_warmup',   cat:'Fitness', label:'WU', name:'Warm-up completed',                pts:10, energy:1, note:'All 8 movements before training',  color:'#534AB7', maxPerDay:1 },
  { id:'fit_cooldown', cat:'Fitness', label:'CD', name:'Cool-down & stretches done',       pts:10, energy:1, note:'All 8 stretches after training',   color:'#534AB7', maxPerDay:1 },
  { id:'fit_walk',     cat:'Fitness', label:'PW', name:'Post-meal walk (10+ min)',          pts:15, energy:2, note:'After your largest meal',          color:'#534AB7', maxPerDay:1 },
  { id:'fit_walk30',   cat:'Fitness', label:'W+', name:'Walk 30+ min',                     pts:20, energy:2, note:'Any walk over half an hour',        color:'#534AB7', maxPerDay:1 },
  { id:'fit_yoga',     cat:'Fitness', label:'YG', name:'Stretching or yoga session',       pts:15, energy:2, note:'Rest days — active recovery',       color:'#534AB7', maxPerDay:1 },
  { id:'fit_5min',     cat:'Fitness', label:'5M', name:'Started workout (5-min rule)',      pts:8,  energy:3, note:'Just start — momentum follows',    color:'#534AB7', maxPerDay:1 },

  // ── Self-care ──────────────────────────────────────────────────────────────
  { id:'sc_teeth_am',  cat:'Self-care', label:'TA', name:'Brush teeth (morning)',       pts:5,  energy:1, note:'2 min minimum',                        color:'#0F6E56', maxPerDay:1 },
  { id:'sc_teeth_pm',  cat:'Self-care', label:'TN', name:'Brush teeth (night)',         pts:8,  energy:1, note:'Easier to skip — earns extra',          color:'#0F6E56', maxPerDay:1 },
  { id:'sc_floss',     cat:'Self-care', label:'FS', name:'Floss',                       pts:10, energy:2, note:'Consistently skipped — worth more',     color:'#0F6E56', maxPerDay:1 },
  { id:'sc_face_am',   cat:'Self-care', label:'FA', name:'Wash face (morning)',         pts:5,  energy:1, note:'Skincare step 1',                       color:'#0F6E56', maxPerDay:1 },
  { id:'sc_face_pm',   cat:'Self-care', label:'FN', name:'Wash face (night)',           pts:8,  energy:1, note:'Night routine — easy to skip tired',    color:'#0F6E56', maxPerDay:1 },
  { id:'sc_moist',     cat:'Self-care', label:'MZ', name:'Moisturise face',             pts:5,  energy:1, note:'AM or PM',                              color:'#0F6E56', maxPerDay:2 },
  { id:'sc_shower',    cat:'Self-care', label:'SH', name:'Shower taken',                pts:15, energy:3, note:'Initiation is the hard part',           color:'#0F6E56', maxPerDay:1 },
  { id:'sc_hair',      cat:'Self-care', label:'HW', name:'Hair washed',                 pts:20, energy:4, note:'High energy task — deserves reward',    color:'#0F6E56', maxPerDay:1 },
  { id:'sc_dressed',   cat:'Self-care', label:'GD', name:'Got fully dressed',            pts:8,  energy:2, note:'Real clothes — sets the tone',          color:'#0F6E56', maxPerDay:1 },
  { id:'sc_nails',     cat:'Self-care', label:'NL', name:'Nails clipped/filed',          pts:8,  energy:2, note:'When needed',                          color:'#0F6E56', maxPerDay:1 },

  // ── Supplements ────────────────────────────────────────────────────────────
  { id:'sup_myo_am',  cat:'Supplements', label:'MA', name:'Myo-inositol AM dose',     pts:5, energy:1, note:'Before breakfast — 40:1 ratio', color:'#BA7517', maxPerDay:1 },
  { id:'sup_myo_pm',  cat:'Supplements', label:'MP', name:'Myo-inositol PM dose',     pts:5, energy:1, note:'Before dinner',                 color:'#BA7517', maxPerDay:1 },
  { id:'sup_vitd',    cat:'Supplements', label:'VD', name:'Vitamin D3 taken',          pts:5, energy:1, note:'With highest-fat meal',         color:'#BA7517', maxPerDay:1 },
  { id:'sup_mag',     cat:'Supplements', label:'MG', name:'Magnesium glycinate',       pts:5, energy:1, note:'30 min before bed',             color:'#BA7517', maxPerDay:1 },
  { id:'sup_fish',    cat:'Supplements', label:'FO', name:'Fish oil taken',            pts:5, energy:1, note:'With dinner',                   color:'#BA7517', maxPerDay:1 },
  { id:'sup_psyl',    cat:'Supplements', label:'PS', name:'Psyllium husk taken',       pts:5, energy:1, note:'Before largest meal',           color:'#BA7517', maxPerDay:1 },

  // ── Sleep ──────────────────────────────────────────────────────────────────
  { id:'sleep_7h',      cat:'Sleep', label:'7H', name:'7–9 hours of sleep',           pts:30, energy:3, note:'Single most impactful habit',            color:'#993C1D', maxPerDay:1 },
  { id:'sleep_bed',     cat:'Sleep', label:'BT', name:'In bed by consistent time',    pts:15, energy:2, note:'Same time every night',                  color:'#993C1D', maxPerDay:1 },
  { id:'sleep_screen',  cat:'Sleep', label:'NS', name:'No screens 30 min before bed', pts:20, energy:3, note:'Hardest sleep habit — high reward',      color:'#993C1D', maxPerDay:1 },
  { id:'sleep_log',     cat:'Sleep', label:'SL', name:'Sleep log filled in',          pts:5,  energy:1, note:'In your wellness packet',                color:'#993C1D', maxPerDay:1 },
  { id:'sleep_mag',     cat:'Sleep', label:'SM', name:'Magnesium taken before bed',   pts:5,  energy:1, note:'Supports sleep onset and quality',       color:'#993C1D', maxPerDay:1 },

  // ── Home ───────────────────────────────────────────────────────────────────
  { id:'home_laundry_w', cat:'Home', label:'LW', name:'Laundry washed',            pts:20, energy:3, note:'Starting is the hardest part',            color:'#5F5E5A', maxPerDay:1 },
  { id:'home_laundry_d', cat:'Home', label:'LD', name:'Laundry moved to dryer',    pts:15, energy:2, note:'Step 2 — before it sits wet',             color:'#5F5E5A', maxPerDay:1 },
  { id:'home_laundry_a', cat:'Home', label:'LA', name:'Laundry put away',          pts:30, energy:5, note:'Hardest laundry step — full reward',      color:'#5F5E5A', maxPerDay:1 },
  { id:'home_dishes',    cat:'Home', label:'DW', name:'Dishes washed or loaded',   pts:15, energy:3, note:'Same day = double points next time',      color:'#5F5E5A', maxPerDay:1 },
  { id:'home_kitchen',   cat:'Home', label:'KW', name:'Kitchen surfaces wiped',    pts:10, energy:2, note:'Counters, stovetop, sink',                color:'#5F5E5A', maxPerDay:1 },
  { id:'home_bed',       cat:'Home', label:'BM', name:'Bed made',                  pts:10, energy:2, note:'Sets the tone for the whole day',         color:'#5F5E5A', maxPerDay:1 },
  { id:'home_trash',     cat:'Home', label:'TR', name:'Trash taken out',           pts:10, energy:2, note:'Before it overflows',                     color:'#5F5E5A', maxPerDay:1 },
  { id:'home_bathroom',  cat:'Home', label:'BR', name:'Bathroom cleaned',          pts:30, energy:4, note:'Toilet, sink, surfaces — weekly',         color:'#5F5E5A', maxPerDay:1 },
  { id:'home_vacuum',    cat:'Home', label:'VC', name:'Vacuumed or swept',         pts:25, energy:3, note:'All main areas — weekly',                 color:'#5F5E5A', maxPerDay:1 },
  { id:'home_weekly',    cat:'Home', label:'WC', name:'Full weekly clean',         pts:60, energy:5, note:'Whole home top to bottom',                color:'#5F5E5A', maxPerDay:1 },
  { id:'home_groceries', cat:'Home', label:'GR', name:'Groceries bought (on plan)',pts:20, energy:3, note:'Stuck to the list',                       color:'#5F5E5A', maxPerDay:1 },
  { id:'home_tidy',      cat:'Home', label:'TI', name:'Quick 10-min tidy',         pts:12, energy:2, note:'Pick up clutter, reset surfaces',         color:'#5F5E5A', maxPerDay:1 },

  // ── Wellness ───────────────────────────────────────────────────────────────
  { id:'well_pause',   cat:'Wellness', label:'MP', name:'Used 5-min pause rule',     pts:25, energy:4, note:'Instead of stress eating — huge win',  color:'#D85A30', maxPerDay:2 },
  { id:'well_mindful', cat:'Wellness', label:'MF', name:'5 min mindful pause',       pts:10, energy:1, note:'Breathing or stillness',               color:'#D85A30', maxPerDay:1 },
  { id:'well_journal', cat:'Wellness', label:'JN', name:'Journaled or reflected',    pts:15, energy:2, note:'Any writing counts',                   color:'#D85A30', maxPerDay:1 },
  { id:'well_tracker', cat:'Wellness', label:'HT', name:'Habit tracker filled in',   pts:10, energy:1, note:'Wellness packet — paper version',      color:'#D85A30', maxPerDay:1 },
  { id:'well_sun',     cat:'Wellness', label:'SN', name:'10+ min natural light',     pts:10, energy:1, note:'Outside or bright window',             color:'#D85A30', maxPerDay:1 },
  { id:'well_social',  cat:'Wellness', label:'SC', name:'Positive social connection', pts:15, energy:2, note:'Called, texted, or met someone you like', color:'#D85A30', maxPerDay:1 },
  { id:'well_appt',    cat:'Wellness', label:'AP', name:'Medical appointment kept',  pts:30, energy:3, note:'Doctor, labs, therapy, any health appt', color:'#D85A30', maxPerDay:1 },
  { id:'well_learn',   cat:'Wellness', label:'LN', name:'Read or listened (non-social media)', pts:10, energy:1, note:'Book, podcast, article', color:'#D85A30', maxPerDay:1 },
];

const CATEGORIES = ['Hydration','Meals','Fitness','Self-care','Supplements','Sleep','Home','Wellness'];

const CAT_COLORS = {
  Hydration:'#185FA5', Meals:'#3B6D11', Fitness:'#534AB7',
  'Self-care':'#0F6E56', Supplements:'#BA7517', Sleep:'#993C1D',
  Home:'#5F5E5A', Wellness:'#D85A30'
};

const REWARDS = [
  { id:'r_tv',      name:'30 min guilt-free TV',         cost:50,  note:'Pick the show, no multitasking' },
  { id:'r_hobby',   name:'1 hour of favourite hobby',    cost:80,  note:'Whatever you love — fully present' },
  { id:'r_treat',   name:'Favourite snack or treat',     cost:75,  note:'Something from your craving list' },
  { id:'r_rest',    name:'Full guilt-free rest day',     cost:100, note:'Zero obligations, no guilt whatsoever' },
  { id:'r_candle',  name:'New candle or bath product',   cost:150, note:'Something small and luxurious' },
  { id:'r_book',    name:'New book or audiobook',        cost:200, note:'Something you actually want to read' },
  { id:'r_movie',   name:'Movie or streaming rental',    cost:200, note:'Film of your choice, just for you' },
  { id:'r_clothes', name:'New clothing item',            cost:400, note:'Something you have been eyeing' },
  { id:'r_workout', name:'New workout gear piece',       cost:300, note:'One item of gym wear or equipment' },
  { id:'r_takeout', name:'Takeout from favourite place', cost:350, note:'Your choice, completely planned treat' },
  { id:'r_gadget',  name:'New kitchen gadget',           cost:450, note:'Something that makes cooking easier' },
  { id:'r_spa',     name:'Spa or nail appointment',      cost:500, note:'Self-care splurge — book it' },
  { id:'r_trip',    name:'Day trip or fun outing',       cost:600, note:'A place you have wanted to go' },
  { id:'r_massage', name:'Massage or bodywork',          cost:700, note:'Full hour — you earned this one' },
  { id:'r_shoes',   name:'New shoes',                    cost:800, note:'Practical or fun, your call' },
  { id:'r_big',     name:'Big personal reward',          cost:1200,note:'Define this yourself — make it count' },
];

const LEVELS = [
  { min:0,    name:'Just getting started',  color:'#888780' },
  { min:200,  name:'Building momentum',     color:'#185FA5' },
  { min:600,  name:'Finding your rhythm',   color:'#3B6D11' },
  { min:1200, name:'Habit machine',         color:'#0F6E56' },
  { min:2000, name:'PCOS warrior',          color:'#BA7517' },
  { min:3200, name:'Unstoppable',           color:'#534AB7' },
  { min:5000, name:'Transformation mode',  color:'#D85A30' },
  { min:7500, name:'Wellness legend',       color:'#993C1D' },
];
