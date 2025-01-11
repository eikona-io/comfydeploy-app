import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SelectionBoxProps {
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  leftHeader: ReactNode;
  rightHeader?: ReactNode;
  description: ReactNode;
  className?: string;
}

export function SelectionBox({
  selected,
  disabled,
  onClick,
  leftHeader,
  rightHeader,
  description,
  className,
}: SelectionBoxProps) {
  return (
    <div
      className={cn(
        "flex cursor-pointer flex-col justify-center rounded-lg border p-4 transition-all duration-200",
        "hover:border-gray-400 hover:bg-gray-50",
        disabled && "cursor-not-allowed opacity-50",
        selected
          ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2 bg-blue-100/50 opacity-100"
          : "border-gray-200 opacity-60",
        className,
      )}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center justify-between">
        <div>{leftHeader}</div>
        {rightHeader && <div>{rightHeader}</div>}
      </div>
      <div className="font-mono text-[11px] text-gray-400">{description}</div>
    </div>
  );
}
