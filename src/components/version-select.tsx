"use client";

import {
	getAllWorkflowVersion,
} from "@/server/getAllUserWorkflow";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
	Check,
	ChevronDown,
} from "lucide-react";
import * as React from "react";
import { useMemo } from "react";
import { parseAsInteger, useQueryState } from "nuqs";
import { getRelativeTime } from "@/lib/getRelativeTime";
import { useCurrentWorkflow } from "@/hooks/useCurrentWorkflow";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirmServerActionDialog } from "@/components/ui/auto-form/auto-form-dialog";
import { sendWorkflow } from "@/lib/sendEventToCD";
import { CopyWorkflowVersion } from "@/components/VersionSelect";
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
} from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { useWorkflowVersion } from "@/components/WorkflowList";
import { useDebounce } from "use-debounce";
import { useIsAdminAndMember, useIsAdminOnly } from "@/components/permissions";
import { useQuery } from "@tanstack/react-query";
import { VirtualizedInfiniteList } from "./virtualized-infinite-list";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWorkflowStore } from "@/repo/components/ui/custom/workspace/Workspace";

export function WorkflowLastEditTime({
	workflow_id,
}: {
	workflow_id: string;
}) {
	const { workflow } = useCurrentWorkflow(workflow_id);
	if (!workflow) return <Skeleton className="w-36 h-4 py-1" />;
	return <div>{getRelativeTime(workflow?.updated_at)}</div>;
}

export function useSelectedVersion(workflow_id: string) {
	const { workflow } = useCurrentWorkflow(workflow_id);

	const [version, setVersion] = useQueryState("version", {
		defaultValue: workflow?.versions?.[0].version ?? 1,
		...parseAsInteger,
	});

	// const {

	// } = useWorkflowVersion(workflow_id);

	const {
		data: versionData,
		isLoading,
		status,
	} = useQuery<any>({
		queryKey: ["workflow", workflow_id, "version", version.toString()],
	});

	// const {
	//   data: versions,
	//   isLoading,
	//   isValidating,
	// } = useSWR(
	//   workflow?.id + "-version",
	//   async () => {
	//     return getAllWorkflowVersion(workflow!.id, 0, 50);
	//   },
	//   {
	//     refreshInterval: 5000,
	//     dedupingInterval: 5000,
	//     revalidateOnFocus: false,
	//     revalidateIfStale: false,
	//     // revalidateOnMount: false,
	//   },
	// );

	// const value = versions?.find((x) => x.version == version);

	return {
		value: versionData,
		// versions,
		setVersion,
		isLoading: isLoading || status === "pending",
		isValidating: status === "pending",
	};
}

export function VersionSelectV2({
	workflow_id,
	path,
	onSelect,
	selectedVersion,
	className,
}: {
	workflow_id: string;
	path?: string;
	onSelect?: (version: WorkflowType) => void;
	selectedVersion?: any;
	className?: string;
}) {
	const [open, setOpen] = React.useState(false);
	const [searchValue, setSearchValue] = React.useState("");
	const [debouncedSearchValue] = useDebounce(searchValue, 250);

	const query = useWorkflowVersion(workflow_id, debouncedSearchValue);

	const flatData = React.useMemo(
		() => query.data?.pages.flatMap((page) => page) ?? [],
		[query.data],
	);

	React.useEffect(() => {
		query.refetch();
	}, [debouncedSearchValue]);

	const [_version, setVersion] = useQueryState("version", {
		defaultValue: selectedVersion?.version ?? flatData[0]?.version ?? 1,
		...parseAsInteger,
	});

	const version = selectedVersion?.version || _version;

	const value = useMemo<any>(() => {
		if (selectedVersion) return selectedVersion;

		return flatData?.find((x) => x.version == version);
	}, [flatData !== undefined, version, selectedVersion]);

	const { dialog, setOpen: setOpenDialog } = useConfirmServerActionDialog<any>({
		title: "Load to workspace",
		description:
			"This will load the workflow from the selected version to workspace, which will override the current workflow",
		action: async (value) => {
			sendWorkflow(value.workflow);
			setVersion(value.version);
		},
	});

	const { hasChanged } = useWorkflowStore();

	const isAdminOnly = useIsAdminOnly();
	const isAdminAndMember = useIsAdminAndMember();

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="ghost"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"w-full justify-between flex px-2 py-1 border-0 bg-transparent hover:bg-gray-2000",
						className,
					)}
				>
					<span className="w-full flex gap-2 truncate text-ellipsis text-start text-sm">
						<Badge className="relative inline-block">
							v{value?.version || version}
							{hasChanged && "*"}
						</Badge>
					</span>
					<ChevronDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[375px] p-0 overflow-hidden" side="bottom">
				{dialog}

				<div className="relative p-2">
					<Search className="absolute left-6 top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2" />
					<Input
						placeholder="Search versions..."
						className="pl-12 text-sm"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
				</div>
				<VirtualizedInfiniteList
					queryResult={query}
					renderItem={(item) => (
						<VersionRow
							item={item as any}
							selected={version}
							onSelect={(item) => {
								if (onSelect) {
									onSelect(item);
								} else {
									if (hasChanged) {
										setOpenDialog(item);
									} else {
										setVersion(item.version);
										sendWorkflow(item.workflow);
									}
								}
							}}
							isAdminAndMember={isAdminAndMember}
							setOpen={setOpenDialog}
						/>
					)}
					renderLoading={() => <LoadingRow />}
					estimateSize={100}
				/>
				{/* )} */}
			</PopoverContent>
		</Popover>
	);
}

