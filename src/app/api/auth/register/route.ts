import axios, { isAxiosError } from "axios";
import { ApiAuthRegisterResponse } from "../../../[locale]/register/RegistrationForm";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  if (process.env.NEXT_PUBLIC_API_URL === undefined) {
    return new Response(JSON.stringify({ message: "Missing API URL" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const response = await axios.post<ApiAuthRegisterResponse>(
      "/auth/register",
      JSON.parse(await req.text()),
      {
        headers: {
          "X-Forwarded-For": req.ip,
        },
        baseURL: process.env.NEXT_PUBLIC_API_URL,
      },
    );
    const token = response.data.auth_token;
    const expiration = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 7,
    ).toUTCString();

    return new Response(JSON.stringify(response.data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `token=${token}; path=/; expires=${expiration}; SameSite=Strict; Secure; HttpOnly`,
      },
    });
  } catch (e) {
    if (isAxiosError(e)) {
      if (!e.response) {
        return new Response(
          JSON.stringify({ message: "Internal server error" }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }

      return new Response(JSON.stringify(e.response.data), {
        status: e.response.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  // This should never happen
  console.error("This should never happen");

  return new Response(
    JSON.stringify({
      message: "Internal server error",
    }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};
