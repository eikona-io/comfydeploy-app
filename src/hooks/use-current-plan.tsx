"use client";

import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

export const useCurrentPlanQuery = () => {
	return useQuery<any>({
		queryKey: ["platform", "plan"],
	});
};

export const useCurrentPlan = () => {
	const { isSignedIn } = useUser();
	const { data, isLoading } = useCurrentPlanQuery();
	return data;
};

export const useCurrentPlanWithStatus = () => {
	return useCurrentPlanQuery();
};
