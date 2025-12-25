"use server";

import { postRequestWithoutResponse } from "../../api/baseApi";

export const renameProject = (oldProjectName: string, newProjectName: string) =>
  postRequestWithoutResponse("/activity/rename", {
    from: oldProjectName,
    to: newProjectName,
  });
