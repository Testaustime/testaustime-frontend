import axios from "axios";

const port = process.env.PORT || 3000;
const baseURL = process.env.NODE_ENV === "production" ? "/api" : `http://localhost:${port}/api`;

const instance = axios.create({ baseURL });

export default instance;
