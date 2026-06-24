import type { ApiErrorResponse } from "@/lib/types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PATCH";
  token?: string;
  body?: unknown;
};

export async function apiRequest<T = unknown>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const response = await fetch(`${apiUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.token
        ? { Authorization: `Bearer ${options.token}` }
        : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = (await response.json().catch(() => null)) as
    | T
    | ApiErrorResponse
    | null;

  if (!response.ok) {
    const errorPayload = payload as ApiErrorResponse | null;
    const validationMessage = errorPayload?.details
      ?.map((detail) => `${detail.field}: ${detail.message}`)
      .join(", ");

    throw new Error(
      validationMessage ||
        errorPayload?.message ||
        `Request failed with status ${response.status}`,
    );
  }

  return payload as T;
}
