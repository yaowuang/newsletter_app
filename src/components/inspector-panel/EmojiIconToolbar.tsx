import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface EmojiToolbarProps {
  onInsert: (token: string) => void;
}

// Added number keycap emojis 0-9 at the end for quick numeric annotations
const emojiAndIconList = [
  '😀','😁','😂','🤣','😊','😍','🤔','😎','😭','😡','👍','👎','🙏','🎉','❤️','🎀','🌹','☘️','✨','🔥','💡','✅','❌','⚠️','⭐','📌','📎','📝','📣','🔔','🧪','🛠️','📊','📅','🚀','💼','💻','🧠','🔒','🧾',
  '🎨','🖼️','🚨','📦','🧩','📚',
  '🏫','🎒','✏️',
  '☀️','🏖️','🏝️','🌊','🍦','🩴','🏐',
  '0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣'
];

export const EmojiToolbar: React.FC<EmojiToolbarProps> = ({ onInsert }) => {
  return (
    <div className="flex items-center gap-2 pt-1 flex-wrap">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" size="sm">😊 Emojis</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-56 w-64 overflow-y-auto grid grid-cols-8 gap-1 p-2">
          {emojiAndIconList.map(e => (
            <DropdownMenuItem key={e} className="justify-center px-0" onSelect={(ev) => { ev.preventDefault(); onInsert(e); }}>
              {e}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default EmojiToolbar;