type WorkflowType = NonNullable<
	Awaited<ReturnType<typeof getAllWorkflowVersion>>
>[0];

function VersionRow({
	item,
	selected,
	onSelect,
	isAdminAndMember,
	setOpen,
}: {
	item: WorkflowType;
	selected: number;
	onSelect: (value: WorkflowType) => void;
	isAdminAndMember: boolean;
	setOpen: (workflow: any) => void;
}) {
	return (
		<div className="flex items-start space-x-4 text-sm p-3 transition-colors">
			<div className="flex-shrink-0 w-8 relative">
				<Avatar className="w-6 h-6">
					<AvatarImage src={(item as any).user_icon ?? undefined} />
					<AvatarFallback>{item.user?.name?.[0]}</AvatarFallback>
				</Avatar>
			</div>
			<div className="flex-grow overflow-hidden">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2 min-w-0">
						<Badge variant="secondary" className="text-xs flex-shrink-0">
							v{item.version}
						</Badge>
						<Tooltip>
							<TooltipTrigger>
								<span className="font-medium text-xs truncate">
									{item.user?.name}
								</span>
							</TooltipTrigger>
							<TooltipContent className="max-w-[200px]">
								{item.user?.name}
							</TooltipContent>
						</Tooltip>
					</div>
					<span className="text-muted-foreground text-xs flex-shrink-0 ml-2">
						{getRelativeTime(item.created_at)}
					</span>
				</div>
				<Tooltip>
					<TooltipTrigger className="block w-full text-left">
						<p className="mt-1 text-xs truncate">{item.comment || "-"}</p>
					</TooltipTrigger>
					<TooltipContent className="max-w-[300px] whitespace-normal break-words">
						{item.comment || "-"}
					</TooltipContent>
				</Tooltip>
				<div className="mt-2 flex flex-wrap gap-2">
					{isAdminAndMember && (
						<>
							{/* <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setOpen(item);
                  
                }}
              >
                <Edit className="h-3 w-3 mr-1" /> Edit
              </Button> */}
							<CopyWorkflowVersion
								workflow_id={item.workflow_id}
								version={item.version}
								className="h-7 text-xs"
							/>
						</>
					)}
					<Button
						variant={selected === item.version ? "default" : "outline"}
						size="sm"
						className="h-7 text-xs"
						onClick={() => onSelect(item)}
					>
						{selected === item.version && <Check className="h-3 w-3 mr-1" />}
						{selected === item.version ? "Active" : "Set Active"}
					</Button>
				</div>
			</div>
		</div>
	);
}

function LoadingRow() {
	return (
		<div className="flex items-center space-x-4 text-sm p-3">
			<Skeleton className="w-6 h-6 rounded-full" />
			<div className="flex-grow">
				<Skeleton className="h-4 w-20 mb-2" />
				<Skeleton className="h-3 w-full mb-2" />
				<div className="flex space-x-2">
					<Skeleton className="h-7 w-16" />
					<Skeleton className="h-7 w-16" />
					<Skeleton className="h-7 w-20" />
				</div>
			</div>
		</div>
	);
}

function LoadingState() {
	return (
		<div className="flex flex-col space-y-4 p-4">
			{[...Array(5)].map((_, index) => (
				<LoadingRow key={index} />
			))}
		</div>
	);
}

function LoadingSpinner() {
	return (
		<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
	);
}
