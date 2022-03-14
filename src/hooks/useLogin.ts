import { useDispatch } from "react-redux";
import { axiosInstance } from "../config";
import { setAuthToken } from "../slices/userSlice";

interface UseLoginResult {
  login: (username: string, password: string) => Promise<string>;
}

export const useLogin = (): UseLoginResult => {
  const dispatch = useDispatch();
  const login = async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post<string>("/users/login", { username, password }, { responseType: "text" });
      const authToken = response.data;
      localStorage.setItem("authToken", authToken);
      dispatch(setAuthToken(authToken));
      return await Promise.resolve(authToken);
    } catch (error) {
      return await Promise.reject(error);
    }
  };

  return {
    login
  };
};