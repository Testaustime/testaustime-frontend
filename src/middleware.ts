import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./i18nConfig";
import { NextMiddleware } from "next/server";

export const middleware: NextMiddleware = (request) => {
  const response = i18nRouter(request, i18nConfig);

  response.headers.set(
    "client-ip",
    request.headers.get("x-forwarded-for") ?? request.ip ?? "Unknown IP",
  );

  return response;
};

export const config = {
  matcher:
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|images|fonts).*)",
};
