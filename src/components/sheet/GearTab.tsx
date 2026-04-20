import { SheetCard } from './SheetCard';
import type { CharacterData, PotionEntry, GearEntry } from '@/hooks/useCharacterSheet';

interface Props {
  char: CharacterData;
  update: (patch: Partial<CharacterData>) => void;
  updatePotion: (index: number, patch: Partial<PotionEntry>) => void;
  updateGear: (index: number, patch: Partial<GearEntry>) => void;
  setMovementFromBase: (base: string) => void;
  gearTotalWeight: number;
}

const MOVEMENT_ROWS = [
  { label: 'Light', enc: 'movementLight' as const },
  { label: 'Mod', enc: 'movementMod' as const },
  { label: 'Hvy', enc: 'movementHvy' as const },
  { label: 'Svr', enc: 'movementSvr' as const },
  { label: 'Jog', enc: null, multiplier: 'X2' },
  { label: 'Run', enc: null, multiplier: 'X3' },
  { label: 'Run', enc: null, multiplier: 'X4' },
  { label: 'Run', enc: null, multiplier: 'X5' },
];

const MOVEMENT_RESULT_KEYS = [
  'movementLight', 'movementMod', 'movementHvy', 'movementSvr',
  'movementJog', 'movementRun3', 'movementRun4', 'movementRun5',
] as const;

export function GearTab({ char, update, updatePotion, updateGear, setMovementFromBase, gearTotalWeight }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Movement + Potions side by side on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SheetCard title="Movement Rates">
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr className="border-b border-[#ede8d8]">
                <td colSpan={2} className="py-1 font-cinzel text-[9px] uppercase tracking-wide text-[#6b6555]">Base Rate</td>
                <td className="py-1">
                  <input
                    className="sheet-input text-center text-lg font-bold w-16"
                    value={char.baseMovement}
                    onChange={e => setMovementFromBase(e.target.value)}
                  />
                </td>
              </tr>
              {MOVEMENT_ROWS.map((row, i) => (
                <tr key={i} className="border-b border-[#ede8d8]">
                  <td className="py-1 font-cinzel text-[9px] uppercase tracking-wide text-[#6b6555] w-10">{row.label}</td>
                  <td className="py-1 w-14 text-center">
                    {row.enc ? (
                      <input className="sheet-input text-center text-xs w-12" value={char[row.enc]} onChange={e => update({ [row.enc as string]: e.target.value })} />
                    ) : (
                      <span className="font-cinzel text-[10px] text-[#6b6555]">({row.multiplier})</span>
                    )}
                  </td>
                  <td className="py-1">
                    <input
                      className="sheet-input text-center text-sm"
                      value={char[MOVEMENT_RESULT_KEYS[i]]}
                      onChange={e => update({ [MOVEMENT_RESULT_KEYS[i]]: e.target.value })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SheetCard>

        <SheetCard title="Healing Potions" noPad>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '32%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '16%' }} />
                <col style={{ width: '34%' }} />
              </colgroup>
              <thead>
                <tr className="bg-[#f8f5ef]">
                  <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-left border-b-2 border-[#d8d0bb]">Name</th>
                  <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b-2 border-[#d8d0bb]">Cnt</th>
                  <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b-2 border-[#d8d0bb]">Roll</th>
                  <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b-2 border-[#d8d0bb]">Uses</th>
                  <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-left border-b-2 border-[#d8d0bb]">Notes</th>
                </tr>
              </thead>
              <tbody>
                {char.potions.map((p, i) => (
                  <tr key={i} className="border-b border-[#ede8d8]">
                    <td className="p-1"><input className="sheet-input text-xs" value={p.name} onChange={e => updatePotion(i, { name: e.target.value })} /></td>
                    <td className="p-1 text-center"><input className="sheet-input text-xs text-center" value={p.count} onChange={e => updatePotion(i, { count: e.target.value })} /></td>
                    <td className="p-1 text-center"><input className="sheet-input text-xs text-center" value={p.roll} onChange={e => updatePotion(i, { roll: e.target.value })} /></td>
                    <td className="p-1">
                      <div className="flex items-center justify-center gap-0.5">
                        <input className="sheet-input text-xs text-right w-7" value={p.useCur} onChange={e => updatePotion(i, { useCur: e.target.value })} />
                        <span className="text-[#6b6555] text-sm leading-none">/</span>
                        <input className="sheet-input text-xs text-left w-7" value={p.useMax} onChange={e => updatePotion(i, { useMax: e.target.value })} />
                      </div>
                    </td>
                    <td className="p-1"><input className="sheet-input text-xs" value={p.notes} onChange={e => updatePotion(i, { notes: e.target.value })} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SheetCard>
      </div>

      {/* Equipment */}
      <SheetCard title="Equipment" noPad>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '50%' }} />
              <col style={{ width: '30%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <thead>
              <tr className="bg-[#f8f5ef]">
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-left border-b-2 border-[#d8d0bb]">Item</th>
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-left border-b-2 border-[#d8d0bb]">Location</th>
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-right border-b-2 border-[#d8d0bb]">Weight</th>
              </tr>
            </thead>
            <tbody>
              {char.gear.map((g, i) => (
                <tr key={i} className="border-b border-[#ede8d8]">
                  <td className="p-1"><input className="sheet-input text-sm" value={g.item} onChange={e => updateGear(i, { item: e.target.value })} /></td>
                  <td className="p-1"><input className="sheet-input text-sm" value={g.location} onChange={e => updateGear(i, { location: e.target.value })} /></td>
                  <td className="p-1"><input className="sheet-input text-sm text-right" value={g.weight} onChange={e => updateGear(i, { weight: e.target.value })} /></td>
                </tr>
              ))}
              <tr className="bg-[#f8f5ef] border-t-2 border-[#d8d0bb]">
                <td colSpan={2} className="font-cinzel text-[10px] uppercase tracking-wide font-semibold text-[#6b6555] p-1.5">Total Weight</td>
                <td className="p-1.5 text-right font-handwriting text-sm font-semibold text-[#1a1d2e]">
                  {gearTotalWeight > 0 ? gearTotalWeight.toFixed(1) : ''}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </SheetCard>
    </div>
  );
}
