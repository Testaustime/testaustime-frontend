import axios, { isAxiosError } from "axios";
import { NextRequest } from "next/server";

const handle = async (req: NextRequest) => {
  if (process.env.NEXT_PUBLIC_API_URL === undefined) {
    return new Response(JSON.stringify({ message: "Missing API URL" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("Authorization")?.replace("Bearer ", "");

  // req.nextUrl.pathname is for example "/api/friends/list"
  // We want to remove the "/api" part and keep the rest
  const endpoint = req.nextUrl.pathname.substring(4) || "";

  // This will be something like "https://api.testaustime.fi/friends/list"
  const url = process.env.NEXT_PUBLIC_API_URL + endpoint;

  try {
    const response = await axios({
      method: req.method.toLowerCase(),
      url,
      headers: {
        Authorization: `Bearer ${token || ""}`,
        "X-Forwarded-For": req.ip,
        "Content-Type": "application/json",
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: await req.text(),
    });

    const headers = new Headers();
    Object.entries(response.headers).forEach(([key, value]) => {
      headers.set(key, value as string);
    });

    return new Response(JSON.stringify(response.data), {
      status: response.status,
      headers,
    });
  } catch (e) {
    if (isAxiosError(e)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      return new Response(JSON.stringify({ error: e.response?.data }), {
        status: e.response?.status || 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    console.error(e);

    return new Response(JSON.stringify({ message: "Unknown error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
