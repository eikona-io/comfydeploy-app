import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

export function LoadingIcon(props: { className?: string }) {
  return (
    <LoaderCircle size={16} className={cn("animate-spin", props.className)} />
  );
}
