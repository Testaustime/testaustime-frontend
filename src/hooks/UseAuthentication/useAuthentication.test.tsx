import { renderHook } from "@testing-library/react-hooks";
import { Provider } from "react-redux";
import { store } from "../../store";
import { useAuthentication, UseAuthenticationResult } from "./useAuthentication";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { waitFor } from "@testing-library/react";
import { authTokenLocalStorageKey } from "../../constants";

const generateAuthToken = (username: string) => `${username}_authtoken`;

interface TestUser {
  username: string,
  password: string
}

const user1: TestUser = {
  username: "myUserName",
  password: "myPassWord"
};

const user2: TestUser = {
  username: "mySecondUserName",
  password: "mySecondPassWord"
};

let existingUsers: TestUser[] = [];

describe("useAuthentication", () => {

  const server = setupServer(
    rest.post<{ username: string, password: string }>("/auth/register", (req, res, ctx) => {
      const { username, password } = req.body;

      if (existingUsers.find(u => u.username === username)) {
        return res(
          ctx.status(409),
          ctx.text("User already exists")
        );
      }

      const user = {
        username,
        password,
        auth_token: generateAuthToken(username)
      };
      existingUsers.push(user);
      return res(ctx.json(user));
    }),
    rest.post<{ username: string, password: string }>("/auth/login", (req, res, ctx) => {
      const { username, password } = req.body;

      const user = {
        username,
        password,
        auth_token: generateAuthToken(username)
      };
      existingUsers.push(user);
      return res(ctx.json(user));
    })
  );
  beforeAll(() => server.listen());
  afterEach(() => {
    localStorage.clear();
    existingUsers = [];
    return server.resetHandlers();
  });
  afterAll(() => server.close());

  let hook: UseAuthenticationResult;

  beforeEach(() => {
    hook = renderHook(() => useAuthentication(), {
      wrapper: ({ children }) => <Provider store={store}>
        {children}
      </Provider>
    }).result.current;
  });

  it("has no token by default", () => {
    expect(hook.token).toBeFalsy();
  });

  it("is logged out by default", () => {
    expect(hook.isLoggedIn).toBeFalsy();
  });

  it("returns correct token, and sets it to local storage when registering", async () => {
    const registerResult = await waitFor(() => hook.register(user1.username, user1.password));
    expect(registerResult).toEqual(generateAuthToken(user1.username));
    expect(localStorage.__STORE__[authTokenLocalStorageKey]).toEqual(generateAuthToken(user1.username));
  });

  it("returns rejected promise, when registering a user with the same username", async () => {
    await hook.register(user1.username, user1.password);
    await expect(hook.register(user1.username, user1.password)).rejects.toBeTruthy();
  });

  it("sets token token after logging in with correct credentials", async () => {
    await hook.register(user1.username, user1.password);
    await hook.register(user2.username, user2.password);

    localStorage.clear();

    await expect(hook.login(user1.username, user1.password)).resolves.toEqual(generateAuthToken(user1.username));
  });

  test.todo("removes the auth token from local storage after logging out");
  test.todo("returns a rejected promise, when loggin in with invalid credentials");
  test.todo("saves the new token to local storage after calling regenerateToken");
  test.todo("returns the new token in hook.token after calling regenerateToken");
});