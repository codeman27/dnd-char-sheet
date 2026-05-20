import { useState, useCallback, useRef, useEffect } from 'react';
import { useCharacterSheet } from '@/hooks/useCharacterSheet';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useNostrCharacters } from '@/hooks/useNostrCharacters';
import { useLoginActions } from '@/hooks/useLoginActions';
import { CharacterTab } from './CharacterTab';
import { CombatTab } from './CombatTab';
import { AbilitiesTab } from './AbilitiesTab';
import { SkillsTab } from './SkillsTab';
import { MagicTab } from './MagicTab';
import { GearTab } from './GearTab';
import { NotesTab } from './NotesTab';
import { NostrCharacterDrawer } from './NostrCharacterDrawer';
import type { CharacterData } from '@/hooks/useCharacterSheet';

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

const BTN_BASE = {
  background: 'var(--adnd-dark3)',
  color: 'var(--adnd-gold-light)',
  border: '1px solid var(--adnd-gold-dim)',
} as const;

export function CharacterSheet() {
  const [activeTab, setActiveTab] = useState<TabId>('character');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentNostrId, setCurrentNostrId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const menuRef = useRef<HTMLDivElement>(null);

  const { user } = useCurrentUser();
  const login = useLoginActions();
  const { saveCharacter } = useNostrCharacters();

  const {
    char,
    update,
    replaceChar,
    resetToNew,
    updateWeapon,
    updatePotion,
    updateGear,
    updateProficiency,
    updateSpecialAbility,
    updateSpell,
    addKnownSpell,
    removeKnownSpell,
    toggleFavoriteSpell,
    setMovementFromBase,
    autoFillAbility,
    gearTotalWeight,
  } = useCharacterSheet();

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  function handleNew() {
    setMenuOpen(false);
    if (char.name.trim()) {
      if (!confirm('Start a new character? Unsaved changes will be lost.')) return;
    }
    resetToNew();
    setCurrentNostrId(null);
    setActiveTab('character');
    setSaveStatus('idle');
  }

  function handleLoad() {
    setMenuOpen(false);
    setDrawerOpen(true);
  }

  function handleLogout() {
    setMenuOpen(false);
    if (!confirm('Log out of Nostr?')) return;
    login.logout();
  }

  function handleSignIn() {
    setMenuOpen(false);
    setDrawerOpen(true);
  }

  async function handleSave() {
    if (!user) {
      setDrawerOpen(true);
      return;
    }
    setSaveStatus('saving');
    try {
      const id = await saveCharacter({ char, existingId: currentNostrId ?? undefined });
      setCurrentNostrId(id);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2500);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }

  const handleNostrLoad = useCallback((loadedChar: CharacterData, nostrId: string) => {
    replaceChar(loadedChar);
    setCurrentNostrId(nostrId);
    setSaveStatus('idle');
  }, [replaceChar]);

  const handleNostrSaved = useCallback((nostrId: string) => {
    setCurrentNostrId(nostrId);
  }, []);

  const charName = char.name.trim() || 'New Character';
  const isLoggedIn = !!user;

  // Save button styling
  const saveStyle =
    saveStatus === 'success' ? { background: '#1a4a1a', color: '#6fc86f', border: '1px solid #2a6a2a' } :
    saveStatus === 'error'   ? { background: '#4a1a1a', color: '#f08080', border: '1px solid #6a2a2a' } :
    saveStatus === 'saving'  ? { ...BTN_BASE, opacity: 0.7 as number } :
    BTN_BASE;

  const saveLabel =
    saveStatus === 'saving' ? '…' :
    saveStatus === 'success' ? '✓' :
    saveStatus === 'error' ? '!' :
    'Save';

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--adnd-content-bg)' }}>
      {/* ── Top Header ── */}
      <header
        className="flex items-center px-3 gap-2 shrink-0 z-10"
        style={{
          background: 'var(--adnd-dark)',
          borderBottom: '2px solid var(--adnd-gold-dim)',
          minHeight: '52px',
        }}
      >
        {/* ── Hamburger menu ── */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            className="flex flex-col items-center justify-center gap-[5px] w-9 h-9 rounded border transition-colors"
            style={menuOpen
              ? { background: 'rgba(201,162,39,0.15)', border: '1px solid var(--adnd-gold-dim)', color: 'var(--adnd-gold-light)' }
              : { ...BTN_BASE }
            }
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
          >
            {/* Three bars */}
            <span className="block w-4 h-[2px] rounded-full transition-all" style={{ background: 'var(--adnd-gold-light)' }} />
            <span className="block w-4 h-[2px] rounded-full transition-all" style={{ background: 'var(--adnd-gold-light)' }} />
            <span className="block w-4 h-[2px] rounded-full transition-all" style={{ background: 'var(--adnd-gold-light)' }} />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div
              className="absolute left-0 top-full mt-1.5 rounded-lg overflow-hidden z-50 min-w-[140px] shadow-xl"
              style={{ background: 'var(--adnd-dark2)', border: '1px solid var(--adnd-gold-dim)' }}
            >
              {/* New */}
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left font-cinzel text-xs uppercase tracking-wide transition-colors hover:bg-white/5"
                style={{ color: 'var(--adnd-gold-light)' }}
                onClick={handleNew}
              >
                <span className="text-sm">✦</span>
                New
              </button>

              {/* Load */}
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left font-cinzel text-xs uppercase tracking-wide transition-colors hover:bg-white/5"
                style={{ color: 'var(--adnd-gold-light)', borderTop: '1px solid #2a3050' }}
                onClick={handleLoad}
              >
                <span className="text-sm">📜</span>
                Load
              </button>

              {/* Divider */}
              <div style={{ borderTop: '1px solid #2a3050' }} />

              {/* Log Out / Sign In */}
              {isLoggedIn ? (
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-left font-cinzel text-xs uppercase tracking-wide transition-colors hover:bg-white/5"
                  style={{ color: '#cc6666' }}
                  onClick={handleLogout}
                >
                  <span className="text-sm">⬡</span>
                  Log Out
                </button>
              ) : (
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-left font-cinzel text-xs uppercase tracking-wide transition-colors hover:bg-white/5"
                  style={{ color: 'var(--adnd-gold)' }}
                  onClick={handleSignIn}
                >
                  <span className="text-sm">⚡</span>
                  Sign In
                </button>
              )}
            </div>
          )}
        </div>

        {/* Logo */}
        <img
          src={ADND_LOGO}
          alt="AD&D 2e"
          className="h-7 shrink-0"
          style={{ filter: 'brightness(0) invert(1) opacity(0.85)' }}
        />

        {/* Character name — center */}
        <div className="flex-1 text-center min-w-0 overflow-hidden px-1">
          <span
            className="font-cinzel text-base truncate block"
            style={{ color: 'var(--adnd-gold-light)', letterSpacing: '1px' }}
          >
            {charName}
          </span>
          {currentNostrId && (
            <span className="font-cinzel text-[8px] uppercase tracking-widest block" style={{ color: 'var(--adnd-gold-dim)' }}>
              ⚡ synced
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          className="shrink-0 px-3 py-1.5 rounded text-xs font-cinzel border transition-all"
          style={saveStyle}
          onClick={handleSave}
          disabled={saveStatus === 'saving'}
          title={isLoggedIn ? 'Save to Nostr' : 'Sign in to save'}
        >
          {saveLabel}
        </button>
      </header>

      {/* ── Scrollable Content ── */}
      <main className="flex-1 overflow-y-auto p-3 pb-24">
        {activeTab === 'character' && <CharacterTab char={char} update={update} />}
        {activeTab === 'combat' && <CombatTab char={char} update={update} updateWeapon={updateWeapon} />}
        {activeTab === 'abilities' && <AbilitiesTab char={char} update={update} autoFillAbility={autoFillAbility} />}
        {activeTab === 'skills' && <SkillsTab char={char} update={update} updateSpecialAbility={updateSpecialAbility} />}
        {activeTab === 'magic' && (
          <MagicTab
            knownSpellIds={char.knownSpells ?? []}
            favoriteSpellIds={char.favoriteSpells ?? []}
            addKnownSpell={addKnownSpell}
            removeKnownSpell={removeKnownSpell}
            toggleFavoriteSpell={toggleFavoriteSpell}
          />
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
        {activeTab === 'notes' && <NotesTab char={char} update={update} updateProficiency={updateProficiency} />}
      </main>

      {/* ── Bottom Navigation ── */}
      <nav
        className="bottom-nav fixed bottom-0 left-0 right-0 flex items-stretch z-20"
        style={{ background: 'var(--adnd-dark)', borderTop: '2px solid var(--adnd-gold-dim)' }}
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

      {/* ── Character Drawer ── */}
      <NostrCharacterDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        currentChar={char}
        currentNostrId={currentNostrId}
        onLoad={handleNostrLoad}
        onSaved={handleNostrSaved}
        onNew={handleNew}
      />
    </div>
  );
}
