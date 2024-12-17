"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	MoreHorizontal,
	Edit,
	Play,
	Image,
	Code,
	PinIcon,
	Workflow,
	AlertCircle,
} from "lucide-react";
import * as React from "react";
import { getRelativeTime } from "../lib/get-relative-time";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { callServerPromise } from "@/lib/call-server-promise";

import {
	cloneWorkflow,
	renameWorkflow,
	deleteWorkflow,
	pinWorkflow,
} from "@/components/workflow-api";

import { DialogTemplate } from "@/components/dialog-template";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/clerk-react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { FileURLRender } from "@/components/output-render";

import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { AdminAndMember, useIsAdminAndMember } from "@/components/permissions";
import { useCurrentPlan, useCurrentPlanQuery } from "@/hooks/use-current-plan";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useWorkflowList } from "../hooks/use-workflow-list";

export function useWorkflowVersion(
	workflow_id: string,
	debouncedSearchValue?: string,
) {
	const BATCH_SIZE = 5;
	return useInfiniteQuery<any[]>({
		queryKey: ["workflow", workflow_id, "versions"],
		meta: {
			limit: BATCH_SIZE,
			offset: 0,
			params: {
				search: debouncedSearchValue ?? "",
			},
		},
		getNextPageParam: (lastPage, allPages) => {
			// Check if lastPage is defined and has a length property
			if (
				lastPage &&
				Array.isArray(lastPage) &&
				lastPage.length === BATCH_SIZE
			) {
				return allPages.length * BATCH_SIZE;
			}
			return undefined;
		},
		initialPageParam: 0,
	});
}

export function WorkflowList() {
	const [modalType, setModalType] = React.useState<"json" | "new" | null>(null);
	const [view, setView] = React.useState<"list" | "grid">("grid");

	const user = useUser();
	const sub = useCurrentPlan();

	const [searchValue, setSearchValue] = React.useState<string | null>(null);
	const [debouncedSearchValue] = useDebounce(searchValue, 250);

	const {
		data: workflowsFromPythonApi,
		isLoading,
		refetch,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useWorkflowList(debouncedSearchValue ?? "");

	const parentRef = React.useRef<HTMLDivElement>(null);
	useInfiniteScroll(parentRef, fetchNextPage, hasNextPage, isFetchingNextPage);

	const flatData = React.useMemo(
		() => workflowsFromPythonApi?.pages.flatMap((page) => page) ?? [],
		[workflowsFromPythonApi],
	);

	React.useEffect(() => {
		refetch();
	}, [debouncedSearchValue]);

	return (
		<div className="flex flex-col h-full w-full">
			<div className="flex flex-row w-full items-center py-4 px-4 gap-2">
				<Input
					placeholder="Filter workflows..."
					value={searchValue ?? ""}
					onChange={(event) => {
						if (event.target.value === "") {
							setSearchValue(null);
						} else {
							setSearchValue(event.target.value);
						}
					}}
					className="max-w-sm"
				/>
				<AdminAndMember>
					<div className="ml-auto flex gap-2">
						<Tooltip>
							<TooltipTrigger>
								{sub && (
									<Badge
										className={cn(
											sub?.features.workflowLimited
												? "border-gray-400 text-gray-500"
												: "",
										)}
									>
										<div className="text-xs items-center flex gap-2 px-2">
											{sub?.features.currentWorkflowCount}/
											{sub?.features.workflowLimit}
										</div>
									</Badge>
								)}
							</TooltipTrigger>
							<TooltipContent>
								<p>
									Current workflows: {sub?.features.currentWorkflowCount} / Max:{" "}
									{sub?.features.workflowLimit}
								</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</AdminAndMember>
			</div>
			<ScrollArea className="flex-grow" ref={parentRef}>
				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4 mx-auto">
						{Array.from({ length: 8 }, (_, index) => (
							<WorkflowCardSkeleton key={index} />
						))}
					</div>
				) : flatData?.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full absolute inset-0 text-center p-4">
						{debouncedSearchValue ? (
							<>
								<h3 className="text-lg font-semibold mb-2">No results found</h3>
								<p className="text-muted-foreground mb-4">
									Try adjusting your search or filter to find what you're
									looking for.
								</p>
							</>
						) : (
							<>
								<h3 className="text-lg font-semibold mb-2">
									Welcome{" "}
									{user.user?.username ??
										(user.user?.firstName ?? "") +
											" " +
											(user.user?.lastName ?? "")}
								</h3>
								<p className="text-muted-foreground mb-4">
									Click the + button in the bottom right to create your first
									workflow
								</p>
							</>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4 mx-auto px-4">
						{flatData &&
							flatData.map((workflow) => (
								<WorkflowCard
									key={workflow.id}
									workflow={workflow}
									mutate={refetch}
								/>
							))}
						{isFetchingNextPage && (
							<>
								{Array.from({ length: 8 }, (_, index) => (
									<WorkflowCardSkeleton key={index} />
								))}
							</>
						)}
					</div>
				)}
			</ScrollArea>
		</div>
	);
}

