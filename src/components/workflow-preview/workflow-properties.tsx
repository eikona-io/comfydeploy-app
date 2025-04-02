"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface WorkflowPropertiesProps {
  workflow: any;
}

export function WorkflowProperties({ workflow }: WorkflowPropertiesProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Extract key workflow information
  const nodeCount = workflow.nodes?.length || 0;
  const linkCount = workflow.links?.length || 0;
  const version = workflow.version || "Unknown";
  const hasGroups = (workflow.groups?.length || 0) > 0;

  // Extract extra metadata if available
  const extraData = workflow.extra || {};
  const metadata = {
    version,
    nodeCount,
    linkCount,
    hasGroups,
    ...extraData,
  };

  return (
    <Card className="rounded-xl overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Workflow Properties</CardTitle>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <button className="h-6 w-6 rounded-full hover:bg-muted flex items-center justify-center">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
        <CardDescription>
          <div className="flex flex-wrap gap-2 mt-1">
            <Badge variant="outline" className="rounded-full">
              Nodes: {nodeCount}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Connections: {linkCount}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Version: {version}
            </Badge>
            {hasGroups && (
              <Badge variant="outline" className="rounded-full">
                Has Groups
              </Badge>
            )}

            {/* Display node types summary */}
            {workflow.nodes && (
              <Badge variant="outline" className="bg-primary/10 rounded-full">
                {new Set(workflow.nodes.map((n: any) => n.type)).size} Node
                Types
              </Badge>
            )}
          </div>
        </CardDescription>
      </CardHeader>

      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Display detailed metadata */}
              {Object.entries(metadata).map(([key, value]) => {
                // Skip complex objects for simple display
                if (typeof value === "object" && value !== null) {
                  return (
                    <div key={key} className="overflow-hidden">
                      <h4 className="text-sm font-medium">{formatKey(key)}</h4>
                      <pre className="text-xs bg-muted p-2 rounded-lg overflow-auto max-h-20">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    </div>
                  );
                }

                return (
                  <div key={key}>
                    <h4 className="text-sm font-medium">{formatKey(key)}</h4>
                    <p className="text-sm text-muted-foreground">
                      {String(value)}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

// Helper to format keys for display
function formatKey(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
