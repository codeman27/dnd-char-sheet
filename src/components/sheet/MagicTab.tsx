import { useState, useMemo } from 'react';
import { SheetCard } from './SheetCard';
import { SpellBook } from './SpellBook';
import { getSpellById } from '@/lib/spellData';
import type { SpellData } from '@/lib/spellData';

interface Props {
  knownSpellIds: string[];
  favoriteSpellIds: string[];
  addKnownSpell: (id: string) => void;
  removeKnownSpell: (id: string) => void;
  toggleFavoriteSpell: (id: string) => void;
}

const SCHOOL_COLORS: Record<string, string> = {
  Abjuration:  '#4a6fa5',
  Alteration:  '#5a8a5a',
  Conjuration: '#8a5a8a',
  Divination:  '#5a7a8a',
  Enchantment: '#c9a227',
  Evocation:   '#b54a4a',
  Illusion:    '#6a5a8a',
  Invocation:  '#b54a4a',
  Necromancy:  '#5a5a5a',
};

function schoolBadgeStyle(school: string): React.CSSProperties {
  const key = Object.keys(SCHOOL_COLORS).find(k => school.startsWith(k));
  const color = key ? SCHOOL_COLORS[key] : '#8a9ab8';
  return { background: color + '33', color, border: `1px solid ${color}66` };
}

interface KnownSpellCardProps {
  spell: SpellData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRemove: () => void;
}

