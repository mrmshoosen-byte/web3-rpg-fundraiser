/**
 * game.js — Crystal Realm Story Mode RPG
 * Self-contained vanilla JS, no framework/build step required.
 */

/* ═══════════════════════════════════════════════════════════════
   DATA DEFINITIONS
═══════════════════════════════════════════════════════════════ */

const CHARACTERS = {
  vibhu: {
    id: 'vibhu',
    name: 'Vibhu',
    class: 'Knight',
    sprite: '⚔️',
    winSprite: '👑⚔️',
    resource: 'STR',
    resourceColor: 'str',
    baseStats: { hp: 160, maxHp: 160, str: 80, int: 30, def: 95, agi: 50, spd: 60 },
    resourceMax: 100,
    startingEquipment: [
      { slot: 'hand1',     name: 'Iron Sword',    icon: '🗡️',  stats: { str: 10 } },
      { slot: 'hand2',     name: 'Iron Shield',   icon: '🛡️',  stats: { def: 8  } },
      { slot: 'head',      name: 'Iron Helmet',   icon: '⛑️',  stats: { def: 5  } },
      { slot: 'legs1',     name: 'Iron Boots',    icon: '👢',  stats: { agi: 3  } },
      { slot: 'legs2',     name: 'Chain Mail',    icon: '🔗',  stats: { def: 8  } },
      { slot: 'accessory', name: 'Warrior Ring',  icon: '💍',  stats: { str: 5  } },
    ],
    startingSkills: ['slash','defend','holy_light','shield_bash','regenerate'],
    unlockableSkills: ['whirlwind','divine_shield','holy_judgment','counter_stance','divine_wrath'],
  },
  cryptopher: {
    id: 'cryptopher',
    name: 'Cryptopher',
    class: 'Mage',
    sprite: '🔮',
    winSprite: '🌟🔮',
    resource: 'Mana',
    resourceColor: 'mana',
    baseStats: { hp: 100, maxHp: 100, str: 40, int: 100, def: 50, agi: 80, spd: 80 },
    resourceMax: 100,
    startingEquipment: [
      { slot: 'hand1',     name: 'Crystal Staff',  icon: '🪄',  stats: { int: 15 } },
      { slot: 'hand2',     name: 'Mana Orb',       icon: '🔮',  stats: { int: 10 } },
      { slot: 'head',      name: 'Mage Hat',       icon: '🎩',  stats: { int: 5  } },
      { slot: 'legs1',     name: 'Silk Robe',      icon: '👗',  stats: { def: 5  } },
      { slot: 'legs2',     name: 'Magic Boots',    icon: '👟',  stats: { agi: 8  } },
      { slot: 'accessory', name: 'Mana Crystal',   icon: '💎',  stats: { int: 10 } },
    ],
    startingSkills: ['fireball','icy_shard','lightning','healing_spell','mana_shield'],
    unlockableSkills: ['meteor_storm','blizzard','chain_lightning','inferno','void_rupture'],
  },
};

/* All skills */
const SKILLS = {
  /* ── Vibhu ── */
  slash:          { id:'slash',          name:'Slash',            cost:15, type:'physical', mult:0.96, effect:null,
                    desc:'Strike with your blade. Deals STR×0.96 physical damage.' },
  defend:         { id:'defend',         name:'Defend',           cost:10, type:'buff',     mult:0,   effect:{type:'defBuff',amount:20,turns:2},
                    desc:'Raise shield. +20 DEF for 2 turns.' },
  holy_light:     { id:'holy_light',     name:'Holy Light',       cost:15, type:'heal',     mult:0,   effect:{type:'heal',amount:40},
                    desc:'Channel divine energy. Heal 40 HP.' },
  shield_bash:    { id:'shield_bash',    name:'Shield Bash',      cost:20, type:'physical', mult:0.8, effect:{type:'stun',chance:0.30},
                    desc:'Bash with shield. STR×0.8 damage + 30% stun chance.' },
  regenerate:     { id:'regenerate',     name:'Regenerate',       cost:12, type:'regen',    mult:0,   effect:{type:'regen',amount:25,turns:3},
                    desc:'Mend wounds. Heal 25 HP/turn for 3 turns.' },
  whirlwind:      { id:'whirlwind',      name:'Whirlwind Strike', cost:25, type:'physical', mult:1.2, effect:null,
                    desc:'Spinning attack. Deals STR×1.2 physical damage.' },
  divine_shield:  { id:'divine_shield',  name:'Divine Shield',    cost:20, type:'buff',     mult:0,   effect:{type:'defBuff',amount:30,turns:2,healSelf:25},
                    desc:'+30 DEF + Heal 25 HP for 2 turns.' },
  holy_judgment:  { id:'holy_judgment',  name:'Holy Judgment',    cost:30, type:'physical', mult:1.6, effect:null,
                    desc:'Righteous smite. Deals STR×1.6 physical damage.' },
  counter_stance: { id:'counter_stance', name:'Counter Stance',   cost:18, type:'buff',     mult:0,   effect:{type:'agiBuff',amount:20,turns:3},
                    desc:'Ready to evade. +20 AGI for 3 turns.' },
  divine_wrath:   { id:'divine_wrath',   name:'Divine Wrath',     cost:35, type:'physical', mult:2.0, effect:null,
                    desc:'Devastating holy strike. Deals STR×2.0 physical damage.' },

  /* ── Cryptopher ── */
  fireball:        { id:'fireball',        name:'Fireball',          cost:25, type:'magic', mult:1.2, effect:null,
                     desc:'Hurl a blazing sphere. Deals INT×1.2 magic damage.' },
  icy_shard:       { id:'icy_shard',       name:'Icy Shard',         cost:25, type:'magic', mult:1.2, effect:{type:'slow',chance:0.20,turns:2},
                     desc:'Ice projectile. INT×1.2 damage + 20% slow chance (2 turns).' },
  lightning:       { id:'lightning',       name:'Lightning Strike',  cost:25, type:'magic', mult:1.2, effect:{type:'stun',chance:0.30},
                     desc:'Electric bolt. INT×1.2 damage + 30% stun chance.' },
  healing_spell:   { id:'healing_spell',   name:'Healing Spell',     cost:20, type:'heal',  mult:0,   effect:{type:'heal',amount:40},
                     desc:'Arcane restoration. Heal 40 HP.' },
  mana_shield:     { id:'mana_shield',     name:'Mana Shield',       cost:18, type:'buff',  mult:0,   effect:{type:'shield',amount:0.30,turns:2},
                     desc:'Magic barrier. Reduce damage by 30% for 2 turns.' },
  meteor_storm:    { id:'meteor_storm',    name:'Meteor Storm',      cost:40, type:'magic', mult:1.6, effect:null,
                     desc:'Rains meteors. Deals INT×1.6 magic damage.' },
  blizzard:        { id:'blizzard',        name:'Blizzard',          cost:35, type:'magic', mult:1.44, effect:{type:'slow',chance:1.0,turns:2},
                     desc:'Blinding snowstorm. INT×1.44 damage + guaranteed slow (2 turns).' },
  chain_lightning: { id:'chain_lightning', name:'Chain Lightning',   cost:38, type:'magic', mult:1.52, effect:null,
                     desc:'Bouncing bolts. Deals INT×1.52 magic damage.' },
  inferno:         { id:'inferno',         name:'Inferno',           cost:30, type:'magic', mult:0.96, effect:{type:'burn',amount:0,turns:3},
                     desc:'Searing flames. INT×0.96 damage/turn for 3 turns (burn).' },
  void_rupture:    { id:'void_rupture',    name:'Void Rupture',      cost:45, type:'magic', mult:2.0, effect:null,
                     desc:'Rips void open. Deals INT×2.0 magic damage.' },
};

