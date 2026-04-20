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
}

function timeAgo(ts: number): string {
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function NostrCharacterDrawer({ isOpen, onClose, currentChar, currentNostrId, onLoad, onSaved }: Props) {
  const {
    isLoggedIn,
    characters,
    isLoadingIndex,
    saveCharacter,
    isSaving,
    saveError,
    loadCharacter,
    isLoading,
    loadError,
    deleteCharacter,
    isDeleting,
  } = useNostrCharacters();

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  async function handleSave() {
    setSaveStatus('saving');
    setStatusMsg('');
    try {
      const id = await saveCharacter({ char: currentChar, existingId: currentNostrId ?? undefined });
      onSaved(id);
      setSaveStatus('success');
      setStatusMsg(`Saved as "${currentChar.name || 'Unnamed'}" on Nostr ✓`);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
      setStatusMsg(err instanceof Error ? err.message : 'Save failed');
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel — slides up from the bottom */}
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
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span className="font-cinzel text-sm font-semibold" style={{ color: 'var(--adnd-gold-light)', letterSpacing: '1px' }}>
              Nostr Characters
            </span>
          </div>
          <button
            className="font-cinzel text-xs px-2 py-1 rounded border"
            style={{ color: '#8a9ab8', borderColor: '#3a4060' }}
            onClick={onClose}
          >
            ✕ Close
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-4">

          {/* Login area if not logged in */}
          {!isLoggedIn ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="text-center">
                <p className="font-cinzel text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--adnd-gold)' }}>
                  Sign in with Nostr
                </p>
                <p className="font-handwriting text-sm" style={{ color: '#8a9ab8' }}>
                  Log in to save & sync your characters across all your devices using your private key.
                </p>
              </div>
              <LoginArea className="w-full max-w-xs" />
            </div>
          ) : (
            <>
              {/* Save current character */}
              <div
                className="rounded-lg p-3 flex flex-col gap-2"
                style={{ background: 'rgba(201,162,39,0.08)', border: '1px solid var(--adnd-gold-dim)' }}
              >
                <p className="font-cinzel text-[10px] uppercase tracking-widest" style={{ color: 'var(--adnd-gold)' }}>
                  Save to Nostr
                </p>
                <p className="font-handwriting text-sm" style={{ color: '#c8c0a0' }}>
                  Current character: <strong style={{ color: 'var(--adnd-gold-light)' }}>{currentChar.name || 'Unnamed'}</strong>
                  {currentNostrId && (
                    <span className="ml-1 text-[10px] font-cinzel opacity-60">(updating existing)</span>
                  )}
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
                    <><span className="animate-spin">⏳</span> Encrypting & publishing…</>
                  ) : saveStatus === 'success' ? (
                    <>✓ Saved!</>
                  ) : (
                    <>⚡ Save to Nostr</>
                  )}
                </button>
                {saveStatus === 'error' && (
                  <p className="font-handwriting text-xs text-red-400">{statusMsg}</p>
                )}
                {saveStatus === 'success' && (
                  <p className="font-handwriting text-xs" style={{ color: '#6fc86f' }}>{statusMsg}</p>
                )}
              </div>

              {/* Character list */}
              <div>
                <p className="font-cinzel text-[10px] uppercase tracking-widest mb-2" style={{ color: 'var(--adnd-gold)' }}>
                  Your Characters
                </p>

                {isLoadingIndex && (
                  <div className="flex items-center gap-2 py-4 justify-center">
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
                      No characters saved on Nostr yet. Save one above!
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
                          background: meta.id === currentNostrId
                            ? 'rgba(201,162,39,0.12)'
                            : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${meta.id === currentNostrId ? 'var(--adnd-gold-dim)' : '#2a3050'}`,
                        }}
                      >
                        {/* Character info */}
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

                        {/* Load button */}
                        <button
                          className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded font-cinzel text-[10px] uppercase tracking-wide transition-colors"
                          style={{
                            background: 'var(--adnd-dark3)',
                            color: 'var(--adnd-gold-light)',
                            border: '1px solid var(--adnd-gold-dim)',
                            opacity: loadingId === meta.id ? 0.7 : 1,
                          }}
                          onClick={() => handleLoad(meta)}
                          disabled={loadingId === meta.id || isLoading}
                          title="Load this character"
                        >
                          {loadingId === meta.id ? (
                            <span className="animate-spin">⏳</span>
                          ) : '📥'}
                          <span className="hidden sm:inline ml-1">Load</span>
                        </button>

                        {/* Delete button */}
                        <button
                          className="shrink-0 flex items-center gap-1 px-2 py-1.5 rounded font-cinzel text-[10px] transition-colors"
                          style={{
                            background: 'rgba(200,40,40,0.1)',
                            color: '#cc6666',
                            border: '1px solid #5a2020',
                            opacity: deletingId === meta.id ? 0.7 : 1,
                          }}
                          onClick={() => handleDelete(meta)}
                          disabled={deletingId === meta.id || isDeleting}
                          title="Remove from Nostr index"
                        >
                          {deletingId === meta.id ? <span className="animate-spin">⏳</span> : '🗑'}
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
                className="rounded-lg p-3 mt-1"
                style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid #2a3050' }}
              >
                <p className="font-cinzel text-[9px] uppercase tracking-widest mb-1" style={{ color: '#5a6888' }}>
                  🔒 Privacy
                </p>
                <p className="font-handwriting text-xs" style={{ color: '#5a6888' }}>
                  Characters are encrypted with NIP-44 to your own key before being published. Only you can read them.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
