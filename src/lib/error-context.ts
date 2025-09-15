export type ErrorContext = {
  action?: string;
};

let current: ErrorContext = {};

export function setErrorContext(ctx: ErrorContext) {
  current = ctx || {};
}

export function clearErrorContext() {
  current = {};
}

export function getErrorContext(): ErrorContext {
  return current;
}

export async function withErrorContext<T>(ctx: ErrorContext, fn: () => Promise<T>): Promise<T> {
  setErrorContext(ctx);
  try {
    return await fn();
  } finally {
    clearErrorContext();
  }
}

