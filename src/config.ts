import axios from "axios";

export const apiUrl =
  process.env.NODE_ENV === "test" ?
    "" : // Testing env -> Use mock apis
    process.env.REACT_APP_BASE_API || ""; // Dev or prod -> Use specified apis

axios.defaults.baseURL = apiUrl;
