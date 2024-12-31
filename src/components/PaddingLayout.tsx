import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PaddingLayout({
  children,
  className,
}: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("px-2 md:px-10 w-full h-full relative", className)}>
      {children}
    </div>
  );
}
