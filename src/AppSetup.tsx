import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export const AppSetup = ({ children }: { children?: React.ReactNode }) => {
  return <QueryClientProvider client={queryClient}>
    <Notifications />
    <ModalsProvider>
      {children}
    </ModalsProvider>
  </QueryClientProvider>;
};