function WorkflowCardSkeleton() {
	return (
		<div className="flex flex-col w-full md:max-w-[320px]">
			<Card className="flex flex-col relative group overflow-hidden rounded-md h-[320px] w-full aspect-square">
				<div className="h-full w-full flex flex-col justify-center items-center">
					<Skeleton className="w-10 h-10 rounded-full mb-2" />
				</div>
				<div className="absolute top-2 right-2">
					<Skeleton className="h-8 w-8 rounded-full" />
				</div>
			</Card>
			<div className="px-2 pt-2 flex flex-col">
				<div className="flex justify-between items-center">
					<Skeleton className="h-5 w-3/4" />
					<Skeleton className="h-5 w-16" />
				</div>
				<div className="flex justify-between mt-1">
					<Skeleton className="h-4 w-1/3" />
					<Skeleton className="h-4 w-1/4" />
				</div>
			</div>
		</div>
	);
}

function WorkflowCard({
	workflow,
	mutate,
}: {
	workflow: any;
	mutate: () => void;
}) {
	const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
	const [modalOpen, setModalOpen] = React.useState<string>();
	const [renameValue, setRenameValue] = React.useState("");

	const { refetch: refetchPlan } = useCurrentPlanQuery();

	const openRenameDialog = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
		setRenameValue(workflow.name);
		setModalOpen("rename");
	};

	const isAdminAndMember = useIsAdminAndMember();

	const { data: latest_runs } = useQuery<any[]>({
		queryKey: ["workflow", workflow.id, "run", "latest"],
		queryKeyHashFn: (queryKey) => [...queryKey, "latest"].toString(),
	});

	const latest_output = latest_runs?.[0]?.outputs?.[0]?.data;
	const status = latest_runs?.[0]?.status;

	return (
		<>
			<DialogTemplate
				open={modalOpen === "rename"}
				onOpenChange={(open) => {
					if (!open) setModalOpen(undefined);
					setRenameValue(workflow.name);
				}}
				title="Rename"
				onCancel={() => setModalOpen(undefined)}
				onConfirm={async () => {
					setModalOpen(undefined);
					await callServerPromise(renameWorkflow(renameValue, workflow.id), {
						loadingText: "Renaming workflow",
					});
					mutate();
				}}
				onConfirmBtnProps={{
					disabled: renameValue === "" || renameValue === workflow.name,
					className:
						renameValue === "" || renameValue === workflow.name
							? "opacity-50"
							: "",
				}}
				workflowName={workflow.name}
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
			<Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
				<DialogContent className={cn("sm:max-w-[425px]")}>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							{"Delete"} <Badge variant={"secondary"}>{workflow.name}</Badge>
						</DialogTitle>
						<DialogDescription className="text-primary">
							Careful this is destructive and cannot be undone.
							<Alert variant="warning" className="mt-2">
								<AlertCircle className="w-4 h-4" />
								<AlertTitle>Warning</AlertTitle>
								<AlertDescription>
									Any existing runs will keep running, before deleting make sure
									your workflow is not currently running.
								</AlertDescription>
							</Alert>
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end w-full gap-2">
						<Button
							className="w-fit"
							variant={"outline"}
							onClick={() => {
								setDeleteModalOpen(false);
							}}
						>
							Cancel
						</Button>
						<Button
							className="w-fit"
							variant="destructive"
							onClick={async () => {
								await callServerPromise(deleteWorkflow(workflow.id), {
									loadingText: "Deleting workflow",
								});
								await refetchPlan();
								mutate();
								setDeleteModalOpen(false);
							}}
						>
							Delete
						</Button>
					</div>
				</DialogContent>
			</Dialog>
			<Link
				href={
					isAdminAndMember
						? `/workflows/${workflow.id}?view=workspace`
						: `/workflows/${workflow.id}?view=playground`
				}
				className="flex flex-col w-full md:max-w-[320px]"
			>
				<Card className="flex flex-col relative group overflow-hidden rounded-md h-[320px] w-full aspect-square">
					<div className="h-full w-full">
						{latest_output?.images?.[0] && latest_output.images[0].url ? (
							<FileURLRender
								url={latest_output.images[0].url}
								// alt={workflow.name}
								imgClasses="w-full h-full max-w-full max-h-full rounded-[8px] object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
							/>
						) : (
							<div className="flex flex-col justify-center items-center h-full ">
								<Workflow
									size={40}
									strokeWidth={1.5}
									className="text-gray-400 mb-2"
								/>
							</div>
						)}
					</div>
					<div className="absolute bottom-0 left-0 right-0 group-hover:opacity-100 opacity-0 transition-all duration-300 px-2 py-2">
						<div className="flex items-center justify-center gap-2">
							<AdminAndMember>
								<Button
									variant="default"
									size="sm"
									className="w-full "
									href={`/workflows/${workflow.id}?view=workspace`}
								>
									<Edit className="w-4 h-4" />
								</Button>
								<Button
									variant="default"
									size="sm"
									className="w-full "
									href={`/workflows/${workflow.id}`}
								>
									<Code className="w-4 h-4" />
								</Button>
								<Button
									variant="default"
									size="sm"
									className="w-full "
									href={`/workflows/${workflow.id}?view=playground`}
								>
									<Play className="w-4 h-4" />
								</Button>
								<Button
									variant="default"
									size="sm"
									className="w-full "
									href={`/workflows/${workflow.id}?view=gallery`}
								>
									<Image className="w-4 h-4" />
								</Button>
							</AdminAndMember>
						</div>
					</div>
					<div className="absolute top-2 right-2">
						<AdminAndMember>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="ghost"
										className="h-8 w-8 p-0 bg-black/30 text-white"
									>
										<MoreHorizontal className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>Workflow Actions</DropdownMenuLabel>
									<DropdownMenuItem onClick={(e) => openRenameDialog(e)}>
										Rename
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={async (e) => {
											e.stopPropagation();
											e.preventDefault();
											await callServerPromise(cloneWorkflow(workflow.id), {
												loadingText: "Cloning workflow",
											});
											mutate();
										}}
									>
										Clone
									</DropdownMenuItem>
									<DropdownMenuItem
										className="text-destructive"
										onClick={(e) => {
											e.stopPropagation();
											e.preventDefault();
											setDeleteModalOpen(true);
										}}
									>
										Delete
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										onClick={(e) => {
											e.stopPropagation();
											e.preventDefault();
											callServerPromise(pinWorkflow(workflow.id, true));
											mutate();
										}}
									>
										{workflow.pinned ? "Unpin" : "Pin"}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</AdminAndMember>
					</div>

					{workflow.pinned && (
						<div className="absolute top-4 left-4">
							<PinIcon className="rotate-45 text-white drop-shadow-md" />
						</div>
					)}
				</Card>
				<div className="px-2 pt-2 flex flex-col">
					<div className="text-gray-700 text-md font-semibold truncate w-full justify-between flex flex-row">
						<div className="truncate mr-2">{workflow.name}</div>
						{status && (
							<Badge
								variant={status === "success" ? "success" : "secondary"}
								className="shrink-0"
							>
								{status}
							</Badge>
						)}
					</div>
					<div className="flex flex-row justify-between opacity-50">
						<div className="text-xs flex items-center gap-2 truncate">
							{workflow.user_name || "Unknown"}
						</div>
						<div className="text-xs shrink-0">
							{workflow.latest_run_at
								? getRelativeTime(workflow.latest_run_at)
								: getRelativeTime(workflow.updated_at)}
						</div>
					</div>
				</div>
			</Link>
		</>
	);
}
