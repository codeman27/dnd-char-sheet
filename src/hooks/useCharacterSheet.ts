import { useState, useCallback } from 'react';

// ── Ability tables ────────────────────────────────────────────────────────────

const m_strength: (string[] | string[][])[] = [
  ['-5', '-4', '1 lb', '3 lb', '1', '0%'],
  ['-3', '-2', '1 lb', '5 lb', '1', '0%'],
  ['-3', '-1', '5 lb', '10 lb', '2', '0%'],
  ['-2', '-1', '10 lb', '25 lb', '3', '0%'],
  ['-2', '-1', '10 lb', '25 lb', '3', '0%'],
  ['-1', '0', '20 lb', '55 lb', '4', '0%'],
  ['-1', '0', '20 lb', '55 lb', '4', '0%'],
  ['0', '0', '35 lb', '90 lb', '5', '1%'],
  ['0', '0', '35 lb', '90 lb', '5', '1%'],
  ['0', '0', '40 lb', '115 lb', '6', '2%'],
  ['0', '0', '40 lb', '115 lb', '6', '2%'],
  ['0', '0', '45 lb', '140 lb', '7', '4%'],
  ['0', '0', '45 lb', '140 lb', '7', '4%'],
  ['0', '0', '55 lb', '170 lb', '8', '7%'],
  ['0', '0', '55 lb', '170 lb', '8', '7%'],
  ['0', '+1', '70 lb', '195 lb', '9', '10%'],
  ['+1', '+1', '85 lb', '220 lb', '10', '13%'],
  [
    ['+1', '+2', '110 lb', '255 lb', '11', '16%'],
    ['+1', '+3', '135 lb', '280 lb', '12', '20%'],
    ['+2', '+3', '160 lb', '305 lb', '13', '25%'],
    ['+2', '+4', '185 lb', '330 lb', '14', '30%'],
    ['+2', '+5', '235 lb', '380 lb', '15(3)', '35%'],
    ['+3', '+6', '335 lb', '480 lb', '16(6)', '40%'],
  ],
  ['+3', '+7', '484 lb', '640 lb', '16(8)', '50%'],
  ['+3', '+8', '535 lb', '700 lb', '17(10)', '60%'],
  ['+4', '+9', '635 lb', '810 lb', '17(12)', '70%'],
  ['+4', '+10', '785 lb', '970 lb', '18(14)', '80%'],
  ['+5', '+11', '935 lb', '1,130 lb', '18(16)', '90%'],
  ['+6', '+12', '1,235 lb', '1,440 lb', '19(17)', '95%'],
  ['+7', '+14', '1,535 lb', '1,750 lb', '19(18)', '99%'],
];

const m_dexterity: string[][] = [
  ['-6', '-6', '+5'],
  ['-4', '-4', '+5'],
  ['-3', '-3', '+4'],
  ['-2', '-2', '+3'],
  ['-1', '-1', '+2'],
  ['0', '0', '+1'],
  ['0', '0', '+0'],
  ['0', '0', '0'],
  ['0', '0', '0'],
  ['0', '0', '0'],
  ['0', '0', '0'],
  ['0', '0', '0'],
  ['0', '0', '0'],
  ['0', '0', '0'],
  ['0', '0', '-1'],
  ['+1', '+1', '-2'],
  ['+2', '+2', '-3'],
  ['+2', '+2', '-4'],
  ['+3', '+3', '-4'],
  ['+3', '+3', '-4'],
  ['+4', '+4', '-5'],
  ['+4', '+4', '-5'],
  ['+4', '+4', '-5'],
  ['+5', '+5', '-6'],
  ['+5', '+5', '-6'],
];

