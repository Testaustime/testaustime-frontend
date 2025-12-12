"use client";

import { Button } from "@mantine/core";
import { DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { demoteUser } from "./actions";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";
import { PostRequestError } from "../../../../types";
import { logOutAndRedirect } from "../../../../utils/authUtils";

type DemoteUserButtonProps = {
  name: string;
  username: string;
};

export const DemoteUserButton = ({ name, username }: DemoteUserButtonProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Button
      size="xs"
      variant="subtle"
      leftSection={<DoubleArrowDownIcon />}
      color="red"
      onClick={() => {
        demoteUser(username, name)
          .then(async (data) => {
            if ("error" in data) {
              switch (data.error) {
                case PostRequestError.Unauthorized:
                  showNotification({
                    title: t("error"),
                    color: "red",
                    message: t("errors.unauthorized"),
                  });
                  await logOutAndRedirect();
                  break;
                case PostRequestError.RateLimited:
                  router.push("/rate-limited");
                  break;
                case PostRequestError.UnknownError:
                  showNotification({
                    title: t("error"),
                    color: "red",
                    message: t("unknownErrorOccurred"),
                  });
                  break;
              }
            } else {
              router.refresh();
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }}
    >
      {t("leaderboards.demote")}
    </Button>
  );
};
