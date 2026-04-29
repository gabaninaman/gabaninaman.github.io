import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Default meta tags - will be overridden by page-specific Head components */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
