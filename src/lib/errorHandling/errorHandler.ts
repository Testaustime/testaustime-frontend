import axios from "axios";

export const getErrorMessage = (err: unknown) => {
  if (!axios.isAxiosError(err)) throw err;
  if (!err.response || !err.response.data) throw err;

  if (err.response.status === 429) {
    return "You are sending too many requests. Slow down";
  }

  const errorResponseData = err.response.data;
  if (typeof errorResponseData === "object" && "error" in errorResponseData && typeof errorResponseData.error === "string") {
    // Return whatever message was returned from the API
    return String(errorResponseData.error);
  }

  throw err;
};