import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function InfoItem({
    label,
    value,
    className,
  }: {
    label: string;
    value: ReactNode;
    className?: string;
  }) {
    return (
      <div className={cn(className)}>
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    );
  }