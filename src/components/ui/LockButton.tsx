import { Lock, Unlock } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";

interface LockButtonProps extends Omit<React.ComponentProps<typeof Button>, "onChange"> {
  locked: boolean;
  onToggle: () => void;
  labelLocked?: string;
  labelUnlocked?: string;
}

export const LockButton: React.FC<LockButtonProps> = ({
  locked,
  onToggle,
  labelLocked = "Unlock",
  labelUnlocked = "Lock",
  ...rest
}) => {
  return (
    <Button
      type="button"
      size="sm"
      variant={locked ? "secondary" : "outline"}
      aria-pressed={locked}
      aria-label={locked ? "Unlock element" : "Lock element"}
      onClick={onToggle}
      {...rest}
    >
      {locked ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
      <span className="sr-only sm:not-sr-only">{locked ? labelLocked : labelUnlocked}</span>
    </Button>
  );
};

export default LockButton;