const m_constitution: string[][] = [
  ['-3', '25%', '30%', '-2', '-'],
  ['-2', '30%', '35%', '-1', '-'],
  ['-2', '35%', '40%', '0', '-'],
  ['-1', '40%', '45%', '0', '-'],
  ['-1', '45%', '50%', '0', '-'],
  ['-1', '50%', '55%', '0', '-'],
  ['0', '55%', '60%', '0', '-'],
  ['0', '60%', '65%', '0', '-'],
  ['0', '65%', '70%', '0', '-'],
  ['0', '70%', '75%', '0', '-'],
  ['0', '75%', '80%', '0', '-'],
  ['0', '80%', '85%', '0', '-'],
  ['0', '85%', '90%', '0', '-'],
  ['0', '88%', '92%', '0', '-'],
  ['+1', '90%', '94%', '0', '-'],
  ['+1', '90%', '94%', '0', '-'],
  ['+2', '95%', '96%', '0', '-'],
  ['+2(+3)', '97%', '98%', '0', '-'],
  ['+2(+4)', '99%', '100%', '0', '-'],
  ['+2(+5)', '99%', '100%', '+1', '-'],
  ['+2(+5)', '99%', '100%', '+1', '1/6 turns'],
  ['+2(+6)', '99%', '100%', '+2', '1/5 turns'],
  ['+2(+6)', '99%', '100%', '+2', '1/4 turns'],
  ['+2(+6)', '99%', '100%', '+3', '1/3 turns'],
  ['+2(+7)', '99%', '100%', '+3', '1/2 turns'],
  ['+2(+7)', '100%', '100%', '+4', '1/1 turns'],
];

const m_intelligence: string[][] = [
  ['0', '-', '-', '-', '-'],
  ['1', '-', '-', '-', '-'],
  ['1', '-', '-', '-', '-'],
  ['1', '-', '-', '-', '-'],
  ['1', '-', '-', '-', '-'],
  ['1', '-', '-', '-', '-'],
  ['1', '-', '-', '-', '-'],
  ['1', '-', '-', '-', '-'],
  ['2', '4th', '35%', '6', '-'],
  ['2', '5th', '40%', '7', '-'],
  ['2', '5th', '45%', '7', '-'],
  ['3', '6th', '50%', '7', '-'],
  ['3', '6th', '55%', '9', '-'],
  ['4', '7th', '60%', '9', '-'],
  ['4', '7th', '65%', '11', '-'],
  ['5', '8th', '70%', '11', '-'],
  ['6', '8th', '75%', '14', '-'],
  ['7', '9th', '85%', '18', '-'],
  ['8', '9th', '95%', 'All', '1st-lvl illusions'],
  ['9', '9th', '96%', 'All', '2nd-lvl illusions'],
  ['10', '9th', '97%', 'All', '3rd-lvl illusions'],
  ['11', '9th', '98%', 'All', '4th-lvl illusions'],
  ['12', '9th', '99%', 'All', '5th-lvl illusions'],
  ['15', '9th', '100%', 'All', '6th-lvl illusions'],
  ['20', '9th', '100%', 'All', '7th-lvl illusions'],
];

const m_wisdom: string[][] = [
  ['-6', '-', '80%', '-'],
  ['-4', '-', '60%', '-'],
  ['-3', '-', '50%', '-'],
  ['-2', '-', '45%', '-'],
  ['-1', '-', '40%', '-'],
  ['-1', '-', '35%', '-'],
  ['-1', '-', '30%', '-'],
  ['0', '-', '25%', '-'],
  ['0', '0', '20%', '-'],
  ['0', '0', '15%', '-'],
  ['0', '0', '10%', '-'],
  ['0', '0', '5%', '-'],
  ['0', '1', '0%', '-'],
  ['0', '1 1', '0%', '-'],
  ['+1', '1 1 2', '0%', '-'],
  ['+2', '1 1 2 2', '0%', '-'],
  ['+3', '1 1 2 2 3', '0%', '-'],
  ['+4', '1 1 2 2 3 4', '0%', '-'],
  ['+4', '1 1 1 2 2 3 4 4', '0%', 'Cause fear, Charm person, Command'],
  ['+4', '1 1 1 2 2 2 3 4 4 4', '0%', 'Cause fear, Charm person, Command, Forget'],
  ['+4', '1 1 1 2 2 2 3 3 4 4 4 5', '0%', 'Fear, and all prev.'],
  ['+4', '1 1 1 2 2 2 3 3 4 4 4 4 5 5', '0%', 'Suggestion, and all prev.'],
  ['+4', '1 1 1 2 2 2 3 3 4 4 4 4 5 5 5 5', '0%', 'Quest, and all prev.'],
  ['+4', '1 1 1 2 2 2 3 3 4 4 4 4 5 5 5 5 6 6', '0%', 'Geas, and all prev.'],
  ['+4', '1 1 1 2 2 2 3 3 4 4 4 4 5 5 5 5 6 6 6 7', '0%', 'Mass charm, and all prev.'],
];

