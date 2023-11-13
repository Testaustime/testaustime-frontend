import axios from "../axios";
import { getErrorMessage } from "../lib/errorHandling/errorHandler";

export const logOut = async () => {
  try {
    await axios.post("/auth/logout", null);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw getErrorMessage(error);
  }
};
