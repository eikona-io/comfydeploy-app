"use client";

import * as React from "react";
import { useOrganization } from "@clerk/clerk-react";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { UserIcon } from "./run/SharePageComponent";
import { cn } from "@/lib/utils";
import { Users, X, Server, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMachinesAll } from "@/hooks/use-machine";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UnifiedFilterSelectProps {
  onUserFilterChange: (userIds: string) => void;
  onMachineFilterChange: (machineId: string) => void;
}

interface Member {
  id: string;
  name: string;
}

interface Machine {
  id: string;
  name: string;
  type?: string;
  status?: string;
}

export function UnifiedFilterSelect({
  onUserFilterChange,
  onMachineFilterChange,
}: UnifiedFilterSelectProps) {
  const { organization, isLoaded } = useOrganization({
    memberships: true,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState("users");

  // Get machines data
  const { data: machinesData, isLoading: machinesLoading } = useMachinesAll();

  const machines = useMemo(() => {
    if (!machinesData || !Array.isArray(machinesData)) return [];
    return machinesData.map((machine: any) => ({
      id: machine.id,
      name: machine.name,
      type: machine.type,
      status: machine.status,
    })) as Machine[];
  }, [machinesData]);

  // Storage keys
  const userStorageKey = organization
    ? `workflow-user-filter-${organization.id}`
    : "";
  const machineStorageKey = organization
    ? `workflow-machine-filter-${organization.id}`
    : "";

  const [selectedUsers, setSelectedUsers] = useLocalStorage<string[]>(
    userStorageKey,
    [],
  );
  const [selectedMachines, setSelectedMachines] = useLocalStorage<string[]>(
    machineStorageKey,
    [],
  );

  // Get selected objects for display
  const selectedUserObjects = useMemo(() => {
    return members.filter((member) => selectedUsers.includes(member.id));
  }, [members, selectedUsers]);

  const selectedMachineObjects = useMemo(() => {
    return machines.filter((machine) => selectedMachines.includes(machine.id));
  }, [machines, selectedMachines]);

  // Total selected count
  const totalSelected = selectedUsers.length + selectedMachines.length;

  // Update parent components when filters change
  useEffect(() => {
    onUserFilterChange(selectedUsers.join(","));
  }, [selectedUsers, onUserFilterChange]);

  useEffect(() => {
    onMachineFilterChange(selectedMachines[0] || ""); // Single machine selection
  }, [selectedMachines, onMachineFilterChange]);

  // Fetch organization members
  React.useEffect(() => {
    if (!organization) return;

    const fetchAllMembers = async () => {
      try {
        const response = await organization.getMemberships({
          pageSize: 100,
        });

        const totalMembers = response.total_count || 0;
        const membersList = response.data || [];

        let formattedMembers = membersList.map((membership: any) => ({
          id: membership.publicUserData?.userId || "",
          name: membership.publicUserData?.firstName
            ? `${membership.publicUserData.firstName} ${membership.publicUserData.lastName || ""}`
            : membership.publicUserData?.identifier || "Unknown",
        }));

        if (totalMembers > membersList.length) {
          const remainingPages = Math.ceil(
            (totalMembers - membersList.length) / 100,
          );

          const remainingRequests = Array.from(
            { length: remainingPages },
            (_, i) =>
              organization.getMemberships({
                initialPage: i + 2,
                pageSize: 100,
              }),
          );

          const results = await Promise.all(remainingRequests);

          for (const result of results) {
            const pageMembers = result.data || [];
            formattedMembers = [
              ...formattedMembers,
              ...pageMembers.map((membership: any) => ({
                id: membership.publicUserData?.userId || "",
                name: membership.publicUserData?.firstName
                  ? `${membership.publicUserData.firstName} ${membership.publicUserData.lastName || ""}`
                  : membership.publicUserData?.identifier || "Unknown",
              })),
            ];
          }
        }

        setMembers(formattedMembers);
      } catch (error) {
        console.error("Error fetching organization members:", error);
        setMembers([]);
      }
    };

    fetchAllMembers();
  }, [organization]);

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const toggleMachine = (machineId: string) => {
    setSelectedMachines(
      (prev) => (prev.includes(machineId) ? [] : [machineId]), // Single select for machines
    );
  };

  const clearAllFilters = () => {
    setSelectedUsers([]);
    setSelectedMachines([]);
  };

  const removeUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((id) => id !== userId));
  };

  const removeMachine = (machineId: string) => {
    setSelectedMachines((prev) => prev.filter((id) => id !== machineId));
  };

  if (!isLoaded || !organization) return null;

  const maxVisibleBadges = 3;
  const allSelectedItems = [
    ...selectedUserObjects.map((user) => ({ ...user, type: "user" as const })),
    ...selectedMachineObjects.map((machine) => ({
      ...machine,
      type: "machine" as const,
    })),
  ];
  const visibleItems = allSelectedItems.slice(0, maxVisibleBadges);
  const hiddenCount = allSelectedItems.length - maxVisibleBadges;

  return (
    <div className="flex items-center gap-2">
      {/* Display badges for selected items */}
      {totalSelected > 0 && (
        <div className="mr-2 flex flex-wrap gap-1">
          {visibleItems.map((item) => (
            <Badge
              key={`${item.type}-${item.id}`}
              variant="outline"
              className="flex items-center gap-1 px-2 py-1"
            >
              {item.type === "user" ? (
                <UserIcon user_id={item.id} className="h-3 w-3" />
              ) : (
                <Server className="h-3 w-3" />
              )}
              <span className="max-w-[100px] truncate">{item.name}</span>
              <button
                type="button"
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.type === "user") {
                    removeUser(item.id);
                  } else {
                    removeMachine(item.id);
                  }
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {hiddenCount > 0 && (
            <Badge variant="outline" className="px-2 py-1">
              +{hiddenCount} more
            </Badge>
          )}
        </div>
      )}

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-2",
              totalSelected > 0 && "border-primary",
            )}
          >
            <Filter className="h-4 w-4" />
            {totalSelected > 0 ? (
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {totalSelected}
              </Badge>
            ) : (
              "Filter"
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Filter workflows</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="users" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="machines" className="flex items-center gap-1">
                <Server className="h-4 w-4" />
                Machines
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-2">
              <ScrollArea className="h-60">
                <DropdownMenuGroup>
                  {members.map((member) => (
                    <DropdownMenuItem
                      key={member.id}
                      className="flex items-center gap-2 px-2"
                      onSelect={(event: Event) => {
                        event.preventDefault();
                        toggleUser(member.id);
                      }}
                    >
                      <Checkbox
                        id={`user-${member.id}`}
                        checked={selectedUsers.includes(member.id)}
                        onCheckedChange={() => toggleUser(member.id)}
                      />
                      <div className="flex items-center gap-2 truncate">
                        <UserIcon user_id={member.id} className="h-4 w-4" />
                        <span className="truncate">{member.name}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="machines" className="mt-2">
              <ScrollArea className="h-60">
                <DropdownMenuGroup>
                  {machinesLoading ? (
                    <div className="flex items-center justify-center p-4">
                      Loading machines...
                    </div>
                  ) : (
                    machines.map((machine) => (
                      <DropdownMenuItem
                        key={machine.id}
                        className="flex items-center gap-2 px-2"
                        onSelect={(event: Event) => {
                          event.preventDefault();
                          toggleMachine(machine.id);
                        }}
                      >
                        <Checkbox
                          id={`machine-${machine.id}`}
                          checked={selectedMachines.includes(machine.id)}
                          onCheckedChange={() => toggleMachine(machine.id)}
                        />
                        <div className="flex items-center gap-2 truncate">
                          <Server className="h-4 w-4 shrink-0" />
                          <span className="truncate">{machine.name}</span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuGroup>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {totalSelected > 0 && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center justify-center text-destructive"
                onSelect={(event: Event) => {
                  event.preventDefault();
                  clearAllFilters();
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Clear all filters
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
