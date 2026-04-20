import { useRef } from 'react';
import { SheetCard, Field } from './SheetCard';
import type { CharacterData } from '@/hooks/useCharacterSheet';

interface Props {
  char: CharacterData;
  update: (patch: Partial<CharacterData>) => void;
}

const ADND_LOGO = 'https://blossom.dreamith.to/fe0fefc0b412417d9ac70cf118aa60c6001422f1e83318964fc77d4aec416ff8.png';

export function CharacterTab({ char, update }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePortraitFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      update({ portraitUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Character Info */}
      <SheetCard title="Character Info">
        <Field label="Name">
          <input
            className="sheet-input text-lg"
            value={char.name}
            onChange={e => update({ name: e.target.value })}
            placeholder="Enter character name…"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Alignment">
            <input className="sheet-input" value={char.alignment} onChange={e => update({ alignment: e.target.value })} />
          </Field>
          <Field label="Race">
            <input className="sheet-input" value={char.race} onChange={e => update({ race: e.target.value })} />
          </Field>
          <Field label="Class">
            <input className="sheet-input" value={char.charClass} onChange={e => update({ charClass: e.target.value })} />
          </Field>
          <Field label="Level">
            <input className="sheet-input" value={char.level} onChange={e => update({ level: e.target.value })} />
          </Field>
        </div>
      </SheetCard>

      {/* Experience + Wealth side by side on larger screens, stacked on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SheetCard title="Experience">
          <Field label="Total XP">
            <input className="sheet-input" value={char.totalXp} onChange={e => update({ totalXp: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Next Level">
              <input className="sheet-input" value={char.nextLevel} onChange={e => update({ nextLevel: e.target.value })} />
            </Field>
            <Field label="Bonus %">
              <input className="sheet-input" value={char.bonusXp} onChange={e => update({ bonusXp: e.target.value })} />
            </Field>
          </div>
        </SheetCard>

        <SheetCard title="Wealth">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Field label="Gold">
                <input className="sheet-input" value={char.gold} onChange={e => update({ gold: e.target.value })} />
              </Field>
              <Field label="Silver">
                <input className="sheet-input" value={char.silver} onChange={e => update({ silver: e.target.value })} />
              </Field>
              <Field label="Copper">
                <input className="sheet-input" value={char.copper} onChange={e => update({ copper: e.target.value })} />
              </Field>
            </div>
            <Field label="Gems / Other">
              <textarea
                className="sheet-textarea"
                style={{ height: '88px' }}
                value={char.gems}
                onChange={e => update({ gems: e.target.value })}
              />
            </Field>
          </div>
        </SheetCard>
      </div>

      {/* Portrait */}
      <SheetCard title="Portrait">
        <input
          type="file"
          ref={fileRef}
          accept="image/*"
          className="hidden"
          onChange={handlePortraitFile}
        />
        {!char.portraitUrl ? (
          <div className="flex flex-col items-center gap-3 py-8 border-2 border-dashed border-[#d8d0bb] rounded-lg">
            <img src={ADND_LOGO} alt="AD&D 2e" className="h-16 opacity-40" />
            <p className="font-cinzel text-xs text-[#6b6555] tracking-widest uppercase">Add Portrait</p>
            <div className="flex gap-3">
              <button
                className="flex items-center gap-1.5 px-3 py-2 bg-[#2f3550] text-[#e6c35a] border border-[#7a6218] rounded text-xs font-cinzel"
                onClick={() => {
                  const url = prompt('Enter portrait URL:', 'https://');
                  if (url) update({ portraitUrl: url });
                }}
              >
                🔗 URL
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-2 bg-[#2f3550] text-[#e6c35a] border border-[#7a6218] rounded text-xs font-cinzel"
                onClick={() => fileRef.current?.click()}
              >
                ⬆ Upload
              </button>
            </div>
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={char.portraitUrl}
              alt="Portrait"
              className="w-full max-h-72 object-cover rounded-lg block"
              onError={() => update({ portraitUrl: '' })}
            />
            <div className="absolute inset-0 flex items-end justify-center gap-3 p-3 opacity-0 hover:opacity-100 active:opacity-100 transition-opacity bg-black/40 rounded-lg">
              <button
                className="flex items-center gap-1.5 px-3 py-2 bg-black/70 text-[#e6c35a] border border-[#7a6218] rounded text-xs font-cinzel backdrop-blur-sm"
                onClick={() => {
                  const url = prompt('Enter portrait URL:', char.portraitUrl.startsWith('data:') ? 'https://' : char.portraitUrl);
                  if (url !== null) update({ portraitUrl: url });
                }}
              >
                🔗 URL
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-2 bg-black/70 text-[#e6c35a] border border-[#7a6218] rounded text-xs font-cinzel backdrop-blur-sm"
                onClick={() => fileRef.current?.click()}
              >
                ⬆ Upload
              </button>
              <button
                className="flex items-center gap-1.5 px-3 py-2 bg-black/70 text-red-400 border border-red-800 rounded text-xs font-cinzel backdrop-blur-sm"
                onClick={() => update({ portraitUrl: '' })}
              >
                ✕ Remove
              </button>
            </div>
          </div>
        )}
      </SheetCard>
    </div>
  );
}
