import { SheetCard } from './SheetCard';
import type { CharacterData } from '@/hooks/useCharacterSheet';

interface Props {
  char: CharacterData;
  update: (patch: Partial<CharacterData>) => void;
  autoFillAbility: (stat: string, value: string) => void;
}

interface AbilityRowProps {
  stat: string;
  label: string;
  modLabels: string[];
  score: string;
  mods: string[];
  onScoreChange: (v: string) => void;
  onModChange: (i: number, v: string) => void;
  pencilColour: string;
}

function AbilityRow({ stat, modLabels, score, mods, onScoreChange, onModChange, pencilColour }: AbilityRowProps) {
  return (
    <tr className="border-b border-[#ede8d8]">
      <td className="w-14 text-center align-middle border-r border-[#d8d0bb] px-1 py-1.5">
        <input
          className="text-center font-bold text-[22px] bg-transparent border-none border-b-2 border-[#7a6218] outline-none w-11"
          style={{ color: pencilColour || '#1a1d2e', fontFamily: 'Indie Flower, cursive' }}
          value={score}
          onChange={e => onScoreChange(e.target.value)}
        />
      </td>
      <td className="w-10 text-center align-middle font-cinzel font-semibold text-[11px] text-[#2f3550] px-1.5 py-1.5">{stat}</td>
      <td className="align-middle px-1 py-1.5">
        <table className="w-full border-collapse text-[11px]">
          <tbody>
            <tr>
              {modLabels.map((l, i) => (
                <td key={i} className="font-cinzel text-[8px] uppercase tracking-wide text-[#6b6555] px-1 pb-0.5 text-center">{l}</td>
              ))}
            </tr>
            <tr>
              {mods.map((v, i) => (
                <td key={i} className="px-1 text-center">
                  <input
                    className="sheet-input text-center text-xs w-full"
                    value={v}
                    onChange={e => onModChange(i, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  );
}

export function AbilitiesTab({ char, update, autoFillAbility }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <SheetCard title="Ability Scores" hint="Roll under for ability checks" noPad>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: '340px' }}>
            <tbody>
              <AbilityRow
                stat="STR" label="Strength"
                modLabels={['Hit prob', 'Dmg adj', 'Wt Allow', 'Max press', 'Open door', 'Bb/Lg']}
                score={char.strScore}
                mods={char.strMods.length === 6 ? char.strMods : Array(6).fill('')}
                onScoreChange={v => autoFillAbility('STR', v)}
                onModChange={(i, v) => {
                  const arr = [...char.strMods];
                  arr[i] = v;
                  update({ strMods: arr });
                }}
                pencilColour={char.pencilColour}
              />
              <AbilityRow
                stat="DEX" label="Dexterity"
                modLabels={['Rctn adj', 'Missile atk adj', 'Def adj']}
                score={char.dexScore}
                mods={char.dexMods.length === 3 ? char.dexMods : Array(3).fill('')}
                onScoreChange={v => autoFillAbility('DEX', v)}
                onModChange={(i, v) => {
                  const arr = [...char.dexMods];
                  arr[i] = v;
                  update({ dexMods: arr });
                }}
                pencilColour={char.pencilColour}
              />
              <AbilityRow
                stat="CON" label="Constitution"
                modLabels={['HP adj', 'Sys shock', 'Res sur', 'Pois save', 'Regen']}
                score={char.conScore}
                mods={char.conMods.length === 5 ? char.conMods : Array(5).fill('')}
                onScoreChange={v => autoFillAbility('CON', v)}
                onModChange={(i, v) => {
                  const arr = [...char.conMods];
                  arr[i] = v;
                  update({ conMods: arr });
                }}
                pencilColour={char.pencilColour}
              />
              <AbilityRow
                stat="INT" label="Intelligence"
                modLabels={['# Lang', 'Spell lvl', 'Lrn spell', 'Spells/lvl', 'Spell immun']}
                score={char.intScore}
                mods={char.intMods.length === 5 ? char.intMods : Array(5).fill('')}
                onScoreChange={v => autoFillAbility('INT', v)}
                onModChange={(i, v) => {
                  const arr = [...char.intMods];
                  arr[i] = v;
                  update({ intMods: arr });
                }}
                pencilColour={char.pencilColour}
              />
              <AbilityRow
                stat="WIS" label="Wisdom"
                modLabels={['Mag def adj', 'Bonus spells', 'Spell fail', 'Spell immun']}
                score={char.wisScore}
                mods={char.wisMods.length === 4 ? char.wisMods : Array(4).fill('')}
                onScoreChange={v => autoFillAbility('WIS', v)}
                onModChange={(i, v) => {
                  const arr = [...char.wisMods];
                  arr[i] = v;
                  update({ wisMods: arr });
                }}
                pencilColour={char.pencilColour}
              />
              <AbilityRow
                stat="CHA" label="Charisma"
                modLabels={['Max henchmen', 'Loyalty base', 'Rctn adj']}
                score={char.chaScore}
                mods={char.chaMods.length === 3 ? char.chaMods : Array(3).fill('')}
                onScoreChange={v => autoFillAbility('CHA', v)}
                onModChange={(i, v) => {
                  const arr = [...char.chaMods];
                  arr[i] = v;
                  update({ chaMods: arr });
                }}
                pencilColour={char.pencilColour}
              />
            </tbody>
          </table>
        </div>
      </SheetCard>
    </div>
  );
}
