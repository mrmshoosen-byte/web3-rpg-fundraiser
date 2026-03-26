import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

let currentTier = 0, walletConnected = false, userWallet = null

// Connect Phantom Wallet
const connectWallet = async () => {
  const { solana } = window
  if (!solana?.isPhantom) {
    alert('Please install Phantom wallet: phantom.app')
    return false
  }
  try {
    const resp = await solana.connect()
    userWallet = resp.publicKey.toString()
    walletConnected = true
    document.getElementById('c-wallet').value = userWallet
    console.log('✓ Wallet connected:', userWallet)
    return true
  } catch (e) {
    console.error('Wallet error:', e)
    return false
  }
}

// Save Pledge to Supabase Database
const submitPledge = async () => {
  const name = document.getElementById('c-name')?.value.trim()
  const email = document.getElementById('c-email')?.value.trim()
  const discord = document.getElementById('c-discord')?.value.trim()
  const twitter = document.getElementById('c-twitter')?.value.trim()
  const source = document.getElementById('c-source')?.value.trim()
  const amount = parseFloat(document.getElementById('m-amt')?.value)

  if (!name || !email) {
    alert('Name & Email are required')
    return
  }

  if (!walletConnected && !await connectWallet()) {
    return
  }

  try {
    const { data, error } = await supabase.from('pledges').insert([{
      name: name,
      email: email,
      discord: discord,
      twitter: twitter,
      wallet: userWallet,
      source: source,
      amount: amount,
      tier: currentTier,
      status: 'pending'
    }])

    if (error) throw error

    console.log('✓ Pledge saved to database:', data)
    showStep('step-success')
  } catch (e) {
    console.error('Database error:', e)
    alert('Error saving pledge: ' + e.message)
  }
}

const openDonateModal = () => openTierModal(0, document.getElementById('don-amt')?.value || '25')
const openTierModal = (t, amt) => {
  currentTier = t
  if (amt) document.getElementById('m-amt').value = amt
  showStep('step-pledge')
  document.getElementById('modal').classList.add('open')
}
const closeModal = () => document.getElementById('modal').classList.remove('open')
const showStep = id => {
  document.getElementById('step-pledge').style.display = id === 'step-pledge' ? 'block' : 'none'
  document.getElementById('step-contact').style.display = id === 'step-contact' ? 'block' : 'none'
  document.getElementById('step-success').style.display = id === 'step-success' ? 'block' : 'none'
}
const goContact = () => {
  if (!document.getElementById('m-amt').value) {
    alert('Please enter an amount')
  } else {
    showStep('step-contact')
  }
}
const backPledge = () => showStep('step-pledge')

// CHAMPION DATA (NO RARITY - Skins have rarity instead)
const CHAMPIONS = [
  {
    name: 'Snickle',
    role: 'Rogue',
    class: 'Degen with Heart of Gold',
    desc: 'Once the kingdom\'s most notorious gambler. Lost everything. Found redemption.',
    stats: { dmg: 85, spd: 95, def: 60, hp: 120 },
    sprite: '⚔️'
  },
  {
    name: 'Vibhu',
    role: 'Knight',
    class: 'Knight of Solania',
    desc: 'Sworn protector of the Crystal Realm. Unbreakable oath.',
    stats: { dmg: 75, spd: 60, def: 95, hp: 160 },
    sprite: '🛡️'
  },
  {
    name: 'Cryptopher',
    role: 'Mage',
    class: 'Void Sage',
    desc: 'Commands the fabric of reality. Ancient. Mysterious.',
    stats: { dmg: 100, spd: 80, def: 50, hp: 100 },
    sprite: '🔮'
  },
  {
    name: 'Rexxar',
    role: 'Berserker',
    class: 'Warlord',
    desc: 'Strength incarnate. Pure fury and battle hunger.',
    stats: { dmg: 110, spd: 70, def: 70, hp: 180 },
    sprite: '⚡'
  },
  {
    name: 'Luna',
    role: 'Ranger',
    class: 'Moonbow Archer',
    desc: 'Swift as night wind. Arrows never miss.',
    stats: { dmg: 90, spd: 92, def: 65, hp: 110 },
    sprite: '🏹'
  },
  {
    name: 'Kai',
    role: 'Monk',
    class: 'Fist of Tao',
    desc: 'Balanced yin and yang. Stillness and storm.',
    stats: { dmg: 80, spd: 88, def: 75, hp: 130 },
    sprite: '🥋'
  },
  {
    name: 'Malachai',
    role: 'Paladin',
    class: 'Radiant Guardian',
    desc: 'Clad in holy gold. Divine protector.',
    stats: { dmg: 70, spd: 65, def: 100, hp: 175 },
    sprite: '✨'
  },
  {
    name: 'Raven',
    role: 'Reaper',
    class: 'Death Weaver',
    desc: 'Collector of final breaths. Between life and death.',
    stats: { dmg: 105, spd: 85, def: 55, hp: 115 },
    sprite: '💀'
  },
  {
    name: 'Emara',
    role: 'Sorceress',
    class: 'Wild Mage',
    desc: 'Chaos and order. Bends magic to will.',
    stats: { dmg: 95, spd: 82, def: 48, hp: 105 },
    sprite: '🌪️'
  },
  {
    name: 'Thornwick',
    role: 'Druid',
    class: 'Forest\'s Wrath',
    desc: 'One with nature\'s fury. Summons ancient wrath.',
    stats: { dmg: 75, spd: 70, def: 80, hp: 150 },
    sprite: '🌿'
  }
]

