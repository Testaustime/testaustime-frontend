import { ActionIcon, CloseIcon } from "@mantine/core";
import styles from "./styles.module.css";
import { cookies } from "next/headers";
import { wrapped2025CookieName } from "../../utils/constants";

export const WrappedBanner = ({ text }: { text: string }) => {
  // eslint-disable-next-line @typescript-eslint/require-await
  async function closeBanner() {
    "use server";
    cookies().set(wrapped2025CookieName, "true", {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      sameSite: "strict",
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <p className={styles.text}>{text}</p>
        <a href="https://wrapped.testaustime.fi/" className={styles.link}>
          https://wrapped.testaustime.fi/
        </a>
      </div>
      <div className={styles.right}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form action={closeBanner}>
          <ActionIcon variant="transparent" type="submit">
            <CloseIcon />
          </ActionIcon>
        </form>
      </div>
    </div>
  );
};
