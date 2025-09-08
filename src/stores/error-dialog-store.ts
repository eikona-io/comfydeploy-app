import { create } from "zustand";
import { ApiError, isApiError } from "@/lib/api-error";
import { setApiErrorHandler } from "@/lib/api-error-bus";
import { getErrorContext } from "@/lib/error-context";

function tryParseJsonString(value?: unknown): any | undefined {
  if (typeof value !== "string") return undefined;
  const s = value.trim();
  if (!(s.startsWith("{") || s.startsWith("["))) return undefined;
  try {
    return JSON.parse(s);
  } catch {
    return undefined;
  }
}

function extractTextFromObject(obj: any, depth = 0): string | undefined {
  if (!obj || depth > 3) return undefined;
  // Common keys in various backends
  const primary = ["detail", "message", "error", "reason", "title"] as const;
  for (const key of primary) {
    const v = obj?.[key as keyof typeof obj];
    if (typeof v === "string" && v.trim()) return v;
    const parsed = tryParseJsonString(v);
    if (parsed) {
      const inner = extractTextFromObject(parsed, depth + 1);
      if (inner) return inner;
    }
  }
  // Dive into nested detail/detail forms
  if (obj?.detail && typeof obj.detail === "object") {
    const inner = extractTextFromObject(obj.detail, depth + 1);
    if (inner) return inner;
  }
  if (obj?.error && typeof obj.error === "object") {
    const inner = extractTextFromObject(obj.error, depth + 1);
    if (inner) return inner;
  }
  return undefined;
}

function prettifyErrorMessage(rawMessage: string | undefined, body: unknown): string | undefined {
  // If message is a JSON string, parse and try to extract a human string
  const parsedFromMsg = tryParseJsonString(rawMessage);
  if (parsedFromMsg) {
    const t = extractTextFromObject(parsedFromMsg);
    if (t) return t;
  }
  // If body is structured, try to extract a human string
  if (body && typeof body === "object") {
    const t = extractTextFromObject(body);
    if (t) return t;
  }
  // If body is a JSON-like string, parse and extract
  const parsedFromBody = tryParseJsonString(body as any);
  if (parsedFromBody) {
    const t = extractTextFromObject(parsedFromBody);
    if (t) return t;
  }
  return rawMessage;
}

function detectInsufficientCredit(message: string | undefined, body: unknown) {
  const lc = (message || "").toLowerCase();
  
  // Check for insufficient balance message pattern (simplified detection)
  if (lc.includes("insufficient") && lc.includes("balance")) {
    return true;
  }
  
  // Legacy support: inspect structured body to get feature_id (for backward compatibility)
  const obj =
    typeof body === "string" ? tryParseJsonString(body) : typeof body === "object" ? body : undefined;
  
  if (obj) {
    try {
      const detail = (obj as any).detail || (obj as any).error || {};
      const featureId = detail?.feature_id;
      
      // Only show insufficient credit UI for gpu-credit feature
      if (featureId === "gpu-credit") {
        if (lc.includes("insufficient") && (lc.includes("credit") || lc.includes("balance"))) {
          return true;
        }
      }
      
      const nested = extractTextFromObject(obj);
      const ln = (nested || "").toLowerCase();
      if (ln.includes("insufficient") && (ln.includes("credit") || ln.includes("balance"))) return true;
      // Heuristics on fields
      const allowed = (detail as any).allowed;
      const balances = (detail as any).balances;
      if (allowed === false && Array.isArray(balances)) return true;
    } catch {}
  }
  return false;
}

function detectUpgradeRequired(message: string | undefined, body: unknown) {
  const lc = (message || "").toLowerCase();
  
  // Check for access denied message pattern (simplified detection)
  // This indicates a feature limit that requires upgrade (not insufficient balance)
  if (lc.includes("access denied") && !lc.includes("insufficient") && !lc.includes("balance")) {
    return true;
  }
  
  // Legacy support: inspect structured body to get feature_id and allowed status (for backward compatibility)
  const obj =
    typeof body === "string" ? tryParseJsonString(body) : typeof body === "object" ? body : undefined;
  
  if (obj) {
    try {
      const detail = (obj as any).detail || (obj as any).error || {};
      const featureId = detail?.feature_id;
      const allowed = detail?.allowed;
      
      // If there's a feature_id and user is not allowed, and it's not gpu-credit
      // (gpu-credit is handled by detectInsufficientCredit)
      if (featureId && allowed === false && featureId !== "gpu-credit") {
        return true;
      }
    } catch {}
  }
  
  return false;
}