// MONSTER DATA
const MONSTERS = [
  { name: 'Void Specter', role: 'Ghost', desc: 'Wraith of pure void. Drains life.', hp: 45, dmg: 35, sprite: '👻' },
  { name: 'Skeletal Archer', role: 'Undead', desc: 'Bones reanimated by dark magic.', hp: 60, dmg: 40, sprite: '🏹' },
  { name: 'Shadow Spider', role: 'Beast', desc: 'Eight legs, eight eyes. Web binds.', hp: 75, dmg: 45, sprite: '🕷️' },
  { name: 'Stone Sentinel', role: 'Construct', desc: 'Animated rock. Crushes all.', hp: 110, dmg: 50, sprite: '⚙️' },
  { name: 'Flame Wyrm', role: 'Dragon', desc: 'Serpent of living fire. Scorches all.', hp: 95, dmg: 55, sprite: '🐉' },
  { name: 'Corrupted Golem', role: 'Construct', desc: 'Magic twisted. Regenerates.', hp: 140, dmg: 48, sprite: '🗿' },
  { name: 'Plague Rat Swarm', role: 'Beast', desc: 'Hundreds as one. Poison.', hp: 70, dmg: 42, sprite: '🐀' },
  { name: 'Phantom Knight', role: 'Undead', desc: 'Ghost warrior. Haunts eternally.', hp: 85, dmg: 52, sprite: '⚔️' },
  { name: 'Void Tentacle', role: 'Eldritch', desc: 'From beyond. Unknowable.', hp: 100, dmg: 58, sprite: '🐙' },
  { name: 'Lich Lord', role: 'Boss', desc: 'Ancient sorcerer. Commands legions.', hp: 200, dmg: 75, sprite: '👑' }
]

const renderChampions = () => {
  const grid = document.getElementById('champ-grid')
  if (!grid) return
  
  grid.innerHTML = CHAMPIONS.map((c, i) => `
    <div class="e-card reveal" style="transition-delay:${i * 0.05}s">
      <div class="e-art"><div style="font-size:3rem;text-align:center;padding:20px">${c.sprite}</div></div>
      <div class="e-name">${c.name}<span class="esub">${c.class}</span></div>
      <div class="e-info">
        <div class="e-iname">${c.name}</div>
        <div class="e-irole">${c.role}</div>
        <div class="e-idesc">${c.desc}</div>
        <div class="e-stats">
          <div class="es"><div class="es-v">${c.stats.dmg}</div>DMG</div>
          <div class="es"><div class="es-v">${c.stats.spd}</div>SPD</div>
          <div class="es"><div class="es-v">${c.stats.def}</div>DEF</div>
          <div class="es"><div class="es-v">${c.stats.hp}</div>HP</div>
        </div>
      </div>
    </div>
  `).join('')

  // Add mystery card
  grid.innerHTML += `
    <div class="mystery-card reveal" style="transition-delay:${CHAMPIONS.length * 0.05}s">
      <div class="mystery-in">
        <div class="mq">?</div>
        <div class="mc">90+</div>
        <div class="ml">Champions locked</div>
      </div>
    </div>
  `
}

const renderMonsters = () => {
  const grid = document.getElementById('mon-grid')
  if (!grid) return
  
  grid.innerHTML = MONSTERS.map((m, i) => `
    <div class="e-card reveal" style="transition-delay:${i * 0.05}s">
      <div class="e-art"><div style="font-size:3rem;text-align:center;padding:20px">${m.sprite}</div></div>
      <div class="e-name">${m.name}<span class="esub">${m.role}</span></div>
      <div class="e-info">
        <div class="e-iname">${m.name}</div>
        <div class="e-irole">${m.role}</div>
        <div class="e-idesc">${m.desc}</div>
        <div class="e-stats">
          <div class="es"><div class="es-v">${m.hp}</div>HP</div>
          <div class="es"><div class="es-v">${m.dmg}</div>DMG</div>
        </div>
      </div>
    </div>
  `).join('')

  // Add mystery card
  grid.innerHTML += `
    <div class="mystery-card reveal" style="transition-delay:${MONSTERS.length * 0.05}s">
      <div class="mystery-in">
        <div class="mq">?</div>
        <div class="mc">1000+</div>
        <div class="ml">Creatures await</div>
      </div>
    </div>
  `
}

const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  })
  document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  renderChampions()
  renderMonsters()
  observeElements()
})

export { connectWallet, submitPledge, openDonateModal, closeModal, goContact, backPledge }
