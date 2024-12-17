"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export async function callServerPromise<T>(
	result: Promise<T>,
	props?: {
		loadingText?: string;
		errorAction?: {
			name: string;
			action: () => void;
		};
	},
) {
	let id: string | number;
	if (props?.loadingText) {
		id = toast.loading(props.loadingText);
	}
	return result
		.then((x) => {
			// delay toast to show
			setTimeout(() => {
				if ((x as { message: string })?.message !== undefined) {
					toast.success((x as { message: string }).message);
				} else if ((x as { error: string })?.error !== undefined) {
					const error = (x as { error: string }).error;
					reportError(error);
				}

				// if ((x as { redirect: string })?.redirect !== undefined) {
				//   props?.router?.push((x as { redirect: string }).redirect);
				// }
			}, 500);

			return x;
		})
		.catch((error) => {
			console.log(error);
			console.log(error?.length);
			reportError(error?.toString(), props?.errorAction);
			return null;
		})
		.finally(() => {
			if (id !== undefined) toast.dismiss(id);
		});
}

function reportError(
	error: string,
	errorAction?: {
		name: string;
		action: () => void;
	},
) {
	const max = 20;
	// if (error?.length > max) {
	toast.error(
		<div className="flex flex-col justify-between items-start w-full gap-2">
			<span className="font-medium">{error}</span>
			<div className="w-full flex justify-end gap-2">
				{/* <Link target="_blank" href={"https://discord.gg/e5ZYBSvr"}> */}
				<Button
					variant="outline"
					className="px-2 h-fit py-0 min-h-0 text-2xs"
					onClick={async () => {
						await navigator.clipboard.writeText(`Error: 
\`\`\`
${error}
\`\`\`
`);
						window.open("https://discord.gg/q6HVeCxvCK", "_blank");
					}}
				>
					Report
				</Button>

				{errorAction && (
					<Button
						confirm
						variant="outline"
						className="px-2 h-fit py-0 min-h-0 text-2xs"
						onClick={errorAction.action}
					>
						{errorAction.name}
					</Button>
				)}
				{/* </Link> */}
			</div>
		</div>,
	);
	// } else {
	//   toast.error(error?.toString());
	// }
}
