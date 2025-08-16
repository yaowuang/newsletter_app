import type * as React from "react";
import { Label } from "@/components/ui/label";
import { UI_CONSTANTS } from "@/lib/ui-constants";
import { cn } from "@/lib/utils";

interface FormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  id: string;
  inline?: boolean;
  labelClassName?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  label,
  id,
  children,
  className,
  inline = false,
  labelClassName,
  ...rest
}) => {
  return (
    <div className={cn(inline ? "flex items-center gap-3" : UI_CONSTANTS.spacing.form, className)} {...rest}>
      <Label htmlFor={id} className={cn(UI_CONSTANTS.form.label, inline && "min-w-[90px] text-xs", labelClassName)}>
        {label}
      </Label>
      {children}
    </div>
  );
};

export default FormGroup;
