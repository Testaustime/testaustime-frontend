import { isAxiosError } from "axios";

export const getErrorMessage = (err: unknown) => {
  if (!isAxiosError(err)) throw err;
  if (!err.response || !err.response.data) throw err;

  if (err.response.status === 429) {
    return "You are sending too many requests. Slow down";
  }

  const data: unknown = err.response.data;
  if (typeof data === "object"
    && data !== null
    && "error" in data
    && typeof data.error === "string") {
    return data.error;
  }

  throw err;
};
