import axios from "axios";

const hasError = (data: unknown): data is { error: string } => {
  // FIXME: Check that `error` is actually a string
  return typeof data === "object" && data !== null && "error" in data;
};

export const getErrorMessage = (err: unknown) => {
  if (!axios.isAxiosError(err)) throw err;
  if (!err.response || !err.response.data) throw err;

  if (err.response.status === 429) {
    return "You are sending too many requests. Slow down";
  }

  if (hasError(err.response.data)) {
    return err.response.data.error;
  }

  throw err;
};