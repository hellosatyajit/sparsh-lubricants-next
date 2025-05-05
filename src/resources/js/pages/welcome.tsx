'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { type BreadcrumbItem } from '../types';

export default function Welcome() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Welcome</title>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>
      <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
        <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
          <nav className="flex items-center justify-end gap-4">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </header>
        <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
          <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
            <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
              <h1 className="mb-1 font-medium">Let's get started</h1>
              <p className="mb-2 text-[#706f6c] dark:text-[#A1A09A]">
                Next.js has an incredibly rich ecosystem.
                <br />
                We suggest starting with the following.
              </p>
              <ul className="mb-4 flex flex-col lg:mb-6">
                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                  <span className="relative bg-white py-1 dark:bg-[#161615]">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                    </span>
                  </span>
                  <span>
                    Read the
                    <a
                      href="https://nextjs.org/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                    >
                      <span>Documentation</span>
                      <svg
                        width={10}
                        height={11}
                        viewBox="0 0 10 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2.5 w-2.5"
                      >
                        <path
                          d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                          stroke="currentColor"
                          strokeLinecap="square"
                        />
                      </svg>
                    </a>
                  </span>
                </li>
                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                  <span className="relative bg-white py-1 dark:bg-[#161615]">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                    </span>
                  </span>
                  <span>
                    Learn with
                    <a
                      href="https://nextjs.org/learn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                    >
                      <span>Next.js Learn</span>
                      <svg
                        width={10}
                        height={11}
                        viewBox="0 0 10 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-2.5 w-2.5"
                      >
                        <path
                          d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                          stroke="currentColor"
                          strokeLinecap="square"
                        />
                      </svg>
                    </a>
                  </span>
                </li>
              </ul>
              <ul className="flex gap-3 text-sm leading-normal">
                <li>
                  <a
                    href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                  >
                    Deploy now
                  </a>
                </li>
              </ul>
            </div>
            <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-[#fff2f2] lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:bg-[#1D0002]">
              <svg
                className="w-full max-w-none translate-y-0 text-[#F53003] opacity-100 transition-all duration-750 dark:text-[#F61500] starting:translate-y-6 starting:opacity-0"
                viewBox="0 0 438 104"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Keep the same SVG paths as in your original */}
                <path d="M17.2036 -3H0V102.197H49.5189V86.7187H17.2036V-3Z" fill="currentColor" />
                {/* ... other SVG paths ... */}
              </svg>
              <svg
                className="relative -mt-[4.9rem] -ml-8 w-[448px] max-w-none lg:-mt-[6.6rem] lg:ml-0 dark:hidden"
                viewBox="0 0 440 376"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Keep the same SVG paths as in your original */}
              </svg>
              <svg
                className="relative -mt-[4.9rem] -ml-8 hidden w-[448px] max-w-none lg:-mt-[6.6rem] lg:ml-0 dark:block"
                viewBox="0 0 440 376"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Keep the same SVG paths as in your original */}
              </svg>
              <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" />
            </div>
          </main>
        </div>
        <div className="hidden h-14.5 lg:block"></div>
      </div>
    </>
  );
}