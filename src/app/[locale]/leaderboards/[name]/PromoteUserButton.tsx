"use client";

import { Button } from "@mantine/core";
import { DoubleArrowUpIcon } from "@radix-ui/react-icons";
import { useTranslation } from "react-i18next";
import { promoteUser } from "./actions";
import { PostRequestError } from "../../../../types";
import { showNotification } from "@mantine/notifications";
import { logOutAndRedirect } from "../../../../utils/authUtils";
import { useRouter } from "next/navigation";

type PromoteUserButtonProps = {
  name: string;
  username: string;
};

export const PromoteUserButton = ({
  name,
  username,
}: PromoteUserButtonProps) => {
  const router = useRouter();

  const { t } = useTranslation();

  return (
    <Button
      size="xs"
      variant="subtle"
      leftSection={<DoubleArrowUpIcon />}
      color="green"
      onClick={() => {
        promoteUser(username, name)
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
      {t("leaderboards.promote")}
    </Button>
  );
};
