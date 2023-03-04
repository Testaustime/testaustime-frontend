import { DocumentProps, Head, Html, Main, NextScript } from "next/document";

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
