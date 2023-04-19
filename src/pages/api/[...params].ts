import axios, { isAxiosError } from "axios";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (process.env.NEXT_PUBLIC_API_URL === undefined) return res.status(500).json({ message: "Missing API URL" });
  const token = req.cookies.token || req.headers.authorization?.replace("Bearer ", "");
  const url = `${process.env.NEXT_PUBLIC_API_URL}${req.url?.substring(4) || ""}`;

  try {
    const response = await axios({
      method: req.method?.toLowerCase(),
      url,
      headers: {
        Authorization: `Bearer ${token || ""}`,
        "X-Forwarded-For": req.socket.remoteAddress
      },
      data: req.body as unknown
    });

    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value as string | number | readonly string[]);
    });

    return res.status(response.status).send(response.data);
  } catch (e) {
    if (isAxiosError(e)) {
      return res.status(e.response?.status || 500).send(e.response?.data);
    }
    return res.status(500).json({ message: "Unknown error" });
  }
};

export default handler;
