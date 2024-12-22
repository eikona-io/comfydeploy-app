"use client";
import type { Button } from "@/components/ui/button";
import { generateFinalPath } from "@/lib/ModelUtils";
import { downloadUrlModelSchema } from "@/server/addModelSchema";
import { addModel } from "@/server/curdModel";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type * as React from "react";
import { toast } from "sonner";
import type { z } from "zod";
import { InsertModal } from "./InsertModal";

export function AddModelDialog({
  title,
  buttonVarian = "default",
  data,
}: {
  hash?: string;
  data?: z.infer<typeof downloadUrlModelSchema> & {
    id: string;
  };
  title?: React.ReactNode;
  buttonVarian?: Parameters<typeof Button>[0]["variant"];
}) {
  const [values, setValues] = useState<
    Partial<z.infer<typeof downloadUrlModelSchema>>
  >({});

  const [finalPath, setFinalPath] = useState("");
  const router = useRouter();

  useEffect(() => {
    const { custom_path, filename } = values;
    const newFinalPath = generateFinalPath(undefined, custom_path, filename);
    setFinalPath(newFinalPath);
  }, [values]);

  return (
    <InsertModal
      dialogClassName="sm:max-w-[600px]"
      // disabled={!hasActiveSub}
      data={data}
      // tooltip={!hasActiveSub ? "" : "Upgrade in pricing tab!"}
      title="Add a Model"
      description="using a link to a model"
      serverAction={addModel}
      formSchema={downloadUrlModelSchema}
      buttonVarian={buttonVarian}
      buttonTitle={
        title ?? (
          <>
            Add a Model <Plus size={14} />
          </>
        )
      }
      setValues={setValues}
      fieldConfig={{
        url: {
          fieldType: "modelUrlPicker",
          inputProps: { required: true },
          description: (
            <>
              Pick a model from{" "}
              <a
                href="https://www.civitai.com/models"
                target="_blank"
                className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
                rel="noreferrer"
              >
                civitai.com
              </a>{" "}
              or a url we can download a model from
            </>
          ),
        },
        filename: {
          description: "Keep empty, for default name",
          inputProps: { required: false },
        },
        custom_path: {
          inputProps: { required: false },
          description: (
            <>
              <span className="text-gray-500 text-sm">
                Folder path:{" "}
                <span className="rounded bg-gray-200 px-1 py-0.5">
                  {finalPath}
                </span>
              </span>
            </>
          ),
        },
      }}
      mutateFn={async () => {
        toast.warning("Don't See Model in Your Workflow?", {
          duration: 10000,
          description:
            "Rebuild the machine used by your workflow to refresh the list of models",
          action: {
            label: "Machines",
            onClick: () => router.push("/machines"),
          },
        });
      }}
    />
  );
}
