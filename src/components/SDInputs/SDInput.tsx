"use client";

import { Badge } from "@/components/ui/badge";
import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import React, { type ReactNode } from "react";

type SDTextareaProps = InputProps & {
  label?: string;
  header?: ReactNode;
  inputClasses?: string;
};

export const SDInput = React.forwardRef<HTMLInputElement, SDTextareaProps>(
  ({ label, header, className, inputClasses, ...props }, ref) => {
    return (
      <div className={className}>
        {header}
        <Input ref={ref} className={cn(inputClasses)} {...props} id={label} />
      </div>
    );
  },
);