const m_charisma: string[][] = [
  ['0', '-8', '-7'],
  ['1', '-7', '-6'],
  ['1', '-6', '-5'],
  ['1', '-5', '-4'],
  ['2', '-4', '-3'],
  ['2', '-3', '-2'],
  ['3', '-2', '-1'],
  ['3', '-1', '0'],
  ['4', '0', '0'],
  ['4', '0', '0'],
  ['4', '0', '0'],
  ['5', '0', '0'],
  ['5', '0', '+1'],
  ['6', '+1', '+2'],
  ['7', '+3', '+3'],
  ['8', '+4', '+5'],
  ['10', '+6', '+6'],
  ['15', '+8', '+7'],
  ['20', '+10', '+8'],
  ['25', '+12', '+9'],
  ['30', '+14', '+10'],
  ['35', '+16', '+11'],
  ['40', '+18', '+12'],
  ['45', '+20', '+13'],
  ['50', '+20', '+14'],
];

export function lookupStrength(rawValue: string): string[] | null {
  let value = rawValue;
  let percentage = '0';
  if (value.includes('/')) {
    const parts = value.split('/');
    value = parts[0];
    percentage = parts[1] === '00' ? '100' : parts[1];
  }
  const v = parseInt(value);
  const p = parseInt(percentage);
  if (isNaN(v)) return null;

  if (v === 18) {
    const row = m_strength[17] as string[][];
    if (p === 0) return row[0] as string[];
    else if (p <= 50) return row[1] as string[];
    else if (p <= 75) return row[2] as string[];
    else if (p <= 90) return row[3] as string[];
    else if (p <= 99) return row[4] as string[];
    else return row[5] as string[];
  } else if (v >= 1 && v <= 25) {
    return m_strength[v - 1] as string[];
  }
  return null;
}

