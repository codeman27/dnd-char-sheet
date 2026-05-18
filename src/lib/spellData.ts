export interface SpellData {
  id: string;
  name: string;
  school: string;
  sphere?: string;
  level: number;
  range: string;
  components: string;
  duration: string;
  castingTime: string;
  areaOfEffect: string;
  savingThrow: string;
  /** Mechanical summary — dice, rules, no fluff */
  summary: string;
  description: string;
  spellClass: 'priest' | 'wizard' | 'all';
}

export const SPELLS: SpellData[] = [
  // ─── First-Level Priest Spells ────────────────────────────────────────────
  {
    id: 'altruism',
    name: 'Altruism',
    school: 'Invocation',
    level: 1,
    range: 'Touch',
    components: 'V, S',
    duration: 'Permanent',
    castingTime: '5',
    areaOfEffect: 'One creature',
    savingThrow: 'None',
    summary:
      'Transfer any number of own HP to a touched creature. 1:1 exchange. Permanent — cannot be taken back. Recipient cannot exceed their normal max HP and cannot refuse. Only works on non-opposed alignments (not good vs. evil, not lawful vs. chaotic).',
    description:
      'With this spell, a cleric may transfer hit points to another character or being of any alignment not directly opposed to his own (good vs. evil or lawful vs. chaotic.) Hit points are exchanged on a 1 to 1 basis, and may not be "taken back" once the spell has been cast. The recipient of the spell cannot gain more hit points than he normally has, and cannot refuse the gift even if he wants to.',
    spellClass: 'priest',
  },
  {
    id: 'analyze-balance',
    name: 'Analyze Balance',
    school: 'Divination',
    sphere: 'Numbers, Divination',
    level: 1,
    range: '80 yards',
    components: 'V, S, M',
    duration: '5 rounds +1 round/level',
    castingTime: '1 round',
    areaOfEffect: "One creature, object, or 10' square",
    savingThrow: 'None',
    summary:
      "Reveals how many alignment steps target deviates from True Neutral and which axes (Law/Chaos, Good/Evil). Does NOT reveal direction unless: 5%/level chance on one randomly chosen axis. Animals (Int 'animal' or 'non-') always read as True Neutral. No result on hidden traps. M: four iron coins (not consumed).",
    description:
      'This spell allows a priest to sense how far a character, creature, object, or area is from a condition of balance—in other words, the degree to which its alignment is removed from true Neutral. The spell gives no indication of the "direction" in which the alignment is removed from true Neutral except under certain conditions which follow. The spell does, however, indicate along which axis or axes of alignment the variation lies.\n\nFor example, a priest uses this spell to analyze the balance of a Chaotic Neutral creature. The spell indicates that the creature is removed from Neutral by one grade, and the variation is along the Law/Chaos axis; thus, the creature must be either Chaotic Neutral or Lawful Neutral. If the creature were Chaotic Evil, the spell would indicate that it is removed from balance by two grades, one along each axis; thus, the creature must be Chaotic Evil, Chaotic Good, Lawful Evil, or Lawful Good.\n\nA priest has a 5% chance per level of correctly determining the direction of variation along one randomly chosen axis. This means that a 10th-level priest evaluating the balance of a Chaotic Neutral creature would have a 50% chance of learning that the creature is Chaotic (and hence Chaotic Neutral, since it is only one step away from balance).\n\nSimilar to spells such as detect evil, this spell will not yield a result on a hidden trap. If cast on a creature with an intelligence level of "animal" or "non-," it will always read true Neutral (i.e., zero steps removed from balance).\n\nThe material components are four iron coins which the priest tosses in his hand while concentrating on the spell. The coins are not consumed in the casting.',
    spellClass: 'priest',
  },
  {
    id: 'animal-friendship',
    name: 'Animal Friendship',
    school: 'Enchantment/Charm',
    sphere: 'Animal',
    level: 1,
    range: '10 yards',
    components: 'V, S, M',
    duration: 'Permanent',
    castingTime: '1 hour',
    areaOfEffect: '1 animal',
    savingThrow: 'Neg.',
    summary:
      "Target animal (Int 1–4) must fail save or stand quietly. Teaches 3 tricks per point of Intelligence. Training: 1 week per trick, all within 3 months. Max 2 HD/level attracted and trained simultaneously. Only unaligned animals. Caster must sincerely want friendship (ulterior motives are sensed). M: holy symbol + food the animal likes.",
    description:
      "By means of this spell, the caster is able to show any animal of animal intelligence to semi-intelligence (Intelligence 1–4) that he desires friendship. If the animal does not roll a successful saving throw vs. spell immediately when the spell is begun, it stands quietly while the caster finishes the spell. Thereafter, it follows the caster about. The spell functions only if the caster actually wishes to be the animal's friend.\n\nThe caster can teach the befriended animal three specific tricks or tasks for each point of Intelligence it possesses. Training for each trick must be done over one week; all must be done within three months of acquiring the creature. The caster can attract up to 2 Hit Dice of animal(s) per experience level, which is also the maximum total HD trainable at one time.",
    spellClass: 'priest',
  },
  {
    id: 'anti-vermin-barrier',
    name: 'Anti-Vermin Barrier',
    school: 'Abjuration',
    sphere: 'Wards',
    level: 1,
    range: '30 yards',
    components: 'V, S, M',
    duration: '1 hour/level',
    castingTime: '1',
    areaOfEffect: "10-foot cube/level",
    savingThrow: 'None',
    summary:
      'Invisible field repels non-magical insects, rodents, spiders, snakes, worms, and similar vermin of less than 1 HD. No effect on giant versions ≥1 HD. Affects summoned vermin (e.g., summon insects). Creatures inside when cast are unaffected, but cannot re-enter once they leave. Area: 10\' cube × level. M: holy symbol + rodent\'s whisker.',
    description:
      "With this spell, the caster creates an invisible force field that repels nonmagical insects, rodents, spiders, snakes, worms, and similar vermin of less than 1 Hit Die. The spell has no effect on giant-sized versions of these creatures unless they are less than 1 Hit Die. The barrier affects summoned creatures, such as those called by a summon insects spell.\n\nAny vermin within the area of effect when the spell is cast are not affected; however, when these creatures exit the area, they cannot return.\n\nThe spell affects a cubic area whose sides are 10 feet times the caster's level (a 2nd-level priest could affect a 20' × 20' × 20' cube).",
    spellClass: 'priest',
  },
  {
    id: 'astral-celerity',
    name: 'Astral Celerity',
    school: 'Alteration',
    sphere: 'Astral',
    level: 1,
    range: '0',
    components: 'V, S',
    duration: '1 hr./level',
    castingTime: '4',
    areaOfEffect: 'The caster',
    savingThrow: 'None',
    summary:
      'On Astral Plane: movement rate doubled (30×Int → 60×Int ft/round). On Ethereal Plane: movement +50%. Also removes missile fire penalties while astral. Caster attunes to the plane instantly (no adjustment period).',
    description:
      "This spell enhances the caster's movement capabilities in extraplanar settings by attuning him to his new surroundings. Astral celerity doubles the character's movement rate on the Astral Plane; normally, characters move at 30 times their Intelligence score in feet per round, but this spell increases this to 60 feet times their Intelligence score. The caster also suffers no penalties for missile fire while astral.\n\nOn the Ethereal Plane, movement rates are increased by 50%, so a character with movement 12 would enjoy movement 18 while this spell was in effect.",
    spellClass: 'priest',
  },
  {
    id: 'battlefate',
    name: 'Battlefate',
    school: 'Alteration',
    sphere: 'Chaos',
    level: 1,
    range: '20 yards',
    components: 'V, S, M',
    duration: '2 rounds/level',
    castingTime: '4',
    areaOfEffect: '1 creature',
    savingThrow: 'None',
    summary:
      'Combat bonus = +1 per 3 levels (max +5 at 13th level). Each round, roll d6 to determine which aspect benefits: 1=No benefit (chaos), 2=Attack roll, 3=Damage, 4=Armor Class, 5=Saving throw, 6=Extra attack (choose enhanced accuracy or damage). If the applicable roll type doesn\'t occur that round, no benefit. M: electrum coin tossed during casting.',
    description:
      "This spell alters probability to favor one character or creature locked in battle. Combat modifiers provided by battlefate equal +1 per three levels, so a 1st-level caster provides +1, a 4th-level caster +2, a 7th-level caster +3, and so on to a maximum of +5 for a 13th-level priest.\n\nEach round, roll a d6 to see which aspect is affected:\n1 – No benefit (nature of chaos)\n2 – Attack roll\n3 – Damage\n4 – Armor Class\n5 – Saving throw\n6 – Extra attack with enhanced accuracy or damage (subject's choice)\n\nIf the character doesn't make a roll of the specified type in the round, battlefate provides no benefit that round.",
    spellClass: 'priest',
  },
  {
    id: 'beastmask',
    name: 'Beastmask',
    school: 'Illusion/Phantasm',
    sphere: 'Animal',
    level: 1,
    range: 'Touch',
    components: 'V, S, M',
    duration: '12 hours',
    castingTime: '4',
    areaOfEffect: '1 creature',
    savingThrow: 'Neg.',
    summary:
      'Subject appears as a chosen animal species — but only to members of that species (sight, hearing, smell, touch). Other creatures see the subject normally. Subject cannot assume a form more than twice or less than one-quarter their own size. Does not grant communication with the animal species. M: miniature wooden mask carved to look like the animal.',
    description:
      'Beastmask may affect any single person or animal, or characters may cast it on themselves. It allows the subject to take on the illusory form of a single animal species—but only that species of animal can perceive the illusion. The almost perfect illusion deceives the animal\'s sight, hearing, smell, and touch.\n\nCharacters use beastmask to travel among or hunt a particular species. A druid could assume the guise of a caribou to move among a herd without causing panic, or avoid being attacked by dire wolves by wearing a wolf\'s "mask." The subject may not assume an animal form more than twice or less than one-quarter the character\'s size.',
    spellClass: 'priest',
  },
  {
    id: 'bless',
    name: 'Bless',
    school: 'Conjuration/Summoning',
    sphere: 'All',
    level: 1,
    range: '60 yards',
    components: 'V, S, M',
    duration: '6 rounds',
    castingTime: '1 round',
    areaOfEffect: "50-foot cube",
    savingThrow: 'None',
    summary:
      '+1 attack rolls and +1 morale/saves vs. fear for all friendly creatures in a 50\' cube. Only affects creatures NOT already in combat. Multiple bless spells not cumulative. Can also bless one item (max 1 lb/level) lasting until used or duration ends. M: holy water. Reverse (Curse): –1 attack/morale, requires unholy water.',
    description:
      'Upon uttering the bless spell, the caster raises the morale of friendly creatures and any saving throw rolls they make against fear effects by +1. Furthermore, it raises their attack dice rolls by +1. A blessing affects only those not already engaged in melee combat. The caster determines at what range (up to 60 yards) he will cast the spell; it affects all creatures in a 50-foot cube centered on the selected point.\n\nA second use: bless a single item (max 1 lb/level) until it is used or the duration ends. Multiple bless spells are not cumulative.\n\nThis spell can be reversed to a curse that lowers morale and attack rolls by –1.',
    spellClass: 'priest',
  },
  {
    id: 'blessed-watchfulness',
    name: 'Blessed Watchfulness',
    school: 'Alteration',
    sphere: 'Guardian',
    level: 1,
    range: 'Touch',
    components: 'V, S',
    duration: '4 hrs. +1 hr./level',
    castingTime: '4',
    areaOfEffect: 'Creature Touched',
    savingThrow: 'None',
    summary:
      'Sentinel stays fully alert for duration. Cannot be surprised on a roll of 1. Resists sleep and similar magic as if 4 levels/HD higher. +2 bonus to saves vs. charm, beguiling, fear, emotion, and similar mind-affecting spells. No benefit if the effect normally allows no save.',
    description:
      'By casting this spell, the priest confers exceptional powers of observation and alertness to one creature for the duration. While blessed watchfulness is in effect, the designated sentinel remains alert, awake, and vigilant. It takes a roll of 1 to surprise someone under this effect. He resists sleep spells and similar magic as if 4 levels or Hit Dice higher than his actual level, and gains a +2 bonus to saving throws against charm, beguiling, fear, emotion, and similar mind-affecting spells. If the effect normally allows no saving throw, the watcher gains no special benefit.',
    spellClass: 'priest',
  },
  {
    id: 'calculate',
    name: 'Calculate',
    school: 'Divination',
    sphere: 'Numbers',
    level: 1,
    range: '0',
    components: 'S, M',
    duration: 'Instantaneous',
    castingTime: '4',
    areaOfEffect: 'The caster',
    savingThrow: 'None',
    summary:
      'Accurately estimates the chance of success of one specific action (must be one resolved by a die roll). Priest has 70% + 2%/level chance to succeed. On success: DM reveals exact AC, THAC0, thief %, spell save needed, ability check chance, etc. On roll of 99–00: result is wildly wrong. M: miniature ivory abacus worth ≥100 gp (not consumed).',
    description:
      "By means of this spell, the priest can accurately estimate the chance of success of one specific action, such as climbing a cliff, making a trick bowshot, crossing a burning room, or striking an enemy. The action must be resolved by a die roll; the priest doesn't have to be the person attempting it.\n\nThe priest has a 70% chance, +2% per level, of making an accurate estimate. On success, the DM reveals the action's chance (AC, THAC0, skill percentage, spell save required, etc.).\n\nIf the priest fails with a roll of 99 or 00, his calculation is wildly skewed in a random fashion.",
    spellClass: 'priest',
  },
  {
    id: 'call-upon-faith',
    name: 'Call Upon Faith',
    school: 'Invocation',
    sphere: 'Summoning',
    level: 1,
    range: '0',
    components: 'V, S, M',
    duration: '1 round',
    castingTime: '1',
    areaOfEffect: 'The caster',
    savingThrow: 'None',
    summary:
      'If the priest has been true to his faith (DM adjudicates), grants +3 (or +15%) bonus to ONE die roll of choice (save, attack roll, ability check, etc.) made in the next round. Must be cast before the attempted action. M: holy symbol.',
    description:
      "Before attempting a difficult task, the priest may cast call upon faith to aid his performance. If the priest has been true to his faith (as determined by the DM), the priest gains a +3 (or +15%) bonus to one die roll (his choice) needed to complete the task. The bonus may be used to affect a saving throw, attack roll, ability check, etc. For example, if a priest were about to cross a narrow log high above a chasm, he could cast this spell and gain a +3 bonus to his Dexterity ability check.",
    spellClass: 'priest',
  },
  {
    id: 'calm-animals',
    name: 'Calm Animals',
    school: 'Enchantment/Charm',
    sphere: 'Animal',
    level: 1,
    range: '60 yards',
    components: 'V, S',
    duration: '1 turn +1 round/level',
    castingTime: '4',
    areaOfEffect: 'Special',
    savingThrow: 'Special',
    summary:
      'Calms 2d4 + 1 HD/level of same-species animals (Int 1–4). No save unless magical/unnatural creatures. Calmed animals remain in place and do not attack or flee. If attacked or confronted by major hazard, spell breaks. Calmed animals still defend themselves if attacked.',
    description:
      'This spell soothes and quiets normal animals, rendering them docile and harmless. Only creatures with Intelligence 1–4 (animal- or semi-intelligent) can be affected. The caster can calm 2d4 Hit Dice of animals, plus 1 Hit Die per level. All subjects must be of the same species.\n\nSubject creatures are not allowed a saving throw unless they have magical powers or are clearly unnatural (a normal bear gets no save; a winter wolf or hell hound does).\n\nWhile under the influence, affected creatures remain where they are and do not attack or flee unless attacked or confronted by a significant hazard. Once roused, the spell is broken.',
    spellClass: 'priest',
  },
  {
    id: 'combine',
    name: 'Combine',
    school: 'Evocation',
    sphere: 'All',
    level: 1,
    range: 'Touch',
    components: 'V, S',
    duration: 'Special',
    castingTime: '1 round',
    areaOfEffect: 'The circle of priests',
    savingThrow: 'None',
    summary:
      'Three to five priests form a circle. Central priest gains +1 level per surrounding priest (max +4 levels). Affects turn undead and level-dependent spell parameters — no extra spells. Encircling priests must concentrate throughout: lose shield and Dex AC bonuses. If any encircler is disrupted, combine ends immediately. In-progress spell from central priest is ruined if combine breaks mid-cast.',
    description:
      "Using this spell, three to five priests combine their abilities so that one casts spells and turns undead at an enhanced level. The highest-level priest stands alone while the others join hands in a surrounding circle. The central priest casts the combine spell. He temporarily gains one level for each priest in the circle, up to a maximum gain of four levels.\n\nThe encircling priests must concentrate; they lose all Armor Class bonuses for shield and Dexterity. If any of them has concentration broken, the combine ends immediately, ruining any spell the central priest is in the act of casting.",
    spellClass: 'priest',
  },
  {
    id: 'command',
    name: 'Command',
    school: 'Enchantment/Charm',
    sphere: 'Charm, Combat, Law',
    level: 1,
    range: '30 yards',
    components: 'V',
    duration: '1 round',
    castingTime: '1',
    areaOfEffect: '1 creature',
    savingThrow: 'None (see summary)',
    summary:
      'One-word command obeyed for 1 round (must be in a language the creature understands). "Suicide" and clearly impossible commands are ignored. "Die" causes 1-round faint/catalepsy (creature recovers fully). No effect on undead. Creatures with Int 13+ OR 6+ HD/levels get a save vs. spell (Wisdom adjusted). Both 13 Int AND 6 HD = still only one save.',
    description:
      'This spell enables the priest to command another creature with a single word. The command must be uttered in a language understood by the creature. The subject will obey only as long as the command is absolutely clear and unequivocal; "Suicide!" is ignored. A command to "Die!" causes the creature to fall in a faint for one round, after which it revives fully.\n\nTypical commands: back, halt, flee, run, stop, fall, go, leave, surrender, sleep, rest.\n\nNo command affects a creature for more than one round; undead are not affected at all. Creatures with Intelligence 13 or higher, or 6+ Hit Dice/levels, are entitled to a saving throw vs. spell (Wisdom adjusted).',
    spellClass: 'priest',
  },
  {
    id: 'courage',
    name: 'Courage',
    school: 'Enchantment/Charm',
    sphere: 'War',
    level: 1,
    range: '240 yards',
    components: 'V, S, M',
    duration: 'Special',
    castingTime: '1 turn',
    areaOfEffect: 'One unit up to 200 individuals',
    savingThrow: 'None',
    summary:
      'Target unit automatically passes its FIRST morale check after casting (no die roll, assumed passed). Spell then ends. Expires at first sunset if no morale check is triggered. Multiple simultaneous morale events: commanding player picks one to ignore. Maximum one courage spell per unit at a time. Requires unobstructed line of sight. M: cube of cast iron.',
    description:
      "This spell imbues the target unit with a temporary burst of courage. The priest must have an uninterrupted line of sight to the target unit.\n\nA courage spell enables a unit to automatically pass its first morale check following casting — no die roll is made and the unit is assumed to pass. The spell then ends. If no morale check occurs, the spell expires at first sunset.\n\nWhen multiple simultaneous events trigger morale checks, the player commanding the unit selects one such event and its modifier is ignored. No more than one courage spell can affect a unit at a time.",
    spellClass: 'priest',
  },
  {
    id: 'create-water',
    name: 'Create Water',
    school: 'Alteration',
    sphere: 'Elemental (Water)',
    level: 1,
    range: '30 yards',
    components: 'V, S, M',
    duration: 'Permanent',
    castingTime: '1 round',
    areaOfEffect: 'Up to 27 cubic feet',
    savingThrow: 'None',
    summary:
      'Creates 4 gallons/level of clean, drinkable water. Permanent (can be dispelled within 1 round, after which it is normal water). Reverse (Destroy Water): obliterates equal amount with no vapor or steam. Cannot create or destroy water inside a creature. M: at least one drop of water to create; pinch of dust to destroy.',
    description:
      "When the priest casts create water, up to four gallons of water are generated for every experience level (a 2nd-level priest creates 8 gallons, a 3rd-level 12 gallons, etc.). The water is clean and drinkable. The created water can be dispelled within a round of creation; otherwise its magic fades, leaving normal water.\n\nReversing the spell, destroy water, obliterates without trace (no vapor, mist, fog, or steam) a like quantity of water. Water weighs about 8½ pounds per gallon; a cubic foot weighs approximately 64 pounds.",
    spellClass: 'priest',
  },
  {
    id: 'cure-light-wounds',
    name: 'Cure Light Wounds',
    school: 'Necromancy',
    sphere: 'Healing',
    level: 1,
    range: 'Touch',
    components: 'V, S',
    duration: 'Permanent',
    castingTime: '5',
    areaOfEffect: 'Creature touched',
    savingThrow: 'None',
    summary:
      'Heals 1d8 HP. Does not affect creatures without corporeal bodies, non-living creatures, or extraplanar beings. Reverse (Cause Light Wounds): inflicts 1d8 HP damage; attack roll required if target is avoiding.',
    description:
      'When casting this spell and laying his hand upon a creature, the priest causes 1d8 points of wound or other injury damage to the creature\'s body to be healed. This healing cannot affect creatures without corporeal bodies, nor can it cure wounds of creatures not living or of extraplanar origin.\n\nThe reversed spell, cause light wounds, operates in the same manner, inflicting 1d8 points of damage. If a creature is avoiding this touch, an attack roll is needed to determine if the priest\'s hand strikes the opponent.',
    spellClass: 'priest',
  },
  {
    id: 'detect-evil',
    name: 'Detect Evil',
    school: 'Divination',
    sphere: 'Divination',
    level: 1,
    range: '120 yards',
    components: 'V, S, M',
    duration: '1 turn + 5 rounds/level',
    castingTime: '1 round',
    areaOfEffect: "10-foot path",
    savingThrow: 'None',
    summary:
      'Detects evil/good emanations in a 10\' wide path, up to 120 yds. Degree noted (faint/moderate/strong/overwhelming). 10%/level chance to determine alignment bent (lawful/neutral/chaotic) if overwhelming. Must concentrate ≥1 round per reading. Can scan 60°/round. Does not detect hidden traps or unintelligent animals. M: holy symbol held before priest. Reverse: Detect Good.',
    description:
      "This spell discovers emanations of evil, or of good in the case of the reverse, from any creature, object, or area. Character alignment is revealed only under unusual circumstances: characters who are strongly aligned and of at least 9th level might radiate good or evil if intent upon appropriate actions.\n\nThe degree of evil (faint, moderate, strong, overwhelming) and possibly its general nature (expectant, malignant, gloating, etc.) can be noted. If the evil is overwhelming, the priest has a 10% chance per level of detecting its general bent (lawful, neutral, chaotic). The priest must concentrate — stop, have quiet, and intently seek to detect the aura — for at least one round to receive a reading.",
    spellClass: 'priest',
  },
  {
    id: 'detect-magic',
    name: 'Detect Magic',
    school: 'Divination',
    sphere: 'All',
    level: 1,
    range: '30 yards',
    components: 'V, S, M',
    duration: '1 turn',
    castingTime: '1 round',
    areaOfEffect: "10-foot path",
    savingThrow: 'None',
    summary:
      "Detects magical radiations in 10' wide path up to 30 yds. Intensity noted (dim/faint/moderate/strong/overwhelming). 10%/level chance to identify the sphere (but NOT the magic type like alteration, conjuration). Can scan 60°/round. Blocked by 1' stone, 1\" metal, 1 yd wood. M: holy symbol.",
    description:
      "When the detect magic spell is cast, the priest detects magical radiations in a path 10 feet wide and up to 30 feet long in the direction he is facing. The intensity of the magic can be detected (dim, faint, moderate, strong, overwhelming). The caster has a 10% chance per level to determine the sphere of the magic, but unlike the wizard version, the type of magic (alteration, conjuration, etc.) cannot be divined. The caster can turn, scanning 60° per round.\n\nA stone wall of 1 foot or more, solid metal of 1 inch, or a yard of solid wood blocks the spell.",
    spellClass: 'priest',
  },
  {
    id: 'detect-poison',
    name: 'Detect Poison',
    school: 'Divination',
    sphere: 'Divination',
    level: 1,
    range: '0',
    components: 'V, S, M',
    duration: '1 turn + 1 round/level',
    castingTime: '4',
    areaOfEffect: "Special",
    savingThrow: 'None',
    summary:
      'Determines if one object or 5\' cubic mass is poisoned or poisonous. One check per round. 5%/level chance to identify exact poison type. M: strip of specially blessed vellum, which turns black if poison is present.',
    description:
      "This spell enables the priest to determine if an object has been poisoned or is poisonous. One object, or a 5-foot cubic mass, can be checked per round. The priest has a 5% chance per level of determining the exact type of poison.\n\nThe material component is a strip of specially blessed vellum, which turns black if poison is present.",
    spellClass: 'priest',
  },
  {
    id: 'detect-snares-pits',
    name: 'Detect Snares & Pits',
    school: 'Divination',
    sphere: 'Plant',
    level: 1,
    range: '0',
    components: 'V, S, M',
    duration: '4 rounds/level',
    castingTime: '4',
    areaOfEffect: "10-foot path, 40 feet long",
    savingThrow: 'None',
    summary:
      "Detects pits, snares, deadfalls, and similar hazards in a 10'×40' directional path. Reveals general nature (pit/snare/deadfall) and what triggers it. Also detects natural hazards: quicksand (snare), sinkholes (pit), unsafe rock walls (deadfall). Does NOT detect: magical traps (except pit/snare/deadfall types), mechanically complex traps, inactive/rendered-safe snares. M: holy symbol.",
    description:
      "Upon casting this spell, the caster is able to detect snares, pits, deadfalls, and similar hazards along a 10-foot-wide by 40-foot-long path. The spell is directional—the caster must face the desired direction. The caster experiences a feeling of danger from the direction of a detected hazard, which increases as the danger is approached. The caster learns the general nature of the danger (pit, snare, or deadfall) but not its exact operation.\n\nThe spell detects certain natural hazards: quicksand (snare), sinkholes (pit), or unsafe walls of natural rock (deadfall). It does not detect magical traps (save those that operate by pit, deadfall, or snaring), mechanically complex traps, or snares/deadfalls that have been rendered safe or inactive.",
    spellClass: 'priest',
  },
  {
    id: 'dispel-fatigue',
    name: 'Dispel Fatigue',
    school: 'Necromancy',
    sphere: 'Necromantic',
    level: 1,
    range: '30 yards',
    components: 'V, S, M',
    duration: 'Instantaneous',
    castingTime: '4',
    areaOfEffect: '1 creature',
    savingThrow: 'None',
    summary:
      'Instantly removes ALL accumulated fatigue/exhaustion from one creature. Negates forced march, swim, jog, run, sprint penalties. Removes accumulated fatigue points (Combat & Tactics or magic fatigue rules). Subject can then start accumulating fatigue again normally. M: sprinkle of fresh, blessed spring water.',
    description:
      "This spell removes physical fatigue or exhaustion from the subject by undoing the physiological effects of his exertions. The subject is instantly restored to his normal, fully rested level of endurance. This spell can negate the penalties of forced marching, long swims, jogging, running, or sprinting, or accumulated fatigue points from the Player's Option: Combat & Tactics rules or magic fatigue rules. Once this spell has been cast, the subject may start to accumulate fatigue again depending on how he continues to exert himself.",
    spellClass: 'priest',
  },
  {
    id: 'emotion-read',
    name: 'Emotion Read',
    school: 'Divination',
    sphere: 'Thought',
    level: 1,
    range: '5 yards/level',
    components: 'V, S, M',
    duration: 'Instantaneous',
    castingTime: '3',
    areaOfEffect: 'One creature',
    savingThrow: 'Neg.',
    summary:
      'Reads dominant emotion of one creature (Int 3+) at the instant of casting. No details, no motivation, no mixed emotions. Save negates (no reading). If save roll exceeds needed number by 6+: priest perceives the OPPOSITE emotion. M: square of unmarked white wax.',
    description:
      "This spell allows the priest to perform an instantaneous reading of a single subject's emotional state. It can be used on any subject possessing Intelligence 3 or better. This reading is neither deep nor specific and cannot pick out mixed emotions or intricate details — it might reveal the subject is fearful, but not what they fear or why.\n\nEmotion read does not reveal individual thoughts or motivation. The reading is instantaneous and reveals only the strongest emotion at that moment.\n\nIf the saving throw succeeds, the priest receives no reading. If the subject's roll exceeds the necessary number by six or more, the priest perceives the opposite of the subject's true emotion.",
    spellClass: 'priest',
  },
  {
    id: 'endure-cold-heat',
    name: 'Endure Cold / Endure Heat',
    school: 'Alteration',
    sphere: 'Protection',
    level: 1,
    range: 'Touch',
    components: 'V, S',
    duration: '1½ hours/level',
    castingTime: '1 round',
    areaOfEffect: 'Creature touched',
    savingThrow: 'None',
    summary:
      'Protects against normal extremes: down to –30°F (cold) or up to 130°F (heat). Beyond limit: 1 HP/hr per degree over limit. Cancelled immediately if recipient is affected by any magical heat OR cold (regardless of application). When cancelled, absorbs first 10 pts of damage (after saves) from that effect. Spell ends if resist fire or resist cold is cast on recipient.',
    description:
      "The creature receiving this spell is protected from normal extremes of cold or heat (depending on which application the priest selects at casting). The creature can stand in temperatures as low as –30° F or as high as 130° F with no ill effect. Temperatures beyond these limits inflict 1 point of damage per hour of exposure for every degree beyond the limit.\n\nThe spell is immediately cancelled if the recipient is affected by any non-normal heat or cold (magic, breath weapons, etc.), regardless of application. The recipient does not suffer the first 10 points of damage (after applicable saving throws) from the heat or cold during the round in which the spell is broken. The spell ends instantly if resist fire or resist cold is cast upon the recipient.",
    spellClass: 'priest',
  },
  {
    id: 'entangle',
    name: 'Entangle',
    school: 'Alteration',
    sphere: 'Plant',
    level: 1,
    range: '80 yards',
    components: 'V, S, M',
    duration: '1 turn',
    castingTime: '4',
    areaOfEffect: "40-foot cube",
    savingThrow: '½',
    summary:
      'Plants in a 40\' cube writhe and grasp. Failed save: creature is held fast (immobile). Passed save: movement reduced to half, other actions possible. Duration 1 turn. M: holy symbol.',
    description:
      'All plants in a 40-foot cube writhe and grasp at creatures within the area of effect. Any creature caught in the area must make a saving throw vs. spell. Creatures that fail their saving throw are held fast and cannot move. Creatures that succeed are still slowed to half movement. The effect lasts for 1 turn.',
    spellClass: 'priest',
  },
  {
    id: 'invisibility-to-undead',
    name: 'Invisibility to Undead',
    school: 'Abjuration',
    sphere: 'Necromantic',
    level: 1,
    range: 'Touch',
    components: 'V, S, M',
    duration: '6 rounds',
    castingTime: '4',
    areaOfEffect: '1 creature',
    savingThrow: 'Special',
    summary:
      'Warded creature is ignored by undead for 6 rounds. Undead of 4 or fewer HD are auto-affected; higher HD receive a save vs. spell. Ends if recipient makes any attack. M: holy symbol.',
    description:
      'This spell causes affected undead to lose track of and ignore the warded creature for the duration of the spell. Undead of 4 or fewer Hit Dice are automatically affected, but those with more Hit Dice receive a saving throw vs. spell to avoid the effect. Note that a priest protected by this spell cannot turn affected undead. The spell ends immediately if the recipient makes any attack, although casting spells such as cure light wounds, augury, or chant does not end the ward. The material component is the priest\'s holy symbol.',
    spellClass: 'priest',
  },
  {
    id: 'light',
    name: 'Light',
    school: 'Alteration',
    sphere: 'Sun',
    level: 1,
    range: '120 yards',
    components: 'V, S',
    duration: '1 hour + 1 turn/level',
    castingTime: '4',
    areaOfEffect: '20-ft.-radius globe',
    savingThrow: 'Special',
    summary:
      'Creates torchlight-brightness globe (20\' radius) at a chosen point. If centered on a creature\'s eyes: -4 attack, saves, and AC penalty (blinds it). Reversible: Darkness (half duration, pitch black). Caster can dismiss with a word.',
    description:
      'This spell causes a luminous glow within 20 feet of the spell\'s center. The area of light thus caused is equal in brightness to torchlight. Objects in darkness beyond this sphere can be seen, at best, as vague and shadowy shapes. The spell is centered on a point selected by the caster, and he must have a line of sight or unobstructed path to that point when the spell is cast. Light can spring from air, rock, metal, wood, or almost any similar substance. The effect is immobile unless it is specifically centered on a movable object or mobile creature.\n\nIf this spell is cast upon a creature, any applicable magic resistance and saving throws must be rolled. Successful resistance negates the spell, while a successful saving throw indicates that the spell is centered immediately behind the creature, rather than upon the creature itself. A light spell centered on the visual organs of a creature blinds it, reducing its attack and saving throw rolls by 4 and worsening its Armor Class by 4. The caster can extinguish the light at any time by uttering a single word. Light spells are not cumulative—multiple castings do not provide a brighter light.\n\nThe spell is reversible, causing darkness in the same area and under the same conditions as the light spell, but with half the duration. Magical darkness is equal to that of an unlit interior room—pitch darkness. Any normal light source or magical light source of lesser intensity than full daylight does not function in magical darkness. A darkness spell cast directly against a light spell cancels both, and vice versa.',
    spellClass: 'priest',
  },
  {
    id: 'magical-stone',
    name: 'Magical Stone',
    school: 'Enchantment',
    sphere: 'Combat',
    level: 1,
    range: 'Touch',
    components: 'V, S, M',
    duration: 'Special (30 min. or until used)',
    castingTime: '4',
    areaOfEffect: '3 pebbles',
    savingThrow: 'None',
    summary:
      'Enchants up to 3 pebbles as +1 (to-hit only) thrown weapons. Each deals 1d4 damage (2d4 vs. undead). All three can be thrown in one round (30 yds. range). Magic expires in 30 min. M: holy symbol + 3 natural pebbles.',
    description:
      'By using this spell, the priest can temporarily enchant up to three small pebbles, no larger than sling bullets. The magical stones can then be hurled or slung at an opponent. If hurled, they can be thrown up to 30 yards, and all three can be thrown in one round. The character using them must roll normally to hit, although the magic of the stones enables any character to be proficient with them. The stones are considered +1 weapons for determining if a creature can be struck (those struck only by magical weapons, for instance), although they do not have an attack or damage bonus. Each stone that hits inflicts 1d4 points of damage (2d4 points against undead). The magic in each stone lasts only for half an hour, or until used. The material components are the priest\'s holy symbol and three small pebbles, unworked by tools or magic of any type.',
    spellClass: 'priest',
  },
  {
    id: 'orison',
    name: 'Orison',
    school: 'Various',
    sphere: 'All',
    level: 1,
    range: '10 yards',
    components: 'V, S',
    duration: 'Special (1 round/level)',
    castingTime: '4',
    areaOfEffect: 'Varies',
    savingThrow: 'None',
    summary:
      'Minor prayer: one spell slot grants 3 + 1/level orisons (max 9). Each orison produces a small, single-target effect for up to 1 round/level. Examples: heal 1 hp, +1 to next attack, +1 save vs. magic/poison, calm fear, etc.',
    description:
      'The most humble of priestly spells is the orison, a brief prayer or invocation of a minor nature. Typically, priests learn a number of orisons as acolytes or students in order to hone their spellcasting skills and emphasize concepts, ideals, or phrases of particular importance to the faith. Because an orison is not even on par with other 1st-level magic, a priest memorizes a number of individual orisons equal to three +1 per level (up to a maximum of nine) when he devotes a 1st-level spell slot to orison. In other words, a 1st-level priest can memorize four orisons for one 1st-level spell slot, a 2nd-level priest can memorize five, and so on. Unlike cantrip, an orison must have a specific effect, although the priest need not decide which incantation he will use until he actually casts the spell. Regardless of the prayer chosen, the orison\'s duration is never more than one round per level.\n\nKnown orisons include the following: Alleviate: A single creature suffering from nausea or pain is relieved of its discomfort. Magically induced nausea or pain is only alleviated if the victim passes a saving throw vs. spell with a –2 penalty. Calm: A single creature that has been startled or frightened is soothed. Victims suffering from magical fear may attempt a save vs. spell with a –2 penalty to calm themselves. Clarity: For the duration of the orison, the priest\'s speech is clear and free of impediment. Courage: The priest gains a +1 bonus to his next attack roll, as long as the attack is made within the spell\'s duration. Guidance: The priest gains a +1 bonus to a Wisdom or Intelligence check to determine the right course of action in a moral dilemma or puzzle. Healing: By his touch, the priest may heal a creature of 1 point of damage. Magic sense: If there is a persistent spell effect or magical item within 10 yards, the priest feels a recognizable tingle. Memory: Any item the priest commits to memory during the spell duration is more completely and permanently learned; he gains a +2 bonus to any checks to recall the exact appearance, wording, or meaning of an item, text, or message. Resistance to magic: The caster gains a +1 bonus to his next saving throw against magic of any type. Resistance to poison: The priest gains a +1 bonus to his next saving throw vs. poison.\n\nOther orisons of similar power or scope may be permitted by the DM. Generally, an orison should not affect more than one creature or die roll at a time, and an orison that can actually cause immediate harm to a creature should inflict no more than 1 or 2 points of damage.',
    spellClass: 'priest',
  },
  {
    id: 'protection-from-evil',
    name: 'Protection from Evil',
    school: 'Abjuration',
    sphere: 'Protection',
    level: 1,
    range: 'Touch',
    components: 'V, S, M',
    duration: '3 rounds/level',
    castingTime: '4',
    areaOfEffect: '1 creature',
    savingThrow: 'None',
    summary:
      'Barrier 1 ft. around recipient: evil attackers suffer -2 to hit, recipient gains +2 saves; blocks mental control; prevents bodily contact by extraplanar/conjured creatures. Reversible: Protection from Good. M: holy water or burning incense.',
    description:
      'When this spell is cast, it creates a magical barrier around the recipient at a distance of 1 foot. The barrier moves with the recipient and has three major effects:\n\nFirst, all attacks made by evil or evilly enchanted creatures against the protected creature receive a penalty of -2 to each attack roll, and any saving throws caused by such attacks are made by the protected creature with a +2 bonus.\n\nSecond, any attempt to exercise mental control over the protected creature (if, for example, it has been charmed by a vampire) or to invade and take over its mind (as by a ghost\'s magic jar attack) is blocked by this spell. Note that the protection does not prevent a vampire\'s charm itself, nor end it, but it does prevent the vampire from exercising mental control through the barrier. Likewise, an outside life force is merely kept out, and would not be expelled if in place before the protection was cast.\n\nThird, the spell prevents bodily contact by creatures of an extraplanar or conjured nature (such as aerial servants, elementals, imps, invisible stalkers, salamanders, water weirds, xorn, and others). This causes the natural (body) weapon attacks of such creatures to fail and the creature to recoil if such attacks require touching the protected creature. Animals or monsters summoned or conjured by spells or similar magic are likewise hedged from the character. This protection ends if the protected character makes a melee attack against or tries to force the barrier against the blocked creature.\n\nTo complete this spell, the priest uses holy water or burning incense. This spell can be reversed to become protection from good, with the second and third benefits remaining unchanged. The material components for the reverse are a circle of unholy water or smoldering dung.',
    spellClass: 'priest',
  },
  {
    id: 'purify-food-drink',
    name: 'Purify Food & Drink',
    school: 'Alteration',
    sphere: 'All',
    level: 1,
    range: '30 yards',
    components: 'V, S',
    duration: 'Permanent',
    castingTime: '1 round',
    areaOfEffect: '1 cu. ft./level in 10 sq. ft.',
    savingThrow: 'None',
    summary:
      'Makes spoiled, rotten, poisoned, or contaminated food/water safe to consume (1 cu. ft./level). Spoils unholy water. No effect on creatures or potions. Reversible: Putrefy Food & Drink.',
    description:
      'When cast, this spell makes spoiled, rotten, poisonous, or otherwise contaminated food and water pure and suitable for eating and drinking. Up to 1 cubic foot of food and drink per level can be thus made suitable for consumption. This spell does not prevent subsequent natural decay or spoilage. Unholy water and similar food and drink of significance is spoiled by purify food and drink, but the spell has no effect on creatures of any type nor upon magical potions.\n\nThe reverse of the spell is putrefy food and drink. This spoils even holy water; however, it likewise has no effect upon creatures or potions.',
    spellClass: 'priest',
  },
  {
    id: 'remove-fear',
    name: 'Remove Fear',
    school: 'Abjuration',
    sphere: 'Charm',
    level: 1,
    range: '10 yards',
    components: 'V, S',
    duration: 'Special (1 turn for save bonus)',
    castingTime: '1',
    areaOfEffect: '1 creature per 4 levels',
    savingThrow: 'Special',
    summary:
      '+4 to saves vs. magical fear for 1 turn; if recipient recently failed such a save, immediately grants a new save at +4. 1 creature per 4 caster levels. Reversible: Cause Fear (flee max speed 1d4 rounds, save negates). No effect on undead.',
    description:
      'The priest casting this spell instills courage in the spell recipient, raising the creature\'s saving throw rolls against magical fear attacks by +4 for one turn. If the recipient has recently (that day) failed a saving throw against such an attack, the spell immediately grants another saving throw, with a +4 bonus to the die roll. For every four levels of the caster, one creature can be affected by the spell (one creature at levels 1 through 4, two creatures at levels 5 through 8, etc.).\n\nThe reverse of the spell, cause fear, causes one creature to flee in panic at maximum movement speed away from the caster for 1d4 rounds. A successful saving throw against the reversed effect negates it, and any Wisdom adjustment also applies. Of course, cause fear can be automatically countered by remove fear and vice versa. Neither spell has any effect on undead of any sort.',
    spellClass: 'priest',
  },
  {
    id: 'sanctuary',
    name: 'Sanctuary',
    school: 'Abjuration',
    sphere: 'Protection',
    level: 1,
    range: 'Touch',
    components: 'V, S, M',
    duration: '2 rounds + 1 round/level',
    castingTime: '4',
    areaOfEffect: '1 creature',
    savingThrow: 'None',
    summary:
      'Opponents must save vs. spell to attack protected creature; failure means they ignore it entirely. Protected creature cannot attack offensively or the spell ends. Area spells (fireball, etc.) still affect subject. M: holy symbol + small silver mirror.',
    description:
      'When the priest casts a sanctuary spell, any opponent attempting to strike or otherwise directly attack the protected creature must roll a saving throw vs. spell. If the saving throw is successful, the opponent can attack normally and is unaffected by that casting of the spell. If the saving throw is failed, the opponent loses track of and totally ignores the warded creature for the duration of the spell. Those not attempting to attack the subject remain unaffected. Note that this spell does not prevent the operation of area attacks (fireball, ice storm, etc.).\n\nWhile protected by this spell, the subject cannot take direct offensive action without breaking the spell, but may use nonattack spells or otherwise act in any way that does not violate the prohibition against offensive action. This allows a warded priest to heal wounds, for example, or to bless, perform an augury, chant, cast a light in the area (but not upon an opponent), and so on.\n\nThe components of the spell include the priest\'s holy symbol and a small silver mirror.',
    spellClass: 'priest',
  },
  {
    id: 'strength-of-stone',
    name: 'Strength of Stone',
    school: 'Invocation/Evocation',
    sphere: 'Combat',
    level: 1,
    range: 'Touch',
    components: 'V, S, M',
    duration: '3 rounds + 1 round/level',
    castingTime: '4',
    areaOfEffect: '1 creature',
    savingThrow: 'None',
    summary:
      'Raises recipient\'s Strength by 1d4 points (minimum 16). Both priest and recipient must be in contact with solid ground when cast; spell ends if recipient loses ground contact. M: chip of granite + a giant\'s hair.',
    description:
      'This spell grants supernatural strength to the recipient by raising his Strength score by 1d4 points or to a minimum of 16, whichever is higher. Each 10% of exceptional Strength counts as 1 point, so a character with a Strength of 17 could be raised as high as an 18/30, but no higher. Both the priest and the recipient must be in contact with solid stone or earth when the spell is cast—standing on the ground will do nicely, but flying or swimming will not.\n\nThe spell lasts for 3 rounds plus 1 round per caster level or until the subject loses contact with the earth. Obviously, this can happen in a number of ways, including being picked up or grappled by a larger creature, being knocked through the air by an impact or explosion, or even being magically moved in some fashion.\n\nThe material components are a chip of granite and a hair from a giant.',
    spellClass: 'priest',
  },
  {
    id: 'ring-of-hands',
    name: 'Ring of Hands',
    school: 'Abjuration',
    sphere: 'Protection',
    level: 1,
    range: '0',
    components: 'V, S',
    duration: '2d10 rounds',
    castingTime: '5',
    areaOfEffect: 'Special (circle of priests)',
    savingThrow: 'None',
    summary:
      'Cooperative spell (2–10 priests). Priests join hands forming a protective circle (~5 ft. circumference per priest). Acts as protection from evil: -1 to evil attackers per priest, +1 to saves per priest. Circle breaks if any priest moves or releases hands. Reversible: Ring of Woe (vs. good creatures).',
    description:
      'This is a cooperative magic spell. It requires a minimum of two priests and can accommodate a maximum of ten. Each priest must cast ring of hands on the same round. At the end of the casting, the priests involved join hands, thus completing the spell. If any priest breaks the circle, the spell immediately ceases. The priests may not move from their locations but are free to speak. They may not cast spells requiring a somatic or material component while the ring is formed.\n\nThe ring of hands forms a protective barrier around the priests and everything within their circle. For each priest, assume a five-foot circumference of the circle; thus, three priests would create a circle of 15-foot circumference. For easy calculation, assume that for each priest, the circle can accommodate four persons.\n\nThe barrier functions as a protection from evil spell. Attacks by evil creatures suffer a -1 penalty for every priest forming the circle. Saving throws made by the priests or anyone in the circle against attacks from such creatures receive a +1 bonus for every priest in the circle. Attempts at mental control over protected creatures are blocked. Extraplanar and conjured creatures are unable to touch the priests and those within the circle, although melee attacks against such creatures by those within the ring break the barrier.\n\nBecause the priests casting the spell cannot move and must hold hands, they do not receive any Dexterity bonuses to Armor Class. Furthermore, opponents gain a +2 bonus on attack rolls against the priests, since there is little they can do to avoid a blow. Creatures within the ring are free to act as they wish. Melee attacks by those within the ring are limited to piercing weapons and suffer a -1 penalty to attack rolls since the priests intervene.\n\nThe reverse of this spell, ring of woe, functions as detailed above except the effect applies to good creatures as would a protection from good spell.',
    spellClass: 'priest',
  },
  {
    id: 'sacred-guardian',
    name: 'Sacred Guardian',
    school: 'Divination',
    sphere: 'Divination',
    level: 1,
    range: 'Touch',
    components: 'V, S, M',
    duration: '1 day/level',
    castingTime: '1',
    areaOfEffect: 'Creature touched',
    savingThrow: 'None',
    summary:
      'Priest is instantly alerted when the touched recipient is in danger, regardless of distance or plane. At 3rd level+, priest also receives a mental image of the situation. Does not reveal location. M: a rose petal kissed by the recipient.',
    description:
      "By use of this spell, a priest becomes instantly aware when the recipient of the spell is in danger, regardless of the distance between the priest and the recipient. The recipient may be on a different plane of existence than the priest. When this spell is cast by a priest of at least 3rd level, he receives a mental image of the endangered person's situation. At no time, however, does the priest know the person's location through the use of this spell.\n\nThe material component is a rose petal that has been kissed by the spell recipient.",
    spellClass: 'priest',
  },
  {
    id: 'speak-with-astral-traveler',
    name: 'Speak with Astral Traveler',
    school: 'Divination',
    sphere: 'Astral',
    level: 1,
    range: 'Touch',
    components: 'V, S',
    duration: '1 round/level',
    castingTime: '1 round',
    areaOfEffect: '1 creature',
    savingThrow: 'None',
    summary:
      'Touch the comatose body of an astrally projected priest to establish mental two-way communication with the traveler for 1 round/level. Spell ends abruptly when duration expires.',
    description:
      'When a priest casts the 7th-level astral spell, he leaves his physical body in suspended animation while his astral body travels. By touching the comatose body and casting speak with astral traveler, a priest can mentally communicate with the projected individual. Although communication is mental, it takes the same amount of time as a normal, verbal dialogue. The spell ends abruptly when its duration expires.',
    spellClass: 'priest',
  },
];

/** Look up a single spell by its id */
export function getSpellById(id: string): SpellData | undefined {
  return SPELLS.find(s => s.id === id);
}

/** Look up a single spell by its name (case-insensitive) */
export function getSpellByName(name: string): SpellData | undefined {
  return SPELLS.find(s => s.name.toLowerCase() === name.toLowerCase());
}
