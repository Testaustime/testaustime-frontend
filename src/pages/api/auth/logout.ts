import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    res.setHeader("Set-Cookie", "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");
    return res.status(200).json({ message: "Logged out" });
  }
  else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
