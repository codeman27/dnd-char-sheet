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
import type { CharacterData } from './useCharacterSheet';

const INDEX_D_TAG = 'adnd2e-index';
const CHAR_D_PREFIX = 'adnd2e-char-';

export interface CharacterMeta {
  id: string;       // UUID used as d-tag suffix
  name: string;     // Character name for display
  updatedAt: number; // Unix timestamp
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useNostrCharacters() {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const isLoggedIn = !!user;

  // ── Fetch character index ─────────────────────────────────────────────────

  const indexQuery = useQuery({
    queryKey: ['nostr-char-index', user?.pubkey],
    enabled: isLoggedIn,
    staleTime: 30_000,
    queryFn: async (): Promise<CharacterMeta[]> => {
      if (!user) return [];

      const events = await nostr.query([
        {
          kinds: [30078],
          authors: [user.pubkey],
          '#d': [INDEX_D_TAG],
          limit: 1,
        },
      ], { signal: AbortSignal.timeout(8000) });

      if (events.length === 0) return [];

      const event = events[0];
      if (!event.content) return [];

      try {
        if (!user.signer.nip44) throw new Error('NIP-44 not supported');
        const decrypted = await user.signer.nip44.decrypt(user.pubkey, event.content);
        const parsed = JSON.parse(decrypted) as CharacterMeta[];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    },
  });

  // ── Save (publish) a character ─────────────────────────────────────────────

  const saveCharacterMutation = useMutation({
    mutationFn: async ({ char, existingId }: { char: CharacterData; existingId?: string }) => {
      if (!user) throw new Error('Not logged in');
      if (!user.signer.nip44) throw new Error('Your signer does not support NIP-44 encryption. Please use a key that supports it.');

      const charId = existingId || generateId();
      const dTag = `${CHAR_D_PREFIX}${charId}`;
      const now = Math.floor(Date.now() / 1000);

      // Encrypt the character data to self
      const plaintext = JSON.stringify({ version: 4, ...char });
      const encrypted = await user.signer.nip44.encrypt(user.pubkey, plaintext);

      // Sign & publish the character event
      const charEvent = await user.signer.signEvent({
        kind: 30078,
        content: encrypted,
        tags: [
          ['d', dTag],
          ['alt', `AD&D 2e character sheet: ${char.name || 'Unnamed'}`],
          ['client', location.hostname],
        ],
        created_at: now,
      });
      await nostr.event(charEvent, { signal: AbortSignal.timeout(8000) });

      // Update the index
      const currentIndex: CharacterMeta[] = indexQuery.data ?? [];
      const existingEntry = currentIndex.find(m => m.id === charId);
      let newIndex: CharacterMeta[];

      if (existingEntry) {
        newIndex = currentIndex.map(m =>
          m.id === charId ? { id: charId, name: char.name || 'Unnamed', updatedAt: now } : m
        );
      } else {
        newIndex = [
          ...currentIndex,
          { id: charId, name: char.name || 'Unnamed', updatedAt: now },
        ];
      }

      const encryptedIndex = await user.signer.nip44.encrypt(user.pubkey, JSON.stringify(newIndex));
      const indexEvent = await user.signer.signEvent({
        kind: 30078,
        content: encryptedIndex,
        tags: [
          ['d', INDEX_D_TAG],
          ['alt', 'AD&D 2e character index'],
          ['client', location.hostname],
        ],
        created_at: now,
      });
      await nostr.event(indexEvent, { signal: AbortSignal.timeout(8000) });

      return charId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nostr-char-index', user?.pubkey] });
    },
  });

  // ── Load a specific character ─────────────────────────────────────────────

  const loadCharacterMutation = useMutation({
    mutationFn: async (charId: string): Promise<CharacterData> => {
      if (!user) throw new Error('Not logged in');
      if (!user.signer.nip44) throw new Error('NIP-44 not supported');

      const dTag = `${CHAR_D_PREFIX}${charId}`;
      const events = await nostr.query([
        {
          kinds: [30078],
          authors: [user.pubkey],
          '#d': [dTag],
          limit: 1,
        },
      ], { signal: AbortSignal.timeout(8000) });

      if (events.length === 0) throw new Error('Character not found on Nostr');

      const event = events[0];
      const decrypted = await user.signer.nip44.decrypt(user.pubkey, event.content);
      return JSON.parse(decrypted) as CharacterData;
    },
  });

  // ── Delete a character ────────────────────────────────────────────────────

  const deleteCharacterMutation = useMutation({
    mutationFn: async (charId: string) => {
      if (!user) throw new Error('Not logged in');
      if (!user.signer.nip44) throw new Error('NIP-44 not supported');

      // Remove from the index
      const currentIndex: CharacterMeta[] = indexQuery.data ?? [];
      const newIndex = currentIndex.filter(m => m.id !== charId);
      const now = Math.floor(Date.now() / 1000);

      const encryptedIndex = await user.signer.nip44.encrypt(user.pubkey, JSON.stringify(newIndex));
      const indexEvent = await user.signer.signEvent({
        kind: 30078,
        content: encryptedIndex,
        tags: [
          ['d', INDEX_D_TAG],
          ['alt', 'AD&D 2e character index'],
          ['client', location.hostname],
        ],
        created_at: now,
      });
      await nostr.event(indexEvent, { signal: AbortSignal.timeout(8000) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nostr-char-index', user?.pubkey] });
    },
  });

  return {
    isLoggedIn,
    characters: indexQuery.data ?? [],
    isLoadingIndex: indexQuery.isLoading,
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
