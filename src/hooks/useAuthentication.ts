import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../config";
import { setAuthToken, setUsername } from "../slices/userSlice";
import { RootState } from "../store";

export const useAuthentication = () => {
  const dispatch = useDispatch();

  const token = useSelector<RootState, string>(state => state.users.authToken);
  const username = useSelector<RootState, string>(state => state.users.username);

  const setToken = (newToken: string) => {
    dispatch(setAuthToken(newToken));
    localStorage.setItem("authToken", newToken);
  };

  const regenerateToken = async () => {
    try {
      const response = await axiosInstance.post("/auth/regenerate", {}, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "text"
      });
      const newToken = response.data;
      setToken(newToken);
      return Promise.resolve(newToken);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post<string>("/auth/register", { username, password }, { responseType: "text" });
      const authToken = response.data;
      setToken(authToken);
      dispatch(setUsername(username));
      return await Promise.resolve(authToken);
    } catch (error) {
      return await Promise.reject(error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await axiosInstance.post<string>("/auth/login", { username, password }, { responseType: "text" });
      const authToken = response.data;
      setToken(authToken);
      dispatch(setUsername(username));
      return await Promise.resolve(authToken);
    } catch (error) {
      return await Promise.reject(error);
    }
  };

  const logOut = () => {
    dispatch(setAuthToken(""));
    dispatch(setUsername(""));
    localStorage.removeItem("authToken");
  };

  const refetchUsername = () => {
    if (token) {
      axiosInstance.get("/users/@me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }).then(response => {
        dispatch(setUsername(response.data.user_name));
      }).catch(error => {
        console.log(error);
      });
    }
    else {
      dispatch(setUsername(""));
    }
  };

  return {
    token,
    setToken,
    isLoggedIn: !!token,
    regenerateToken,
    register,
    login,
    logOut,
    username,
    refetchUsername
  };
};
