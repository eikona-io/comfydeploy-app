"use client";

import { useMatchRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function useWorkflowIdInWorkflowPage() {
  const matchRoute = useMatchRoute();
  const params = matchRoute({ to: "/workflows/$workflowId/$view" });

  if (!params) {
    return null;
  }

  return params.workflowId;
}