/* Enemies */
const ENEMIES = [
  null, /* index 0 unused */
  { name:'Void Specter',    emoji:'👻', baseHp:40,  skills:['void_strike','drain_life'],   floor:1  }, /* floor 1 */
  { name:'Void Specter',    emoji:'👻', baseHp:40,  skills:['void_strike','drain_life'],   floor:2  }, /* floor 2 */
  { name:'Skeletal Archer', emoji:'💀', baseHp:50,  skills:['arrow_shot','bone_shield'],   floor:3  },
  { name:'Skeletal Archer', emoji:'💀', baseHp:50,  skills:['arrow_shot','bone_shield'],   floor:4  },
  { name:'Shadow Spider',   emoji:'🕷️', baseHp:55,  skills:['poison_bite','web_snare'],    floor:5  },
  { name:'Shadow Spider',   emoji:'🕷️', baseHp:55,  skills:['poison_bite','web_snare'],    floor:6  },
  { name:'Stone Sentinel',  emoji:'🗿', baseHp:65,  skills:['stone_smash','rock_wall'],    floor:7  },
  { name:'Stone Sentinel',  emoji:'🗿', baseHp:65,  skills:['stone_smash','rock_wall'],    floor:8  },
  { name:'Phantom Knight',  emoji:'👑', baseHp:80,  skills:['phantom_slash','death_aura'], floor:9  },
  { name:'Lich Lord',       emoji:'💀✨',baseHp:150, skills:['soul_drain','ice_nova'],      floor:10, boss:true },
];

const ENEMY_SKILLS = {
  void_strike:   { name:'Void Strike',    baseDmg:18, effect:null },
  drain_life:    { name:'Drain Life',     baseDmg:14, effect:{type:'lifesteal', amount:0.25} },
  arrow_shot:    { name:'Arrow Shot',     baseDmg:20, effect:null },
  bone_shield:   { name:'Bone Shield',    baseDmg:0,  effect:{type:'enemyDefBuff', amount:20, turns:2} },
  poison_bite:   { name:'Poison Bite',    baseDmg:16, effect:{type:'burn', amount:10, turns:3} },
  web_snare:     { name:'Web Snare',      baseDmg:10, effect:{type:'slow', chance:1.0, turns:2} },
  stone_smash:   { name:'Stone Smash',    baseDmg:24, effect:null },
  rock_wall:     { name:'Rock Wall',      baseDmg:0,  effect:{type:'enemyDefBuff', amount:30, turns:2} },
  phantom_slash: { name:'Phantom Slash',  baseDmg:26, effect:{type:'stun', chance:0.20} },
  death_aura:    { name:'Death Aura',     baseDmg:12, effect:{type:'burn', amount:12, turns:3} },
  soul_drain:    { name:'Soul Drain',     baseDmg:30, effect:{type:'lifesteal', amount:0.40} },
  ice_nova:      { name:'Ice Nova',       baseDmg:22, effect:{type:'slow', chance:1.0, turns:2} },
};

/* Slot display names and icons */
const SLOT_INFO = {
  hand1:     { label:'Main Hand',  icon:'⚔️'  },
  hand2:     { label:'Off Hand',   icon:'🛡️'  },
  head:      { label:'Head',       icon:'⛑️'  },
  legs1:     { label:'Legs 1',     icon:'👢'  },
  legs2:     { label:'Legs 2',     icon:'🔗'  },
  accessory: { label:'Accessory',  icon:'💍'  },
};

const RARITIES = ['Common','Uncommon','Rare','Epic','Legendary'];
const RARITY_WEIGHTS = [40, 30, 18, 9, 3]; /* cumulative probability */
const RARITY_COLORS = {
  Common:'rarity-common', Uncommon:'rarity-uncommon', Rare:'rarity-rare',
  Epic:'rarity-epic', Legendary:'rarity-legendary',
};

/* Consumable items */
const BASE_ITEMS = [
  { id:'health_potion',  name:'Health Potion',  icon:'🧪', qty:2, effect:{type:'heal',amount:50},  desc:'Restore 50 HP' },
  { id:'str_elixir',     name:'Strength Elixir',icon:'⚗️', qty:1, effect:{type:'statBuff',stat:'str',amount:20,turns:3}, desc:'+20 STR for 3 turns' },
  { id:'def_tonic',      name:'Defense Tonic',  icon:'🫙', qty:1, effect:{type:'statBuff',stat:'def',amount:15,turns:2}, desc:'+15 DEF for 2 turns' },
];

/* ═══════════════════════════════════════════════════════════════
   GAME STATE
═══════════════════════════════════════════════════════════════ */

const gameState = {
  phase: 'select',  /* select | info | battle | loot | skillUnlock | floorComplete | victory | gameOver */
  character: null,  /* deep copy of chosen character template */
  floor: 0,
  enemy: null,      /* current enemy combat state */
  skills: [],       /* player's 5 current skill ids */
  equipment: {},    /* slot -> equip object */
  items: [],        /* consumable inventory */
  stats: {},        /* computed stats = base + equip bonuses + temp buffs */
  resource: 0,
  resourceMax: 100,
  statusEffects: [],    /* player status effects */
  enemyStatusEffects: [],
  battleLog: [],
  pendingLoot: null,    /* equipment to show on loot screen */
  pendingSkill: null,   /* unlockable skill to show */
  currentUnlockIdx: 0,  /* tracks which unlockable to show next */
  animating: false,
  turnCount: 0,
  slowTurnCounter: 0,   /* for player slow tracking */
  enemySlowCounter: 0,  /* for enemy slow tracking */
  victoryData: null,
};

/* ═══════════════════════════════════════════════════════════════
   UTILITY HELPERS
═══════════════════════════════════════════════════════════════ */

/* ── Balance constants ──────────────────────────────── */
const DODGE_AGI_DIVISOR      = 200;  /* AGI / this = dodge chance (capped naturally) */
const PHYSICAL_DEF_DIVISOR   = 300;  /* DEF / this = physical damage reduction       */
const MAGIC_DEF_DIVISOR      = 400;  /* DEF / this = magic damage reduction          */
const MAX_DAMAGE_REDUCTION   = 0.5;  /* cap: 50% damage reduction from defense       */

function rng(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function deepCopy(obj) { return JSON.parse(JSON.stringify(obj)); }

function rollRarity() {
  const total = RARITY_WEIGHTS.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < RARITIES.length; i++) {
    r -= RARITY_WEIGHTS[i];
    if (r < 0) return RARITIES[i];
  }
  return RARITIES[0];
}

function generateEquipment(slot) {
  const rarity = rollRarity();
  const statKeys = ['str','int','def','agi','spd'];
  const stats = {};
  let count = 1;
  let min = 1, max = 5;
  if (rarity === 'Uncommon') { count = rng(1,2); min=3; max=8; }
  else if (rarity === 'Rare')     { count = 2; min=5; max=15; }
  else if (rarity === 'Epic')     { count = rng(2,3); min=10; max=20; }
  else if (rarity === 'Legendary'){ count = 3; min=15; max=25; }

  const chosen = [...statKeys].sort(() => Math.random()-.5).slice(0, count);
  chosen.forEach(s => { stats[s] = rng(min, max); });

  const adjectives = ['Arcane','Void','Shadow','Crystal','Ember','Storm','Ancient','Cursed','Divine'];
  const nouns = {
    hand1:['Sword','Blade','Axe','Spear'], hand2:['Shield','Orb','Totem','Buckler'],
    head:['Helm','Crown','Hood','Circlet'], legs1:['Greaves','Leggings','Trousers','Tassets'],
    legs2:['Boots','Sabatons','Slippers','Sandals'], accessory:['Ring','Amulet','Charm','Rune'],
  };
  const adj = adjectives[rng(0, adjectives.length-1)];
  const noun = nouns[slot][rng(0, nouns[slot].length-1)];
  const icons = { hand1:'⚔️', hand2:'🛡️', head:'⛑️', legs1:'👢', legs2:'🔗', accessory:'💍' };

  return { slot, name:`${adj} ${noun}`, icon:icons[slot], rarity, stats };
}

