import { useSeoMeta } from '@unhead/react';
import { CharacterSheet } from '@/components/sheet/CharacterSheet';

const Index = () => {
  useSeoMeta({
    title: 'AD&D 2nd Edition Character Sheet',
    description: 'A mobile-first Advanced Dungeons & Dragons 2nd Edition character sheet.',
  });

  return <CharacterSheet />;
};

export default Index;
