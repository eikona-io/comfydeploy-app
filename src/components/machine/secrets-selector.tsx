"use client";

import type React from "react";

import { useState } from "react";
import {
  Plus,
  KeyRound,
  Eye,
  EyeOff,
  Trash2,
  Pencil,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Empty initial state
const initialSecretGroups: SecretGroup[] = [];

type SecretValue = {
  id: string;
  name: string;
  value: string;
};

type SecretGroup = {
  id: string;
  name: string;
  values: SecretValue[];
};

export function SecretsSelector() {
  const [secretGroups, setSecretGroups] =
    useState<SecretGroup[]>(initialSecretGroups);
  const [visibleValues, setVisibleValues] = useState<Record<string, boolean>>(
    {},
  );
  const [showNewValue, setShowNewValue] = useState(false);
  const [isAddingSecret, setIsAddingSecret] = useState(false);
  const [isEditingSecret, setIsEditingSecret] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newValueName, setNewValueName] = useState("");
  const [newSecretValue, setNewSecretValue] = useState("");
  const [editingValueId, setEditingValueId] = useState<string | null>(null);
  const [editValueName, setEditValueName] = useState("");
  const [editSecretValue, setEditSecretValue] = useState("");
  const [addingMode, setAddingMode] = useState<"group" | "value">("group");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Delete confirmation states
  const [showDeleteValueConfirm, setShowDeleteValueConfirm] = useState(false);
  const [showDeleteGroupConfirm, setShowDeleteGroupConfirm] = useState(false);
  const [deleteValueId, setDeleteValueId] = useState<string | null>(null);
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);

  const selectedGroup = secretGroups.find((g) => g.id === selectedGroupId);

  const handleAddSecret = () => {
    if (
      addingMode === "group" &&
      newGroupName &&
      newValueName &&
      newSecretValue
    ) {
      const groupId = Date.now().toString();
      const valueId = `${groupId}-${Date.now() + 1}`;

      const newGroup: SecretGroup = {
        id: groupId,
        name: newGroupName,
        values: [
          {
            id: valueId,
            name: newValueName,
            value: newSecretValue,
          },
        ],
      };

      setSecretGroups([...secretGroups, newGroup]);
      setSelectedGroupId(newGroup.id);
      setNewGroupName("");
      setNewValueName("");
      setNewSecretValue("");
      setIsAddingSecret(false);
      setShowNewValue(false);
    } else if (
      addingMode === "value" &&
      selectedGroupId &&
      newValueName &&
      newSecretValue
    ) {
      const updatedGroups = secretGroups.map((group) => {
        if (group.id === selectedGroupId) {
          const newValue: SecretValue = {
            id: `${group.id}-${Date.now()}`,
            name: newValueName,
            value: newSecretValue,
          };
          return {
            ...group,
            values: [...group.values, newValue],
          };
        }
        return group;
      });
      setSecretGroups(updatedGroups);
      setNewValueName("");
      setNewSecretValue("");
      setIsAddingSecret(false);
      setShowNewValue(false);
    }
  };

  const handleEditSecret = () => {
    if (editingValueId && editValueName && editSecretValue) {
      const updatedGroups = secretGroups.map((group) => {
        const updatedValues = group.values.map((value) => {
          if (value.id === editingValueId) {
            return {
              ...value,
              name: editValueName,
              value: editSecretValue,
            };
          }
          return value;
        });

        if (updatedValues.some((v) => v.id === editingValueId)) {
          return {
            ...group,
            values: updatedValues,
          };
        }
        return group;
      });

      setSecretGroups(updatedGroups);
      setEditingValueId(null);
      setIsEditingSecret(false);
    }
  };

  const handleDeleteValue = () => {
    if (deleteValueId && selectedGroupId) {
      const selectedGroup = secretGroups.find((g) => g.id === selectedGroupId);

      // Don't allow deleting if this is the only value in the group
      if (selectedGroup && selectedGroup.values.length <= 1) {
        setDeleteValueId(null);
        setShowDeleteValueConfirm(false);
        return;
      }

      const updatedGroups = secretGroups.map((group) => {
        const hasValue = group.values.some((v) => v.id === deleteValueId);

        if (hasValue) {
          return {
            ...group,
            values: group.values.filter((value) => value.id !== deleteValueId),
          };
        }
        return group;
      });

      // Remove any groups that now have no values
      const filteredGroups = updatedGroups.filter(
        (group) => group.values.length > 0,
      );

      setSecretGroups(filteredGroups);
      setDeleteValueId(null);
      setShowDeleteValueConfirm(false);

      // If the group was deleted because it had no values, go back to the list view
      if (
        selectedGroupId &&
        !filteredGroups.some((g) => g.id === selectedGroupId)
      ) {
        setSelectedGroupId(null);
      }
    }
  };

  // Function to delete a group
  const handleDeleteGroup = () => {
    if (deleteGroupId) {
      setSecretGroups((prev) =>
        prev.filter((group) => group.id !== deleteGroupId),
      );

      if (selectedGroupId === deleteGroupId) {
        setSelectedGroupId(null);
      }

      setDeleteGroupId(null);
      setShowDeleteGroupConfirm(false);
    }
  };

  // Function to open delete confirmation
  const openDeleteConfirmation = (groupId: string) => {
    setDeleteGroupId(groupId);
    setShowDeleteGroupConfirm(true);
  };

  const openAddDialog = (mode: "group" | "value", groupId?: string) => {
    setAddingMode(mode);
    if (mode === "value" && groupId) {
      setSelectedGroupId(groupId);
    }
    setIsAddingSecret(true);
    setShowNewValue(false); // Hide new value by default

    // Reset form fields
    setNewGroupName("");
    setNewValueName("");
    setNewSecretValue("");
  };

  const openEditDialog = (valueId: string, name: string, value: string) => {
    setEditingValueId(valueId);
    setEditValueName(name);
    setEditSecretValue(value);
    setIsEditingSecret(true);
    setShowNewValue(false); // Hide value by default when editing
  };

  const confirmDeleteValue = (valueId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteValueId(valueId);
    setShowDeleteValueConfirm(true);
  };

  const toggleValueVisibility = (valueId: string) => {
    setVisibleValues((prev) => ({
      ...prev,
      [valueId]: !prev[valueId],
    }));
  };

  const toggleShowNewValue = () => {
    setShowNewValue(!showNewValue);
  };

  const selectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const backToGroups = () => {
    setSelectedGroupId(null);
  };

  // Empty state - no secrets at all
  if (secretGroups.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-3 py-4">
          <div className="rounded-full bg-muted p-3">
            <KeyRound className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg">No Secrets Available</h3>
          <p className="max-w-md text-muted-foreground text-sm">
            You haven't added any secrets to this machine yet. Secrets help you
            store sensitive information securely.
          </p>
          <Button onClick={() => openAddDialog("group")} className="mt-2">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Secret Group
          </Button>
        </div>

        <Dialog open={isAddingSecret} onOpenChange={setIsAddingSecret}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Secret Group</DialogTitle>
              <DialogDescription>
                Create a new group with an initial environment variable.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="API_KEYS"
                />
              </div>

              <Separator className="my-2" />

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="value-name">Key</Label>
                  <Input
                    id="value-name"
                    value={newValueName}
                    onChange={(e) => setNewValueName(e.target.value)}
                    placeholder="PRODUCTION"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="secret-value">Value</Label>
                  <div className="relative">
                    <Input
                      id="secret-value"
                      value={newSecretValue}
                      onChange={(e) => setNewSecretValue(e.target.value)}
                      type={showNewValue ? "text" : "password"}
                      placeholder="Enter secret value"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-0 right-0 h-full px-3 py-2 text-muted-foreground"
                      onClick={toggleShowNewValue}
                    >
                      {showNewValue ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showNewValue ? "Hide" : "Show"} value
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddingSecret(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSecret}
                disabled={!newGroupName || !newValueName || !newSecretValue}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Secret Group Dropdown
  const SecretGroupDropdown = () => (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              {selectedGroupId ? (
                <span>{selectedGroup?.name}</span>
              ) : (
                <span>Select a secret</span>
              )}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {secretGroups.map((group) => (
              <DropdownMenuItem
                key={group.id}
                onClick={() => selectGroup(group.id)}
                className={group.id === selectedGroupId ? "bg-muted" : ""}
              >
                {group.name}
              </DropdownMenuItem>
            ))}
            {selectedGroupId && (
              <>
                <Separator className="my-1" />
                <DropdownMenuItem onClick={backToGroups}>
                  View all secrets
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedGroupId && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-2 h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              openDeleteConfirmation(selectedGroupId);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete secret group</span>
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          selectedGroupId
            ? openAddDialog("value", selectedGroupId)
            : openAddDialog("group")
        }
        className="h-7 text-xs"
      >
        <Plus className="mr-1 h-3 w-3" />
        {selectedGroupId ? "Add Environment Variable" : "Add Secret Group"}
      </Button>
    </div>
  );

  // If a group is selected, show its environment variables
  if (selectedGroupId && selectedGroup) {
    const filteredValues = selectedGroup.values;

    return (
      <div>
        <SecretGroupDropdown />

        {filteredValues.length > 0 ? (
          <div className="space-y-2">
            {filteredValues.map((value) => (
              <div key={value.id} className="overflow-hidden rounded-md border">
                <div className="flex items-center justify-between bg-muted/10 p-2">
                  <div className="flex flex-1 items-center">
                    <span className="mr-4 w-1/3 truncate font-medium text-sm">
                      {value.name}
                    </span>
                    <div className="flex-1 truncate font-mono text-sm">
                      {visibleValues[value.id]
                        ? value.value
                        : "••••••••••••••••••••••••••••••••"}
                    </div>
                  </div>
                  <div className="ml-2 flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => toggleValueVisibility(value.id)}
                    >
                      {visibleValues[value.id] ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                      <span className="sr-only">
                        {visibleValues[value.id] ? "Hide" : "Show"} value
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() =>
                        openEditDialog(value.id, value.name, value.value)
                      }
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit environment variable</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      onClick={(e) =>
                        selectedGroup.values.length > 1
                          ? confirmDeleteValue(value.id, e)
                          : e.stopPropagation()
                      }
                      disabled={selectedGroup.values.length <= 1}
                      title={
                        selectedGroup.values.length <= 1
                          ? "Cannot delete the only environment variable"
                          : "Delete environment variable"
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">
                        Delete environment variable
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border py-4 text-center">
            <p className="mb-2 text-muted-foreground text-sm">
              {"No environment variables in this secret group"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openAddDialog("value", selectedGroup.id)}
            >
              <Plus className="mr-2 h-3 w-3" />
              Add Environment Variable
            </Button>
          </div>
        )}

        {/* Add Environment Variable Dialog */}
        <Dialog open={isAddingSecret} onOpenChange={setIsAddingSecret}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Environment Variable</DialogTitle>
              <DialogDescription>
                Add a new environment variable to the "{selectedGroup.name}"
                secret group.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="value-name">Key</Label>
                  <Input
                    id="value-name"
                    value={newValueName}
                    onChange={(e) => setNewValueName(e.target.value)}
                    placeholder="PRODUCTION"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="secret-value">Value</Label>
                  <div className="relative">
                    <Input
                      id="secret-value"
                      value={newSecretValue}
                      onChange={(e) => setNewSecretValue(e.target.value)}
                      type={showNewValue ? "text" : "password"}
                      placeholder="Enter secret value"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-0 right-0 h-full px-3 py-2 text-muted-foreground"
                      onClick={toggleShowNewValue}
                    >
                      {showNewValue ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showNewValue ? "Hide" : "Show"} password
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddingSecret(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSecret}
                disabled={!newValueName || !newSecretValue}
              >
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Environment Variable Dialog */}
        <Dialog open={isEditingSecret} onOpenChange={setIsEditingSecret}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Environment Variable</DialogTitle>
              <DialogDescription>
                Update the name and value for this environment variable.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-value-name">Key</Label>
                  <Input
                    id="edit-value-name"
                    value={editValueName}
                    onChange={(e) => setEditValueName(e.target.value)}
                    placeholder="PRODUCTION"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-secret-value">Value</Label>
                  <div className="relative">
                    <Input
                      id="edit-secret-value"
                      value={editSecretValue}
                      onChange={(e) => setEditSecretValue(e.target.value)}
                      type={showNewValue ? "text" : "password"}
                      placeholder="Enter secret value"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-0 right-0 h-full px-3 py-2 text-muted-foreground"
                      onClick={toggleShowNewValue}
                    >
                      {showNewValue ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showNewValue ? "Hide" : "Show"} password
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditingSecret(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSecret}
                disabled={!editValueName || !editSecretValue}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Environment Variable Confirmation */}
        <AlertDialog
          open={showDeleteValueConfirm}
          onOpenChange={setShowDeleteValueConfirm}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Environment Variable</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this environment variable? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteValue}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Secret Group Confirmation */}
        <AlertDialog
          open={showDeleteGroupConfirm}
          onOpenChange={setShowDeleteGroupConfirm}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Secret Group</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this entire secret group and all
                its environment variables? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteGroup}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Show list of all secret groups
  return (
    <div>
      <SecretGroupDropdown />

      <div className="space-y-2">
        {secretGroups.map((group) => (
          <div
            key={group.id}
            className="cursor-pointer rounded-md border p-3 hover:bg-muted/10"
            onClick={() => selectGroup(group.id)}
            onKeyDown={() => {}}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{group.name}</h4>
                <p className="mt-1 text-muted-foreground text-xs">
                  {group.values.length} environment{" "}
                  {group.values.length === 1 ? "variable" : "variables"}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  openDeleteConfirmation(group.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete secret group</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Secret Group Dialog */}
      <Dialog open={isAddingSecret} onOpenChange={setIsAddingSecret}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Secret Group</DialogTitle>
            <DialogDescription>
              Create a new group with an initial environment variable.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="group-name">Group Name</Label>
              <Input
                id="group-name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="API_KEYS"
              />
            </div>

            <Separator className="my-2" />

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="value-name">Key</Label>
                <Input
                  id="value-name"
                  value={newValueName}
                  onChange={(e) => setNewValueName(e.target.value)}
                  placeholder="PRODUCTION"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="secret-value">Value</Label>
                <div className="relative">
                  <Input
                    id="secret-value"
                    value={newSecretValue}
                    onChange={(e) => setNewSecretValue(e.target.value)}
                    type={showNewValue ? "text" : "password"}
                    placeholder="Enter secret value"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={toggleShowNewValue}
                  >
                    {showNewValue ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showNewValue ? "Hide" : "Show"} value
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingSecret(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddSecret}
              disabled={!newGroupName || !newValueName || !newSecretValue}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Secret Group Confirmation */}
      <AlertDialog
        open={showDeleteGroupConfirm}
        onOpenChange={setShowDeleteGroupConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Secret Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this entire secret group and all
              its environment variables? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
