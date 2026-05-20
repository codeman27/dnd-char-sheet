import { useState, useMemo } from 'react';
import { SPELLS } from '@/lib/spellData';
import type { SpellData } from '@/lib/spellData';

interface Props {
  knownSpellIds: string[];
  onAdd: (spellId: string) => void;
  onClose: () => void;
}

const SCHOOL_COLORS: Record<string, string> = {
  Abjuration:    '#4a6fa5',
  Alteration:    '#5a8a5a',
  Conjuration:   '#8a5a8a',
  Divination:    '#5a7a8a',
  Enchantment:   '#c9a227',
  Evocation:     '#b54a4a',
  Illusion:      '#6a5a8a',
  Invocation:    '#b54a4a',
  Necromancy:    '#5a5a5a',
};

function schoolColor(school: string): string {
  const key = Object.keys(SCHOOL_COLORS).find(k => school.startsWith(k));
  return key ? SCHOOL_COLORS[key] : '#8a9ab8';
}

function SchoolBadge({ school }: { school: string }) {
  const color = schoolColor(school);
  return (
    <span
      className="font-cinzel text-[8px] uppercase tracking-wide px-1.5 py-0.5 rounded-sm shrink-0"
      style={{ background: color + '33', color, border: `1px solid ${color}66` }}
    >
      {school}
    </span>
  );
}

