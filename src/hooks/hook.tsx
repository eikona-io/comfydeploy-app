"use client";

import { useMatchRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function useWorkflowIdInWorkflowPage() {
	const matchRoute = useMatchRoute();
	const params = matchRoute({ to: "/workflow/$workflowId" });

	if (!params) {
		return null;
	}

	console.log(params);

	return params.workflowId;
}
