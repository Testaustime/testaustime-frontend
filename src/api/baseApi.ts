"use server";

import { cookies, headers } from "next/headers";
import { GetRequestError, PostRequestError } from "../types";

export const getRequest = async <T>(path: string) => {
  const token = cookies().get("token")?.value;
  if (!token) {
    return {
      error: GetRequestError.Unauthorized as const,
    };
  }

  const ip = headers().get("client-ip") ?? "Unknown IP";

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "client-ip": ip,
      "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
    },
    cache: "no-cache",
  });

  if (!response.ok) {
    if (response.status === 401) {
      return {
        error: GetRequestError.Unauthorized as const,
        response,
      };
    }

    if (response.status === 429) {
      return {
        error: GetRequestError.RateLimited as const,
        response,
      };
    }

    return {
      error: GetRequestError.UnknownError as const,
      path,
      response,
    };
  }

  const data = (await response.json()) as T;

  return data;
};

type WithResponseBody<R> =
  | { data: R }
  | { error: PostRequestError; statusCode: number };

type NoResponseBody = WithResponseBody<null>;

async function baseFetch(
  path: string,
  body?: unknown,
  method: string = "POST",
) {
  const tokenCookieName = "token";
  const token = cookies().get(tokenCookieName)?.value;

  const h = new Headers({
    "Content-Type": "application/json",
    "client-ip": headers().get("client-ip") ?? "Unknown IP",
    "bypass-token": process.env.RATELIMIT_IP_FORWARD_SECRET ?? "",
  });

  if (token) {
    h.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + path, {
    method,
    headers: h,
    cache: "no-cache",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 429) {
      return {
        error: PostRequestError.RateLimited,
        statusCode: response.status,
      };
    }

    return {
      error: PostRequestError.UnknownError,
      statusCode: response.status,
    };
  }

  return response;
}

export async function postRequestWithResponse<R>(
  path: string,
  body?: unknown,
  method: string = "POST",
): Promise<WithResponseBody<R>> {
  const response = await baseFetch(path, body, method);
  if ("error" in response) return response;

  const data = (await response.json()) as R;
  return { data };
}

export async function postRequestWithoutResponse(
  path: string,
  body?: unknown,
  method: string = "POST",
): Promise<NoResponseBody> {
  const response = await baseFetch(path, body, method);
  if ("error" in response) return response;

  return { data: null };
}
