import { SheetCard, Field } from './SheetCard';
import type { CharacterData, WeaponEntry } from '@/hooks/useCharacterSheet';

interface Props {
  char: CharacterData;
  update: (patch: Partial<CharacterData>) => void;
  updateWeapon: (index: number, patch: Partial<WeaponEntry>) => void;
}

const ST_LABELS = [
  'Paralyzation / Poison',
  'Rod, Staff, or Wand',
  'Petrification / Polymorph',
  'Breath Weapon',
  'Spells',
];

export function CombatTab({ char, update, updateWeapon }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* HP & Spell Points */}
      <SheetCard title="Hit Points & Spell Points">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-cinzel text-[9px] tracking-widest uppercase text-[#6b6555] mb-1">Hit Points</p>
            <input
              className="sheet-input text-3xl text-center font-bold"
              style={{ fontSize: '32px' }}
              value={char.hp}
              onChange={e => update({ hp: e.target.value })}
              placeholder="0"
            />
          </div>
          <Field label="Wounds">
            <textarea
              className="sheet-textarea"
              style={{ height: '60px' }}
              value={char.wounds}
              onChange={e => update({ wounds: e.target.value })}
            />
          </Field>
          <div className="border-t border-[#d8d0bb] pt-3">
            <p className="font-cinzel text-[9px] tracking-widest uppercase text-[#6b6555] mb-1">Spell Points</p>
            <input
              className="sheet-input text-3xl text-center font-bold"
              style={{ fontSize: '32px' }}
              value={char.spellPoints}
              onChange={e => update({ spellPoints: e.target.value })}
              placeholder="0"
            />
          </div>
          <div className="border-t border-[#d8d0bb] pt-3">
            <Field label="Active Spells">
              <textarea
                className="sheet-textarea"
                style={{ height: '60px' }}
                value={char.activeSpells}
                onChange={e => update({ activeSpells: e.target.value })}
              />
            </Field>
          </div>
        </div>
      </SheetCard>

      {/* Saving Throws */}
      <SheetCard title="Saving Throws" hint="Roll over – smaller is better">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="font-cinzel text-[9px] uppercase tracking-wide text-[#6b6555] pb-1 text-center w-12">Mod</th>
                <th className="font-cinzel text-[9px] uppercase tracking-wide text-[#6b6555] pb-1 text-left pl-2">Save</th>
                <th className="font-cinzel text-[9px] uppercase tracking-wide text-[#6b6555] pb-1 text-center w-12">Roll</th>
              </tr>
            </thead>
            <tbody>
              {ST_LABELS.map((label, i) => (
                <tr key={i} className="border-b border-[#ede8d8]">
                  <td className="py-1.5 text-center">
                    <input
                      className="sheet-input text-center text-base w-10"
                      value={char.stMod[i]}
                      onChange={e => {
                        const arr = [...char.stMod];
                        arr[i] = e.target.value;
                        update({ stMod: arr });
                      }}
                    />
                  </td>
                  <td className="py-1.5 pl-2 text-[13px] font-handwriting">{label}</td>
                  <td className="py-1.5 text-center">
                    <input
                      className="sheet-input text-center text-base w-10"
                      value={char.stSave[i]}
                      onChange={e => {
                        const arr = [...char.stSave];
                        arr[i] = e.target.value;
                        update({ stSave: arr });
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SheetCard>

      {/* Armor Class */}
      <SheetCard title="Armor Class" hint="Smaller is better – starts from 10">
        <div className="flex gap-4">
          {/* Shield */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <span className="font-cinzel text-[9px] tracking-widest uppercase text-[#6b6555]">AC</span>
            <div className="shield-wrap">
              <input
                className="absolute text-center font-bold text-[22px] bg-transparent border-none outline-none w-10 pt-1"
                style={{ color: char.pencilColour || '#1a1d2e' }}
                value={char.acBase}
                onChange={e => update({ acBase: e.target.value })}
              />
            </div>
          </div>
          {/* AC fields */}
          <div className="flex-1 min-w-0">
            <table className="w-full border-collapse text-xs">
              <tbody>
                {[
                  { label: 'Surprised', val: char.acSurprised, key: 'acSurprised' as const, armor: char.acSurprisedArmor, armorKey: 'acSurprisedArmor' as const },
                  { label: 'Shieldless', val: char.acShieldless, key: 'acShieldless' as const, armor: char.acShieldlessArmor, armorKey: 'acShieldlessArmor' as const },
                  { label: 'Rear', val: char.acRear, key: 'acRear' as const, armor: char.acRearArmor, armorKey: 'acRearArmor' as const },
                ].map(row => (
                  <tr key={row.key} className="border-b border-[#ede8d8]">
                    <td className="py-1 w-20">
                      <div className="flex items-center gap-1">
                        <span className="font-cinzel text-[9px] uppercase tracking-wide text-[#6b6555] whitespace-nowrap">{row.label}</span>
                        <input className="sheet-input text-sm w-12" value={row.val} onChange={e => update({ [row.key]: e.target.value })} />
                      </div>
                    </td>
                    <td className="py-1 pl-1">
                      <input className="sheet-input text-sm" value={row.armor} onChange={e => update({ [row.armorKey]: e.target.value })} placeholder="Armor type…" />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={2} className="py-1">
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel text-[9px] uppercase tracking-wide text-[#6b6555] whitespace-nowrap shrink-0">Defenses</span>
                      <input className="sheet-input text-sm" value={char.acDefenses} onChange={e => update({ acDefenses: e.target.value })} />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </SheetCard>

      {/* Weapons */}
      <SheetCard title="Weapons" hint="THAC0 − roll = AC hit" noPad>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs" style={{ minWidth: '560px' }}>
            <thead>
              <tr className="bg-[#f8f5ef]">
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-left border-b-2 border-[#d8d0bb] min-w-[100px]">Weapon</th>
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b-2 border-[#d8d0bb] w-8">#AT</th>
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b-2 border-[#d8d0bb] w-16">Atk/Dmg</th>
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b-2 border-[#d8d0bb] w-12">THAC0</th>
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b-2 border-[#d8d0bb] w-16">Dmg S/L</th>
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b-2 border-[#d8d0bb] w-12">Range</th>
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b-2 border-[#d8d0bb] w-8">Sz</th>
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b-2 border-[#d8d0bb] w-8">Tp</th>
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b-2 border-[#d8d0bb] w-8">Spd</th>
              </tr>
            </thead>
            <tbody>
              {char.weapons.map((w, i) => (
                <tr key={i} className="border-b border-[#ede8d8]">
                  <td className="p-1"><input className="sheet-input text-xs" value={w.name} onChange={e => updateWeapon(i, { name: e.target.value })} /></td>
                  <td className="p-1"><input className="sheet-input text-xs text-center" value={w.attacks} onChange={e => updateWeapon(i, { attacks: e.target.value })} /></td>
                  <td className="p-1">
                    <div className="flex gap-0.5 items-center">
                      <input className="sheet-input text-xs text-center w-7" value={w.atkAdj} onChange={e => updateWeapon(i, { atkAdj: e.target.value })} />
                      <span className="text-[#6b6555]">/</span>
                      <input className="sheet-input text-xs text-center w-7" value={w.dmgAdj} onChange={e => updateWeapon(i, { dmgAdj: e.target.value })} />
                    </div>
                  </td>
                  <td className="p-1"><input className="sheet-input text-xs text-center" value={w.thac0} onChange={e => updateWeapon(i, { thac0: e.target.value })} /></td>
                  <td className="p-1">
                    <div className="flex gap-0.5 items-center">
                      <input className="sheet-input text-xs text-center w-7" value={w.dmgSm} onChange={e => updateWeapon(i, { dmgSm: e.target.value })} />
                      <span className="text-[#6b6555]">/</span>
                      <input className="sheet-input text-xs text-center w-7" value={w.dmgLg} onChange={e => updateWeapon(i, { dmgLg: e.target.value })} />
                    </div>
                  </td>
                  <td className="p-1"><input className="sheet-input text-xs text-center" value={w.range} onChange={e => updateWeapon(i, { range: e.target.value })} /></td>
                  <td className="p-1"><input className="sheet-input text-xs text-center" value={w.size} onChange={e => updateWeapon(i, { size: e.target.value })} /></td>
                  <td className="p-1"><input className="sheet-input text-xs text-center" value={w.type} onChange={e => updateWeapon(i, { type: e.target.value })} /></td>
                  <td className="p-1"><input className="sheet-input text-xs text-center" value={w.speed} onChange={e => updateWeapon(i, { speed: e.target.value })} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SheetCard>
    </div>
  );
}
