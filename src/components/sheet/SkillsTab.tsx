import { SheetCard } from './SheetCard';
import type { CharacterData, SpecialAbilityEntry } from '@/hooks/useCharacterSheet';

interface Props {
  char: CharacterData;
  update: (patch: Partial<CharacterData>) => void;
  updateSpecialAbility: (index: number, patch: Partial<SpecialAbilityEntry>) => void;
}

const THIEVING_LABELS = [
  'Pick Pockets', 'Open Locks', 'Find/Remove Traps',
  'Move Silently', 'Hide in Shadows', 'Detect Noise',
  'Climb Walls', 'Read Languages', 'Backstab',
];

const TURNING_LABELS = [
  'Skeleton\nor 1 HD', 'Zombie', 'Ghoul\nor 2 HD',
  'Shadow\nor 3–4 HD', 'Wight\nor 5 HD', 'Ghast',
  'Wraith\nor 6 HD', 'Mummy\nor 7 HD', 'Spectre\nor 8 HD',
  'Vampire\nor 9 HD', 'Ghost\nor 10 HD', 'Lich\nor 11+ HD',
  'Special',
];

const SPELL_LEVEL_LABELS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];

export function SkillsTab({ char, update, updateSpecialAbility }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Thieving Abilities */}
      <SheetCard title="Thieving Abilities" noPad>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center" style={{ minWidth: '360px' }}>
            <tbody>
              {/* Row 1: first 9 values */}
              <tr>
                {THIEVING_LABELS.map((_, i) => (
                  <td key={i} className="text-center px-1 py-1">
                    <input
                      className="sheet-input text-center text-sm"
                      value={char.thieving[i] ?? ''}
                      onChange={e => {
                        const arr = [...char.thieving];
                        arr[i] = e.target.value;
                        update({ thieving: arr });
                      }}
                    />
                  </td>
                ))}
              </tr>
              {/* Row 2: second 9 values */}
              <tr>
                {THIEVING_LABELS.map((_, i) => (
                  <td key={i} className="text-center px-1 py-1">
                    <input
                      className="sheet-input text-center text-sm"
                      value={char.thieving[i + 9] ?? ''}
                      onChange={e => {
                        const arr = [...char.thieving];
                        arr[i + 9] = e.target.value;
                        update({ thieving: arr });
                      }}
                    />
                  </td>
                ))}
              </tr>
              <tr className="border-t border-[#d8d0bb]">
                {THIEVING_LABELS.map((label, i) => (
                  <td key={i} className="font-cinzel text-[7.5px] uppercase tracking-wide text-[#6b6555] px-0.5 py-1 text-center leading-tight">
                    {label.split('/').map((part, j) => <span key={j}>{j > 0 && '/'}<br />{j > 0 ? part : part}</span>)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </SheetCard>

      {/* Turning Undead */}
      <SheetCard title="Turning Undead" hint="Roll over – smaller is better" noPad>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center" style={{ minWidth: '400px' }}>
            <tbody>
              <tr>
                {TURNING_LABELS.map((_, i) => (
                  <td key={i} className="text-center px-0.5 py-1">
                    <input
                      className="sheet-input text-center text-sm"
                      value={char.turning[i] ?? ''}
                      onChange={e => {
                        const arr = [...char.turning];
                        arr[i] = e.target.value;
                        update({ turning: arr });
                      }}
                    />
                  </td>
                ))}
              </tr>
              <tr className="border-t border-[#d8d0bb]">
                {TURNING_LABELS.map((label, i) => (
                  <td key={i} className="font-cinzel text-[7px] uppercase tracking-wide text-[#6b6555] px-0.5 py-1 text-center leading-tight whitespace-pre-line">
                    {label}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </SheetCard>

      {/* Spells per Level & Special Abilities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SheetCard title="Spells per Level" noPad>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-center">
              <tbody>
                <tr>
                  {SPELL_LEVEL_LABELS.map((_, i) => (
                    <td key={i} className="px-1 py-1.5">
                      <input
                        className="sheet-input text-center text-base"
                        style={{ fontSize: '16px' }}
                        value={char.spellsPerLevel[i] ?? ''}
                        onChange={e => {
                          const arr = [...char.spellsPerLevel];
                          arr[i] = e.target.value;
                          update({ spellsPerLevel: arr });
                        }}
                      />
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-[#d8d0bb]">
                  {SPELL_LEVEL_LABELS.map((label, i) => (
                    <td key={i} className="font-cinzel text-[8.5px] uppercase tracking-wide text-[#6b6555] px-1 py-1 text-center">{label}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </SheetCard>

        <SheetCard title="Special Abilities">
          <table className="w-full border-collapse">
            <tbody>
              {char.specialAbilities.map((ab, i) => (
                <tr key={i} className="border-b border-[#ede8d8]">
                  <td className="py-1 pr-1">
                    <input
                      className="sheet-input text-sm"
                      value={ab.col1}
                      onChange={e => updateSpecialAbility(i, { col1: e.target.value })}
                    />
                  </td>
                  <td className="py-1">
                    <input
                      className="sheet-input text-sm"
                      value={ab.col2}
                      onChange={e => updateSpecialAbility(i, { col2: e.target.value })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SheetCard>
      </div>
    </div>
  );
}
