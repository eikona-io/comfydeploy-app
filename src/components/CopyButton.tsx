"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function CopyButton({
	className,
	children,
	hideLabel = false,
	variant,
	hideIcon = false,
	...props
}: {
	text: string;
	className?: string;
	hideLabel?: boolean;
	children?: React.ReactNode;
	variant?: ButtonProps["variant"];
	hideIcon?: boolean;
}) {
	const [buttonText, setButtonText] = useState("Copy");

	const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
		await navigator.clipboard.writeText(props.text);
		toast.success("Copied to clipboard");
		setButtonText("Copied");
		setTimeout(() => {
			setButtonText("Copy");
		}, 2000);
	};

	if (hideIcon) {
		return (
			<Button
				variant={variant ?? "expandIcon"}
				type="button"
				onClick={handleClick}
				className={cn("flex w-fit min-h-0", className)}
			>
				{children} {!hideLabel && buttonText}
			</Button>
		);
	}

	return (
		<Button
			variant={variant ?? "expandIcon"}
			iconPlacement="right"
			type="button"
			onClick={handleClick}
			Icon={Copy}
			className={cn("flex w-fit min-h-0", className)}
		>
			{children} {!hideLabel && buttonText}
		</Button>
	);
}
