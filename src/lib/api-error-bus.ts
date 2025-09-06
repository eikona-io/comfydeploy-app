import type { ApiError } from "./api-error";

type Handler = (err: ApiError<any>) => void;

let handler: Handler | undefined;
const pending: ApiError<any>[] = [];

export function setApiErrorHandler(h: Handler) {
  handler = h;
  // Flush any pending errors that occurred before the handler was set
  if (pending.length) {
    for (const err of pending.splice(0)) {
      try {
        handler(err);
      } catch {
        // ignore
      }
    }
  }
}

export function emitApiError(err: ApiError<any>) {
  try {
    if (handler) handler(err);
    else pending.push(err);
  } catch (e) {
    // Swallow to avoid breaking callers
    // console.error("Global API error handler failed", e);
  }
}
