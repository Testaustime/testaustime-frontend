import { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuthentication } from "../hooks/useAuthentication";

export const PrivateRoute = ({ children, redirect }: {
  children?: ReactNode,
  redirect?: string
}) => {
  const { isLoggedOut } = useAuthentication();
  if (isLoggedOut) {
    const fullUrl = "/login" + (redirect ? "?redirect=" + redirect : "");
    return <Navigate to={fullUrl} replace />;
  }

  return <>{children}</>;
};
