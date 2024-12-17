"use client";

import { Icon as IconWord } from "@/components/icon-word";

import {
	BookCheck,
	CircleGauge,
	CreditCard,
	Database,
	Key,
	LineChart,
	Server,
	Settings,
	Workflow,
	Book,
	Github,
	Box,
	Rss,
	MessageCircle,
	ExternalLink,
	Receipt,
} from "lucide-react";

import { OrganizationSwitcher, UserButton } from "@clerk/clerk-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import { useWorkflowIdInWorkflowPage } from "@/hooks/hook";
import { WorkflowDropdown } from "@/components/workflow-dropdown";
// import { VersionSelectV2 } from "@/components/VersionSelectV2";
// import { MachineSelect } from "@/components/MachineSelect";
// import { useCurrentPlan } from "@/components/useCurrentPlan";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import React, { use } from "react";
import { useIsAdminAndMember, useIsAdminOnly } from "@/components/permissions";

function UserMenu() {
	const isAdminOnly = useIsAdminOnly();
	const isAdminAndMember = useIsAdminAndMember();

	return (
		<div className="flex items-center justify-center w-10 h-full">
			<UserButton
				userProfileProps={{}}
				appearance={{
					elements: {
						userButtonPopoverRootBox: {
							pointerEvents: "initial",
						},
					},
				}}
			>
				<UserButton.MenuItems>
					{isAdminAndMember && (
						<UserButton.Link
							label="Billing"
							labelIcon={<Receipt size={14} />}
							href="/api/stripe/dashboard"
						/>
					)}
					{/* 
          {isAdminAndMember && (
            <UserButton.Link
              label="API Keys"
              labelIcon={<Key size={14} />}
              href="/api-keys"
            />
          )} */}

					{/* {isAdminAndMember && (
            <UserButton.Link
              label="Settings"
              labelIcon={<Cog size={14} />}
              href="/settings"
            />
          )} */}

					{/* <UserButton.Link
            label="Pricing"
            labelIcon={<CircleDollarSign size={14} />}
            href="/pricing"
          /> */}
				</UserButton.MenuItems>
			</UserButton>
		</div>
	);
}

function usePages() {
	// const pathname = `/${pathnames.split("/")[1]}`;

	// const { has } = useAuth();

	const isAdminOnly = useIsAdminOnly();
	const isAdminAndMember = useIsAdminAndMember();

	// const pricingPlanFlagEnable = useFeatureFlagEnabled("pricing-plan");
	const pages = [
		{
			name: "Workflows",
			path: "/workflows",
			icon: Workflow,
		},
		// {
		//   name: "Models",
		//   path: "/models",
		//   icon: Component,
		// },
		...(isAdminAndMember
			? [
					{
						name: "Machines",
						path: "/machines",
						icon: Server,
					},
				]
			: []),
		{
			name: "Storage",
			path: "/storage",
			icon: Database,
		},
	];

	const metaPages = [
		...(isAdminAndMember
			? [
					{
						name: "Settings",
						path: "/settings",
						icon: Settings,
					},
					{
						name: "API Keys",
						path: "/api-keys",
						icon: Key,
					},
				]
			: []),

		...(isAdminOnly
			? [
					{
						name: "Usage",
						path: "/usage",
						icon: CircleGauge,
					},
				]
			: []),

		{
			name: "Plan",
			path: "/pricing",
			icon: CreditCard,
		},
	];

	return {
		pages,
		flatPages: pages.flat(),
		metaPages: metaPages.flat(),
	};
}

const links = [
	{
		title: "Documentation",
		url: "https://docs.comfydeploy.com",
		icon: Book,
	},
	{
		title: "Discord",
		url: "https://discord.com/invite/c222Cwyget",
		icon: MessageCircle,
	},
	{
		title: "NextJS Demo",
		url: "https://demo2.comfydeploy.com",
		icon: Box,
	},
	{
		title: "GitHub",
		url: "https://github.com/BennyKok/comfyui-deploy",
		icon: Github,
	},
	{
		title: "Blog",
		url: "/blog",
		icon: Rss,
	},
];