export type ErrorKind =
  | "insufficient_credit"
  | "upgrade_required"
  | "forbidden"
  | "network"
  | "not_found"
  | "rate_limited"
  | "unknown";

export interface SustainedErrorInfo {
  title: string;
  message: string;
  kind: ErrorKind;
  status?: number;
  path?: string;
  code?: string;
  body?: unknown;
  contextAction?: string;
  confirm?: {
    label: string;
    destructive?: boolean;
    onConfirm: () => void;
  };
}

interface ErrorDialogState {
  open: boolean;
  error?: SustainedErrorInfo;
  sustainError: (error: SustainedErrorInfo) => void;
  clear: () => void;
}

export const useErrorDialogStore = create<ErrorDialogState>((set) => ({
  open: false,
  error: undefined,
  sustainError: (error) => set({ error, open: true }),
  clear: () => set({ open: false, error: undefined }),
}));

// Helper: Inspect an API error and open the dialog with a sensible message
export function sustainApiError(err: unknown, ctx?: { path?: string }) {
  const { sustainError } = useErrorDialogStore.getState();

  let message = "An unexpected error occurred";
  let status: number | undefined = undefined;
  let kind: ErrorKind = "unknown";
  let path = ctx?.path;

  if (isApiError(err)) {
    status = err.status;
    path = path ?? err.url;
    const bodyMessage =
      typeof err.body === "string"
        ? err.body
        : (err.body as any)?.message || (err.body as any)?.error || err.message;
    const pretty = prettifyErrorMessage(err.message, err.body);
    message = pretty ?? bodyMessage ?? err.message;

    const lc = message.toLowerCase();
    if (detectInsufficientCredit(message, err.body)) {
      kind = "insufficient_credit";
    } else if (detectUpgradeRequired(message, err.body)) {
      kind = "upgrade_required";
    } else if (status === 0) kind = "network";
    else if (status === 403) kind = lc.includes("forbidden") ? "forbidden" : "forbidden";
    else if (status === 404) kind = "not_found";
    else if (status === 429) kind = "rate_limited";
    else kind = "unknown";
  } else if (err instanceof Error) {
    message = err.message;
    kind = message.toLowerCase().includes("network") ? "network" : "unknown";
  }

  const titleByKind: Record<ErrorKind, string> = {
    insufficient_credit: "Insufficient Credit",
    upgrade_required: "Upgrade Required",
    forbidden: "Access Forbidden",
    network: "Network Error",
    not_found: "Not Found",
    rate_limited: "Too Many Requests",
    unknown: "Something Went Wrong",
  };

  // Dedupe if the same error is already displayed
  const state = useErrorDialogStore.getState();
  const sameAsCurrent =
    state.open &&
    state.error?.message === message &&
    state.error?.status === status &&
    state.error?.kind === kind;

  if (!sameAsCurrent) {
    const ctx = getErrorContext();
    // Simplify overly technical messages for common kinds
    const simplified =
      kind === "insufficient_credit"
        ? "Not enough credits"
        : kind === "upgrade_required"
          ? "This feature requires a plan upgrade"
          : kind === "forbidden"
            ? "Access denied"
            : kind === "network"
              ? "Network error"
              : undefined;

    sustainError({
      title: titleByKind[kind],
      message: simplified ?? message,
      kind,
      status,
      path,
      code: isApiError(err) ? err.code : undefined,
      body: isApiError(err) ? err.body : undefined,
      contextAction: ctx?.action,
    });
  }
}

// Register global handler so every ApiError opens the dialog
// Bypass 404s (common for "not found" lookups we handle in UI)
setApiErrorHandler((err) => {
  if (err.status === 404) return;
  sustainApiError(err);
});
