"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useErrorDialogStore } from "@/stores/error-dialog-store";

export async function callServerPromise<T>(
  result: Promise<T>,
  props?: {
    loadingText?: string;
    successMessage?: string;
    errorAction?: {
      name: string;
      action: () => void;
    };
  },
) {
  let id: string | number;
  if (props?.loadingText) {
    id = toast.loading(props.loadingText);
  }
  return result
    .then((x) => {
      // delay toast to show
      setTimeout(() => {
        if ((x as { message: string })?.message !== undefined) {
          toast.success((x as { message: string }).message);
        } else if ((x as { error: string })?.error !== undefined) {
          const error = (x as { error: string }).error;
          reportError(error);
        } else if (props?.successMessage) {
          toast.success(props.successMessage);
        }

        // if ((x as { redirect: string })?.redirect !== undefined) {
        //   props?.router?.push((x as { redirect: string }).redirect);
        // }
      }, 500);

      return x;
    })
    .catch((error) => {
      console.log(error);
      console.log(error?.length);
      reportError(error?.toString(), props?.errorAction);
      return null;
    })
    .finally(() => {
      if (id !== undefined) toast.dismiss(id);
    });
}

function reportError(
  error: string,
  errorAction?: {
    name: string;
    action: () => void;
  },
) {
  const max = 20;
  if (errorAction) {
    const cleaned = (error || "").replace(/^ApiError:\s*/i, "");
    // Open the global dialog with a destructive confirmation CTA
    useErrorDialogStore.getState().sustainError({
      title: "Confirm Delete",
      message: cleaned || "Delete this resource?",
      kind: "unknown",
      confirm: {
        label: errorAction.name,
        destructive: true,
        onConfirm: errorAction.action,
      },
    });
    return;
  }

  // Fallback: show toast with copy/report when no action is present
  toast.error(
    <div className="flex w-full flex-col items-start justify-between gap-2">
      <span className="font-medium">{error}</span>
      <div className="flex w-full justify-end gap-2">
        <Button
          variant="outline"
          className="h-fit min-h-0 px-2 py-0 text-2xs"
          onClick={async () => {
            await navigator.clipboard.writeText(`Error: \n\`\`\`\n${error}\n\`\`\`\n`);
            window.open("https://discord.gg/q6HVeCxvCK", "_blank");
          }}
        >
          Report
        </Button>
      </div>
    </div>,
  );
}
