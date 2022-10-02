import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();
  const { connected } = useWallet();

  return (
    <aside className="fixed flex w-20 flex-col items-center space-y-2 py-4 md:w-64 md:items-stretch md:space-y-4 md:py-8 md:pl-4 md:pr-8">
      <Link href="/">
        <a className="inline-block round-full p-3 hover:bg-gray-100 md:self-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-primary-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        </a>
      </Link>
      <div className="flex flex-col items-center space-y-2 md:items-stretch">
        <Link href="/">
          <a
            className={
              (router.pathname === "/" ? "font-bold " : "") +
              "inline-flex items-center space-x-4 rounded-full p-3 hover:bg-gray-100 md:w-full"
            }
          >
            {router.pathname === "/" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            )}
            <div className="hidden text-xl md:block">Home</div>
          </a>
        </Link>
        <Link href="/tags">
          <a
            className={
              (router.pathname == "/tags" ? "font-bold " : "") +
              "inline-flex items-center space-x-4 rounded-full p-3 hover:bg-gray-100 md:w-full"
            }
          >
            {router.pathname == "/tags" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            )}
            <div className="hidden text-xl md:block">Tags</div>
          </a>
        </Link>
        <Link href="/users">
          <a
            className={
              (router.pathname == "/users" ? "font-bold " : "") +
              "inline-flex items-center space-x-4 rounded-full p-3 hover:bg-gray-100 md:w-full"
            }
          >
            {router.pathname == "/users" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            )}
            <div className="hidden text-xl md:block">Users</div>
          </a>
        </Link>
        {connected && (
          <Link href="/profile">
            <a
              className={
                (router.pathname == "/profile" ? "font-bold " : "") +
                "inline-flex items-center space-x-4 rounded-full p-3 hover:bg-gray-100 md:w-full"
              }
            >
              {router.pathname == "/profile" ? (
                <svg
                  v-if="isActive"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-700"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
              <div className="hidden text-xl md:block">Profile</div>
            </a>
          </Link>
        )}
      </div>
      <div className="fixed bottom-8 right-8 w-48 md:static md:w-full">
        <WalletMultiButton />
      </div>
    </aside>
  );
}
