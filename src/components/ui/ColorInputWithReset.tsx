import { RefreshCcw } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ColorInputWithResetProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onReset?: () => void;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export const ColorInputWithReset: React.FC<ColorInputWithResetProps> = ({
  id,
  value,
  onChange,
  onReset,
  disabled,
  size = "md",
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Input
        id={id}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn("p-0 border-none cursor-pointer", size === "sm" ? "w-8 h-8" : "w-10 h-10")}
        aria-label="Color picker"
      />
      {onReset && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onReset}
          disabled={disabled}
          aria-label="Reset color"
          className="h-8 w-8"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};

export default ColorInputWithReset;
