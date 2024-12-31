import { useAuthStore } from "./auth-store";

export async function api({
  url,
  init,
  params,
  raw,
}: {
  url: string;
  init?: RequestInit;
  params?: Record<string, any> | string;
  raw?: boolean;
}) {
  const fetchToken = useAuthStore.getState().fetchToken;

  const auth = await fetchToken();

  let queryString;
  if (typeof params === "string") {
    queryString = "?" + params;
  } else {
    queryString = params
      ? `?${new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
        ).toString()}`
      : "";
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth}`,
  };

  const finalUrl = `${process.env.NEXT_PUBLIC_CD_API_URL}/api/${url}${queryString}`;

  return await fetch(finalUrl, {
    headers: {
      ...headers,
      ...init?.headers,
    },
    ...init,
  }).then(async (res) => {
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`HTTP error! status: ${res.status}, body: ${errorBody}`);
    }
    if (raw) {
      return res;
    }
    return res.json().then((data) => convertDateFields(data));
  });
}

export function convertDateFields(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(convertDateFields);
  } else if (obj !== null && typeof obj === "object") {
    const newObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
        const customRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;

        if (isoRegex.test(value)) {
          // Handle ISO 8601 format
          const dateString = value.endsWith("Z") ? value : `${value}Z`;
          newObj[key] = new Date(dateString);
        } else if (customRegex.test(value)) {
          // Handle custom format: 2024-09-08 16:39:26.823000
          newObj[key] = new Date(value.replace(" ", "T") + "Z");
        } else {
          newObj[key] = convertDateFields(value);
        }
      } else {
        newObj[key] = convertDateFields(value);
      }
    }
    return newObj;
  }
  return obj;
}
