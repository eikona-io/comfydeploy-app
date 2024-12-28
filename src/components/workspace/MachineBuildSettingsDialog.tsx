"use client";
import { Button } from "@/components/ui/button";

import {
  customFormSchema,
  serverlessFormSchema,
  sharedMachineConfig,
} from "@/components/machine/machine-schema";

import { useMachine } from "@/hooks/use-machine";
import { api } from "@/lib/api";
import { Settings } from "lucide-react";
import * as React from "react";
import { UpdateModal } from "../auto-form/auto-form-dialog";

export function MachineBuildSettingsDialog(props: {
  machineId: string;
  className?: string;
  buttonVariant?: "outline" | "default" | "ghost";
}) {
  const [open2, setOpen2] = React.useState(false);
  const { data: machine, refetch } = useMachine(props.machineId);
  const { type } = machine;

  return (
    <>
      {type === "comfy-deploy-serverless" ? (
        <UpdateModal
          containerClassName="lg:flex-row lg:gap-14"
          dialogClassName="!max-w-[1200px] !max-h-[calc(90vh-10rem)]"
          data={machine}
          open={open2}
          setOpen={setOpen2}
          trigger={
            <Button
              className={props.className}
              variant={props.buttonVariant ?? "outline"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpen2(true);
              }}
            >
              <Settings size={14} />{" "}
            </Button>
          }
          title="Machine Settings"
          description="Edit machine"
          serverAction={async (data) => {
            // console.log(data);
            await api({
              url: `machine/serverless/${machine.id}`,
              init: {
                method: "PATCH",
                body: JSON.stringify(data),
              },
            });
            await refetch();
          }}
          formSchema={serverlessFormSchema}
          fieldConfig={{
            ...sharedMachineConfig,
          }}
        />
      ) : (
        <UpdateModal
          data={machine}
          open={open2}
          setOpen={setOpen2}
          trigger={
            <Button
              variant={props.buttonVariant ?? "outline"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpen2(true);
              }}
              className={props.className}
            >
              <Settings size={14} />{" "}
            </Button>
          }
          title="Machine Settings"
          description="Edit machine"
          serverAction={async (data) => {
            await api({
              url: `machine/custom/${machine.id}`,
              init: {
                method: "PATCH",
                body: JSON.stringify(data),
              },
            });
            await refetch();
          }}
          formSchema={customFormSchema}
          fieldConfig={{
            auth_token: {
              inputProps: {
                type: "password",
              },
            },
          }}
        />
      )}
    </>
  );
}
