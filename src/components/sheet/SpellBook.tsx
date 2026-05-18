import { useState, useMemo } from 'react';
import { X, BookOpen, Plus, Check, Search, Star } from 'lucide-react';
import { SPELLS } from '@/lib/spellData';
import type { SpellData } from '@/lib/spellData';

interface Props {
  knownSpellIds: string[];
  favoriteSpellIds: string[];
  onAdd: (spellId: string) => void;
  onToggleFavorite: (spellId: string) => void;
  onClose: () => void;
}

const LEVELS = [1, 2, 3, 4, 5, 6, 7] as const;

const SCHOOL_COLORS: Record<string, string> = {
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

function schoolColor(school: string): string {
  for (const [key, val] of Object.entries(SCHOOL_COLORS)) {
    if (school.startsWith(key)) return val;
  }
  return '#5a5a5a';
}

interface SpellRowProps {
  spell: SpellData;
  isKnown: boolean;
  isFavorite: boolean;
  onAdd: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

function SpellRow({ spell, isKnown, isFavorite, onAdd, onToggleFavorite }: SpellRowProps) {
  const [open, setOpen] = useState(false);
  const color = schoolColor(spell.school);

  return (
    <div
      className="border-b last:border-b-0"
      style={{ borderColor: '#2a3048' }}
    >
      {/* ── Header row ── */}
      <div
        className="flex items-start gap-2 px-3 py-2.5 cursor-pointer select-none hover:bg-[#1e2235] transition-colors"
        onClick={() => setOpen(v => !v)}
      >
        {/* Expand chevron */}
        <span
          className="mt-0.5 shrink-0 text-[10px] transition-transform duration-150"
          style={{ color: '#7a8aaa', transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▶
        </span>

        {/* Name + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-1.5">
            <span
              className="font-cinzel text-[12px] font-semibold"
              style={{ color: '#e6c35a' }}
            >
              {spell.name}
            </span>
            {/* School badge */}
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-cinzel uppercase tracking-wide"
              style={{ background: color + '33', color: color, border: `1px solid ${color}55` }}
            >
              {spell.school.split('/')[0]}
            </span>
            {spell.sphere && (
              <span className="text-[9px]" style={{ color: '#7a8aaa' }}>
                {spell.sphere}
              </span>
            )}
          </div>

          {/* Stat pills row */}
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
            <StatPill label="Cast" value={spell.castingTime} />
            <StatPill label="Range" value={spell.range} />
            <StatPill label="Save" value={spell.savingThrow} />
            <StatPill label="Dur" value={spell.duration} />
          </div>

          {/* Summary (always visible) */}
          <p className="mt-1 text-[10px] leading-snug" style={{ color: '#a0b0c8' }}>
            {spell.summary}
          </p>
        </div>

        {/* Add button — stop propagation so click doesn't toggle accordion */}
        <div className="shrink-0 ml-1 mt-0.5 flex items-center gap-1">
          {/* Favorite star */}
          <button
            className="p-1 rounded transition-colors"
            style={isFavorite
              ? { color: '#e6c35a' }
              : { color: '#3a4060' }
            }
            onClick={e => { e.stopPropagation(); onToggleFavorite(spell.id); }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star size={13} fill={isFavorite ? '#e6c35a' : 'none'} />
          </button>

          {/* Add button */}
          <button
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-cinzel uppercase tracking-wide border transition-all"
            style={isKnown
              ? { background: '#1a3a1a', color: '#6fc86f', border: '1px solid #2a5a2a', cursor: 'default' }
              : { background: '#1a2a1a', color: '#e6c35a', border: '1px solid var(--adnd-gold-dim)' }
            }
            disabled={isKnown}
            onClick={e => {
              e.stopPropagation();
              if (!isKnown) onAdd(spell.id);
            }}
            title={isKnown ? 'Already in spell list' : 'Add to spell list'}
          >
            {isKnown ? <Check size={10} /> : <Plus size={10} />}
            {isKnown ? 'Added' : 'Add'}
          </button>
        </div>
      </div>

      {/* ── Full description (accordion) ── */}
      {open && (
        <div className="px-4 pb-3 pt-1" style={{ background: '#141726' }}>
          <div
            className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2 text-[10px]"
            style={{ color: '#8090a8' }}
          >
            <div><span style={{ color: '#c9a227' }}>Components:</span> {spell.components}</div>
            <div><span style={{ color: '#c9a227' }}>Area of Effect:</span> {spell.areaOfEffect}</div>
            <div><span style={{ color: '#c9a227' }}>Duration:</span> {spell.duration}</div>
            <div><span style={{ color: '#c9a227' }}>Saving Throw:</span> {spell.savingThrow}</div>
          </div>
          <p
            className="text-[11px] leading-relaxed whitespace-pre-line"
            style={{ color: '#c0cfe0' }}
          >
            {spell.description}
          </p>
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

export function SpellBook({ knownSpellIds, favoriteSpellIds, onAdd, onToggleFavorite, onClose }: Props) {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<number | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SPELLS.filter(s => {
      if (showFavoritesOnly && !favoriteSpellIds.includes(s.id)) return false;
      if (levelFilter !== null && s.level !== levelFilter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.school.toLowerCase().includes(q) ||
        (s.sphere?.toLowerCase().includes(q) ?? false) ||
        s.summary.toLowerCase().includes(q)
      );
    });
  }, [search, levelFilter, showFavoritesOnly, favoriteSpellIds]);

  const availableLevels = useMemo(() =>
    [...new Set(SPELLS.map(s => s.level))].sort((a, b) => a - b),
    []
  );

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div
        className="relative flex flex-col w-full sm:max-w-xl sm:rounded-xl overflow-hidden"
        style={{
          background: 'var(--adnd-dark)',
          border: '2px solid var(--adnd-gold-dim)',
          maxHeight: '90dvh',
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center gap-2 px-4 py-3 shrink-0"
          style={{
            background: 'var(--adnd-dark3)',
            borderBottom: '1px solid var(--adnd-gold-dim)',
          }}
        >
          <BookOpen size={16} style={{ color: '#e6c35a' }} />
          <span className="font-cinzel text-sm tracking-wide" style={{ color: '#e6c35a' }}>
            Spell Book
          </span>
          <span className="text-[10px] ml-1" style={{ color: '#7a8aaa' }}>
            ({filtered.length} spell{filtered.length !== 1 ? 's' : ''})
          </span>
          <button
            className="ml-auto p-1 rounded hover:bg-[#3a4060] transition-colors"
            style={{ color: '#7a8aaa' }}
            onClick={onClose}
            aria-label="Close spell book"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Search + Level filters ── */}
        <div
          className="px-3 py-2 shrink-0 flex flex-col gap-2"
          style={{ background: 'var(--adnd-dark2)', borderBottom: '1px solid #2a3048' }}
        >
          {/* Search input */}
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#7a8aaa' }} />
            <input
              type="text"
              placeholder="Search spells…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 rounded text-[12px] outline-none"
              style={{
                background: '#1a1d2e',
                border: '1px solid #3a4060',
                color: '#c0cfe0',
              }}
            />
          </div>

          {/* Level filter pills */}
          <div className="flex gap-1.5 flex-wrap">
            {/* Favorites toggle */}
            <button
              onClick={() => setShowFavoritesOnly(v => !v)}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-cinzel border transition-colors"
              style={showFavoritesOnly
                ? { background: '#3a2a00', color: '#e6c35a', border: '1px solid var(--adnd-gold)' }
                : { background: 'transparent', color: '#8090a8', border: '1px solid #3a4060' }
              }
            >
              <Star size={9} fill={showFavoritesOnly ? '#e6c35a' : 'none'} />
              Favorites
              {favoriteSpellIds.length > 0 && (
                <span
                  className="ml-0.5 px-1 rounded-full text-[8px]"
                  style={{ background: showFavoritesOnly ? '#e6c35a33' : '#3a4060', color: showFavoritesOnly ? '#e6c35a' : '#7a8aaa' }}
                >
                  {favoriteSpellIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setLevelFilter(null)}
              className="px-2 py-0.5 rounded text-[10px] font-cinzel border transition-colors"
              style={levelFilter === null
                ? { background: 'var(--adnd-gold)', color: '#1a1d2e', border: '1px solid var(--adnd-gold)' }
                : { background: 'transparent', color: '#8090a8', border: '1px solid #3a4060' }
              }
            >
              All
            </button>
            {availableLevels.map(lvl => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(levelFilter === lvl ? null : lvl)}
                className="px-2 py-0.5 rounded text-[10px] font-cinzel border transition-colors"
                style={levelFilter === lvl
                  ? { background: 'var(--adnd-gold)', color: '#1a1d2e', border: '1px solid var(--adnd-gold)' }
                  : { background: 'transparent', color: '#8090a8', border: '1px solid #3a4060' }
                }
              >
                Lvl {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* ── Spell list ── */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <BookOpen size={32} style={{ color: '#3a4060' }} />
              <p className="text-[12px]" style={{ color: '#5a6a80' }}>No spells found</p>
            </div>
          ) : (
            filtered.map(spell => (
              <SpellRow
                key={spell.id}
                spell={spell}
                isKnown={knownSpellIds.includes(spell.id)}
                isFavorite={favoriteSpellIds.includes(spell.id)}
                onAdd={onAdd}
                onToggleFavorite={onToggleFavorite}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
