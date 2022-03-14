import { useDispatch } from "react-redux";
import { axiosInstance } from "../config";
import { setUsername } from "../slices/userSlice";
import { useAuthentication } from "./useAuthentication";

interface UseRegisterResult {
  register: (username: string, password: string) => Promise<string>;
}

export const useRegister = (): UseRegisterResult => {
  const dispatch = useDispatch();
  const { setToken } = useAuthentication();

  const register = async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post<string>("/users/register", { username, password }, { responseType: "text" });
      const authToken = response.data;
      setToken(authToken);
      dispatch(setUsername(username));
      return await Promise.resolve(authToken);
    } catch (error) {
      return await Promise.reject(error);
    }
  };

  return {
    register
  };
};