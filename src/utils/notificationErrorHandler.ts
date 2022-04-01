import { showNotification } from "@mantine/notifications";

export const handleErrorWithNotification = (error: unknown) => {
  showNotification({
    title: "Error",
    color: "red",
    message: String(error || "An unknown error occurred")
  });
};