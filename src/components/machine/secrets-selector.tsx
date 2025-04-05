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
import {
  addNewSecret,
  deleteSecret,
  type EnvironmentVariableType,
  type SecretGroup,
  updateSecret,
  useGetSecrets,
} from "@/hooks/use-secrets-api";
import { toast } from "sonner";

export function SecretsSelector({ machine_id }: { machine_id: string }) {
  const [visibleValues, setVisibleValues] = useState<Record<number, boolean>>(
    {},
  );
  const [showNewValue, setShowNewValue] = useState(false);
  const [isAddingSecret, setIsAddingSecret] = useState(false);
  const [isEditingSecret, setIsEditingSecret] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newValueName, setNewValueName] = useState("");
  const [newSecretValue, setNewSecretValue] = useState("");
  const [editingValueIndex, setEditingValueIndex] = useState<number | null>(
    null,
  );
  const [editValueName, setEditValueName] = useState("");
  const [editSecretValue, setEditSecretValue] = useState("");
  const [addingMode, setAddingMode] = useState<"group" | "value">("group");
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [showDeleteValueConfirm, setShowDeleteValueConfirm] = useState(false);
  const [showDeleteGroupConfirm, setShowDeleteGroupConfirm] = useState(false);
  const [deleteValueIndex, setDeleteValueIndex] = useState<number | null>(null);
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null);

  const { data: secretGroups, refetch } = useGetSecrets();

  const selectedGroup = secretGroups?.find(
    (g: SecretGroup) => g.id === selectedGroupId,
  );

  const handleAddSecret = async () => {
    if (
      addingMode === "group" &&
      newGroupName &&
      newValueName &&
      newSecretValue
    ) {
      const newGroup = {
        machine_id,
        secret_name: newGroupName,
        secret: [
          {
            key: newValueName,
            value: newSecretValue,
          },
        ],
      };

      try {
        const group = await addNewSecret(newGroup);
        if (group) {
          setSelectedGroupId(group.id);
          setNewGroupName("");
          setNewValueName("");
          setNewSecretValue("");
          setIsAddingSecret(false);
          setShowNewValue(false);
          refetch();
          toast.success("Created the Secret successfully");
        }
      } catch (error) {
        toast.error("Error creating the Secret");
      }
    } else if (
      addingMode === "value" &&
      selectedGroupId &&
      newValueName &&
      newSecretValue &&
      selectedGroup
    ) {
      const secret = [
        ...selectedGroup.environment_variables,
        { key: newValueName, value: newSecretValue },
      ];
      try {
        const updatedSecret = await updateSecret({
          secret_id: selectedGroup.id,
          secret,
        });
        if (updatedSecret) {
          refetch();
          setNewValueName("");
          setNewSecretValue("");
          setIsAddingSecret(false);
          setShowNewValue(false);
          toast.success("Added the Environment Variable successfully");
        }
      } catch (error) {
        toast.error("Error adding the Environment Variable");
      }
    }
  };

  const handleEditSecret = async () => {
    if (
      editingValueIndex &&
      editValueName &&
      editSecretValue &&
      selectedGroup
    ) {
      const updatedEnvs = selectedGroup?.environment_variables.map(
        (value: EnvironmentVariableType, index: number) => {
          if (index + 1 === editingValueIndex) {
            return {
              ...value,
              key: editValueName,
              value: editSecretValue,
            };
          }
          return value;
        },
      );

      try {
        const updatedSecret = await updateSecret({
          secret_id: selectedGroup.id,
          secret: updatedEnvs,
        });
        if (updatedSecret) {
          refetch();
          setEditingValueIndex(null);
          setIsEditingSecret(false);
          toast.success("Updated the Environment Variable successfully");
        }
      } catch (error) {
        toast.error("Error editing the Secret");
      }
    }
  };

  const handleDeleteValue = async () => {
    if (deleteValueIndex && selectedGroupId) {
      const selectedGroup = secretGroups?.find(
        (g: SecretGroup) => g.id === selectedGroupId,
      );

      if (selectedGroup && selectedGroup.environment_variables.length <= 1) {
        setDeleteValueIndex(null);
        setShowDeleteValueConfirm(false);
        return;
      }

      if (!selectedGroup) return;

      const hasValue = selectedGroup.environment_variables.some(
        (v: EnvironmentVariableType, index: number) =>
          index + 1 === deleteValueIndex,
      );

      if (!hasValue) return;

      if (hasValue) {
        const secret = selectedGroup.environment_variables.filter(
          (_, index: number) => index + 1 !== deleteValueIndex,
        );

        try {
          const updatedSecret = await updateSecret({
            secret,
            secret_id: selectedGroup.id,
          });
          if (updatedSecret) {
            setDeleteValueIndex(null);
            setShowDeleteValueConfirm(false);
            refetch();
            toast.success("Deleted the Environment Variable successfully");
            setVisibleValues({});
          }
        } catch (error) {
          toast.error("Error deleting the environment variable");
        }
      }
    }
  };

  const handleDeleteGroup = async () => {
    if (deleteGroupId) {
      try {
        await deleteSecret({ secret_id: deleteGroupId });
        setDeleteGroupId(null);
        setShowDeleteGroupConfirm(false);
        refetch();
        toast.success("Deleted the Secret successfully");
      } catch (error) {
        toast.error("Error Deleting the Secret");
      }
    }
  };

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

    setNewGroupName("");
    setNewValueName("");
    setNewSecretValue("");
  };

  const openEditDialog = (index: number, name: string, value: string) => {
    setEditingValueIndex(index);
    setEditValueName(name);
    setEditSecretValue(value);
    setIsEditingSecret(true);
    setShowNewValue(false); // Hide value by default when editing
  };

  const confirmDeleteValue = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteValueIndex(index);
    setShowDeleteValueConfirm(true);
  };

  const toggleValueVisibility = (index: number) => {
    setVisibleValues((prev) => ({
      ...prev,
      [index]: !prev[index],
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
  if (secretGroups?.length === 0) {
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
            {secretGroups?.map((group: SecretGroup) => (
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
    const filteredValues = selectedGroup.environment_variables;

    return (
      <div>
        <SecretGroupDropdown />

        {filteredValues?.length > 0 ? (
          <div className="space-y-2">
            {filteredValues.map(
              (env: EnvironmentVariableType, index: number) => (
                <div
                  key={env.key + env.value + Math.random()}
                  className="overflow-hidden rounded-md border"
                >
                  <div className="flex items-center justify-between bg-muted/10 p-2">
                    <div className="flex flex-1 items-center">
                      <span className="mr-4 w-1/3 truncate font-medium text-sm">
                        {env.key}
                      </span>
                      <div className="flex-1 truncate font-mono text-sm">
                        {visibleValues[index]
                          ? env.value
                          : "••••••••••••••••••••••••••••••••"}
                      </div>
                    </div>
                    <div className="ml-2 flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => toggleValueVisibility(index)}
                      >
                        {visibleValues[index] ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                        <span className="sr-only">
                          {visibleValues[index] ? "Hide" : "Show"} value
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          openEditDialog(index + 1, env.key, env.value);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">
                          Edit environment variable
                        </span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={(e) =>
                          selectedGroup.environment_variables.length > 1
                            ? confirmDeleteValue(index + 1, e)
                            : e.stopPropagation()
                        }
                        disabled={
                          selectedGroup.environment_variables.length <= 1
                        }
                        title={
                          selectedGroup.environment_variables.length <= 1
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
              ),
            )}
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
        {secretGroups?.map((group: SecretGroup) => (
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
                  {group.environment_variables.length} environment{" "}
                  {group.environment_variables.length === 1
                    ? "variable"
                    : "variables"}
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
