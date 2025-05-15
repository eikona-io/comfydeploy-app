"use client";

import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

export const useCurrentPlanQuery = () => {
  return useQuery<any>({
    queryKey: ["platform", "plan"],
  });
};

export const ALLOWED_DEPLOYMENT_PLANS = [
  "deployment_monthly",
  "deployment_yearly",
  "business_monthly",
  "business_yearly",
] as const;

export const useCurrentPlan = () => {
  const { isSignedIn } = useUser();
  const { data, isLoading } = useCurrentPlanQuery();
  // console.log(data);

  return data;
};

export const useIsDeploymentAllowed = () => {
  const plan = useCurrentPlan();
  return ALLOWED_DEPLOYMENT_PLANS.includes(plan?.plans?.plans?.[0]);
};

export const useCurrentPlanWithStatus = () => {
  return useCurrentPlanQuery();
};

export interface SubscriptionPlan {
  plans: {
    plans: string[];
    names: string[];
    prices: (number | null)[];
    amount: number[];
  };
  cancel_at_period_end: boolean;
  canceled_at: string | null;
}