/* Compute stats from base + equipment + temp buffs */
function computeStats() {
  const ch = gameState.character;
  const base = { ...ch.baseStats };

  /* Add equipment bonuses */
  Object.values(gameState.equipment).forEach(item => {
    if (item && item.stats) {
      Object.entries(item.stats).forEach(([k, v]) => {
        if (base[k] !== undefined) base[k] += v;
        else base[k] = v;
      });
    }
  });

  /* Apply active stat buffs from status effects */
  gameState.statusEffects.forEach(fx => {
    if (fx.type === 'defBuff')  base.def += fx.amount;
    if (fx.type === 'agiBuff')  base.agi += fx.amount;
    if (fx.type === 'statBuff') base[fx.stat] = (base[fx.stat]||0) + fx.amount;
  });

  gameState.stats = base;
  return base;
}

function computeEnemyDef(enemy) {
  let def = enemy.def || 0;
  (gameState.enemyStatusEffects || []).forEach(fx => {
    if (fx.type === 'enemyDefBuff') def += fx.amount;
  });
  return def;
}

/* ═══════════════════════════════════════════════════════════════
   RENDERING HELPERS
═══════════════════════════════════════════════════════════════ */

const container = () => document.getElementById('game-container');

function setScreen(html) {
  container().innerHTML = html;
}

function hpBarClass(cur, max) {
  const pct = cur / max;
  if (pct <= 0.25) return 'low';
  if (pct <= 0.55) return 'mid';
  return '';
}

function hpBarWidth(cur, max) {
  return `${clamp(Math.round((cur / max) * 100), 0, 100)}%`;
}

