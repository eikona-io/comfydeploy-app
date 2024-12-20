"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { getRelativeTime } from "@/lib/get-relative-time";

export function DeploymentRow({
  deployment,
}: {
  deployment: any;
}) {
  return (
    <>
      <TableCell className="truncate capitalize">
        {deployment.environment}
      </TableCell>
      <TableCell className="truncate font-medium">
        {deployment.version?.version}
      </TableCell>
      <TableCell className="truncate font-medium">
        {deployment.machine?.name}
      </TableCell>
      <TableCell className="truncate text-right">
        {getRelativeTime(deployment.updated_at)}
      </TableCell>
    </>
  );
}
