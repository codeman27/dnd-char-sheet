/**
 * useNostrCharacters
 *
 * Stores AD&D 2e character sheets on Nostr using NIP-78 (kind 30078).
 * Each character is a separate addressable event:
 *   kind: 30078
 *   d tag: "adnd2e-char-{uuid}"
 *   content: NIP-44 encrypted JSON (encrypted to self)
 *
 * A separate index event tracks the list of character IDs:
 *   kind: 30078
 *   d tag: "adnd2e-index"
 *   content: NIP-44 encrypted JSON array of { id, name, updatedAt }
 *
 * Both are authored by and encrypted to the logged-in user's own pubkey,
 * so only that user can read them.
 */

import { useNostr } from '@nostrify/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from './useCurrentUser';
import { useAppContext } from './useAppContext';
import type { CharacterData } from './useCharacterSheet';

const INDEX_D_TAG = 'adnd2e-index';
const CHAR_D_PREFIX = 'adnd2e-char-';

// Reliable public relays we always write to and read from for character data.
// We use a fixed set so characters are always findable regardless of the
// user's NIP-65 relay list or which relays their signer app uses.
const STORAGE_RELAYS = [
  'wss://relay.ditto.pub',
  'wss://relay.primal.net',
  'wss://relay.damus.io',
  'wss://nos.lol',
];

export interface CharacterMeta {
  id: string;        // UUID used as d-tag suffix
  name: string;      // Character name for display
  updatedAt: number; // Unix timestamp
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useNostrCharacters() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const { config } = useAppContext();
  const queryClient = useQueryClient();

  const isLoggedIn = !!user;

  // Build the relay set to use: our fixed storage relays PLUS whatever
  // write relays the user has configured (e.g. their Primal inbox relay).
  // This maximises the chance that the event reaches at least one relay
  // that the user's signer app also reads from.
  function getRelays(): string[] {
    const userRelays = config.relayMetadata.relays
      .filter(r => r.write)
      .map(r => r.url);
    const all = new Set([...STORAGE_RELAYS, ...userRelays]);
    return [...all];
  }

  // ── Fetch character index ─────────────────────────────────────────────────

  const indexQuery = useQuery({
    queryKey: ['nostr-char-index', user?.pubkey],
    enabled: isLoggedIn,
    staleTime: 0,         // Always re-fetch when drawer opens / pubkey changes
    gcTime: 5 * 60_000,   // Keep in memory for 5 minutes between opens
    retry: 2,
    queryFn: async (): Promise<CharacterMeta[]> => {
      if (!user) return [];

      const relays = getRelays();
      console.log('[adnd] Querying index from relays:', relays);

      // Query all storage relays in parallel and take the newest result
      const results = await Promise.allSettled(
        relays.map(url =>
          nostr.relay(url).query(
            [{ kinds: [30078], authors: [user.pubkey], '#d': [INDEX_D_TAG], limit: 1 }],
            { signal: AbortSignal.timeout(10_000) }
          )
        )
      );

      // Collect all returned events, pick the one with the highest created_at
      const events = results
        .flatMap(r => r.status === 'fulfilled' ? r.value : [])
        .filter(e => e.content)
        .sort((a, b) => b.created_at - a.created_at);

      console.log('[adnd] Index query returned', events.length, 'events');

      if (events.length === 0) return [];

      const event = events[0];

      if (!user.signer.nip44) throw new Error('NIP-44 not supported by this signer');
      const decrypted = await user.signer.nip44.decrypt(user.pubkey, event.content);
      const parsed = JSON.parse(decrypted) as CharacterMeta[];
      console.log('[adnd] Decoded index:', parsed);
      return Array.isArray(parsed) ? parsed : [];
    },
  });

  // ── Save (publish) a character ─────────────────────────────────────────────

