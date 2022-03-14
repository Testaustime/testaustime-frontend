import { axiosInstance } from "../config";

interface UseRegisterResult {
  register: (username: string, password: string) => Promise<string>;
}

export const useRegister = (): UseRegisterResult => {
  const register = async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post<string>("/users/register", { username, password }, { responseType: "text" });
      const authToken = response.data;
      localStorage.setItem("authToken", authToken);
      return await Promise.resolve(authToken);
    } catch (error) {
      return await Promise.reject(error);
    }
  };

  return {
    register
  };
};