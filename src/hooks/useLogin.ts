import { useDispatch } from "react-redux";
import { axiosInstance } from "../config";
import { setUsername } from "../slices/userSlice";
import { useAuthentication } from "./useAuthentication";

interface UseLoginResult {
  login: (username: string, password: string) => Promise<string>;
}

export const useLogin = (): UseLoginResult => {
  const dispatch = useDispatch();
  const { setToken } = useAuthentication();

  const login = async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post<string>("/users/login", { username, password }, { responseType: "text" });
      const authToken = response.data;
      setToken(authToken);
      dispatch(setUsername(username));
      return await Promise.resolve(authToken);
    } catch (error) {
      return await Promise.reject(error);
    }
  };

  return {
    login
  };
};