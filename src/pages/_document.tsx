import { DocumentProps, Head, Html, Main, NextScript } from "next/document";
import axios from "axios";
import { createGetInitialProps } from "@mantine/next";

// axios.defaults.baseURL = import.meta.env.VITE_API_URL;

export default function Document(props: DocumentProps) {
  const currentLocale = props.__NEXT_DATA__.locale ?? "en";

  return <Html lang={currentLocale}>
    <Head>
      <meta charSet="utf-8" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>;
}

export const getInitialProps = createGetInitialProps();
