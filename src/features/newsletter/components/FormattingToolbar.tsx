import type React from "react";
import { Button } from "@/components/ui/button";

export type FormattingAction = "bold" | "italic" | "ul" | "ol" | "link" | "table" | "hr";

interface FormattingToolbarProps {
  onAction: (action: FormattingAction) => void;
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({ onAction }) => {
  return (
    <div className="flex flex-wrap gap-1 mb-1 text-xs">
      <Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => onAction("bold")}>
        <strong>B</strong>
      </Button>
      <Button type="button" size="sm" variant="outline" className="h-7 px-2 italic" onClick={() => onAction("italic")}>
        I
      </Button>
      <Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => onAction("ul")}>
        • List
      </Button>
      <Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => onAction("ol")}>
        1. List
      </Button>
      <Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => onAction("link")}>
        Link
      </Button>
      <Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => onAction("table")}>
        Table
      </Button>
      <Button type="button" size="sm" variant="outline" className="h-7 px-2" onClick={() => onAction("hr")}>
        HR
      </Button>
    </div>
  );
};

export default FormattingToolbar;
