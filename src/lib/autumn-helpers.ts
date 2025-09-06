import type { Feature as AutumnFeature, AutumnDataV2Response } from "@/types/autumn-v2";

/**
 * Helper functions for working with Autumn Data V2 features
 */

export interface PlanStatusResponse {
  plans?: {
    autumn_data?: {
      features?: Record<string, AutumnFeature>;
    };
  };
}

/**
 * Get the autumn data from either autumn response or plan status (prioritize autumnResp)
 */
export function getAutumnData(
  planStatus?: PlanStatusResponse,
  autumnResp?: AutumnDataV2Response
) {
  return autumnResp?.autumn_data ?? planStatus?.plans?.autumn_data;
}

/**
 * Get a specific feature from autumn data
 */
export function getAutumnFeature(
  featureId: string,
  planStatus?: PlanStatusResponse,
  autumnResp?: AutumnDataV2Response
): AutumnFeature | null {
  const autumnData = getAutumnData(planStatus, autumnResp);
  return (autumnData?.features?.[featureId] ?? null) as AutumnFeature | null;
}

/**
 * Check if workflows are limited based on autumn data (prioritizing autumnResp)
 */
export function getWorkflowLimits(
  planStatus?: PlanStatusResponse,
  autumnResp?: AutumnDataV2Response,
  fallbackSub?: {
    features?: {
      workflowLimited?: boolean;
      workflowLimit?: number;
      currentWorkflowCount?: number;
    };
  }
) {
  // Prioritize autumnResp over planStatus
  const workflowLimitFeature = getAutumnFeature("workflow_limit", planStatus, autumnResp);
  
  const isUnlimited = workflowLimitFeature?.unlimited === true;
  const isLimited = workflowLimitFeature
    ? !workflowLimitFeature.unlimited && (workflowLimitFeature.balance ?? 0) <= 0
    : fallbackSub?.features?.workflowLimited ?? false;
  
  const limit = isUnlimited
    ? "Unlimited"
    : (workflowLimitFeature?.included_usage ?? fallbackSub?.features?.workflowLimit ?? 0);
  
  const currentCount = workflowLimitFeature?.usage ?? fallbackSub?.features?.currentWorkflowCount ?? 0;
  
  return {
    isUnlimited,
    isLimited,
    limit,
    currentCount,
    feature: workflowLimitFeature,
  };
}

/**
 * Check if machines are limited based on autumn data (prioritizing autumnResp)
 */
export function getMachineLimits(
  planStatus?: PlanStatusResponse,
  autumnResp?: AutumnDataV2Response,
  fallbackSub?: {
    features?: {
      machineLimited?: boolean;
      machineLimit?: number;
      currentMachineCount?: number;
    };
  }
) {
  // Prioritize autumnResp over planStatus
  const machineLimitFeature = getAutumnFeature("machine_limit", planStatus, autumnResp);
  
  const isUnlimited = machineLimitFeature?.unlimited === true;
  const isLimited = machineLimitFeature
    ? !machineLimitFeature.unlimited && (machineLimitFeature.balance ?? 0) <= 0
    : fallbackSub?.features?.machineLimited ?? false;
  
  const limit = isUnlimited
    ? "Unlimited"
    : (machineLimitFeature?.included_usage ?? fallbackSub?.features?.machineLimit ?? 0);
  
  const currentCount = machineLimitFeature?.usage ?? fallbackSub?.features?.currentMachineCount ?? 0;
  
  return {
    isUnlimited,
    isLimited,
    limit,
    currentCount,
    feature: machineLimitFeature,
  };
}

/**
 * Get credit balance for a feature
 */
export function getFeatureCredits(
  featureId: string,
  planStatus?: PlanStatusResponse,
  autumnResp?: AutumnDataV2Response
) {
  const feature = getAutumnFeature(featureId, planStatus, autumnResp);
  return {
    balance: feature?.balance ?? 0,
    usage: feature?.usage ?? 0,
    includedUsage: feature?.included_usage ?? 0,
    unlimited: feature?.unlimited ?? false,
    nextResetAt: feature?.next_reset_at,
  };
}