import type * as React from "react";
import { UI_CONSTANTS } from "@/lib/ui-constants";
import { cn } from "@/lib/utils";

interface InspectorSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  actions?: React.ReactNode;
  noPadBody?: boolean;
}

export const InspectorSection: React.FC<InspectorSectionProps> = ({
  title,
  actions,
  className,
  children,
  noPadBody,
  ...rest
}) => {
  return (
    <section
      className={cn(
        UI_CONSTANTS.backgrounds.section,
        UI_CONSTANTS.spacing.section,
        "focus-within:ring-1 focus-within:ring-blue-500/30 outline-none",
        className,
      )}
      {...rest}
    >
      {(title || actions) && (
        <header className="flex items-start justify-between gap-3">
          {title && (
            <h3 className={cn("font-semibold text-sm leading-none tracking-wide", "text-gray-800 dark:text-gray-100")}>
              {title}
            </h3>
          )}
          {actions && (
            <div className="flex items-center gap-2" role="group">
              {actions}
            </div>
          )}
        </header>
      )}
      <div className={cn(noPadBody && "-m-4 -mt-2 p-4", "space-y-3")}>{children}</div>
    </section>
  );
};

export default InspectorSection;