export function lookupAbility(stat: string, rawValue: string): string[] | null {
  const v = parseInt(rawValue);
  if (isNaN(v) || v < 1 || v > 25) return null;
  const idx = v - 1;
  switch (stat) {
    case 'STR': return lookupStrength(rawValue);
    case 'DEX': return m_dexterity[idx];
    case 'CON': return m_constitution[idx];
    case 'INT': return m_intelligence[idx];
    case 'WIS': return m_wisdom[idx];
    case 'CHA': return m_charisma[idx];
    default: return null;
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SpellEntry {
  name: string;
  level: string;
  sp: string;
  r: boolean;
  v: boolean;
  s: boolean;
  m: boolean;
}

export interface WeaponEntry {
  name: string;
  attacks: string;
  atkAdj: string;
  dmgAdj: string;
  thac0: string;
  dmgSm: string;
  dmgLg: string;
  range: string;
  weight: string;
  size: string;
  type: string;
  speed: string;
}

export interface PotionEntry {
  name: string;
  count: string;
  roll: string;
  useCur: string;
  useMax: string;
  notes: string;
}

export interface GearEntry {
  item: string;
  location: string;
  weight: string;
}

export interface ProficiencyEntry {
  name: string;
  stat: string;
  adj: string;
  weapon: string;
}

export interface SpecialAbilityEntry {
  col1: string;
  col2: string;
}

export interface CharacterData {
  // Character Info
  name: string;
  alignment: string;
  race: string;
  charClass: string;
  level: string;
  // XP
  totalXp: string;
  nextLevel: string;
  bonusXp: string;
  // Money
  gold: string;
  silver: string;
  copper: string;
  gems: string;
  // Portrait
  portraitUrl: string;
  // HP & Spell Points
  hp: string;
  wounds: string;
  spellPoints: string;
  activeSpells: string;
  // Saving Throws [modifier, save] x5
  stMod: string[];
  stSave: string[];
  // AC
  acBase: string;
  acSurprised: string;
  acSurprisedArmor: string;
  acShieldless: string;
  acShieldlessArmor: string;
  acRear: string;
  acRearArmor: string;
  acDefenses: string;
  // Weapons
  weapons: WeaponEntry[];
  // Abilities [score, ...modifiers]
  strScore: string;
  strMods: string[];
  dexScore: string;
  dexMods: string[];
  conScore: string;
  conMods: string[];
  intScore: string;
  intMods: string[];
  wisScore: string;
  wisMods: string[];
  chaScore: string;
  chaMods: string[];
  // Thieving
  thieving: string[];
  // Turning Undead
  turning: string[];
  // Spells per level
  spellsPerLevel: string[];
  // Special Abilities
  specialAbilities: SpecialAbilityEntry[];
  // Spell list
  spells: SpellEntry[];
  // Movement
  baseMovement: string;
  movementLight: string;
  movementMod: string;
  movementHvy: string;
  movementSvr: string;
  movementJog: string;
  movementRun3: string;
  movementRun4: string;
  movementRun5: string;
  // Healing Potions
  potions: PotionEntry[];
  // Equipment
  gear: GearEntry[];
  // Proficiencies
  proficiencies: ProficiencyEntry[];
  // Notes
  notes: string;
  // Settings
  font: string;
  pencilColour: string;
  // Spell Book
  knownSpells: string[];
  favoriteSpells: string[];
}

function createDefaultWeapons(count: number): WeaponEntry[] {
  return Array.from({ length: count }, () => ({
    name: '', attacks: '', atkAdj: '', dmgAdj: '', thac0: '',
    dmgSm: '', dmgLg: '', range: '', weight: '', size: '', type: '', speed: ''
  }));
}

function createDefaultPotions(count: number): PotionEntry[] {
  return Array.from({ length: count }, () => ({
    name: '', count: '', roll: '', useCur: '', useMax: '', notes: ''
  }));
}

function createDefaultGear(count: number): GearEntry[] {
  return Array.from({ length: count }, () => ({ item: '', location: '', weight: '' }));
}

function createDefaultProficiencies(count: number): ProficiencyEntry[] {
  return Array.from({ length: count }, () => ({ name: '', stat: '', adj: '', weapon: '' }));
}

function createDefaultSpecialAbilities(count: number): SpecialAbilityEntry[] {
  return Array.from({ length: count }, () => ({ col1: '', col2: '' }));
}

function createDefaultSpells(count: number): SpellEntry[] {
  return Array.from({ length: count }, () => ({
    name: '', level: '', sp: '', r: false, v: false, s: false, m: false
  }));
}

const defaultCharacter: CharacterData = {
  name: '',
  alignment: '',
  race: '',
  charClass: '',
  level: '',
  totalXp: '',
  nextLevel: '',
  bonusXp: '',
  gold: '',
  silver: '',
  copper: '',
  gems: '',
  portraitUrl: '',
  hp: '',
  wounds: '',
  spellPoints: '',
  activeSpells: '',
  stMod: ['', '', '', '', ''],
  stSave: ['', '', '', '', ''],
  acBase: '',
  acSurprised: '',
  acSurprisedArmor: '',
  acShieldless: '',
  acShieldlessArmor: '',
  acRear: '',
  acRearArmor: '',
  acDefenses: '',
  weapons: createDefaultWeapons(6),
  strScore: '',
  strMods: ['', '', '', '', '', ''],
  dexScore: '',
  dexMods: ['', '', ''],
  conScore: '',
  conMods: ['', '', '', '', ''],
  intScore: '',
  intMods: ['', '', '', '', ''],
  wisScore: '',
  wisMods: ['', '', '', ''],
  chaScore: '',
  chaMods: ['', '', ''],
  thieving: Array(18).fill(''),
  turning: Array(13).fill(''),
  spellsPerLevel: Array(9).fill(''),
  specialAbilities: createDefaultSpecialAbilities(7),
  spells: createDefaultSpells(30),
  baseMovement: '',
  movementLight: '',
  movementMod: '',
  movementHvy: '',
  movementSvr: '',
  movementJog: '',
  movementRun3: '',
  movementRun4: '',
  movementRun5: '',
  potions: createDefaultPotions(8),
  gear: createDefaultGear(20),
  proficiencies: createDefaultProficiencies(7),
  notes: '',
  font: 'Default',
  pencilColour: '#1a1d2e',
  knownSpells: [],
  favoriteSpells: [],
};

// ── Hook ──────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'adnd2e-character';

function loadFromStorage(): CharacterData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultCharacter };
    const parsed = JSON.parse(raw) as Partial<CharacterData>;
    return { ...defaultCharacter, ...parsed };
  } catch {
    return { ...defaultCharacter };
  }
}

