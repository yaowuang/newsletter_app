import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface EmojiToolbarProps {
  onInsert: (token: string) => void;
}

const emojiAndIconList = ['😀','😁','😂','🤣','😊','😍','🤔','😎','😭','😡','👍','👎','🙏','🎉','✨','🔥','💡','✅','❌','⚠️','⭐','📌','📎','📝','📣','🔔','🧪','🛠️','📊','📅','🚀','💼','💻','🧠','🔒','🧾'];

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
