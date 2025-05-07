import Head from "next/head";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Welcome() {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/auth/login";
    }
  }, [session]);
  return (
    <>
      <Head>
        <title>Welcome</title>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
          rel="stylesheet"
        />
      </Head>
    </>
  );
}
