export class ApiError<TBody = any> extends Error {
  status: number;
  url: string;
  body?: TBody | string | null;
  code?: string;
  constructor(
    message: string,
    opts: { status: number; url: string; body?: TBody | string | null; code?: string },
  ) {
    super(message);
    this.name = "ApiError";
    this.status = opts.status;
    this.url = opts.url;
    this.body = opts.body ?? null;
    this.code = opts.code;
  }
}

export function isApiError(err: unknown): err is ApiError<any> {
  return err instanceof Error && (err as any).name === "ApiError";
}

