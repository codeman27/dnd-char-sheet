import { useState, useRef } from 'react';
import { useCharacterSheet } from '@/hooks/useCharacterSheet';
import { CharacterTab } from './CharacterTab';
import { CombatTab } from './CombatTab';
import { AbilitiesTab } from './AbilitiesTab';
import { SkillsTab } from './SkillsTab';
import { MagicTab } from './MagicTab';
import { GearTab } from './GearTab';
import { NotesTab } from './NotesTab';

const ADND_LOGO = 'https://blossom.dreamith.to/fe0fefc0b412417d9ac70cf118aa60c6001422f1e83318964fc77d4aec416ff8.png';

type TabId = 'character' | 'combat' | 'abilities' | 'skills' | 'magic' | 'gear' | 'notes';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'character', label: 'Char', icon: '👤' },
  { id: 'combat', label: 'Combat', icon: '⚔️' },
  { id: 'abilities', label: 'Abilities', icon: '💪' },
  { id: 'skills', label: 'Skills', icon: '⭐' },
  { id: 'magic', label: 'Magic', icon: '✨' },
  { id: 'gear', label: 'Gear', icon: '🎒' },
  { id: 'notes', label: 'Notes', icon: '📝' },
];

const FONTS = ['Default', 'Garamond', 'Raleway'];

export function CharacterSheet() {
  const [activeTab, setActiveTab] = useState<TabId>('character');
  const loadRef = useRef<HTMLInputElement>(null);

  const {
    char,
    update,
    updateWeapon,
    updatePotion,
    updateGear,
    updateProficiency,
    updateSpecialAbility,
    updateSpell,
    saveToFile,
    loadFromFile,
    setMovementFromBase,
    autoFillAbility,
    gearTotalWeight,
  } = useCharacterSheet();

  function handleLoadFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadFromFile(file);
    e.target.value = '';
  }

  function handleFontChange(font: string) {
    update({ font });
    const fontMap: Record<string, string> = {
      'Default': "'Indie Flower', cursive",
      'Garamond': "'EB Garamond', serif",
      'Raleway': "'Raleway', sans-serif",
    };
    document.documentElement.style.setProperty('--sheet-font', fontMap[font] || fontMap['Default']);
  }

  function handleColourChange(colour: string) {
    update({ pencilColour: colour });
  }

  const charName = char.name.trim() || 'New Character';

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: 'var(--adnd-content-bg)' }}
      onDragEnter={e => e.preventDefault()}
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) loadFromFile(file);
      }}
    >
      {/* ── Top Header ── */}
      <header
        className="flex items-center px-3 gap-2 shrink-0 z-10"
        style={{
          background: 'var(--adnd-dark)',
          borderBottom: '2px solid var(--adnd-gold-dim)',
          minHeight: '52px',
        }}
      >
        {/* Logo */}
        <img
          src={ADND_LOGO}
          alt="AD&D 2e"
          className="h-7 shrink-0"
          style={{ filter: 'brightness(0) invert(1) opacity(0.85)' }}
        />

        {/* Character name — center */}
        <div className="flex-1 text-center min-w-0 overflow-hidden">
          <span
            className="font-cinzel text-base truncate block"
            style={{ color: 'var(--adnd-gold-light)', letterSpacing: '1px' }}
          >
            {charName}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Save */}
          <button
            className="flex items-center gap-1 px-2 py-1.5 rounded text-xs font-cinzel border transition-colors"
            style={{ background: 'var(--adnd-dark3)', color: 'var(--adnd-gold-light)', border: '1px solid var(--adnd-gold-dim)' }}
            onClick={saveToFile}
            title="Save character (Ctrl+S)"
          >
            💾
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Load */}
          <button
            className="flex items-center gap-1 px-2 py-1.5 rounded text-xs font-cinzel border transition-colors"
            style={{ background: 'var(--adnd-dark3)', color: 'var(--adnd-gold-light)', border: '1px solid var(--adnd-gold-dim)' }}
            onClick={() => loadRef.current?.click()}
            title="Load character"
          >
            📂
            <span className="hidden sm:inline">Load</span>
          </button>
          <input
            type="file"
            ref={loadRef}
            accept=".json"
            className="hidden"
            onChange={handleLoadFile}
          />

          {/* Pencil colour */}
          <label
            className="flex items-center gap-1 px-2 py-1.5 rounded text-xs font-cinzel border cursor-pointer transition-colors relative"
            style={{ background: 'var(--adnd-dark3)', color: 'var(--adnd-gold-light)', border: '1px solid var(--adnd-gold-dim)' }}
            title="Pencil colour"
          >
            ✏️
            <input
              type="color"
              className="absolute opacity-0 w-0 h-0"
              value={char.pencilColour || '#1a1d2e'}
              onChange={e => handleColourChange(e.target.value)}
            />
          </label>

          {/* Font selector */}
          <select
            className="px-1.5 py-1.5 rounded text-xs font-cinzel border hidden sm:block"
            style={{ background: 'var(--adnd-dark3)', color: 'var(--adnd-gold-light)', border: '1px solid var(--adnd-gold-dim)' }}
            value={char.font}
            onChange={e => handleFontChange(e.target.value)}
          >
            {FONTS.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
      </header>

      {/* ── Scrollable Content ── */}
      <main className="flex-1 overflow-y-auto p-3 pb-24">
        {activeTab === 'character' && (
          <CharacterTab char={char} update={update} />
        )}
        {activeTab === 'combat' && (
          <CombatTab char={char} update={update} updateWeapon={updateWeapon} />
        )}
        {activeTab === 'abilities' && (
          <AbilitiesTab char={char} update={update} autoFillAbility={autoFillAbility} />
        )}
        {activeTab === 'skills' && (
          <SkillsTab char={char} update={update} updateSpecialAbility={updateSpecialAbility} />
        )}
        {activeTab === 'magic' && (
          <MagicTab char={char} updateSpell={updateSpell} />
        )}
        {activeTab === 'gear' && (
          <GearTab
            char={char}
            update={update}
            updatePotion={updatePotion}
            updateGear={updateGear}
            setMovementFromBase={setMovementFromBase}
            gearTotalWeight={gearTotalWeight}
          />
        )}
        {activeTab === 'notes' && (
          <NotesTab char={char} update={update} updateProficiency={updateProficiency} />
        )}
      </main>

      {/* ── Bottom Navigation ── */}
      <nav
        className="bottom-nav fixed bottom-0 left-0 right-0 flex items-stretch z-20"
        style={{
          background: 'var(--adnd-dark)',
          borderTop: '2px solid var(--adnd-gold-dim)',
        }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            className="flex-1 flex flex-col items-center justify-center py-2 transition-colors min-w-0"
            style={{
              color: activeTab === tab.id ? 'var(--adnd-gold-light)' : '#8a9ab8',
              background: activeTab === tab.id ? 'rgba(201,162,39,0.12)' : 'transparent',
              borderTop: activeTab === tab.id ? '2px solid var(--adnd-gold)' : '2px solid transparent',
              fontFamily: 'Cinzel, serif',
              fontSize: '9px',
              letterSpacing: '0.3px',
            }}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="text-base leading-none mb-0.5">{tab.icon}</span>
            <span className="uppercase tracking-wide leading-none">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
