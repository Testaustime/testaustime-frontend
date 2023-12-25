import { Button, HoverCard, TableTd, TableTr } from "@mantine/core";
import styles from "./FriendListRow.module.css";
import { CurrentActivity } from "../CurrentActivity/CurrentActivity";
import { BlinkingDot } from "../CurrentActivity/BlinkingDot";
import { CurrentActivityDisplay } from "../CurrentActivity/CurrentActivityDisplay";
import { prettyDuration } from "../../utils/dateUtils";
import Link from "next/link";
import { removeFriend } from "./actions";
import { RemoveFriendError } from "../../types";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { showNotification } from "@mantine/notifications";
import { logOutAndRedirect } from "../../utils/authUtils";
import { useState } from "react";

type FriendListRowProps = {
  isMe: boolean;
  index: number;
  username: string;
  status: CurrentActivity | null;
  codingTime: number;
  locale: string;
};

export const FriendListRow = ({
  isMe,
  index,
  username,
  status,
  codingTime,
  locale,
}: FriendListRowProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <TableTr className={isMe ? styles.tableRow : undefined}>
      <TableTd>{index + 1}</TableTd>
      <TableTd>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {username}
          {status && (
            <HoverCard>
              <HoverCard.Target>
                <BlinkingDot />
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <CurrentActivityDisplay currentActivity={status} />
              </HoverCard.Dropdown>
            </HoverCard>
          )}
        </div>
      </TableTd>
      <TableTd>{prettyDuration(codingTime)}</TableTd>
      <TableTd style={{ textAlign: "right", padding: "7px 0px" }}>
        {!isMe && (
          <Link href={`/${locale}/users/${username}`} prefetch={false}>
            {t("friends.showDashboard")}
          </Link>
        )}
      </TableTd>
      <TableTd style={{ textAlign: "right", padding: "7px 0px" }}>
        {!isMe && (
          <Button
            variant="outline"
            color="red"
            size="compact-md"
            loading={isDeleting}
            onClick={() => {
              setIsDeleting(true);
              removeFriend(username)
                .then(async (result) => {
                  if (result && "error" in result) {
                    switch (result.error) {
                      case RemoveFriendError.RateLimited:
                        router.push("/rate-limited");
                        break;
                      case RemoveFriendError.Unauthorized:
                        showNotification({
                          title: t("error"),
                          color: "red",
                          message: t("errors.unauthorized"),
                        });
                        await logOutAndRedirect();
                        break;
                      case RemoveFriendError.UnknownError:
                        showNotification({
                          title: t("error"),
                          color: "red",
                          message: t("friends.errorRemovingFriend"),
                        });
                        break;
                    }
                  } else {
                    router.refresh();
                  }
                })
                .catch(() => {
                  showNotification({
                    title: t("error"),
                    color: "red",
                    message: t("friends.errorRemovingFriend"),
                  });
                })
                .finally(() => {
                  setIsDeleting(false);
                });
            }}
          >
            {t("friends.unfriend")}
          </Button>
        )}
      </TableTd>
    </TableTr>
  );
};