function KnownSpellCard({ spell, isFavorite, onToggleFavorite, onRemove }: KnownSpellCardProps) {
  const [open, setOpen] = useState(false);

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Remove "${spell.name}" from your spell list?`)) return;
    onRemove();
  }

  function handleStar(e: React.MouseEvent) {
    e.stopPropagation();
    onToggleFavorite();
  }

  return (
    <div
      className="rounded-lg overflow-hidden mb-2"
      style={{ background: 'var(--adnd-dark2)', border: '1px solid var(--adnd-gold-dim)' }}
    >
      {/* Header */}
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

        <span
          className="font-cinzel text-[8px] uppercase tracking-wide px-1.5 py-0.5 rounded-sm shrink-0"
          style={schoolBadgeStyle(spell.school)}
        >
          {spell.school}
        </span>

        <span
          className="font-cinzel text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded-sm shrink-0"
          style={{ background: 'rgba(201,162,39,0.15)', color: 'var(--adnd-gold)', border: '1px solid var(--adnd-gold-dim)' }}
        >
          Lvl {spell.level}
        </span>

        {/* Star / favorite button */}
        <button
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-white/10"
          title={isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
          onClick={handleStar}
          aria-label={isFavorite ? 'Unfavorite' : 'Favorite'}
        >
          <span className="text-base leading-none" style={{ color: isFavorite ? '#c9a227' : 'var(--adnd-gold-dim)' }}>
            {isFavorite ? '★' : '☆'}
          </span>
        </button>

        {/* Trash button */}
        <button
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded transition-colors hover:bg-red-900/40"
          title="Remove spell"
          onClick={handleRemove}
          aria-label="Remove spell"
        >
          <span className="text-sm" style={{ color: '#cc6666' }}>🗑</span>
        </button>
      </div>

      {/* Expanded details */}
      {open && (
        <div
          className="px-4 pb-4 text-[11px] space-y-3"
          style={{ color: '#c8cfe8', borderTop: '1px solid var(--adnd-gold-dim)' }}
        >
          <p className="font-handwriting text-[12px] leading-relaxed pt-3" style={{ color: 'var(--adnd-gold-light)' }}>
            {spell.summary}
          </p>

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

          <p className="font-handwriting text-[11px] leading-relaxed border-t pt-2" style={{ borderColor: 'var(--adnd-gold-dim)', color: '#a8b4cc' }}>
            {spell.description}
          </p>
        </div>
      )}
    </div>
  );
}

export function MagicTab({ knownSpellIds, favoriteSpellIds, addKnownSpell, removeKnownSpell, toggleFavoriteSpell }: Props) {
  const [spellBookOpen, setSpellBookOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [levelFilter, setLevelFilter] = useState<number | null>(null);

  const knownSpells = knownSpellIds
    .map(id => getSpellById(id))
    .filter((s): s is SpellData => s !== undefined);

  const availableLevels = useMemo(() => {
    const set = new Set(knownSpells.map(s => s.level));
    return Array.from(set).sort((a, b) => a - b);
  }, [knownSpells]);

  const displayedSpells = knownSpells.filter(s => {
    if (showFavoritesOnly && !favoriteSpellIds.includes(s.id)) return false;
    if (levelFilter !== null && s.level !== levelFilter) return false;
    return true;
  });

  const favoriteCount = knownSpells.filter(s => favoriteSpellIds.includes(s.id)).length;

  return (
    <>
      <div className="flex flex-col gap-4">
        <SheetCard
          title="Known Spells"
          headerExtra={
            <div className="flex items-center gap-2 ml-auto">
              {/* Favorites filter — only shown when there are known spells */}
              {knownSpells.length > 0 && (
                <button
                  className="flex items-center gap-1.5 font-cinzel text-[9px] uppercase tracking-wide px-2.5 py-1 rounded-full border transition-all"
                  style={
                    showFavoritesOnly
                      ? { background: 'rgba(201,162,39,0.2)', color: 'var(--adnd-gold)', border: '1px solid var(--adnd-gold)' }
                      : { background: 'transparent', color: 'var(--adnd-gold-dim)', border: '1px solid var(--adnd-gold-dim)' }
                  }
                  onClick={() => setShowFavoritesOnly(v => !v)}
                  title="Show favorites only"
                >
                  <span className="text-sm leading-none">{showFavoritesOnly ? '★' : '☆'}</span>
                  {showFavoritesOnly && favoriteCount > 0 && (
                    <span>{favoriteCount}</span>
                  )}
                </button>
              )}

              {/* Add Spell button */}
              <button
                className="font-cinzel text-[9px] uppercase tracking-wide px-2.5 py-1 rounded border transition-colors hover:bg-white/10"
                style={{ color: 'var(--adnd-gold-light)', border: '1px solid var(--adnd-gold-dim)' }}
                onClick={() => setSpellBookOpen(true)}
              >
                + Add Spell
              </button>
            </div>
          }
        >
          {/* Level filter pills — only shown when spells span more than one level */}
          {knownSpells.length > 0 && availableLevels.length > 1 && (
            <div
              className="flex gap-1.5 flex-wrap px-3 pt-2 pb-1"
              style={{ borderBottom: '1px solid var(--adnd-gold-dim)' }}
            >
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
              {availableLevels.map(lvl => (
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
          )}

          {knownSpells.length === 0 ? (
            /* Empty state — no known spells */
            <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
              <span className="text-4xl">📖</span>
              <p className="font-cinzel text-xs uppercase tracking-wide" style={{ color: 'var(--adnd-gold-dim)' }}>
                No spells in your list
              </p>
              <button
                className="font-cinzel text-xs uppercase tracking-wide px-4 py-2 rounded border transition-colors hover:bg-white/10"
                style={{ color: 'var(--adnd-gold-light)', border: '1px solid var(--adnd-gold-dim)' }}
                onClick={() => setSpellBookOpen(true)}
              >
                Open Spell Book
              </button>
            </div>
          ) : displayedSpells.length === 0 ? (
            /* Empty state — active filters produced no results */
            <div className="flex flex-col items-center justify-center gap-3 py-10 px-4 text-center">
              <span className="text-4xl">{showFavoritesOnly ? '⭐' : '🔍'}</span>
              <p className="font-cinzel text-xs uppercase tracking-wide" style={{ color: 'var(--adnd-gold-dim)' }}>
                {showFavoritesOnly ? 'No favorites yet' : `No level ${levelFilter} spells in your list`}
              </p>
              {showFavoritesOnly && (
                <p className="font-handwriting text-[11px]" style={{ color: '#8a9ab8' }}>
                  Star spells in your list to mark them as favorites
                </p>
              )}
            </div>
          ) : (
            <div className="pt-1">
              {displayedSpells.map(spell => (
                <KnownSpellCard
                  key={spell.id}
                  spell={spell}
                  isFavorite={favoriteSpellIds.includes(spell.id)}
                  onToggleFavorite={() => toggleFavoriteSpell(spell.id)}
                  onRemove={() => removeKnownSpell(spell.id)}
                />
              ))}
            </div>
          )}
        </SheetCard>
      </div>

      {/* Spell Book modal */}
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
