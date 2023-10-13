import axios from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthentication } from "./useAuthentication";
import { useRouter } from "next/router";

export const useAccount = (username: string) => {
  const { logOut } = useAuthentication();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync: changeAccountVisibility } = useMutation(
    ["changeUserVisibility"],
    (visibility: boolean) =>
      axios.post("/account/settings", {
        public_profile: visibility,
      }),
    {
      onSuccess: (_, newVisibility) => {
        queryClient.setQueryData(["fetchUser"], {
          isPublic: newVisibility,
        });
      },
    },
  );

  const { mutateAsync: deleteAccount } = useMutation(
    ["deleteAccount"],
    (password: string) =>
      axios.delete("/users/@me/delete", {
        data: {
          username,
          password,
        },
      }),
    {
      onSuccess: async () => {
        await logOut();
        router.push("/").catch(console.error);
      },
    },
  );

  return {
    changeAccountVisibility: (visibility: boolean) =>
      changeAccountVisibility(visibility),
    deleteAccount: (password: string) => deleteAccount(password),
  };
};
