import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Download,
  Eye,
  ExternalLink,
  Play,
  User,
  Calendar,
  Workflow,
} from "lucide-react";
import { getRelativeTime } from "@/lib/get-relative-time";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

interface SharedWorkflow {
  id: string;
  user_id: string;
  org_id: string;
  workflow_id: string;
  workflow_version_id: string;
  workflow_export: Record<string, unknown>;
  share_slug: string;
  title: string;
  description: string;
  cover_image: string;
  is_public: boolean;
  view_count: number;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export const Route = createFileRoute("/share/workflow/$user/$slug")({
  component: SharedWorkflowDetails,
});

function SharedWorkflowDetails() {
  const { user: userParam, slug } = Route.useParams();
  const [isDownloading, setIsDownloading] = useState(false);

  // Debug logging
  console.log("Route params:", { userParam, slug });
  console.log("API URL will be:", `shared-workflows/${slug}`);

  const {
    data: sharedWorkflow,
    isLoading,
    error,
  } = useQuery<SharedWorkflow>({
    queryKey: ["shared-workflow", slug],
    queryFn: async () => {
      const apiUrl = `shared-workflows/${slug}`;
      console.log("Making API request to:", apiUrl);

      try {
        const data = await api({
          url: apiUrl,
        });
        console.log("API Response data:", data);
        return data;
      } catch (error) {
        console.error("API Error:", error);
        throw error;
      }
    },
  });

  console.log("Query state:", { isLoading, error, sharedWorkflow });

  const handleDownload = async () => {
    if (!sharedWorkflow) return;

    setIsDownloading(true);
    try {
      // Use api utility with raw: true to get the response object
      const response = await api({
        url: `shared-workflows/${slug}/download`,
        raw: true,
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${sharedWorkflow.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Workflow downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download workflow");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return <SharedWorkflowDetailsSkeleton />;
  }

  if (error || !sharedWorkflow) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-muted-foreground mb-2">
              Workflow Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              The shared workflow you're looking for doesn't exist or has been
              removed.
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 text-sm text-red-700">
                <strong>Debug info:</strong>
                <br />
                User: {userParam}
                <br />
                Slug: {slug}
                <br />
                Error: {error.message}
              </div>
            )}
            <Link to="/explore">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Browse
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link to="/explore">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Button>
        </Link>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cover Image */}
          <div className="w-full lg:w-1/3">
            <div className="aspect-video rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              {sharedWorkflow.cover_image ? (
                <img
                  src={sharedWorkflow.cover_image}
                  alt={sharedWorkflow.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Workflow className="h-16 w-16 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {sharedWorkflow.title}
              </h1>
              <p className="text-muted-foreground text-lg">
                {sharedWorkflow.description || "No description provided"}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{sharedWorkflow.view_count} views</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>{sharedWorkflow.download_count} downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Shared {getRelativeTime(sharedWorkflow.created_at)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Link
                to="/share/playground/$user/$slug"
                params={{
                  user: sharedWorkflow.user_id,
                  slug: sharedWorkflow.share_slug,
                }}
              >
                <Button size="lg" className="gap-2">
                  <Play className="h-4 w-4" />
                  Run This Workflow
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                onClick={handleDownload}
                disabled={isDownloading}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {isDownloading ? "Downloading..." : "Download JSON"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            Workflow Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Workflow Structure */}
          {sharedWorkflow.workflow_export && (
            <div>
              <h3 className="font-semibold mb-3">Workflow Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Nodes</p>
                  <p className="font-medium">
                    {(sharedWorkflow.workflow_export as any)?.nodes?.length ||
                      0}{" "}
                    nodes
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Environment</p>
                  <p className="font-medium">
                    {(sharedWorkflow.workflow_export as any)?.environment
                      ?.gpu || "Not specified"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">ComfyUI Version</p>
                  <p className="font-medium">
                    {(
                      sharedWorkflow.workflow_export as any
                    )?.environment?.comfyui_version?.substring(0, 8) ||
                      "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Usage Instructions */}
          <div>
            <h3 className="font-semibold mb-3">How to Use</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                • Click "Run This Workflow" to execute it with custom inputs
              </p>
              <p>
                • Download the JSON file to import into your own ComfyUI
                instance
              </p>
              <p>
                • The workflow includes all necessary node configurations and
                dependencies
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SharedWorkflowDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Skeleton className="h-10 w-32 mb-4" />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3">
            <Skeleton className="aspect-video rounded-lg" />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-6 w-full" />
            </div>

            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="flex gap-3">
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-12 w-36" />
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Skeleton className="h-5 w-32 mb-3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>

          <div>
            <Skeleton className="h-5 w-24 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