export function useCharacterSheet() {
  const [char, setChar] = useState<CharacterData>(loadFromStorage);

  const update = useCallback((patch: Partial<CharacterData>) => {
    setChar(prev => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const resetToNew = useCallback(() => {
    const fresh = { ...defaultCharacter };
    setChar(fresh);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch { /* ignore */ }
  }, []);

  // Full replacement — used when loading a character from Nostr
  const replaceChar = useCallback((incoming: CharacterData) => {
    // Merge over defaults so any missing fields in the saved data get filled in
    const full = { ...defaultCharacter, ...incoming };
    setChar(full);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
    } catch { /* ignore */ }
  }, []);

  // Convenience updater for array fields
  const updateArrayField = useCallback(<K extends keyof CharacterData>(
    field: K,
    index: number,
    value: string | boolean
  ) => {
    setChar(prev => {
      const arr = [...(prev[field] as (string | boolean)[])] as (string | boolean)[];
      arr[index] = value;
      const next = { ...prev, [field]: arr };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const updateWeapon = useCallback((index: number, patch: Partial<WeaponEntry>) => {
    setChar(prev => {
      const weapons = prev.weapons.map((w, i) => i === index ? { ...w, ...patch } : w);
      const next = { ...prev, weapons };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const updatePotion = useCallback((index: number, patch: Partial<PotionEntry>) => {
    setChar(prev => {
      const potions = prev.potions.map((p, i) => i === index ? { ...p, ...patch } : p);
      const next = { ...prev, potions };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const updateGear = useCallback((index: number, patch: Partial<GearEntry>) => {
    setChar(prev => {
      const gear = prev.gear.map((g, i) => i === index ? { ...g, ...patch } : g);
      const next = { ...prev, gear };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const updateProficiency = useCallback((index: number, patch: Partial<ProficiencyEntry>) => {
    setChar(prev => {
      const proficiencies = prev.proficiencies.map((p, i) => i === index ? { ...p, ...patch } : p);
      const next = { ...prev, proficiencies };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const updateSpecialAbility = useCallback((index: number, patch: Partial<SpecialAbilityEntry>) => {
    setChar(prev => {
      const specialAbilities = prev.specialAbilities.map((a, i) => i === index ? { ...a, ...patch } : a);
      const next = { ...prev, specialAbilities };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const updateSpell = useCallback((index: number, patch: Partial<SpellEntry>) => {
    setChar(prev => {
      const spells = prev.spells.map((s, i) => i === index ? { ...s, ...patch } : s);
      const next = { ...prev, spells };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch { /* ignore */ }
      return next;
    });
  }, []);

  const saveToFile = useCallback(() => {
    const data = JSON.stringify({ version: 4, ...char }, null, 2);
    const uri = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
    const link = document.createElement('a');
    link.setAttribute('href', uri);
    link.setAttribute('download', (char.name || 'unnamed') + '.json');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }, [char]);

  const loadFromFile = useCallback((file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const raw = reader.result as string;
          if (!raw || !raw.trim()) {
            reject(new Error('File is empty'));
            return;
          }
          const parsed = JSON.parse(raw);

          // Support both the new React format (version 4, flat fields)
          // and the old vanilla-JS format (version 1-3, nested `data` object)
          let loaded: CharacterData;
          if (parsed.version <= 3 && parsed.data) {
            // Old format — just load defaults; fields won't map across
            // but at least don't crash. The user will see a blank sheet.
            loaded = { ...defaultCharacter };
          } else {
            // New React format: top-level fields match CharacterData
            // Strip the version key before merging
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { version: _v, ...fields } = parsed as { version?: number } & Partial<CharacterData>;
            loaded = { ...defaultCharacter, ...fields };
          }

          setChar(loaded);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
          resolve();
        } catch (err) {
          reject(err instanceof Error ? err : new Error('Failed to parse character file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  const setMovementFromBase = useCallback((base: string) => {
    const m = parseInt(base);
    if (isNaN(m)) return;
    update({
      baseMovement: base,
      movementLight: String(Math.floor(m * 2 / 3)),
      movementMod: String(Math.floor(m / 2)),
      movementHvy: String(Math.floor(m / 3)),
      movementSvr: String(Math.min(m, 1)),
      movementJog: String(Math.floor(m * 2)),
      movementRun3: String(Math.floor(m * 3)),
      movementRun4: String(Math.floor(m * 4)),
      movementRun5: String(Math.floor(m * 5)),
    });
  }, [update]);

  const autoFillAbility = useCallback((stat: string, value: string) => {
    const data = lookupAbility(stat, value);
    if (!data) return;
    switch (stat) {
      case 'STR': update({ strScore: value, strMods: [...data] }); break;
      case 'DEX': update({ dexScore: value, dexMods: [...data] }); break;
      case 'CON': update({ conScore: value, conMods: [...data] }); break;
      case 'INT': update({ intScore: value, intMods: [...data] }); break;
      case 'WIS': update({ wisScore: value, wisMods: [...data] }); break;
      case 'CHA': update({ chaScore: value, chaMods: [...data] }); break;
    }
  }, [update]);

  const addKnownSpell = useCallback((id: string) => {
    setChar(prev => {
      if (prev.knownSpells.includes(id)) return prev;
      const knownSpells = [...prev.knownSpells, id];
      const next = { ...prev, knownSpells };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const removeKnownSpell = useCallback((id: string) => {
    setChar(prev => {
      const knownSpells = prev.knownSpells.filter(s => s !== id);
      const favoriteSpells = prev.favoriteSpells.filter(s => s !== id);
      const next = { ...prev, knownSpells, favoriteSpells };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const toggleFavoriteSpell = useCallback((id: string) => {
    setChar(prev => {
      const favoriteSpells = prev.favoriteSpells.includes(id)
        ? prev.favoriteSpells.filter(s => s !== id)
        : [...prev.favoriteSpells, id];
      const next = { ...prev, favoriteSpells };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const gearTotalWeight = char.gear.reduce((sum, g) => {
    const w = parseFloat(g.weight);
    return isNaN(w) ? sum : sum + w;
  }, 0);

  return {
    char,
    update,
    resetToNew,
    replaceChar,
    updateArrayField,
    updateWeapon,
    updatePotion,
    updateGear,
    updateProficiency,
    updateSpecialAbility,
    updateSpell,
    addKnownSpell,
    removeKnownSpell,
    toggleFavoriteSpell,
    saveToFile,
    loadFromFile,
    setMovementFromBase,
    autoFillAbility,
    gearTotalWeight,
  };
}
