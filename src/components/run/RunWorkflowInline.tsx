"use client";

import { SDForm } from "@/components/SDInputs/SDForm";
import {
  type RGBColor,
  SDInputsRender,
} from "@/components/SDInputs/SDInputsRender";
import { Button } from "@/components/ui/button";
// import { getFileDownloadUrlV2 } from "@/db/getFileDownloadUrl";
import { useAuthStore } from "@/lib/auth-store";
import { callServerPromise } from "@/lib/call-server-promise";
import {
  type WorkflowInputsType,
  type getInputsFromWorkflow,
  getInputsFromWorkflowJSON,
} from "@/lib/getInputsFromWorkflow";
import { plainInputsToZod } from "@/lib/workflowVersionInputsToZod";
// import { HandleFileUpload } from "@/server/uploadFile";
import { useAuth, useClerk } from "@clerk/clerk-react";
import JSZip from "jszip";
import { Play } from "lucide-react";
import {
  type FormEvent,
  type ReactNode,
  use,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import type { z } from "zod";
import { publicRunStore } from "./VersionSelect";

export async function parseFilesToImgURLs(
  values: Record<string, any>,
  toZip = false,
) {
  const processFile = async (file: File) => {
    const getUploadURL = await callServerPromise(
      HandleFileUpload({ fileSize: file.size, fileType: file.type }),
    );
    if (!getUploadURL || typeof getUploadURL === "string") {
      throw new Error("Upload image failed");
    }
    if ("error" in getUploadURL) {
      throw new Error(`Upload image failed: ${getUploadURL.error}`);
    }

    const toastId = toast.loading(`Uploading ${file.name}...`);

    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", getUploadURL.uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.setRequestHeader("x-amz-acl", "public-read");
      xhr.setRequestHeader("Content-Length", file.size.toString());

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          const uploadedSize = event.loaded;
          const totalSize = event.total;
          const elapsedTime = (Date.now() - startTime) / 1000;
          const uploadSpeed = uploadedSize / elapsedTime;
          const remainingSize = totalSize - uploadedSize;
          const estimatedTime = remainingSize / uploadSpeed;

          toast.loading(`Uploading ${file.name}: ${progress.toFixed(1)}%`, {
            id: toastId,
          });
        }
      };

      const startTime = Date.now();

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          toast.success(`${file.name} uploaded successfully`, { id: toastId });
          resolve(getFileDownloadUrlV2(getUploadURL.filePath));
        } else {
          toast.error(`Failed to upload ${file.name}: ${xhr.statusText}`, {
            id: toastId,
          });
          reject(new Error(`Failed to upload file: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => {
        toast.error(`Network error occurred while uploading ${file.name}`, {
          id: toastId,
        });
        reject(new Error("Network error occurred during file upload"));
      };

      xhr.send(file);
    });
  };

  const processValue = async (value: any): Promise<any> => {
    if (value instanceof File) {
      return processFile(value);
    } else if (Array.isArray(value)) {
      if (toZip) {
        const zip = new JSZip();
        for (const item of value) {
          if (item instanceof File) {
            zip.file(item.name, item);
          }
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const zipFile = new File([zipBlob], "files.zip", {
          type: "application/zip",
        });
        console.log(zipFile);
        return processFile(zipFile);
      }

      // Turn that in serialized array
      return JSON.stringify(
        await Promise.all(value.map((item) => processValue(item))),
      );
    } else if (value && typeof value === "object") {
      const entries = Object.entries(value);
      const processedEntries = await Promise.all(
        entries.map(async ([key, val]) => {
          const processedValue = await processValue(val);
          return [key, processedValue];
        }),
      );
      return Object.fromEntries(processedEntries);
    } else {
      return value;
    }
  };

  const newValues: Record<string, any> = {};
  for (const [key, value] of Object.entries(values)) {
    newValues[key] = await processValue(value);
  }
  console.log(newValues);

  return newValues;
}

export function WorkflowInputsForm({
  values,
  setValues,
  defaultValues,
  ...props
}: {
  workflow: z.infer<typeof workflowType>;
  inputs: ReturnType<typeof getInputsFromWorkflow>;
  defaultValues: Record<string, any>;
  onSubmit: (
    e: FormEvent<HTMLFormElement>,
    // values: Record<string, any>,
  ) => AsyncGenerator<
    {
      children: ReactNode;
      tooltip?: string;
    },
    void,
    unknown
  >;
  hideRunButton?: boolean;
  actionArea?: ReactNode;
  values?: Record<string, any>;
  setValues?: any;
}) {
  const { inputs, hideRunButton } = props;

  function updateInput(
    key: string,
    val: string | File | undefined | (File | string)[] | boolean | RGBColor[],
  ) {
    if (val instanceof File && val.size > 200000000) {
      toast.error("Cannot upload files bigger than 200MB");
      return;
    }
    setValues((prev: any) => ({ ...prev, [key]: val }));
  }

  const [_isLoading, setIsLoading] = useState(false);
  const isLoading = _isLoading;

  const [childrenOverrides, setChildrenOverrides] = useState<ReactNode>();
  const [tooltip, setTooltip] = useState<string | undefined>(undefined);

  return (
    <SDForm
      onSubmit={async (e) => {
        // e.preventDefault();
        if (isLoading) return;

        const currentChildren = "Run";
        const currentTooltip = tooltip;

        setIsLoading(true);
        if (props.onSubmit) {
          e.preventDefault();
          const generator = props.onSubmit(e);
          for await (const message of generator) {
            // setChildren(message.children);
            setChildrenOverrides(message.children);
            setTooltip(message.tooltip);
          }
        }
        setIsLoading(false);
        // setChildren(currentChildren);
        setChildrenOverrides(undefined);
        setTooltip(currentTooltip);
      }}
      actionArea={
        // props.actionArea
        !hideRunButton && (
          <div className="flex justify-end gap-2 pr-3">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                setValues(defaultValues);
              }}
            >
              Reset default
            </Button>
            <Button
              type="submit"
              // disabled={isLoading || loading}
              isLoading={isLoading}
            >
              {childrenOverrides ?? "Run with inputs"}
              {/* {isLoading || loading ? <LoadingIcon /> : <Play size={14} />} */}
            </Button>
          </div>
        )
      }
      scrollAreaClassName="[&>[data-radix-scroll-area-viewport]]:max-h-[500px]"
    >
      {inputs?.map((item) => {
        if (!values || !item?.input_id) {
          return;
        }
        return (
          <SDInputsRender
            key={item.input_id}
            inputNode={item}
            updateInput={updateInput}
            inputValue={values[item.input_id]}
          />
        );
      })}
    </SDForm>
  );
}

// For share page
export function RunWorkflowInline({
  inputs,
  workflow_version_id,
  machine_id,
  default_values = {},
  hideRunButton = false,
  hideInputs = false,
  runOrigin = "public-share",
  blocking = true,
  model_id,
}: {
  inputs: z.infer<typeof WorkflowInputsType>;
  workflow_version_id: string;
  machine_id: string;
  default_values?: Record<string, any>;
  hideRunButton?: boolean;
  hideInputs?: boolean;
  runOrigin?: WorkflowRunOriginType;
  blocking?: boolean;
  model_id?: string;
}) {
  const [values, setValues] =
    useState<
      Record<
        string,
        string | File | undefined | (File | string)[] | boolean | RGBColor[]
      >
    >(default_values);
  const [isLoading, setIsLoading] = useState(false);

  const user = useAuth();
  const clerk = useClerk();

  const schema = useMemo(() => {
    return plainInputsToZod(inputs);
  }, [inputs]);

  const fetchToken = useAuthStore((state) => state.fetchToken);

  const {
    setRunId,
    loading,
    setLoading: setLoading2,
    setStatus,
    setImage,
  } = publicRunStore();

  const runWorkflow = async () => {
    if (!user.isSignedIn) {
      clerk.openSignIn({
        redirectUrl: window.location.href,
      });
      return;
    }

    setLoading2(true);
    setIsLoading(true);
    const valuesParsed = await parseFilesToImgURLs({ ...values });
    const val = Object.entries(valuesParsed)
      .filter(([_, value]) => value != null)
      .reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]:
            typeof value === "string"
              ? // Try to parse JSON strings, fall back to original value if parsing fails
                (() => {
                  try {
                    return JSON.parse(value);
                  } catch {
                    return value;
                  }
                })()
              : value,
        }),
        {},
      );
    console.log(val);
    setStatus({ state: "preparing", live_status: "", progress: 0 });
    try {
      const origin = window.location.origin;
      // if (v2RunApi || model_id) {
      const auth = await fetchToken();
      const body = model_id
        ? { model_id: model_id, inputs: val }
        : {
            workflow_version_id: workflow_version_id,
            machine_id: machine_id,
            inputs: val,
            origin: runOrigin,
            batch_number: 1,
          };

      if (model_id) {
        setLoading2(true);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CD_API_URL}/api/run${model_id ? "/sync" : ""}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify(body),
        },
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }

      if (model_id) {
        const data = await response.json();
        setLoading2(false);
        const mediaData = data[0]?.data;
        if (mediaData?.images?.[0]?.url) {
          setImage([{ url: mediaData.images[0].url }]);
        } else if (mediaData?.video?.[0]?.url) {
          setImage([{ url: mediaData.video[0].url }]);
        }
      }
      // } else {
      // const a = await callServerPromise(
      //   createRun({
      //     origin,
      //     workflow_version_id: workflow_version_id,
      //     machine_id: machine_id,
      //     inputs: val,
      //     runOrigin: runOrigin,
      //   }),
      // );
      // if (a && !("error" in a) && "workflow_run_id" in a) {
      //   setRunId(a.workflow_run_id as string);
      // } else {
      //   setLoading2(false);
      // }
      // console.log(a);
      // }
      setIsLoading(false);
      if (!blocking) {
        setLoading2(false);
      }
    } catch (error) {
      setIsLoading(false);
      setLoading2(false);
      toast.error(
        `Failed to run workflow: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    runWorkflow();
  }

  function updateInput(
    key: string,
    val: string | File | undefined | (File | string)[] | boolean | RGBColor[],
  ) {
    if (val instanceof File && val.size > 200000000) {
      toast.error("Cannot upload files bigger than 200MB");
      return;
    }
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  useHotkeys(
    "meta+enter",
    (e) => {
      e.preventDefault();
      runWorkflow();
      // console.log("meta+enter");
    },
    {
      enableOnFormTags: ["input", "select", "textarea"],
    },
  );

  // if default value changes, update the values
  useEffect(() => {
    setValues(default_values);
  }, [default_values]);

  return (
    <>
      <SDForm
        onSubmit={onSubmit}
        hideChildren={hideInputs}
        actionArea={
          !hideRunButton && (
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading || loading}
              variant="expandIcon"
              iconPlacement="right"
              Icon={Play}
            >
              Run
            </Button>
          )
        }
        scrollAreaClassName="[&>[data-radix-scroll-area-viewport]]:max-h-[500px]"
      >
        {!hideInputs &&
          inputs?.map((item) => {
            if (!item?.input_id) {
              return;
            }
            return (
              <SDInputsRender
                key={item.input_id}
                inputNode={item}
                updateInput={updateInput}
                inputValue={values[item.input_id]}
              />
            );
          })}
      </SDForm>
      {!inputs && !hideRunButton && (
        <Button
          onClick={runWorkflow}
          isLoading={isLoading || loading}
          eventID="workflow_share_button:click"
        >
          Confirm
        </Button>
      )}
    </>
  );
}
