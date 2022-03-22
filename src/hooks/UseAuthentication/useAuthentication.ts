import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authTokenLocalStorageKey } from "../../constants";
import { getErrorMessage } from "../../lib/errorHandling/errorHandler";
import { setAuthToken, setUsername } from "../../slices/userSlice";
import { RootState } from "../../store";

export interface ApiAuthRegisterResponse {
  token: string
}

export interface ApiAuthLoginResponse {
  token: string
}

export interface ApiAuthRegenerateResponse {
  token: string
}

export interface ApiUsersUserResponse {
  id: number,
  user_name: string,
  friend_code: string,
  registration_time: string
}

export interface UseAuthenticationResult {
  token: string,
  setToken: (newToken: string) => void,
  isLoggedIn: boolean,
  regenerateToken: () => Promise<string>,
  register: (username: string, password: string) => Promise<string>,
  login: (username: string, password: string) => Promise<string>,
  logOut: () => void,
  username: string,
  refetchUsername: () => Promise<string>
}

export const useAuthentication = (): UseAuthenticationResult => {
  const dispatch = useDispatch();

  const token = useSelector<RootState, string>(state => state.users.authToken);
  const username = useSelector<RootState, string>(state => state.users.username);

  const setToken = (newToken: string) => {
    dispatch(setAuthToken(newToken));
    localStorage.setItem(authTokenLocalStorageKey, newToken);
  };

  const regenerateToken = async () => {
    try {
      const { data } = await axios.post<ApiAuthRegenerateResponse>("/auth/regenerate", null, { headers: { Authorization: `Bearer ${token}` } });
      const newToken = data.token;
      setToken(newToken);
      return newToken;
    } catch (error) {
      throw getErrorMessage(error);
    }
  };

  const register = async (username: string, password: string) => {
    try {
      const { data } = await axios.post<ApiAuthRegisterResponse>("/auth/register", { username, password });
      const authToken = data.token;
      setToken(authToken);
      dispatch(setUsername(username));
      return authToken;
    } catch(error) {
      throw getErrorMessage(error);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const { data } = await axios.post<ApiAuthLoginResponse>("/auth/login", { username, password });
      const authToken = data.token;
      setToken(authToken);
      dispatch(setUsername(username));
      return authToken;
    } catch (err) {
      throw getErrorMessage(err);
    }
  };

  const logOut = () => {
    dispatch(setAuthToken(""));
    dispatch(setUsername(""));
    localStorage.removeItem(authTokenLocalStorageKey);
  };

  const refetchUsername = async () => {
    if (token) {
      try {
        const { data } = await axios.get("/users/@me", { headers: { Authorization: `Bearer ${token}` } });
        dispatch(setUsername(data.user_name));
        return data.user_name;
      } catch (error) {
        dispatch(setUsername(""));
        return "";
      }
    }
    else {
      dispatch(setUsername(""));
      return "";
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
