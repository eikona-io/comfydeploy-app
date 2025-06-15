"use client";

import { useState } from "react";
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
import { Share } from "lucide-react";

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
  const [description, setDescription] = useState(`Shared workflow: ${workflowName}`);
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CD_API_URL}/api/workflow/${workflowId}/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workflow_id: workflowId,
            title,
            description,
            is_public: isPublic,
          }),
        }
      );

      if (response.ok) {
        const sharedWorkflow = await response.json();
        const shareUrl = `${window.location.origin}/share/${sharedWorkflow.user_id}/${sharedWorkflow.share_slug}`;
        
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link created and copied to clipboard!");
        
        onOpenChange(false);
        
        setTitle(workflowName);
        setDescription(`Shared workflow: ${workflowName}`);
        setIsPublic(true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.detail || "Failed to create share link");
      }
    } catch (error) {
      console.error("Share workflow error:", error);
      toast.error("Failed to create share link");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            Share Workflow
          </DialogTitle>
        </DialogHeader>

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

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public">Public</Label>
              <div className="text-sm text-muted-foreground">
                Make this workflow visible to everyone
              </div>
            </div>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Share Link"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
