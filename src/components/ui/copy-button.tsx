"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Button, ButtonProps } from "./button";
import { cn } from "@/lib/utils";

export function CopyButton({
  className,
  children,
  hideLabel = false,
  variant,
  ...props
}: {
  text: string;
  className?: string;
  hideLabel?: boolean,
  children?: React.ReactNode;
  variant?: ButtonProps["variant"];
}) {
  const [buttonText, setButtonText] = useState("Copy");

  const handleClick = async () => {
    await navigator.clipboard.writeText(props.text);
    toast.success("Copied to clipboard");
    setButtonText("Copied");
    setTimeout(() => {
      setButtonText("Copy");
    }, 2000);
  };

  return (
    <Button
      variant={"expandIcon"}
      type="button"
      onClick={handleClick}
      Icon={Copy}
      iconPlacement="right"
      className={cn("flex w-fit min-h-0", className)}
    >
      {children} {!hideLabel && buttonText}
    </Button>
  );
}
