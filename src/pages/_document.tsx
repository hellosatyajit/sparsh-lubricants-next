import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <body className="min-h-screen bg-accent dark:bg-background font-sans antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
