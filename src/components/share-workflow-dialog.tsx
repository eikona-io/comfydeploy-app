"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Share,
  ExternalLink,
  AlertCircle,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { api } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AssetsBrowserPopup } from "@/components/workspace/assets-browser-drawer";
import { FileURLRender } from "@/components/workflows/OutputRender";
import { useAssetsBrowserStore } from "@/components/workspace/Workspace";

interface ShareWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId: string;
  workflowName: string;
}

export function ShareWorkflowDialog({
  open,
  onOpenChange,
  workflowId,
  workflowName,
}: ShareWorkflowDialogProps) {
  const [title, setTitle] = useState(workflowName);
  const [description, setDescription] = useState(
    `Shared workflow: ${workflowName}`,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<string>("");

  const queryClient = useQueryClient();
  const { setOpen: setAssetBrowserOpen } = useAssetsBrowserStore();

  // Query to check for existing shared workflows
  const { data: existingShares } = useQuery({
    queryKey: ["workflow", workflowId, "shared-status"],
    enabled: open, // Only fetch when dialog is open
  });

  // Check if this workflow already has shared versions
  const existingShare = existingShares?.shared_workflows?.find(
    (share: any) => share.workflow_id === workflowId,
  );

  // Update form fields when existing share is found
  useEffect(() => {
    if (existingShare) {
      setTitle(existingShare.title);
      setDescription(
        existingShare.description || `Shared workflow: ${workflowName}`,
      );
      setCoverImage(existingShare.cover_image || "");
    } else {
      setTitle(workflowName);
      setDescription(`Shared workflow: ${workflowName}`);
      setCoverImage("");
    }
  }, [existingShare, workflowName]);

  const handleCopyExistingLink = async () => {
    if (existingShare) {
      const shareUrl = `${window.location.origin}/share/${existingShare.user_id}/${existingShare.share_slug}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Existing share link copied to clipboard!");
    }
  };

  const handleUnpublish = async () => {
    if (!existingShare) return;

    setIsSubmitting(true);
    try {
      await api({
        url: `workflow/${workflowId}/share`,
        init: {
          method: "DELETE",
        },
      });

      toast.success(
        "Workflow unpublished from community successfully! It's no longer shared.",
      );
      onOpenChange(false);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["workflow", workflowId, "shared-status"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workflows"],
      });
    } catch (error) {
      console.error("Unpublish error:", error);
      toast.error("Failed to unpublish workflow");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateWithLatestVersion = async () => {
    if (!existingShare) return;

    setIsSubmitting(true);
    try {
      await api({
        url: `workflow/${workflowId}/share`,
        init: {
          method: "POST",
          body: JSON.stringify({
            workflow_id: workflowId,
            title: existingShare.title,
            description: existingShare.description,
            cover_image: existingShare.cover_image,
            // This will update with the latest workflow version
          }),
        },
      });

      toast.success(
        "Workflow updated with latest version! Your shared workflow now reflects the newest changes.",
      );
      onOpenChange(false);

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ["workflow", workflowId, "shared-status"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workflows"],
      });
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update workflow");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssetSelect = (asset: {
    url: string;
    name: string;
    id: string;
  }) => {
    setCoverImage(asset.url);
    setAssetBrowserOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate cover image requirement
    if (!coverImage.trim()) {
      toast.error("Cover image is required before publishing");
      return;
    }

    setIsSubmitting(true);

    try {
      const sharedWorkflow = await api({
        url: `workflow/${workflowId}/share`,
        init: {
          method: "POST",
          body: JSON.stringify({
            workflow_id: workflowId,
            title,
            description,
            cover_image: coverImage,
          }),
        },
      });

      if (sharedWorkflow) {
        const shareUrl = `${window.location.origin}/share/${sharedWorkflow.user_id}/${sharedWorkflow.share_slug}`;

        await navigator.clipboard.writeText(shareUrl);

        toast.success(
          existingShare
            ? "Workflow updated and published to community! Share link copied to clipboard."
            : "Workflow published to community successfully! Share link copied to clipboard.",
        );

        onOpenChange(false);

        // Invalidate queries to refresh data
        queryClient.invalidateQueries({
          queryKey: ["workflow", workflowId, "shared-status"],
        });
        queryClient.invalidateQueries({
          queryKey: ["workflows"],
        });

        // Reset form will be handled by useEffect when dialog closes
      }
    } catch (error) {
      console.error("Share workflow error:", error);
      toast.error("Failed to publish workflow");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          if (isSubmitting && !newOpen) return;
          onOpenChange(newOpen);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share className="h-5 w-5" />
              Publish to Community
            </DialogTitle>
          </DialogHeader>

          {existingShare && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-semibold mb-1">
                  <span className="text-green-700">
                    🌍 Published to Community
                  </span>
                </div>
                This workflow is publicly visible in the community. You can copy
                the link, update it with the latest version, or unpublish it.
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyExistingLink}
                    disabled={isSubmitting}
                  >
                    <ExternalLink className="mr-1 h-3 w-3" />
                    Copy Link
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUpdateWithLatestVersion}
                    disabled={isSubmitting}
                  >
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Update Latest
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleUnpublish}
                    disabled={isSubmitting}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Unpublish
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter workflow title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter workflow description (optional)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Cover Image *</Label>
              <div className="flex gap-2">
                {coverImage ? (
                  <div className="group relative h-24 w-24 overflow-hidden rounded-md border">
                    <FileURLRender
                      url={coverImage}
                      imgClasses="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage("")}
                      className="absolute top-1 right-1 rounded-full bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400"
                    onClick={() => setAssetBrowserOpen(true)}
                  >
                    <ImageIcon className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div className="flex flex-col justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAssetBrowserOpen(true)}
                  >
                    {coverImage ? "Change Image" : "Select Image"}
                  </Button>
                  {!coverImage && (
                    <p className="text-muted-foreground text-xs">
                      Cover image is required
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !coverImage.trim()}
              >
                {isSubmitting
                  ? existingShare
                    ? "Updating..."
                    : "Publishing..."
                  : existingShare
                    ? "Update & Publish"
                    : "Publish to Community"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AssetsBrowserPopup isPlayground={true} handleAsset={handleAssetSelect} />
    </>
  );
}
