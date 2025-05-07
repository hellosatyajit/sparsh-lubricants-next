import '@/pages/globals.css'
import { NextPage } from 'next'
import { ReactElement } from 'react'
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement
}


import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};