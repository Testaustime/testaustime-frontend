import { useDispatch, useSelector } from "react-redux";
import { apiUrl } from "../config";
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
      const response = await fetch(`${apiUrl}/auth/regenerate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const newToken = await response.text();
      setToken(newToken);
      return Promise.resolve(newToken);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" }
      });
      const authToken = await response.text();
      setToken(authToken);
      dispatch(setUsername(username));
      return await Promise.resolve(authToken);
    } catch (error) {
      return await Promise.reject(error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" }
      });
      const authToken = await response.text();
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

  const refetchUsername = async () => {
    if (token) {
      const response = await fetch(`${apiUrl}/users/@me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      dispatch(setUsername(data.user_name));
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
