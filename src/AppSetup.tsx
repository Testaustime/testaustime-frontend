import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { store } from "./store";

const queryClient = new QueryClient();

export const AppSetup = ({ children }: { children?: React.ReactNode }) => {
  return <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Notifications />
      <ModalsProvider>
        {children}
      </ModalsProvider>
    </QueryClientProvider>
  </Provider>;
};
