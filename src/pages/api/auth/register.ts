import axios, { isAxiosError } from "axios";
import { NextApiHandler } from "next";
import { ApiAuthRegisterResponse } from "../../../hooks/useAuthentication";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    if (process.env.NEXT_PUBLIC_API_URL === undefined) {
      res.status(500).json({ message: "Missing API URL" });
      return;
    }

    try {
      const response = await axios.post<ApiAuthRegisterResponse>(
        "/auth/register",
        req.body,
        {
          headers: {
            "X-Forwarded-For": req.socket.remoteAddress,
          },
          baseURL: process.env.NEXT_PUBLIC_API_URL,
        },
      );
      const token = response.data.auth_token;
      const expiration = new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 7,
      ).toUTCString();
      res.setHeader(
        "Set-Cookie",
        `token=${token}; path=/; expires=${expiration}; SameSite=Strict; Secure; HttpOnly`,
      );
      res.status(response.status).json(response.data);
      return;
    } catch (e) {
      if (isAxiosError(e)) {
        if (!e.response) {
          res.status(500).json({ message: "Internal server error" });
          return;
        }
        res.status(e.response.status).json(e.response.data);
        return;
      }
    }

    // This should never happen
    console.error("This should never happen");
    res.status(500).json({ message: "Internal server error" });
    return;
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
