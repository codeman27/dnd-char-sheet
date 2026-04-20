import { useState } from 'react';
import { LoginArea } from '@/components/auth/LoginArea';
import { useNostrCharacters, type CharacterMeta } from '@/hooks/useNostrCharacters';
import type { CharacterData } from '@/hooks/useCharacterSheet';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentChar: CharacterData;
  currentNostrId: string | null;
  onLoad: (char: CharacterData, nostrId: string) => void;
  onSaved: (nostrId: string) => void;
  onNew: () => void;
}

function timeAgo(ts: number): string {
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const HDR_BTN = {
  background: 'var(--adnd-dark3)',
  color: 'var(--adnd-gold-light)',
  border: '1px solid var(--adnd-gold-dim)',
} as const;

export function NostrCharacterDrawer({ isOpen, onClose, currentChar, currentNostrId, onLoad, onSaved, onNew }: Props) {
  const {
    isLoggedIn,
    characters,
    isLoadingIndex,
    saveCharacter,
    isSaving,
    loadCharacter,
    isLoading,
    loadError,
    deleteCharacter,
    isDeleting,
  } = useNostrCharacters();

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMsg, setSaveMsg] = useState('');

  async function handleSave() {
    setSaveStatus('saving');
    setSaveMsg('');
    try {
      const id = await saveCharacter({ char: currentChar, existingId: currentNostrId ?? undefined });
      onSaved(id);
      setSaveStatus('success');
      setSaveMsg(`"${currentChar.name || 'Unnamed'}" saved ✓`);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
      setSaveMsg(err instanceof Error ? err.message : 'Save failed');
    }
  }

  async function handleLoad(meta: CharacterMeta) {
    setLoadingId(meta.id);
    try {
      const char = await loadCharacter(meta.id);
      onLoad(char, meta.id);
      onClose();
    } catch (err) {
      console.error('Load failed', err);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(meta: CharacterMeta) {
    if (!confirm(`Delete "${meta.name}" from Nostr? This cannot be undone.`)) return;
    setDeletingId(meta.id);
    try {
      await deleteCharacter(meta.id);
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setDeletingId(null);
    }
  }

  function handleNew() {
    onClose();
    onNew();
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 flex flex-col rounded-t-2xl overflow-hidden"
        style={{
          background: 'var(--adnd-dark)',
          border: '1px solid var(--adnd-gold-dim)',
          borderBottom: 'none',
          maxHeight: '85vh',
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#7a6218] opacity-60" />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{ borderBottom: '1px solid var(--adnd-gold-dim)' }}
        >
          <span className="font-cinzel text-sm font-semibold" style={{ color: 'var(--adnd-gold-light)', letterSpacing: '1px' }}>
            Characters
          </span>
          <div className="flex items-center gap-2">
            {/* New character button */}
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded font-cinzel text-xs uppercase tracking-wide"
              style={HDR_BTN}
              onClick={handleNew}
            >
              ✦ New
            </button>
            <button
              className="font-cinzel text-xs px-2 py-1.5 rounded border"
              style={{ color: '#8a9ab8', borderColor: '#3a4060' }}
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-4">

          {/* ── Not logged in ── */}
          {!isLoggedIn ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="text-center">
                <p className="font-cinzel text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--adnd-gold)' }}>
                  Sign in with Nostr
                </p>
                <p className="font-handwriting text-sm" style={{ color: '#8a9ab8' }}>
                  Log in to save &amp; sync your characters across all your devices using your private key.
                </p>
              </div>
              <LoginArea className="w-full max-w-xs" />
            </div>
          ) : (
            <>
              {/* ── Save current character ── */}
              <div
                className="rounded-lg p-3 flex flex-col gap-2"
                style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid var(--adnd-gold-dim)' }}
              >
                <div className="flex items-center justify-between">
                  <p className="font-cinzel text-[10px] uppercase tracking-widest" style={{ color: 'var(--adnd-gold)' }}>
                    Save current
                  </p>
                  {currentNostrId && (
                    <span className="font-cinzel text-[9px] opacity-50" style={{ color: 'var(--adnd-gold-light)' }}>
                      updating existing
                    </span>
                  )}
                </div>
                <p className="font-handwriting text-sm" style={{ color: '#c8c0a0' }}>
                  <strong style={{ color: 'var(--adnd-gold-light)' }}>{currentChar.name || 'Unnamed'}</strong>
                </p>
                <button
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded font-cinzel text-xs uppercase tracking-wider transition-colors"
                  style={{
                    background: saveStatus === 'success' ? '#1a4a1a' : 'var(--adnd-dark3)',
                    color: saveStatus === 'success' ? '#6fc86f' : 'var(--adnd-gold-light)',
                    border: `1px solid ${saveStatus === 'success' ? '#2a6a2a' : 'var(--adnd-gold-dim)'}`,
                    opacity: isSaving ? 0.7 : 1,
                  }}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <><span className="animate-spin inline-block">⏳</span> Saving…</>
                  ) : saveStatus === 'success' ? (
                    <>✓ Saved!</>
                  ) : (
                    <>⚡ Save to Nostr</>
                  )}
                </button>
                {(saveStatus === 'error' || saveStatus === 'success') && saveMsg && (
                  <p className={`font-handwriting text-xs ${saveStatus === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                    {saveMsg}
                  </p>
                )}
              </div>

              {/* ── Character list ── */}
              <div>
                <p className="font-cinzel text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--adnd-gold)' }}>
                  Your Characters
                </p>

                {isLoadingIndex && (
                  <div className="flex items-center gap-2 py-6 justify-center">
                    <span className="animate-spin text-lg">⚔️</span>
                    <span className="font-cinzel text-xs" style={{ color: '#8a9ab8' }}>Loading from relays…</span>
                  </div>
                )}

                {!isLoadingIndex && characters.length === 0 && (
                  <div
                    className="rounded-lg p-4 text-center"
                    style={{ border: '1px dashed var(--adnd-gold-dim)', background: 'rgba(0,0,0,0.2)' }}
                  >
                    <p className="font-handwriting text-sm" style={{ color: '#8a9ab8' }}>
                      No characters saved yet. Save one above!
                    </p>
                  </div>
                )}

                {!isLoadingIndex && characters.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {[...characters].sort((a, b) => b.updatedAt - a.updatedAt).map(meta => (
                      <div
                        key={meta.id}
                        className="rounded-lg p-3 flex items-center gap-3"
                        style={{
                          background: meta.id === currentNostrId ? 'rgba(201,162,39,0.12)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${meta.id === currentNostrId ? 'var(--adnd-gold-dim)' : '#2a3050'}`,
                        }}
                      >
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-cinzel text-sm font-semibold truncate" style={{ color: 'var(--adnd-gold-light)' }}>
                            {meta.name || 'Unnamed'}
                          </p>
                          <p className="font-handwriting text-xs" style={{ color: '#5a6888' }}>
                            {timeAgo(meta.updatedAt)}
                            {meta.id === currentNostrId && (
                              <span className="ml-1" style={{ color: 'var(--adnd-gold-dim)' }}>· active</span>
                            )}
                          </p>
                        </div>

                        {/* Load */}
                        <button
                          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded font-cinzel text-[10px] uppercase tracking-wide transition-colors"
                          style={{
                            ...HDR_BTN,
                            opacity: loadingId === meta.id ? 0.7 : 1,
                          }}
                          onClick={() => handleLoad(meta)}
                          disabled={loadingId === meta.id || isLoading}
                        >
                          {loadingId === meta.id
                            ? <span className="animate-spin inline-block">⏳</span>
                            : '📥'}
                          Load
                        </button>

                        {/* Delete */}
                        <button
                          className="shrink-0 flex items-center px-2 py-1.5 rounded font-cinzel text-[10px] transition-colors"
                          style={{
                            background: 'rgba(200,40,40,0.1)',
                            color: '#cc6666',
                            border: '1px solid #5a2020',
                            opacity: deletingId === meta.id ? 0.7 : 1,
                          }}
                          onClick={() => handleDelete(meta)}
                          disabled={deletingId === meta.id || isDeleting}
                          title="Remove from Nostr"
                        >
                          {deletingId === meta.id ? <span className="animate-spin inline-block">⏳</span> : '🗑'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {loadError && (
                  <p className="font-handwriting text-xs text-red-400 mt-2">
                    {loadError instanceof Error ? loadError.message : 'Failed to load character'}
                  </p>
                )}
              </div>

              {/* Privacy note */}
              <div
                className="rounded-lg p-3"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #2a3050' }}
              >
                <p className="font-cinzel text-[9px] uppercase tracking-widest mb-1" style={{ color: '#5a6888' }}>
                  🔒 Privacy
                </p>
                <p className="font-handwriting text-xs" style={{ color: '#5a6888' }}>
                  Characters are encrypted with NIP-44 to your own key before publishing. Only you can read them.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