function SpellRow({ spell, isKnown, onAdd }: { spell: SpellData; isKnown: boolean; onAdd: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b last:border-b-0"
      style={{ borderColor: 'var(--adnd-gold-dim)' }}
    >
      {/* Header row */}
      <div
        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none hover:bg-white/5 transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        <span
          className="text-[10px] shrink-0 transition-transform duration-200"
          style={{ color: 'var(--adnd-gold-dim)', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >▶</span>

        <span
          className="font-cinzel text-sm font-semibold flex-1 min-w-0 truncate"
          style={{ color: 'var(--adnd-gold-light)' }}
        >
          {spell.name}
        </span>

        <SchoolBadge school={spell.school} />

        <span
          className="font-cinzel text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded-sm shrink-0"
          style={{ background: 'rgba(201,162,39,0.15)', color: 'var(--adnd-gold)', border: '1px solid var(--adnd-gold-dim)' }}
        >
          Lvl {spell.level}
        </span>

        <button
          className="font-cinzel text-[10px] uppercase tracking-wide px-2.5 py-1 rounded border transition-all shrink-0"
          style={
            isKnown
              ? { background: '#1a3a1a', color: '#5a9a5a', border: '1px solid #2a5a2a', cursor: 'default' }
              : { background: 'var(--adnd-dark3)', color: 'var(--adnd-gold-light)', border: '1px solid var(--adnd-gold-dim)' }
          }
          onClick={e => {
            e.stopPropagation();
            if (!isKnown) onAdd();
          }}
          disabled={isKnown}
        >
          {isKnown ? 'Added ✓' : 'Add'}
        </button>
      </div>

      {/* Expanded details */}
      {open && (
        <div
          className="px-4 pb-4 text-[11px] space-y-3"
          style={{ color: '#c8cfe8', background: 'rgba(0,0,0,0.25)' }}
        >
          {/* Summary */}
          <p className="font-handwriting text-[12px] leading-relaxed" style={{ color: 'var(--adnd-gold-light)' }}>
            {spell.summary}
          </p>

          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {[
              ['Sphere', spell.sphere],
              ['Range', spell.range],
              ['Duration', spell.duration],
              ['Casting Time', spell.castingTime],
              ['Area of Effect', spell.areaOfEffect],
              ['Components', spell.components],
              ['Saving Throw', spell.savingThrow],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className="flex gap-1.5">
                <span className="font-cinzel text-[9px] uppercase tracking-wide shrink-0" style={{ color: 'var(--adnd-gold-dim)' }}>
                  {label}:
                </span>
                <span className="font-handwriting">{value}</span>
              </div>
            ))}
          </div>

          {/* Full description */}
          <p className="font-handwriting text-[11px] leading-relaxed border-t pt-2" style={{ borderColor: 'var(--adnd-gold-dim)', color: '#a8b4cc' }}>
            {spell.description}
          </p>
        </div>
      )}
    </div>
  );
}

export function SpellBook({ knownSpellIds, onAdd, onClose }: Props) {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<number | null>(null);

  const levels = useMemo(() => {
    const set = new Set(SPELLS.map(s => s.level));
    return Array.from(set).sort((a, b) => a - b);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return SPELLS.filter(s => {
      if (levelFilter !== null && s.level !== levelFilter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.school.toLowerCase().includes(q) ||
        (s.sphere ?? '').toLowerCase().includes(q) ||
        s.summary.toLowerCase().includes(q)
      );
    });
  }, [search, levelFilter]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(5,7,18,0.92)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div
        className="flex flex-col w-full h-full max-w-2xl mx-auto"
        style={{ background: 'var(--adnd-dark)', borderLeft: '1px solid var(--adnd-gold-dim)', borderRight: '1px solid var(--adnd-gold-dim)' }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ borderBottom: '2px solid var(--adnd-gold-dim)', background: 'var(--adnd-dark2)' }}
        >
          <span className="text-lg">📖</span>
          <h2 className="font-cinzel text-base font-bold flex-1" style={{ color: 'var(--adnd-gold-light)', letterSpacing: '1px' }}>
            Spell Book
          </h2>
          <button
            className="font-cinzel text-xs uppercase tracking-wide px-3 py-1.5 rounded border transition-colors hover:bg-white/10"
            style={{ color: 'var(--adnd-gold-light)', border: '1px solid var(--adnd-gold-dim)' }}
            onClick={onClose}
          >
            ✕ Close
          </button>
        </div>

        {/* Search + level filter */}
        <div
          className="flex flex-col gap-2 px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid var(--adnd-gold-dim)', background: 'var(--adnd-dark2)' }}
        >
          <input
            type="text"
            placeholder="Search spells…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded px-3 py-2 text-sm outline-none font-handwriting"
            style={{
              background: 'var(--adnd-dark)',
              border: '1px solid var(--adnd-gold-dim)',
              color: 'var(--adnd-gold-light)',
            }}
            autoFocus
          />

          {/* Level pills */}
          <div className="flex gap-1.5 flex-wrap">
            <button
              className="font-cinzel text-[9px] uppercase tracking-wide px-2 py-1 rounded-full border transition-colors"
              style={
                levelFilter === null
                  ? { background: 'var(--adnd-gold)', color: '#1a1d2e', border: '1px solid var(--adnd-gold)' }
                  : { background: 'transparent', color: 'var(--adnd-gold-dim)', border: '1px solid var(--adnd-gold-dim)' }
              }
              onClick={() => setLevelFilter(null)}
            >
              All
            </button>
            {levels.map(lvl => (
              <button
                key={lvl}
                className="font-cinzel text-[9px] uppercase tracking-wide px-2 py-1 rounded-full border transition-colors"
                style={
                  levelFilter === lvl
                    ? { background: 'var(--adnd-gold)', color: '#1a1d2e', border: '1px solid var(--adnd-gold)' }
                    : { background: 'transparent', color: 'var(--adnd-gold-dim)', border: '1px solid var(--adnd-gold-dim)' }
                }
                onClick={() => setLevelFilter(lvl)}
              >
                Lvl {lvl}
              </button>
            ))}
          </div>

          <p className="font-handwriting text-[10px]" style={{ color: 'var(--adnd-gold-dim)' }}>
            {filtered.length} spell{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Spell list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 py-12">
              <span className="text-3xl">🔍</span>
              <p className="font-cinzel text-xs uppercase tracking-wide" style={{ color: 'var(--adnd-gold-dim)' }}>
                No spells match your search
              </p>
            </div>
          ) : (
            filtered.map(spell => (
              <SpellRow
                key={spell.id}
                spell={spell}
                isKnown={knownSpellIds.includes(spell.id)}
                onAdd={() => onAdd(spell.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
