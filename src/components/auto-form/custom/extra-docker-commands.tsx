import type { AutoFormInputComponentProps } from "@/components/auto-form/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

export const ExtraDockerCommandsType = z.array(
  z.object({
    commands: z.array(z.string()),
    when: z.union([z.literal("before"), z.literal("after")]),
  }),
);

export default function ExtraDockerCommands({
  label,
  isRequired,
  field,
  fieldConfigItem,
  zodItem,
}: AutoFormInputComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [commands, setCommands] = useState(
    ExtraDockerCommandsType.parse(field.value ?? []),
  );
  const [newCommand, setNewCommand] = useState("");
  const [runSelected, setRunSelected] = useState<"before" | "after">("after");
  const [editIndex, setEditIndex] = useState(-1); // Index for editing

  const addOrEditCommand = () => {
    const commandData = {
      commands: newCommand.split("\n"),
      when: runSelected,
    };
    const updatedCommands = [...commands];
    if (editIndex === -1) {
      // Add new command
      updatedCommands.push(commandData);
    } else {
      // Edit existing command
      updatedCommands[editIndex] = commandData;
    }
    setCommands(updatedCommands);
    setNewCommand("");
    setIsOpen(false);
    setEditIndex(-1);
    field.onChange(updatedCommands);
  };

  const deleteCommand = (index: number) => {
    const updatedCommands = commands.filter(
      (_, cmdIndex) => cmdIndex !== index,
    );
    setCommands(updatedCommands);
    field.onChange(updatedCommands);
  };

  const openEditDialog = (index: number) => {
    setEditIndex(index);
    setNewCommand(commands[index].commands.join("\n"));
    setRunSelected(commands[index].when);
    setIsOpen(true);
  };

  return (
    <FormItem>
      <FormLabel className="flex w-full items-center justify-between">
        Extra docker commands
        {isRequired && <span className="text-destructive"> *</span>}
        <Button
          as={"div"}
          role="button"
          variant="secondary"
          onClick={() => {
            setEditIndex(-1);
            setNewCommand("");
            setIsOpen(true);
          }}
        >
          <Plus size={16} />
        </Button>
      </FormLabel>
      <FormControl>
        <div>
          <ul className="space-y-2">
            {commands.map((cmd, index) => (
              <li
                key={index}
                className="flex w-full items-center justify-between rounded-sm bg-gray-50 px-4 py-2 text-sm"
              >
                <div className="flex flex-col break-all">
                  {cmd.commands.map((x, cmdIndex) => (
                    <div key={cmdIndex} className="font-mono">
                      {x}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="h-fit">{cmd.when}</Badge>
                  <Button
                    as={"div"}
                    role="button"
                    variant="secondary"
                    onClick={() => openEditDialog(index)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    as={"div"}
                    role="button"
                    variant="secondary"
                    onClick={() => deleteCommand(index)}
                  >
                    <Trash size={14} />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </FormControl>
      {fieldConfigItem.description && (
        <FormDescription>{fieldConfigItem.description}</FormDescription>
      )}
      <FormMessage />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>
            {editIndex === -1
              ? "Add New Docker Command"
              : "Edit Docker Command"}
          </DialogTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addOrEditCommand();
            }}
            className="flex flex-col gap-4"
          >
            <Textarea
              value={newCommand}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNewCommand(e.target.value)
              }
              placeholder="Enter Docker command"
            />
            <div>
              Run commands{" "}
              <Select
                value={runSelected}
                onValueChange={(value) => {
                  setRunSelected(value as "before" | "after");
                }}
              >
                <SelectTrigger className="relative inline-flex w-fit">
                  <SelectValue placeholder="Run command before or after" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>When</SelectLabel>
                    <SelectItem value="before">Before</SelectItem>
                    <SelectItem value="after">After</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>{" "}
              custom nodes installation.
            </div>
            <div className="mt-4 flex justify-end">
              <Button>{editIndex === -1 ? "Add" : "Update"}</Button>
              <DialogClose asChild>
                <Button variant="secondary" style={{ marginLeft: "10px" }}>
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </FormItem>
  );
}