  const saveCharacterMutation = useMutation({
    mutationFn: async ({ char, existingId }: { char: CharacterData; existingId?: string }) => {
      if (!user) throw new Error('Not logged in');
      if (!user.signer.nip44) throw new Error('Your signer does not support NIP-44 encryption.');

      const charId = existingId || generateId();
      const dTag = `${CHAR_D_PREFIX}${charId}`;
      const now = Math.floor(Date.now() / 1000);
      const relays = getRelays();

      console.log('[adnd] Saving character to relays:', relays);

      // Encrypt the character data to self
      const plaintext = JSON.stringify({ version: 4, ...char });
      const encrypted = await user.signer.nip44.encrypt(user.pubkey, plaintext);

      // Sign & publish the character event to all storage relays
      const charEvent = await user.signer.signEvent({
        kind: 30078,
        content: encrypted,
        tags: [
          ['d', dTag],
          ['alt', `AD&D 2e character sheet: ${char.name || 'Unnamed'}`],
        ],
        created_at: now,
      });

      const charResults = await Promise.allSettled(
        relays.map(url => nostr.relay(url).event(charEvent, { signal: AbortSignal.timeout(10_000) }))
      );
      const charOk = charResults.filter(r => r.status === 'fulfilled').length;
      console.log('[adnd] Character event accepted by', charOk, '/', relays.length, 'relays');
      if (charOk === 0) throw new Error('No relays accepted the character event. Check your connection.');

      // Build updated index — read latest from relay first to avoid clobbering
      const currentIndex: CharacterMeta[] = indexQuery.data ?? [];
      const existingEntry = currentIndex.find(m => m.id === charId);
      const newIndex: CharacterMeta[] = existingEntry
        ? currentIndex.map(m => m.id === charId ? { id: charId, name: char.name || 'Unnamed', updatedAt: now } : m)
        : [...currentIndex, { id: charId, name: char.name || 'Unnamed', updatedAt: now }];

      // Sign & publish the index event to all storage relays
      const encryptedIndex = await user.signer.nip44.encrypt(user.pubkey, JSON.stringify(newIndex));
      const indexEvent = await user.signer.signEvent({
        kind: 30078,
        content: encryptedIndex,
        tags: [
          ['d', INDEX_D_TAG],
          ['alt', 'AD&D 2e character index'],
        ],
        created_at: now,
      });

      const indexResults = await Promise.allSettled(
        relays.map(url => nostr.relay(url).event(indexEvent, { signal: AbortSignal.timeout(10_000) }))
      );
      const indexOk = indexResults.filter(r => r.status === 'fulfilled').length;
      console.log('[adnd] Index event accepted by', indexOk, '/', relays.length, 'relays');

      return charId;
    },
    onSuccess: () => {
      // Optimistically update the query cache so the drawer refreshes immediately
      queryClient.invalidateQueries({ queryKey: ['nostr-char-index', user?.pubkey] });
    },
  });

  // ── Load a specific character ─────────────────────────────────────────────

  const loadCharacterMutation = useMutation({
    mutationFn: async (charId: string): Promise<CharacterData> => {
      if (!user) throw new Error('Not logged in');
      if (!user.signer.nip44) throw new Error('NIP-44 not supported');

      const dTag = `${CHAR_D_PREFIX}${charId}`;
      const relays = getRelays();

      console.log('[adnd] Loading character', charId, 'from relays:', relays);

      // Query all relays in parallel, take the newest event
      const results = await Promise.allSettled(
        relays.map(url =>
          nostr.relay(url).query(
            [{ kinds: [30078], authors: [user.pubkey], '#d': [dTag], limit: 1 }],
            { signal: AbortSignal.timeout(10_000) }
          )
        )
      );

      const events = results
        .flatMap(r => r.status === 'fulfilled' ? r.value : [])
        .filter(e => e.content)
        .sort((a, b) => b.created_at - a.created_at);

      console.log('[adnd] Load returned', events.length, 'events for', dTag);

      if (events.length === 0) throw new Error('Character not found on any relay. It may not have been saved yet — try saving again.');

      const decrypted = await user.signer.nip44.decrypt(user.pubkey, events[0].content);
      return JSON.parse(decrypted) as CharacterData;
    },
  });

  // ── Delete a character ────────────────────────────────────────────────────

  const deleteCharacterMutation = useMutation({
    mutationFn: async (charId: string) => {
      if (!user) throw new Error('Not logged in');
      if (!user.signer.nip44) throw new Error('NIP-44 not supported');

      const currentIndex: CharacterMeta[] = indexQuery.data ?? [];
      const newIndex = currentIndex.filter(m => m.id !== charId);
      const now = Math.floor(Date.now() / 1000);
      const relays = getRelays();

      const encryptedIndex = await user.signer.nip44.encrypt(user.pubkey, JSON.stringify(newIndex));
      const indexEvent = await user.signer.signEvent({
        kind: 30078,
        content: encryptedIndex,
        tags: [
          ['d', INDEX_D_TAG],
          ['alt', 'AD&D 2e character index'],
        ],
        created_at: now,
      });

      await Promise.allSettled(
        relays.map(url => nostr.relay(url).event(indexEvent, { signal: AbortSignal.timeout(10_000) }))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nostr-char-index', user?.pubkey] });
    },
  });

  return {
    isLoggedIn,
    characters: indexQuery.data ?? [],
    isLoadingIndex: indexQuery.isLoading || indexQuery.isFetching,
    indexError: indexQuery.error,
    saveCharacter: saveCharacterMutation.mutateAsync,
    isSaving: saveCharacterMutation.isPending,
    saveError: saveCharacterMutation.error,
    loadCharacter: loadCharacterMutation.mutateAsync,
    isLoading: loadCharacterMutation.isPending,
    loadError: loadCharacterMutation.error,
    deleteCharacter: deleteCharacterMutation.mutateAsync,
    isDeleting: deleteCharacterMutation.isPending,
  };
}
