import { useState } from 'react';
import { SheetCard } from './SheetCard';
import type { CharacterData, SpellEntry } from '@/hooks/useCharacterSheet';

interface Props {
  char: CharacterData;
  updateSpell: (index: number, patch: Partial<SpellEntry>) => void;
}

export function MagicTab({ char, updateSpell }: Props) {
  const [editMode, setEditMode] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <SheetCard
        title="Spell List"
        headerExtra={
          <label className="flex items-center gap-2 ml-auto cursor-pointer select-none" onClick={() => setEditMode(v => !v)}>
            <span className="font-handwriting text-[11px] text-[#8a9ab8] normal-case tracking-normal">
              {editMode ? 'Edit Mode' : 'Play Mode'}
            </span>
            <div className="toggle-track">
              <div className="toggle-thumb" style={{ transform: editMode ? 'translateX(0)' : 'translateX(16px)', background: editMode ? '#8a9ab8' : '#e6c35a' }} />
            </div>
          </label>
        }
        noPad
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[11px]" style={{ minWidth: '440px', tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '24%' }} />
              <col style={{ width: '6%' }} />
              <col style={{ width: '6%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '5%' }} />
              <col style={{ width: '5%' }} />
            </colgroup>
            <thead>
              <tr className="bg-[#f8f5ef]">
                <th colSpan={7} className="font-cinzel text-[9px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b border-[#d8d0bb]">Spells</th>
              </tr>
              <tr className="bg-[#f8f5ef]">
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b border-[#d8d0bb]">Spell</th>
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b border-[#d8d0bb]">Lvl</th>
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b border-[#d8d0bb]">Sp.</th>
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b border-[#d8d0bb]">R</th>
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b border-[#d8d0bb]">V</th>
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b border-[#d8d0bb]">S</th>
                <th className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] p-1.5 text-center border-b border-[#d8d0bb]">M</th>
              </tr>
            </thead>
            <tbody>
              {char.spells.map((spell, i) => (
                <tr key={i} className={`border-b border-[#ede8d8] ${i % 2 === 1 ? 'bg-[#faf8f3]' : ''}`}>
                  <td className="p-0.5 align-middle">
                    {editMode ? (
                      <input
                        className="sheet-input text-[11px]"
                        value={spell.name}
                        onChange={e => updateSpell(i, { name: e.target.value })}
                      />
                    ) : (
                      <SpellNameCell spell={spell} index={i} updateSpell={updateSpell} />
                    )}
                  </td>
                  <td className="p-0.5 align-middle text-center">
                    <input
                      className="sheet-input text-[11px] text-center"
                      value={spell.level}
                      onChange={e => updateSpell(i, { level: e.target.value })}
                      disabled={!editMode}
                    />
                  </td>
                  <td className="p-0.5 align-middle text-center">
                    <input
                      className="sheet-input text-[11px] text-center"
                      value={spell.sp}
                      onChange={e => updateSpell(i, { sp: e.target.value })}
                      disabled={!editMode}
                    />
                  </td>
                  {(['r', 'v', 's', 'm'] as const).map(flag => (
                    <td key={flag} className="p-0.5 align-middle text-center">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          className="accent-[#c9a227] cursor-pointer w-4 h-4"
                          checked={spell[flag]}
                          onChange={e => updateSpell(i, { [flag]: e.target.checked })}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SheetCard>
    </div>
  );
}

interface SpellNameCellProps {
  spell: SpellEntry;
  index: number;
  updateSpell: (index: number, patch: Partial<SpellEntry>) => void;
}

function SpellNameCell({ spell, index, updateSpell }: SpellNameCellProps) {
  const [tokens, setTokens] = useState<string[]>([]);

  if (!spell.name) return <span className="text-[#6b6555] text-[10px]">–</span>;

  function addToken() {
    setTokens(prev => [...prev, '×']);
  }

  function removeToken(ti: number) {
    setTokens(prev => prev.filter((_, j) => j !== ti));
  }

  // In play mode with a name: show name + clickable tokens
  return (
    <div
      className="flex items-center gap-1 flex-wrap cursor-pointer"
      onClick={addToken}
      title="Click to memorize"
    >
      <span className="text-[11px] font-handwriting">{spell.name}</span>
      {tokens.map((_, ti) => (
        <span
          key={ti}
          className="text-xs text-red-500 cursor-pointer select-none"
          onClick={e => { e.stopPropagation(); removeToken(ti); }}
          title="Click to cast (remove)"
        >✕</span>
      ))}
    </div>
  );
}
