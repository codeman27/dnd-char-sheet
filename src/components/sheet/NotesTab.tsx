import { SheetCard } from './SheetCard';
import type { CharacterData, ProficiencyEntry } from '@/hooks/useCharacterSheet';

interface Props {
  char: CharacterData;
  update: (patch: Partial<CharacterData>) => void;
  updateProficiency: (index: number, patch: Partial<ProficiencyEntry>) => void;
}

export function NotesTab({ char, update, updateProficiency }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Proficiencies */}
        <SheetCard title="Proficiencies" noPad>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-[#f8f5ef]">
                  <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-left border-b-2 border-[#d8d0bb]">Non-weapon Proficiencies</th>
                  <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-left border-b-2 border-[#d8d0bb]">Weapon Proficiencies</th>
                </tr>
              </thead>
              <tbody>
                {char.proficiencies.map((p, i) => (
                  <tr key={i} className="border-b border-[#ede8d8]">
                    <td className="p-1">
                      <div className="flex items-center gap-0.5">
                        <input
                          className="sheet-input text-xs flex-grow"
                          value={p.name}
                          onChange={e => updateProficiency(i, { name: e.target.value })}
                          placeholder="Proficiency…"
                        />
                        <span className="text-[#6b6555] text-[10px] shrink-0">(</span>
                        <input
                          className="sheet-input text-xs w-8 text-center"
                          value={p.stat}
                          onChange={e => updateProficiency(i, { stat: e.target.value })}
                          placeholder="Stat"
                        />
                        <span className="text-[#6b6555] text-[10px] shrink-0">/</span>
                        <input
                          className="sheet-input text-xs w-8 text-center"
                          value={p.adj}
                          onChange={e => updateProficiency(i, { adj: e.target.value })}
                          placeholder="Adj"
                        />
                        <span className="text-[#6b6555] text-[10px] shrink-0">)</span>
                      </div>
                    </td>
                    <td className="p-1">
                      <input
                        className="sheet-input text-xs"
                        value={p.weapon}
                        onChange={e => updateProficiency(i, { weapon: e.target.value })}
                        placeholder="Weapon…"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SheetCard>

        {/* Notes */}
        <SheetCard title="Notes">
          <textarea
            className="sheet-textarea w-full"
            style={{ height: '300px', fontSize: '14px' }}
            value={char.notes}
            onChange={e => update({ notes: e.target.value })}
            placeholder="Enter notes, backstory, quest hooks…"
          />
        </SheetCard>
      </div>

      {/* Footer credit */}
      <div className="text-center py-4">
        <a
          href="https://shakespeare.diy"
          target="_blank"
          rel="noopener noreferrer"
          className="font-cinzel text-[10px] uppercase tracking-widest text-[#7a6218] hover:text-[#c9a227] transition-colors"
        >
          Vibed with Shakespeare ✦
        </a>
      </div>
    </div>
  );
}
