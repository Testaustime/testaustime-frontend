import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import useAuthentication from "./UseAuthentication";
import { User } from "./UseAuthentication/useAuthentication";

export const useAccount = () => {
  const { token } = useAuthentication();
  const queryClient = useQueryClient();

  const { mutateAsync: changeAccountVisibility } =
    useMutation("changeUserVisibility", (visibility: boolean) => axios.post("/account/settings", {
      public_profile: visibility
    }, {
      headers: {
        Authorization: `Bearer ${token ?? ""}`
      }
    }), {
      onSuccess: (_, newVisibility) => {
        queryClient.setQueryData("fetchUser", (old: User | undefined) => {
          if (!old) throw new Error("User not found");
          return {
            ...old,
            isPublic: newVisibility
          };
        });
      }
    });

  return {
    changeAccountVisibility: (visibility: boolean) => changeAccountVisibility(visibility)
  };
};