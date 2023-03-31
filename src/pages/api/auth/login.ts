import axios, { isAxiosError } from "axios";
import { NextApiHandler } from "next";
import { ApiAuthLoginResponse } from "../../../hooks/useAuthentication";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    if (process.env.NEXT_PUBLIC_API_URL === undefined) return res.status(500).json({ message: "Missing API URL" });

    try {
      const response = await axios.post<ApiAuthLoginResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`, req.body);
      const token = response.data.auth_token;
      res.setHeader(
        "Set-Cookie",
        `token=${token}; path=/; expires=${new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toUTCString()}; SameSite=Strict; Secure; HttpOnly`
      );
      return res.status(response.status).json(response.data);
    } catch (e) {
      if (isAxiosError(e)) {
        if (!e.response) return res.status(500).json({ message: "Internal server error" });
        return res.status(e.response.status).json(e.response.data);
      }
    }

    // This should never happen
    return res.status(500).json({ message: "Internal server error" });
  }
  else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
