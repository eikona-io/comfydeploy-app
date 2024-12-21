"use client";
import { EditAttention } from "@/components/SDInputs/editAttention";
import { Textarea, type TextareaProps } from "@/components/ui/textarea";
import React, { type ReactNode, useEffect } from "react";

type SDTextareaProps = TextareaProps & {
  label?: string;
  header?: ReactNode;
  textareaClasses?: string;
};

export const SDTextarea = React.forwardRef<
  HTMLTextAreaElement,
  SDTextareaProps
>(({ label, header, textareaClasses, className, ...props }, ref) => {
  useEffect(() => {
    window.addEventListener("keydown", EditAttention);
    // Cleanup event listener
    return () => {
      window.removeEventListener("keydown", EditAttention);
    };
  }, []);
  return (
    <div className={className}>
      {header}
      <Textarea ref={ref} className={textareaClasses} {...props} id={label} />
    </div>
  );
});
