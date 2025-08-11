import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface EmojiIconToolbarProps {
  onInsert: (token: string) => void;
}

const emojiList = ['😀','😁','😂','🤣','😊','😍','🤔','😎','😭','😡','👍','👎','🙏','🎉','✨','🔥','💡','✅','❌','⚠️'];
const iconList = ['⭐','📌','📎','📝','📣','🔔','🧪','🛠️','📊','📅','🚀','💼','💻','🧠','🔒','🧾'];

export const EmojiIconToolbar: React.FC<EmojiIconToolbarProps> = ({ onInsert }) => {
  return (
    <div className="flex items-center gap-2 pt-1 flex-wrap">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" size="sm">Emoji 😊</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-56 w-56 overflow-y-auto grid grid-cols-6 gap-1 p-2">
          {emojiList.map(e => (
            <DropdownMenuItem key={e} className="justify-center px-0" onSelect={(ev) => { ev.preventDefault(); onInsert(e); }}>
              {e}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" size="sm">Icons ⭐</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-56 w-56 overflow-y-auto grid grid-cols-6 gap-1 p-2">
          {iconList.map(e => (
            <DropdownMenuItem key={e} className="justify-center px-0" onSelect={(ev) => { ev.preventDefault(); onInsert(e); }}>
              {e}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default EmojiIconToolbar;