export function AppSidebar() {
	const { pages, flatPages, metaPages } = usePages();
	// const sub = useCurrentPlan();

	const items = flatPages.map((page) => ({
		title: page.name,
		url: page.path,
		icon: page.icon,
	}));

	const metaItems = metaPages.map((page) => ({
		title: page.name,
		url: page.path,
		icon: page.icon,
	}));

	const location = useLocation();
	const pathname = location.pathname;
	const chunks = pathname.split("/");
	const parentPath = chunks[1];

	const isAdminAndMember = useIsAdminAndMember();
	const workflow_id = useWorkflowIdInWorkflowPage();

	const [showV2Alert, setShowV2Alert] = React.useState(() => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("hideV2Alert") !== "true";
		}
		return false;
	});

	const handleCloseAlert = () => {
		setShowV2Alert(false);
		localStorage.setItem("hideV2Alert", "true");
	};

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex flex-row justify-between items-start">
					<a href="/" className="flex flex-row justify-between items-start">
						<IconWord />
					</a>
					<UserMenu />
				</div>

				{workflow_id && parentPath === "workflows" && (
					<>
						<div className="flex flex-row gap-2 bg-gray-100 border rounded-md p-2 w-full">
							<WorkflowDropdown
								workflow_id={workflow_id}
								className="flex-grow min-w-0"
							/>
							{/* <VersionSelectV2
								workflow_id={workflow_id}
								className="flex-shrink-0 w-20"
							/> */}
						</div>
					</>
				)}

				{/* <div id="sidebar-header"></div> */}
				{/* </SidebarMenuItem> */}
				{/* </SidebarMenu> */}
			</SidebarHeader>
			<SidebarContent>
				{/* <div id="sidebar-panel"></div> */}

				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									{`/${parentPath}` === item.url && (
										<motion.div
											className="absolute left-0 w-[2px] bg-primary rounded-r-full z-10 h-[20px] top-[5px]"
											transition={{
												type: "spring",
												stiffness: 300,
												damping: 30,
											}}
										/>
									)}
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>

									{item.url === "/workflows" && <div id="sidebar-panel" />}
									{item.url === "/models" && <div id="sidebar-panel-models" />}
									{item.url === "/machines" && (
										<div id="sidebar-panel-machines" />
									)}
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Account</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{metaItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									{`/${parentPath}` === item.url && (
										<motion.div
											className="absolute left-0 w-[2px] bg-primary rounded-r-full z-10 h-[20px] top-[5px]"
											transition={{
												type: "spring",
												stiffness: 300,
												damping: 30,
											}}
										/>
									)}
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Links</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{links.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url} target="_blank">
											<item.icon />
											<span className="w-full flex flex-row gap-2 items-center justify-between pr-2">
												<span>{item.title}</span>
												<ExternalLink size={14} />
											</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="flex flex-col justify-center w-full gap-2">
				{/* {workflow_id && parentPath === "workflows" && isAdminAndMember && (
					<MachineSelect
						workflow_id={workflow_id}
						leaveEmpty
						className="bg-slate-100 border rounded-full p-2"
					/>
				)} */}

				{showV2Alert && (
					<Alert className="mb-2 bg-yellow-50 relative">
						<AlertDescription className="text-xs flex items-center gap-2 text-yellow-800 hover:text-yellow-900">
							<Link
								href="https://www.comfydeploy.com/docs/v2/upgrade/v2"
								className="flex items-center gap-2"
								target="_blank"
							>
								<span>V2 API now available! See migration guide</span>
								<ExternalLink size={12} className="w-6" />
							</Link>
						</AlertDescription>
						<button
							type="button"
							onClick={handleCloseAlert}
							className="absolute top-2 right-2 text-yellow-800 hover:text-yellow-900"
							aria-label="Close alert"
						>
							×
						</button>
					</Alert>
				)}

				<OrganizationSwitcher
					organizationProfileUrl="/organization-profile"
					organizationProfileMode="navigation"
					appearance={{
						elements: {
							rootBox: "items-center justify-center p-2",
							organizationSwitcherPopoverRootBox: {
								pointerEvents: "initial",
							},
						},
					}}
				/>
			</SidebarFooter>
		</Sidebar>
	);
}
