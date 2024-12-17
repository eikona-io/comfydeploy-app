"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, ExternalLink, Search } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import * as React from "react";
import { useMemo, useRef, useState } from "react";
import { DialogTemplate } from "@/components/dialog-template";
import { Label } from "@/components/ui/label";
import { callServerPromise } from "@/lib/call-server-promise";
import { useDebounce } from "use-debounce";
import { useWorkflowList } from "@/hooks/use-workflow-list";
import { VirtualizedInfiniteList } from "./virtualized-infinite-list";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "@/components/ui/avatar";
import { useCurrentWorkflow } from "@/hooks/use-current-workflow";
import { renameWorkflow } from "./workflow-api";

export function WorkflowDropdown({
	workflow_id,
	path,
	path_suffix,
	className,
}: {
	workflow_id: string;
	path?: string;
	path_suffix?: string;
	className?: string;
}) {
	const [open, setOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [debouncedSearchValue] = useDebounce(searchValue, 250);
	const [renameModalOpen, setRenameModalOpen] = useState(false);
	const [renameValue, setRenameValue] = useState("");

	const router = useRouter();

	const query = useWorkflowList(debouncedSearchValue);

	const workflows = useMemo(
		() => query.data?.pages.flatMap((page) => page) ?? [],
		[query.data],
	);

	const { workflow } = useCurrentWorkflow(workflow_id);

	// const value = useMemo(
	//   () => workflows.find((x) => x?.id === workflow_id),
	//   [workflow_id, workflows],
	// );

	React.useEffect(() => {
		query.refetch();
	}, [debouncedSearchValue]);

	// const containerRef = useRef<HTMLDivElement>(null);

	const openRenameDialog = () => {
		setRenameValue(workflow?.name || "");
		setRenameModalOpen(true);
	};

	return (
		<>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<button
						// variant="ghost"
						role="combobox"
						aria-expanded={open}
						className={cn(
							"items-center text-sm w-full justify-between flex px-2 py-1 hover:bg-gray-50 rounded-sm ",
							className,
						)}
						onDoubleClick={openRenameDialog}
					>
						<span className="truncate text-ellipsis text-start">
							{workflow?.name}
						</span>
						<ChevronsUpDown className="opacity-50 flex-shrink-0" size={16} />
					</button>
				</PopoverTrigger>
				<PopoverContent className="w-[375px] p-0 overflow-hidden" side="bottom">
					<div className="relative p-2">
						<Search className="absolute left-6 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
						<Input
							className="pl-12 text-sm"
							placeholder="Search workflows"
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
						/>
					</div>
					<VirtualizedInfiniteList
						queryResult={query}
						renderItem={(item) => (
							<WorkflowItem
								key={item.id}
								item={item}
								selected={workflow}
								onSelect={(selectedItem) => {
									const href =
										(path ? path : "/workflows/") +
										selectedItem.id +
										(path_suffix ? path_suffix : "");
									router.push(href);
								}}
							/>
						)}
						renderLoading={() => <LoadingWorkflowItem />}
						estimateSize={68}
					/>
				</PopoverContent>
			</Popover>

			<DialogTemplate
				open={renameModalOpen}
				onOpenChange={setRenameModalOpen}
				title="Rename"
				onCancel={() => setRenameModalOpen(false)}
				onConfirm={async () => {
					setRenameModalOpen(false);
					await callServerPromise(renameWorkflow(renameValue, workflow_id), {
						loadingText: "Renaming workflow",
					});
					query.refetch();
				}}
				onConfirmBtnProps={{
					disabled: renameValue === "" || renameValue === workflow?.name,
					className:
						renameValue === "" || renameValue === workflow?.name
							? "opacity-50"
							: "",
				}}
				workflowName={workflow?.name || ""}
			>
				<Label className="pb-4">
					Please enter a new name for this workflow.
				</Label>
				<Input
					className="mt-3"
					value={renameValue}
					onChange={(e) => setRenameValue(e.target.value)}
				/>
			</DialogTemplate>
		</>
	);
}

function WorkflowItem({
	item,
	selected,
	onSelect,
}: {
	item: { id: string; name: string; user_name: string };
	selected: { id: string } | undefined;
	onSelect: (item: {
		id: string;
		name: string;
		user_name: string;
	}) => void;
}) {
	return (
		<div
			className="flex hover:bg-gray-200 transition-colors items-center overflow-hidden"
			onClick={() => onSelect(item)}
		>
			<div className="max-w-[calc(100%-48px)] flex-shrink py-2 px-4 text-xs h-full gap-2 w-[375px] flex relative items-center">
				<div className="w-full flex flex-col gap-1">
					<div className="overflow-hidden whitespace-nowrap">
						<span
							className="inline-block animate-marquee"
							style={{ "--duration": "10s" } as React.CSSProperties}
						>
							{item?.name}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<Avatar className="w-5 h-5">
							<AvatarImage src={(item as any).user_icon} alt={item.user_name} />
							<AvatarFallback>{item.user_name.charAt(0)}</AvatarFallback>
						</Avatar>
						<Badge className="truncate max-w-full w-fit whitespace-nowrap">
							{item?.user_name}
						</Badge>
					</div>
				</div>
				<div>
					<Check
						className={cn(
							"ml-auto h-4 w-4",
							selected?.id == item.id ? "opacity-100" : "opacity-0",
						)}
					/>
				</div>
			</div>
			<div className="h-full flex-col items-center justify-center">
				<Button variant="ghost" asChild>
					<a href={"/workflows/" + item.id} target="_blank" rel="noreferrer">
						<ExternalLink size={14} />
					</a>
				</Button>
			</div>
		</div>
	);
}

function LoadingWorkflowItem() {
	return (
		<div className="flex items-center space-x-4 text-sm p-3">
			<Skeleton className="w-6 h-6 rounded-full" />
			<div className="flex-grow">
				<Skeleton className="h-4 w-20 mb-2" />
				<Skeleton className="h-3 w-full" />
			</div>
			<Skeleton className="h-6 w-6" />
		</div>
	);
}