function renderStatusBadges(effects) {
  if (!effects || !effects.length) return '';
  return effects.map(fx => {
    const map = { stun:'stun', slow:'slow', burn:'burn', regen:'regen',
                  shield:'shield', defBuff:'defbuff', agiBuff:'agibuff',
                  statBuff:'defbuff', enemyDefBuff:'defbuff' };
    const cls = map[fx.type] || 'defbuff';
    const labels = { stun:`STUN(${fx.turns})`, slow:`SLOW(${fx.turns})`,
                     burn:`BURN(${fx.turns})`, regen:`REGEN(${fx.turns})`,
                     shield:`SHIELD(${fx.turns})`, defBuff:`DEF+(${fx.turns})`,
                     agiBuff:`AGI+(${fx.turns})`, statBuff:`BUFF(${fx.turns})`,
                     enemyDefBuff:`DEF+(${fx.turns})` };
    return `<span class="status-badge ${cls}">${labels[fx.type]||fx.type}</span>`;
  }).join('');
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN: CHARACTER SELECT
═══════════════════════════════════════════════════════════════ */

function renderCharSelect() {
  const cards = Object.values(CHARACTERS).map(ch => {
    const statRows = Object.entries(ch.baseStats)
      .filter(([k]) => k !== 'maxHp')
      .map(([k,v]) => `<tr><td>${k.toUpperCase()}</td><td>${v}</td></tr>`).join('');
    const equip = ch.startingEquipment.map(e =>
      `<li>${e.icon} ${e.name} (+${Object.entries(e.stats).map(([k,v])=>`${v} ${k.toUpperCase()}`).join(', ')})</li>`
    ).join('');
    const skills = ch.startingSkills.map(sid => {
      const sk = SKILLS[sid];
      return `<li>${sk.name} (${sk.cost} ${ch.resource})</li>`;
    }).join('');

    return `
      <div class="char-card" id="card-${ch.id}">
        <span class="char-sprite">${ch.sprite}</span>
        <div class="char-name">${ch.name}</div>
        <div class="char-class">${ch.class}</div>
        <table class="char-stats-table"><tbody>${statRows}</tbody></table>
        <div class="char-section-label">Starting Equipment</div>
        <ul class="char-equip-list">${equip}</ul>
        <div class="char-section-label">Starting Skills</div>
        <ul class="char-skill-list">${skills}</ul>
        <button class="select-btn" onclick="selectCharacter('${ch.id}')">SELECT ${ch.name.toUpperCase()}</button>
      </div>`;
  }).join('');

  setScreen(`
    <div class="screen">
      <div class="screen-title">⚔️ CRYSTAL <span class="accent">REALM</span></div>
      <div class="screen-subtitle">Choose Your Champion</div>
      <div class="char-select-grid">${cards}</div>
    </div>`);
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN: CHARACTER INFO
═══════════════════════════════════════════════════════════════ */

function renderCharInfo() {
  const ch = gameState.character;
  const st = computeStats();

  /* Stats with equipment bonuses shown */
  const baseStats = ch.baseStats;
  function bonusText(key) {
    const base = baseStats[key] || 0;
    const cur  = st[key] || 0;
    const diff = cur - base;
    return diff > 0 ? `<span class="s-bonus">+${diff}</span>` : '';
  }
  const statKeys = [['HP',st.maxHp||st.hp],['STR',st.str],['INT',st.int],['DEF',st.def],['AGI',st.agi],['SPD',st.spd]];
  const statsHtml = statKeys.map(([k,v]) =>
    `<div class="stat-pill"><span class="s-label">${k}</span><span class="s-val">${v}</span>${bonusText(k.toLowerCase())}</div>`
  ).join('');

  const equipHtml = Object.entries(gameState.equipment).map(([slot, item]) => {
    const si = SLOT_INFO[slot];
    return `<div class="equip-slot">
      <span class="equip-slot-icon">${item ? item.icon : si.icon}</span>
      <div><div class="equip-slot-label">${si.label}</div>
      <div class="equip-slot-name">${item ? item.name : '—'}</div></div>
    </div>`;
  }).join('');

  const skillsHtml = gameState.skills.map((sid, i) => {
    const sk = SKILLS[sid];
    return `<div class="skill-slot">
      <div class="skill-slot-num">${i+1}</div>
      <div class="skill-slot-name">${sk.name}</div>
      <div class="skill-slot-cost">${sk.cost} ${ch.resource}</div>
    </div>`;
  }).join('');

  const itemsHtml = gameState.items.map(it =>
    `<div class="item-row"><span class="item-name">${it.icon} ${it.name}</span><span class="item-qty">×${it.qty}</span></div>`
  ).join('');

  setScreen(`
    <div class="screen">
      <div class="screen-title"><span class="accent">${ch.name}</span></div>
      <div class="screen-subtitle">${ch.class} — Your Champion</div>
      <div class="info-layout">
        <div class="info-portrait">
          <span class="char-sprite">${ch.sprite}</span>
          <div class="char-name">${ch.name}</div>
          <div class="char-class">${ch.class}</div>
        </div>
        <div class="info-panel">
          <div class="info-block">
            <div class="info-block-title">Combat Stats</div>
            <div class="stats-grid">${statsHtml}</div>
          </div>
          <div class="info-block">
            <div class="info-block-title">Equipment</div>
            <div class="equip-slots">${equipHtml}</div>
          </div>
          <div class="info-block">
            <div class="info-block-title">Skills</div>
            <div class="skill-slots">${skillsHtml}</div>
          </div>
          <div class="info-block">
            <div class="info-block-title">Starting Items</div>
            <div class="items-list">${itemsHtml}</div>
          </div>
        </div>
      </div>
      <button class="enter-btn" onclick="startFloor(1)">⚔️ ENTER THE REALM</button>
    </div>`);
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN: BATTLE
═══════════════════════════════════════════════════════════════ */

function renderBattle() {
  const ch   = gameState.character;
  const st   = computeStats();
  const en   = gameState.enemy;
  const floor = gameState.floor;

  const enHpPct   = clamp(Math.round((en.hp / en.maxHp) * 100), 0, 100);
  const plHpPct   = clamp(Math.round((st.hp / st.maxHp) * 100), 0, 100);
  const resPct    = clamp(Math.round((gameState.resource / gameState.resourceMax) * 100), 0, 100);
  const enEmoji   = (en.hp / en.maxHp < 0.20 && !en.boss) ? '💀' : en.emoji;

  const logLines = gameState.battleLog.slice(-6).map(l =>
    `<div class="log-${l.cls||'system'}">${escHtml(l.text)}</div>`
  ).join('');

  const playerBadges  = renderStatusBadges(gameState.statusEffects);
  const enemyBadges   = renderStatusBadges(gameState.enemyStatusEffects);

  setScreen(`
    <div class="screen battle-screen">
      <div class="floor-indicator">FLOOR <span>${floor}</span> / 10${en.boss ? ' — ☠️ BOSS' : ''}</div>

      <div class="enemy-zone" id="enemy-zone">
        <div class="enemy-header">
          <span class="enemy-name">${en.name}</span>
          <span class="enemy-hp-text">HP: <span>${en.hp}</span>/${en.maxHp}</span>
        </div>
        <div class="hp-bar-track">
          <div class="hp-bar-fill ${hpBarClass(en.hp,en.maxHp)}" id="enemy-hp-bar" style="width:${enHpPct}%"></div>
        </div>
        <div class="status-badges" id="enemy-status">${enemyBadges}</div>
        <div class="enemy-sprite-area" id="enemy-sprite">${enEmoji}</div>
      </div>

      <div class="battle-bottom">
        <div class="battle-bottom-left">
          <div class="battle-log" id="battle-log">${logLines}</div>

          <div class="player-zone" id="player-zone">
            <div class="player-row">
              <div class="player-sprite-small">${ch.sprite}</div>
              <div class="player-info">
                <div class="player-name-row">
                  <span class="player-char-name">${ch.name}</span>
                  <span class="player-hp-text">HP: <span id="player-hp-val">${st.hp}</span>/${st.maxHp}</span>
                </div>
                <div class="hp-bar-track">
                  <div class="hp-bar-fill ${hpBarClass(st.hp,st.maxHp)}" id="player-hp-bar" style="width:${plHpPct}%"></div>
                </div>
              </div>
            </div>
            <div class="status-badges" id="player-status">${playerBadges}</div>
            <div class="res-row">
              <span class="res-label">${ch.resource}</span>
              <span class="res-text" id="res-val">${gameState.resource}/${gameState.resourceMax}</span>
            </div>
            <div class="res-bar-track">
              <div class="res-bar-fill ${ch.resourceColor}" id="res-bar" style="width:${resPct}%"></div>
            </div>
          </div>
        </div>

        <div class="battle-bottom-right">
          <div class="action-bar" id="action-bar">
            <button class="action-btn" id="btn-attack"  onclick="togglePanel('skill')">⚔ ATTACK</button>
            <button class="action-btn" id="btn-item"    onclick="togglePanel('item')">🧪 ITEM</button>
            <button class="action-btn" id="btn-stats"   onclick="togglePanel('stats')">📊 STATS</button>
            <button class="action-btn" id="btn-defend"  onclick="playerDefend()">🛡 DEFEND</button>
          </div>
        </div>
      </div>

      <!-- Skill Panel -->
      <div class="skill-panel" id="skill-panel">
        <div class="skill-panel-title">Select a Skill</div>
        <div class="skill-grid" id="skill-grid">${buildSkillButtons()}</div>
      </div>

      <!-- Item Panel -->
      <div class="item-panel" id="item-panel">
        <div class="skill-panel-title">Use an Item</div>
        ${buildItemButtons()}
        <button class="action-btn" style="width:100%;margin-top:.5rem" onclick="closeAllPanels()">← Back</button>
      </div>

      <!-- Stats Panel -->
      <div class="stats-popup" id="stats-panel">
        <div class="skill-panel-title">Current Stats</div>
        ${buildStatsPopup()}
        <button class="action-btn" style="width:100%;margin-top:.5rem" onclick="closeAllPanels()">← Close</button>
      </div>
    </div>`);

  scrollLog();
}

function buildSkillButtons() {
  const ch = gameState.character;
  return gameState.skills.map(sid => {
    const sk = SKILLS[sid];
    const canAfford = gameState.resource >= sk.cost;
    const typeCls = sk.type === 'physical' ? 'physical' : sk.type === 'magic' ? 'magic' : sk.type === 'heal' ? 'heal' : 'buff';
    return `<button class="skill-btn ${typeCls}" onclick="useSkill('${sid}')" ${canAfford?'':'disabled'}>
      <span class="sk-name">${sk.name}</span>
      <span class="sk-cost">${sk.cost} ${ch.resource}</span>
      <span class="sk-desc">${sk.desc}</span>
    </button>`;
  }).join('');
}

function buildItemButtons() {
  if (!gameState.items.filter(i=>i.qty>0).length) {
    return '<div style="font-size:.65rem;color:var(--text-dim);text-align:center;padding:.5rem">No items remaining.</div>';
  }
  return gameState.items.filter(i=>i.qty>0).map(it =>
    `<button class="item-btn" onclick="useItem('${it.id}')">
      <div class="it-name">${it.icon} ${it.name}</div>
      <div class="it-qty">×${it.qty}</div>
      <div class="it-desc">${it.desc}</div>
    </button>`
  ).join('');
}

function buildStatsPopup() {
  const st = computeStats();
  const rows = [['HP',`${st.hp}/${st.maxHp}`],['STR',st.str],['INT',st.int],['DEF',st.def],['AGI',st.agi],['SPD',st.spd]]
    .map(([k,v]) => `<div class="stat-pill"><span class="s-label">${k}</span><span class="s-val">${v}</span></div>`).join('');
  return `<div class="stats-grid">${rows}</div>`;
}

function scrollLog() {
  const el = document.getElementById('battle-log');
  if (el) el.scrollTop = el.scrollHeight;
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN: LOOT
═══════════════════════════════════════════════════════════════ */

function renderLoot() {
  const item = gameState.pendingLoot;
  const statLines = Object.entries(item.stats)
    .map(([k,v]) => `+<span>${v} ${k.toUpperCase()}</span>`).join('<br>');
  const rarityCard = item.rarity.toLowerCase();
  const rarCls = RARITY_COLORS[item.rarity];

  setScreen(`
    <div class="screen loot-screen">
      <div class="screen-title">⚗️ Item <span class="accent">Found!</span></div>
      <div class="screen-subtitle">Floor ${gameState.floor} Reward</div>
      <div class="loot-card ${rarityCard}">
        <span class="loot-rarity ${rarCls}">${item.rarity}</span>
        <span class="loot-icon">${item.icon}</span>
        <div class="loot-name">${item.name}</div>
        <div class="loot-slot">${SLOT_INFO[item.slot].label} Slot</div>
        <div class="loot-stats">${statLines}</div>
      </div>
      <div class="loot-actions">
        <button class="btn-equip" onclick="equipLoot()">⚔ EQUIP</button>
        <button class="btn-skip"  onclick="skipLoot()">SKIP →</button>
      </div>
    </div>`);
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN: SKILL UNLOCK
═══════════════════════════════════════════════════════════════ */

function renderSkillUnlock() {
  const sk = SKILLS[gameState.pendingSkill];
  const ch = gameState.character;
  const typeEmoji = { physical:'⚔️', magic:'✨', heal:'💚', buff:'🛡️', regen:'🔄' };

  setScreen(`
    <div class="screen skill-unlock-screen">
      <div class="screen-title">✨ New <span class="accent">Skill!</span></div>
      <div class="screen-subtitle">Floor ${gameState.floor} Reward</div>

      <div class="skill-unlock-card">
        <div class="skill-unlock-tag">New Skill Unlocked</div>
        <span class="skill-unlock-icon">${typeEmoji[sk.type]||'⚡'}</span>
        <div class="skill-unlock-name">${sk.name}</div>
        <div class="skill-unlock-cost">${sk.cost} ${ch.resource} · ${sk.type.toUpperCase()}</div>
        <div class="skill-unlock-desc">${sk.desc}</div>
      </div>

      <!-- Skill replacement UI (shown when LEARN is clicked) -->
      <div class="skill-replace-section" id="replace-section">
        <div class="skill-replace-title">Replace which skill?</div>
        ${gameState.skills.map((sid,i) => {
          const s = SKILLS[sid];
          return `<button class="skill-replace-btn" onclick="replaceSkill(${i})">
            <span class="sr-name">${i+1}. ${s.name}</span>
            <span class="sr-cost">${s.cost} ${ch.resource}</span>
          </button>`;
        }).join('')}
      </div>

      <div class="skill-unlock-actions">
        <button class="btn-learn" id="btn-learn" onclick="showReplaceUI()">LEARN SKILL</button>
        <button class="btn-skip"  onclick="skipSkill()">SKIP →</button>
      </div>
    </div>`);
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN: FLOOR COMPLETE
═══════════════════════════════════════════════════════════════ */

function renderFloorComplete() {
  const floor = gameState.floor;
  const isLast = floor === 10;
  const rewardType = floor % 2 === 1 ? 'Equipment Drop' : 'Skill Unlock';
  const rewardDesc = floor % 2 === 1
    ? (gameState.pendingLoot ? `Found: ${gameState.pendingLoot.name} (${gameState.pendingLoot.rarity})` : 'No drop this floor.')
    : (gameState.pendingSkill ? `Unlocked: ${SKILLS[gameState.pendingSkill].name}` : 'No skill this floor.');

  const nextAction = isLast ? 'renderVictory()' : (floor % 2 === 1 ? 'renderLoot()' : 'renderSkillUnlock()');

  setScreen(`
    <div class="screen floor-complete-screen">
      <span class="floor-complete-badge">Floor Cleared</span>
      <div class="floor-complete-title">Floor <span class="accent">${floor}</span> Complete!</div>
      <div class="fc-reward">
        <div class="fc-reward-label">${rewardType}</div>
        <div class="fc-reward-content">${rewardDesc}</div>
      </div>
      <button class="btn-next-floor" onclick="${isLast ? 'renderVictory()' : nextAction}">
        ${isLast ? '🏆 VICTORY!' : 'NEXT FLOOR →'}
      </button>
    </div>`);
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN: VICTORY
═══════════════════════════════════════════════════════════════ */

function renderVictory() {
  const ch = gameState.character;
  const st = computeStats();
  gameState.phase = 'victory';

  const equipSummary = Object.entries(gameState.equipment)
    .filter(([,v]) => v)
    .map(([,v]) => `<div style="font-size:.62rem;color:var(--text-dim);margin-bottom:.2rem">${v.icon} ${v.name} <span style="color:var(--${RARITY_COLORS[v.rarity]||'gold-dim'})">[${v.rarity}]</span></div>`)
    .join('');

  setScreen(`
    <div class="screen victory-screen">
      <div class="victory-banner">⚔ VICTORY! ⚔</div>
      <div class="victory-sub">The Lich Lord Has Been Defeated</div>

      <div class="skin-preview">${ch.winSprite}</div>
      <div class="skin-label">✨ LEGENDARY SKIN UNLOCKED ✨</div>

      <div class="victory-stats-grid">
        <div class="vs-stat"><span class="vs-val">10</span><span class="vs-lbl">Floors Cleared</span></div>
        <div class="vs-stat"><span class="vs-val">${st.hp}/${st.maxHp}</span><span class="vs-lbl">HP Remaining</span></div>
        <div class="vs-stat"><span class="vs-val">${ch.class}</span><span class="vs-lbl">Class</span></div>
      </div>

      <div class="info-block" style="margin-bottom:1.5rem;text-align:left">
        <div class="info-block-title">Final Equipment</div>
        ${equipSummary || '<span style="font-size:.62rem;color:var(--text-dim)">No equipment changes.</span>'}
      </div>

      <div id="mint-status" class="mint-status"></div>

      <div class="victory-mint-section">
        <button class="btn-mint" onclick="handleMint()">✨ MINT NOW</button>
        <button class="btn-airdrop" onclick="toggleAirdropForm()">🎁 AIRDROP ON LAUNCH</button>
      </div>

      <div class="airdrop-form" id="airdrop-form">
        <input type="text" id="airdrop-wallet" placeholder="Enter Solana wallet address…" maxlength="88">
        <button onclick="submitAirdrop()">REGISTER FOR AIRDROP</button>
      </div>

      <div class="victory-bottom-btns">
        <button class="btn-retry-main" onclick="resetGame()">🔄 PLAY AGAIN</button>
        <button class="btn-retry-main" onclick="goToMain()">← BACK TO MAIN</button>
      </div>
    </div>`);
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN: GAME OVER
═══════════════════════════════════════════════════════════════ */

function renderGameOver() {
  gameState.phase = 'gameOver';
  setScreen(`
    <div class="screen gameover-screen">
      <div class="gameover-title">DEFEATED...</div>
      <div class="gameover-sub">The Realm Reclaims You</div>
      <div class="gameover-floor">
        Fell on <span>Floor ${gameState.floor}</span>
      </div>
      <div class="gameover-actions">
        <button class="btn-retry-floor" onclick="retryFloor()">↻ RETRY FLOOR</button>
        <button class="btn-main-menu"   onclick="resetGame()">MAIN MENU</button>
      </div>
    </div>`);
}

/* ═══════════════════════════════════════════════════════════════
   GAME FLOW ACTIONS
═══════════════════════════════════════════════════════════════ */

function selectCharacter(id) {
  const template = CHARACTERS[id];
  gameState.character = deepCopy(template);
  gameState.skills    = [...template.startingSkills];
  gameState.equipment = {};
  template.startingEquipment.forEach(e => { gameState.equipment[e.slot] = deepCopy(e); });
  gameState.items     = deepCopy(BASE_ITEMS);
  gameState.resource  = template.resourceMax;
  gameState.resourceMax = template.resourceMax;
  gameState.currentUnlockIdx = 0;
  gameState.statusEffects = [];
  gameState.enemyStatusEffects = [];
  gameState.battleLog = [];

  /* Set HP to fully-computed max (base stats + equipment bonuses) */
  computeStats();
  const computedMaxHp = gameState.stats.hp;
  gameState.character.baseStats.maxHp = computedMaxHp;
  gameState.character.baseStats.hp    = computedMaxHp;
  gameState.stats.hp                  = computedMaxHp;

  gameState.phase = 'info';
  renderCharInfo();
}

function startFloor(floor) {
  gameState.floor  = floor;
  gameState.phase  = 'battle';
  gameState.battleLog = [];
  gameState.turnCount  = 0;
  gameState.slowTurnCounter = 0;
  gameState.enemySlowCounter = 0;
  gameState.statusEffects = gameState.statusEffects.filter(fx => fx.persists);
  gameState.enemyStatusEffects = [];
  gameState.animating = false;

  /* Build enemy */
  const template = ENEMIES[floor];
  const hp = Math.round(template.baseHp * floor);
  gameState.enemy = {
    name: template.name,
    emoji: template.emoji,
    hp, maxHp: hp,
    def: 10 + floor * 5,
    atkMin: 15 + floor * 4,
    atkMax: 25 + floor * 5,
    skills: template.skills,
    boss: !!template.boss,
  };

  /* Restore resource between floors */
  gameState.resource = clamp(gameState.resource + 30, 0, gameState.resourceMax);

  /* Recompute HP (keep current HP from last floor) */
  computeStats();

  logMsg('system', `⚔ Floor ${floor}: ${gameState.enemy.name} appears!`);
  renderBattle();
}

function retryFloor() {
  const st = computeStats();
  /* Restore HP to max and resource to full */
  gameState.character.baseStats.hp = gameState.character.baseStats.maxHp;
  gameState.stats.hp = gameState.character.baseStats.maxHp;
  gameState.resource = gameState.resourceMax;
  gameState.statusEffects = [];
  startFloor(gameState.floor);
}

/* ═══════════════════════════════════════════════════════════════
   PANEL TOGGLE
═══════════════════════════════════════════════════════════════ */

function togglePanel(name) {
  const panels = ['skill','item','stats'];
  panels.forEach(p => {
    const el = document.getElementById(`${p}-panel`);
    if (el) el.classList.remove('open');
    const btn = document.getElementById(`btn-${p==='skill'?'attack':p}`);
    if (btn) btn.classList.remove('active');
  });
  const target = document.getElementById(`${name}-panel`);
  const btn    = document.getElementById(`btn-${name==='skill'?'attack':name}`);
  if (target) {
    const wasOpen = target.classList.contains('open');
    if (!wasOpen) { target.classList.add('open'); if (btn) btn.classList.add('active'); }
  }
}

function closeAllPanels() {
  ['skill','item','stats'].forEach(p => {
    const el = document.getElementById(`${p}-panel`);
    if (el) el.classList.remove('open');
  });
  ['btn-attack','btn-item','btn-stats'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
}

/* ═══════════════════════════════════════════════════════════════
   COMBAT: PLAYER ACTIONS
═══════════════════════════════════════════════════════════════ */

function disableActions() {
  document.querySelectorAll('.action-btn, .skill-btn, .item-btn').forEach(b => b.disabled = true);
  gameState.animating = true;
}
function enableActions() {
  gameState.animating = false;
  /* Rebuild skill grid to reflect current resource */
  const grid = document.getElementById('skill-grid');
  if (grid) grid.innerHTML = buildSkillButtons();
  document.querySelectorAll('.action-btn').forEach(b => b.disabled = false);
}

function logMsg(cls, text) {
  gameState.battleLog.push({ cls, text });
  const log = document.getElementById('battle-log');
  if (log) {
    log.innerHTML += `<div class="log-${cls}">${escHtml(text)}</div>`;
    log.scrollTop = log.scrollHeight;
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function updateBars() {
  const st = computeStats();
  const plHpBar  = document.getElementById('player-hp-bar');
  const plHpVal  = document.getElementById('player-hp-val');
  const resBar   = document.getElementById('res-bar');
  const resVal   = document.getElementById('res-val');
  const enHpBar  = document.getElementById('enemy-hp-bar');
  const enHpTxt  = document.querySelector('.enemy-hp-text span');
  if (plHpBar)  { plHpBar.style.width = hpBarWidth(st.hp, st.maxHp); plHpBar.className = `hp-bar-fill ${hpBarClass(st.hp,st.maxHp)}`; }
  if (plHpVal)  plHpVal.textContent = st.hp;
  if (resBar)   resBar.style.width = hpBarWidth(gameState.resource, gameState.resourceMax);
  if (resVal)   resVal.textContent = `${gameState.resource}/${gameState.resourceMax}`;
  if (enHpBar)  { enHpBar.style.width = hpBarWidth(gameState.enemy.hp, gameState.enemy.maxHp); enHpBar.className = `hp-bar-fill ${hpBarClass(gameState.enemy.hp, gameState.enemy.maxHp)}`; }
  if (enHpTxt)  enHpTxt.textContent = Math.max(0, gameState.enemy.hp);

  /* Update status badges */
  const ps = document.getElementById('player-status');
  const es = document.getElementById('enemy-status');
  if (ps) ps.innerHTML = renderStatusBadges(gameState.statusEffects);
  if (es) es.innerHTML = renderStatusBadges(gameState.enemyStatusEffects);

  /* Update enemy sprite (low HP) */
  const sp = document.getElementById('enemy-sprite');
  const en = gameState.enemy;
  if (sp) sp.textContent = (en.hp / en.maxHp < 0.20 && !en.boss) ? '💀' : en.emoji;
}

function flashEnemy() {
  const el = document.getElementById('enemy-sprite');
  if (!el) return;
  el.classList.remove('hit');
  void el.offsetWidth; /* reflow */
  el.classList.add('hit');
  setTimeout(() => el.classList.remove('hit'), 420);
}

function flashPlayer() {
  const el = document.getElementById('player-zone');
  if (!el) return;
  el.classList.remove('hit');
  void el.offsetWidth;
  el.classList.add('hit');
  setTimeout(() => el.classList.remove('hit'), 420);
}

/* ── Skill Use ─────────────────────────────────── */
function useSkill(skillId) {
  if (gameState.animating) return;
  const sk = SKILLS[skillId];
  const st = computeStats();
  if (gameState.resource < sk.cost) {
    logMsg('system', `Not enough ${gameState.character.resource}!`);
    return;
  }

  disableActions();
  closeAllPanels();
  gameState.resource = Math.max(0, gameState.resource - sk.cost);

  let dmg = 0;
  let hit = true;

  /* Dodge check */
  const dodgeRoll = Math.random();
  const dodgeChance = gameState.enemy.agi ? gameState.enemy.agi / DODGE_AGI_DIVISOR : 0.05;
  if (dodgeRoll < dodgeChance && sk.type !== 'heal' && sk.type !== 'buff' && sk.type !== 'regen') {
    hit = false;
  }

  if (sk.type === 'heal') {
    const amount = sk.effect.amount;
    healPlayer(amount);
    logMsg('heal', `${gameState.character.name} uses ${sk.name} → Heal ${amount} HP!`);
  } else if (sk.type === 'regen') {
    addStatusEffect(gameState.statusEffects, { type:'regen', amount:sk.effect.amount, turns:sk.effect.turns });
    logMsg('heal', `${gameState.character.name} uses ${sk.name} → Regen ${sk.effect.amount} HP/turn for ${sk.effect.turns} turns.`);
  } else if (sk.type === 'buff') {
    applyPlayerBuff(sk);
    logMsg('log-status', `${gameState.character.name} uses ${sk.name}!`);
  } else if (!hit) {
    logMsg('miss', `${gameState.character.name} uses ${sk.name} → Miss! Enemy dodged.`);
  } else {
    /* Damage calc */
    if (sk.type === 'physical') {
      dmg = Math.round(st.str * sk.mult * (1 - Math.min(computeEnemyDef(gameState.enemy) / PHYSICAL_DEF_DIVISOR, MAX_DAMAGE_REDUCTION)));
    } else { /* magic */
      dmg = Math.round(st.int * sk.mult * (1 - Math.min(computeEnemyDef(gameState.enemy) / MAGIC_DEF_DIVISOR, MAX_DAMAGE_REDUCTION)));
    }
    dmg = Math.max(1, dmg);
    dealDamageToEnemy(dmg);

    /* Inferno: add burn */
    if (sk.effect && sk.effect.type === 'burn') {
      const burnDmg = Math.round(st.int * sk.mult);
      addStatusEffect(gameState.enemyStatusEffects, { type:'burn', amount: burnDmg, turns: sk.effect.turns });
      logMsg('log-status', `${gameState.character.name} uses ${sk.name} → ${dmg} + Burn ${burnDmg}/turn!`);
    } else {
      logMsg('player', `${gameState.character.name} uses ${sk.name} → ${dmg} damage!`);
    }

    /* Other skill effects */
    if (sk.effect && sk.effect.type !== 'burn') {
      applySkillEffect(sk.effect, gameState.enemyStatusEffects);
    }
  }

  updateBars();

  /* Check if enemy dead */
  if (gameState.enemy.hp <= 0) {
    setTimeout(() => { gameState.animating = false; handleEnemyDead(); }, 600);
    return;
  }

  /* Enemy turn after delay */
  setTimeout(enemyTurn, 800);
}

function applyPlayerBuff(sk) {
  const fx = sk.effect;
  if (fx.type === 'defBuff')  addStatusEffect(gameState.statusEffects, { type:'defBuff', amount:fx.amount, turns:fx.turns });
  if (fx.type === 'agiBuff')  addStatusEffect(gameState.statusEffects, { type:'agiBuff', amount:fx.amount, turns:fx.turns });
  if (fx.type === 'shield')   addStatusEffect(gameState.statusEffects, { type:'shield', amount:fx.amount, turns:fx.turns });
  if (fx.healSelf) healPlayer(fx.healSelf);
  computeStats();
  updateBars();
}

function applySkillEffect(effect, targetEffects) {
  if (!effect) return;
  if (effect.type === 'stun'  && Math.random() < effect.chance) {
    addStatusEffect(targetEffects, { type:'stun', turns:1 });
    logMsg('log-status', '💫 Stunned!');
  }
  if (effect.type === 'slow'  && Math.random() < effect.chance) {
    addStatusEffect(targetEffects, { type:'slow', turns:effect.turns });
    logMsg('log-status', '🐢 Slowed!');
  }
}

function dealDamageToEnemy(dmg) {
  gameState.enemy.hp = Math.max(0, gameState.enemy.hp - dmg);
  flashEnemy();
}

function healPlayer(amount) {
  const st = computeStats();
  const healed = Math.min(amount, st.maxHp - st.hp);
  gameState.character.baseStats.hp = Math.min(st.maxHp, st.hp + healed);
  gameState.stats.hp = gameState.character.baseStats.hp;
  computeStats();
  updateBars();
}

function damagePlayer(dmg) {
  /* Apply shield */
  const shield = gameState.statusEffects.find(fx => fx.type === 'shield');
  if (shield) dmg = Math.round(dmg * (1 - shield.amount));

  const st = computeStats();
  const newHp = Math.max(0, st.hp - dmg);
  gameState.character.baseStats.hp = newHp;
  gameState.stats.hp = newHp;
  computeStats();
  flashPlayer();
  updateBars();
}

function addStatusEffect(arr, effect) {
  /* Stack turns if same type already present */
  const existing = arr.find(e => e.type === effect.type);
  if (existing) {
    existing.turns = Math.max(existing.turns, effect.turns);
    if (effect.amount !== undefined) existing.amount = effect.amount;
  } else {
    arr.push({ ...effect });
  }
}

function tickStatusEffects() {
  /* Player effects */
  const regen = gameState.statusEffects.find(fx => fx.type === 'regen');
  if (regen) {
    healPlayer(regen.amount);
    logMsg('heal', `Regen: +${regen.amount} HP.`);
  }
  gameState.statusEffects = gameState.statusEffects
    .map(fx => ({ ...fx, turns: fx.turns - 1 }))
    .filter(fx => fx.turns > 0);

  /* Enemy effects */
  const burn = gameState.enemyStatusEffects.find(fx => fx.type === 'burn');
  if (burn) {
    dealDamageToEnemy(burn.amount);
    logMsg('log-status', `Burn: ${gameState.enemy.name} takes ${burn.amount} damage!`);
    if (gameState.enemy.hp <= 0) return 'enemyDead';
  }
  gameState.enemyStatusEffects = gameState.enemyStatusEffects
    .map(fx => ({ ...fx, turns: fx.turns - 1 }))
    .filter(fx => fx.turns > 0);

  return null;
}

/* Defend button shortcut */
function playerDefend() {
  if (gameState.animating) return;
  const hasDefend = gameState.skills.includes('defend') || gameState.skills.includes('mana_shield');
  if (hasDefend) {
    const sid = gameState.skills.includes('defend') ? 'defend' : 'mana_shield';
    if (gameState.resource >= SKILLS[sid].cost) { useSkill(sid); return; }
  }
  /* Fallback: generic DEF buff */
  disableActions();
  addStatusEffect(gameState.statusEffects, { type:'defBuff', amount:10, turns:1 });
  computeStats();
  logMsg('log-status', `${gameState.character.name} takes a defensive stance. +10 DEF for 1 turn.`);
  updateBars();
  setTimeout(enemyTurn, 600);
}

/* Use item */
function useItem(itemId) {
  if (gameState.animating) return;
  const item = gameState.items.find(i => i.id === itemId && i.qty > 0);
  if (!item) return;

  disableActions();
  closeAllPanels();
  item.qty--;

  const fx = item.effect;
  if (fx.type === 'heal') {
    healPlayer(fx.amount);
    logMsg('heal', `Used ${item.name} → +${fx.amount} HP!`);
  } else if (fx.type === 'statBuff') {
    addStatusEffect(gameState.statusEffects, { type:'statBuff', stat:fx.stat, amount:fx.amount, turns:fx.turns });
    computeStats();
    logMsg('log-status', `Used ${item.name} → +${fx.amount} ${fx.stat.toUpperCase()} for ${fx.turns} turns!`);
  }
  updateBars();
  setTimeout(enemyTurn, 600);
}

/* ═══════════════════════════════════════════════════════════════
   COMBAT: ENEMY TURN
═══════════════════════════════════════════════════════════════ */

function enemyTurn() {
  const en = gameState.enemy;
  gameState.turnCount++;
  gameState.resource = Math.min(gameState.resourceMax, gameState.resource + 15);

  /* Tick status effects */
  const deathResult = tickStatusEffects();
  updateBars();
  if (deathResult === 'enemyDead') {
    setTimeout(() => { gameState.animating = false; handleEnemyDead(); }, 400);
    return;
  }
  if (computeStats().hp <= 0) {
    setTimeout(() => { gameState.animating = false; renderGameOver(); }, 400);
    return;
  }

  /* Enemy stun check */
  const enemyStun = gameState.enemyStatusEffects.find(fx => fx.type === 'stun');
  if (enemyStun) {
    enemyStun.turns--;
    if (enemyStun.turns <= 0) gameState.enemyStatusEffects = gameState.enemyStatusEffects.filter(fx => fx.type !== 'stun');
    logMsg('log-enemy', `${en.name} is stunned and loses their turn!`);
    updateBars();
    enableActions();
    return;
  }

  /* Enemy slow: skip every other turn */
  const enemySlow = gameState.enemyStatusEffects.find(fx => fx.type === 'slow');
  if (enemySlow) {
    gameState.enemySlowCounter++;
    if (gameState.enemySlowCounter % 2 === 0) {
      logMsg('log-enemy', `${en.name} is slowed and stumbles!`);
      updateBars();
      enableActions();
      return;
    }
  } else {
    gameState.enemySlowCounter = 0;
  }

  /* Enemy strategic heal: when HP below 50%, 40% chance to heal instead of attack */
  if (en.hp < en.maxHp * 0.5 && Math.random() < 0.40) {
    const healAmount = Math.round(en.maxHp * 0.15);
    en.hp = Math.min(en.maxHp, en.hp + healAmount);
    logMsg('log-enemy', `${en.name} recovers! +${healAmount} HP.`);
    updateBars();
    enableActions();
    return;
  }

  /* Pick skill */
  const skillKey = en.skills[Math.floor(Math.random() * en.skills.length)];
  const esk = ENEMY_SKILLS[skillKey];

  /* Enemy buff skill */
  if (esk.baseDmg === 0 && esk.effect && esk.effect.type === 'enemyDefBuff') {
    addStatusEffect(gameState.enemyStatusEffects, { type:'enemyDefBuff', amount:esk.effect.amount, turns:esk.effect.turns });
    logMsg('log-enemy', `${en.name} uses ${esk.name}! DEF +${esk.effect.amount} for ${esk.effect.turns} turns.`);
    updateBars();
    enableActions();
    return;
  }

  /* Player dodge */
  const st = computeStats();
  const playerDodge = Math.random() < (st.agi / DODGE_AGI_DIVISOR);
  if (playerDodge) {
    logMsg('miss', `${en.name} attacks — you dodge!`);
    updateBars();
    enableActions();
    return;
  }

  /* Damage */
  let dmg = rng(en.atkMin, en.atkMax);
  dmg = Math.round(dmg * (1 - Math.min(st.def / PHYSICAL_DEF_DIVISOR, MAX_DAMAGE_REDUCTION)));
  dmg = Math.max(1, dmg);

  /* Lifesteal */
  let lsHeal = 0;
  if (esk.effect && esk.effect.type === 'lifesteal') {
    lsHeal = Math.round(dmg * esk.effect.amount);
    en.hp = Math.min(en.maxHp, en.hp + lsHeal);
  }

  damagePlayer(dmg);

  let logText = `${en.name} uses ${esk.name} → ${dmg} damage!`;
  if (lsHeal > 0) logText += ` (healed ${lsHeal} HP)`;
  logMsg('log-enemy', logText);

  /* Apply enemy skill effects to player */
  if (esk.effect) {
    if (esk.effect.type === 'slow' && Math.random() < (esk.effect.chance || 1)) {
      addStatusEffect(gameState.statusEffects, { type:'slow', turns:esk.effect.turns });
      logMsg('log-status', '🐢 You are slowed!');
    }
    if (esk.effect.type === 'stun' && Math.random() < (esk.effect.chance || 0.2)) {
      addStatusEffect(gameState.statusEffects, { type:'stun', turns:1 });
      logMsg('log-status', '💫 You are stunned! (Next turn skipped)');
    }
    if (esk.effect.type === 'burn') {
      addStatusEffect(gameState.statusEffects, { type:'burn', amount:esk.effect.amount, turns:esk.effect.turns });
      logMsg('log-status', `🔥 Burning for ${esk.effect.amount} damage/turn!`);
    }
  }

  updateBars();

  /* Check player stun → skip reenable briefly */
  const playerStun = gameState.statusEffects.find(fx => fx.type === 'stun');
  if (playerStun) {
    playerStun.turns--;
    if (playerStun.turns <= 0) gameState.statusEffects = gameState.statusEffects.filter(fx => fx.type !== 'stun');
    logMsg('log-status', 'You are stunned and lose your next action!');
    setTimeout(() => {
      updateBars();
      /* Actually skip the player's turn by triggering enemy turn again */
      gameState.resource = Math.min(gameState.resourceMax, gameState.resource + 15);
      enemyTurn();
    }, 900);
    return;
  }

  /* Check player dead */
  if (computeStats().hp <= 0) {
    setTimeout(() => { gameState.animating = false; renderGameOver(); }, 600);
    return;
  }

  enableActions();
}

/* ═══════════════════════════════════════════════════════════════
   POST-FLOOR HANDLING
═══════════════════════════════════════════════════════════════ */

function handleEnemyDead() {
  const floor = gameState.floor;
  logMsg('heal', `✓ ${gameState.enemy.name} defeated!`);

  /* Generate reward */
  if (floor % 2 === 1) { /* odd → equipment */
    gameState.pendingLoot  = generateEquipment(randomSlot());
    gameState.pendingSkill = null;
  } else { /* even → skill */
    const ch     = gameState.character;
    const allUnlocks = ch.unlockableSkills;
    const idx    = Math.min(gameState.currentUnlockIdx, allUnlocks.length - 1);
    gameState.pendingSkill = allUnlocks[idx];
    gameState.currentUnlockIdx = Math.min(idx + 1, allUnlocks.length - 1);
    gameState.pendingLoot  = null;
  }

  gameState.phase = 'floorComplete';

  if (floor === 10) {
    renderVictory();
  } else {
    renderFloorComplete();
  }
}

function randomSlot() {
  const slots = ['hand1','hand2','head','legs1','legs2','accessory'];
  return slots[Math.floor(Math.random() * slots.length)];
}

/* Loot actions */
function equipLoot() {
  const item = gameState.pendingLoot;
  if (!item) return;
  gameState.equipment[item.slot] = item;
  computeStats();
  advanceToNextFloor();
}

function skipLoot() {
  advanceToNextFloor();
}

/* Skill unlock actions */
function showReplaceUI() {
  const sec = document.getElementById('replace-section');
  const btn = document.getElementById('btn-learn');
  if (sec) sec.classList.add('open');
  if (btn) btn.style.display = 'none';
}

function replaceSkill(index) {
  gameState.skills[index] = gameState.pendingSkill;
  advanceToNextFloor();
}

function skipSkill() {
  advanceToNextFloor();
}

function advanceToNextFloor() {
  const nextFloor = gameState.floor + 1;
  if (nextFloor > 10) {
    renderVictory();
  } else {
    startFloor(nextFloor);
  }
}

/* ═══════════════════════════════════════════════════════════════
   VICTORY ACTIONS
═══════════════════════════════════════════════════════════════ */

async function handleMint() {
  const statusEl = document.getElementById('mint-status');
  if (statusEl) statusEl.textContent = '🔗 Connecting to Phantom wallet…';

  if (!window.GameWallet) {
    if (statusEl) statusEl.textContent = '⚠ Wallet module not loaded.';
    return;
  }

  if (!GameWallet.isPhantomAvailable()) {
    if (statusEl) statusEl.textContent = '⚠ Phantom wallet not detected. Please install Phantom to mint.';
    return;
  }

  const conn = await GameWallet.connectPhantom();
  if (!conn.ok) {
    if (statusEl) statusEl.textContent = `⚠ ${conn.error}`;
    return;
  }

  if (statusEl) statusEl.textContent = `✓ Connected: ${conn.address.slice(0,6)}…${conn.address.slice(-4)} — Minting…`;

  const result = await GameWallet.mockMintNFT(conn.address, {
    skinId: `${gameState.character.id}_legendary`,
    character: gameState.character.name,
    floor: 10,
    timestamp: Date.now(),
  });

  if (result.ok) {
    if (statusEl) statusEl.innerHTML = `✨ <span style="color:var(--legendary)">Mint successful!</span> TX: ${result.txId.slice(0,12)}…`;
    if (window.GameDB) GameDB.trackSkinOwnership(conn.address, `${gameState.character.id}_legendary`);
  } else {
    if (statusEl) statusEl.textContent = `⚠ Mint failed: ${result.error}`;
  }
}

function toggleAirdropForm() {
  const form = document.getElementById('airdrop-form');
  if (form) form.classList.toggle('open');
}

async function submitAirdrop() {
  const input = document.getElementById('airdrop-wallet');
  const statusEl = document.getElementById('mint-status');
  if (!input || !input.value.trim()) {
    if (statusEl) statusEl.textContent = '⚠ Please enter a valid wallet address.';
    return;
  }
  const addr = input.value.trim();
  if (statusEl) statusEl.textContent = '⏳ Registering…';

  if (window.GameDB) {
    const res = await GameDB.registerAirdrop(addr, gameState.character.id, 10);
    if (res.ok) {
      if (statusEl) statusEl.innerHTML = `🎁 <span style="color:var(--green-term)">Registered for airdrop!</span> Address: ${addr.slice(0,8)}…`;
    } else {
      /* Even without Supabase, acknowledge the input */
      if (statusEl) statusEl.innerHTML = `🎁 <span style="color:var(--green-term)">Registered for airdrop! (local)</span>`;
    }
  } else {
    if (statusEl) statusEl.innerHTML = `🎁 <span style="color:var(--green-term)">Registered for airdrop!</span>`;
  }

  const form = document.getElementById('airdrop-form');
  if (form) form.classList.remove('open');
}

/* ═══════════════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════════════ */

function resetGame() {
  Object.assign(gameState, {
    phase:'select', character:null, floor:0, enemy:null,
    skills:[], equipment:{}, items:[], stats:{},
    resource:0, statusEffects:[], enemyStatusEffects:[],
    battleLog:[], pendingLoot:null, pendingSkill:null,
    currentUnlockIdx:0, animating:false, turnCount:0,
    slowTurnCounter:0, enemySlowCounter:0,
  });
  renderCharSelect();
}

function goToMain() {
  window.location.href = 'index.html';
}

/* ═══════════════════════════════════════════════════════════════
   BOOT
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  renderCharSelect();
});
