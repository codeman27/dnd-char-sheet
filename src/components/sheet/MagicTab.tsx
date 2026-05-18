import { useState } from 'react';
import { BookOpen, Trash2, Plus } from 'lucide-react';
import { SheetCard } from './SheetCard';
import { SpellBook } from './SpellBook';
import { getSpellById } from '@/lib/spellData';
import type { SpellData } from '@/lib/spellData';

interface Props {
  knownSpellIds: string[];
  addKnownSpell: (id: string) => void;
  removeKnownSpell: (id: string) => void;
}

function schoolBadgeStyle(school: string): { background: string; color: string; border: string } {
  const map: Record<string, string> = {
    'Abjuration':            '#4a6fa5',
    'Alteration':            '#5a8a5a',
    'Conjuration/Summoning': '#8a5a8a',
    'Divination':            '#8a7a3a',
    'Enchantment/Charm':     '#a05050',
    'Evocation':             '#b06020',
    'Illusion/Phantasm':     '#607080',
    'Invocation':            '#7a3a3a',
    'Necromancy':            '#4a4a6a',
  };
  let color = '#5a5a5a';
  for (const [key, val] of Object.entries(map)) {
    if (school.startsWith(key)) { color = val; break; }
  }
  return { background: color + '33', color, border: `1px solid ${color}55` };
}

interface KnownSpellCardProps {
  spell: SpellData;
  onRemove: () => void;
}

function KnownSpellCard({ spell, onRemove }: KnownSpellCardProps) {
  const [open, setOpen] = useState(false);
  const badgeStyle = schoolBadgeStyle(spell.school);

  return (
    <div className="rounded-lg overflow-hidden mb-2" style={{ border: '1px solid #2a3048', background: '#181b2c' }}>
      <div
        className="flex items-start gap-2 px-3 py-2.5 cursor-pointer select-none hover:bg-[#1e2235] transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <span
          className="mt-0.5 shrink-0 text-[10px] transition-transform duration-150"
          style={{ color: '#7a8aaa', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >▶</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="font-cinzel text-[12px] font-semibold" style={{ color: '#e6c35a' }}>{spell.name}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-cinzel uppercase tracking-wide" style={badgeStyle}>
              {spell.school.split('/')[0]}
            </span>
            {spell.sphere && <span className="text-[9px]" style={{ color: '#7a8aaa' }}>{spell.sphere}</span>}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
            <StatPill label="Lvl" value={String(spell.level)} />
            <StatPill label="Cast" value={spell.castingTime} />
            <StatPill label="Range" value={spell.range} />
            <StatPill label="Save" value={spell.savingThrow} />
            <StatPill label="Dur" value={spell.duration} />
          </div>
          <p className="mt-1 text-[10px] leading-snug" style={{ color: '#a0b0c8' }}>{spell.summary}</p>
        </div>

        <button
          className="shrink-0 ml-1 mt-0.5 p-1 rounded hover:bg-[#3a1a1a] transition-colors"
          style={{ color: '#7a5050' }}
          onClick={e => { e.stopPropagation(); if (confirm(`Remove ${spell.name}?`)) onRemove(); }}
          title="Remove spell"
        ><Trash2 size={12} /></button>
      </div>

      {open && (
        <div className="px-4 pb-3 pt-1" style={{ background: '#141726', borderTop: '1px solid #2a3048' }}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2 text-[10px]" style={{ color: '#8090a8' }}>
            <div><span style={{ color: '#c9a227' }}>Components:</span> {spell.components}</div>
            <div><span style={{ color: '#c9a227' }}>Area:</span> {spell.areaOfEffect}</div>
            <div><span style={{ color: '#c9a227' }}>Duration:</span> {spell.duration}</div>
            <div><span style={{ color: '#c9a227' }}>Save:</span> {spell.savingThrow}</div>
          </div>
          <p className="text-[11px] leading-relaxed whitespace-pre-line" style={{ color: '#c0cfe0' }}>{spell.description}</p>
        </div>
      )}
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-[9px]" style={{ color: '#7a8aaa' }}>
      <span style={{ color: '#9aabbc' }}>{label}:</span> {value}
    </span>
  );
}

export function MagicTab({ knownSpellIds, addKnownSpell, removeKnownSpell }: Props) {
  const [spellBookOpen, setSpellBookOpen] = useState(false);

  const knownSpells = knownSpellIds
    .map(id => getSpellById(id))
    .filter((s): s is SpellData => s !== undefined);

  return (
    <>
      <div className="flex flex-col gap-4">
        <SheetCard
          title="Spell List"
          headerExtra={
            <button
              className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-cinzel uppercase tracking-wide border transition-all hover:brightness-110"
              style={{ background: 'var(--adnd-dark)', color: '#e6c35a', border: '1px solid var(--adnd-gold-dim)' }}
              onClick={() => setSpellBookOpen(true)}
            >
              <Plus size={10} />
              Add Spell
            </button>
          }
        >
          {knownSpells.length === 0 ? (
            <div
              className="flex flex-col items-center gap-3 py-10 text-center rounded-lg"
              style={{ border: '1px dashed #2a3048' }}
            >
              <BookOpen size={32} style={{ color: '#3a4060' }} />
              <div>
                <p className="font-cinzel text-[11px] uppercase tracking-wide" style={{ color: '#5a6a80' }}>
                  No spells memorized
                </p>
                <p className="text-[10px] mt-1" style={{ color: '#3a4a60' }}>
                  Open the Spell Book to add spells to your list.
                </p>
              </div>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[11px] font-cinzel uppercase tracking-wide border transition-all hover:brightness-110"
                style={{ background: 'var(--adnd-dark3)', color: '#e6c35a', border: '1px solid var(--adnd-gold-dim)' }}
                onClick={() => setSpellBookOpen(true)}
              >
                <BookOpen size={12} />
                Open Spell Book
              </button>
            </div>
          ) : (
            <div>
              {knownSpells.map(spell => (
                <KnownSpellCard
                  key={spell.id}
                  spell={spell}
                  onRemove={() => removeKnownSpell(spell.id)}
                />
              ))}
            </div>
          )}
        </SheetCard>
      </div>

      {spellBookOpen && (
        <SpellBook
          knownSpellIds={knownSpellIds}
          onAdd={addKnownSpell}
          onClose={() => setSpellBookOpen(false)}
        />
      )}
    </>
  );
}
