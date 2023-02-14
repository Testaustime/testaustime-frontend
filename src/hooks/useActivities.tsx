import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { useAuthentication } from "./useAuthentication";
import { ActivityDataEntry } from "./useActivityData";

export const useActivity = (activityName: string) => {
  const { token } = useAuthentication();
  const queryClient = useQueryClient();

  const { mutateAsync: renameProject } = useMutation("renameProject",
    (newName: string) => axios.post("/activity/rename", {
      from: activityName,
      to: newName
    }, {
      headers: {
        Authorization: `Bearer ${token ?? ""}`
      }
    }),
    {
      onSuccess: (_, newName) => {
        queryClient.setQueryData(["activityData", "@me"],
          (oldData: ActivityDataEntry[] | undefined) => {
            const newData = oldData ? oldData.map(d => ({
              ...d,
              project_name: d.project_name === activityName ? newName : d.project_name
            })) : [];
            return newData;
          });
      }
    });

  return {
    renameProject
  };
};