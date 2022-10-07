import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();
  const { connected } = useWallet();

  return (
    <aside className="fixed h-full w-72">
      <div className="h-full overflow-y-auto border-r border-gray-300/50">
        <div className="relative mb-8">
          <div className="relative overflow-hidden">
            <div className="glass absolute left-[2.5%] z-0 h-72 w-full scale-x-105 opacity-30"></div>
            <div className="flex h-72 items-center justify-center">
              <div className="mb-6 select-none text-center text-gray-800">
                <div className="mx-auto mb-4 text-4xl">
                  <Link href="/">
                    <a className="inline-block round-full p-3 hover:bg-gray-100 md:self-start rounded-full">
                      <Image
                        src="/chat.png"
                        width={50}
                        height={50}
                        alt="logo"
                      />
                    </a>
                  </Link>
                </div>
                <h1 className="mb-0 text-2xl font-semibold">Solana Twitter</h1>
                <p className="text-xs italic">Solana communication platform</p>
                <p className="text-xs italic">Created using Anchor, Solana, and Next.js</p>
              </div>
            </div>
          </div>
          <div className="relative z-10 mx-auto -mt-[25px] w-48">
            <WalletMultiButton />
          </div>
        </div>
        <div className="mx-12 flex flex-col items-center space-y-2 md:items-stretch">
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
                  className="h-6 w-6 text-gray-700"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
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
                  className="h-6 w-6 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.585 9.468c.66 0 1.2-.538 1.2-1.2 0-.662-.54-1.2-1.2-1.2h-3.22l.31-3.547c.027-.318-.07-.63-.277-.875-.206-.245-.495-.396-.822-.425-.65-.035-1.235.432-1.293 1.093l-.326 3.754H9.9l.308-3.545c.06-.658-.43-1.242-1.097-1.302-.665-.05-1.235.43-1.293 1.092l-.325 3.754h-3.33c-.663 0-1.2.538-1.2 1.2 0 .662.538 1.2 1.2 1.2h3.122l-.44 5.064H3.416c-.662 0-1.2.54-1.2 1.2s.538 1.202 1.2 1.202h3.22l-.31 3.548c-.057.657.432 1.24 1.09 1.3l.106.005c.626 0 1.14-.472 1.195-1.098l.327-3.753H14.1l-.308 3.544c-.06.658.43 1.242 1.09 1.302l.106.005c.617 0 1.142-.482 1.195-1.098l.325-3.753h3.33c.66 0 1.2-.54 1.2-1.2s-.54-1.202-1.2-1.202h-3.122l.44-5.064h3.43zm-5.838 0l-.44 5.063H9.253l.44-5.062h5.055z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 7.337h-3.93l.372-4.272c.036-.412-.27-.775-.682-.812-.417-.03-.776.27-.812.683l-.383 4.4h-6.32l.37-4.27c.037-.413-.27-.776-.68-.813-.42-.03-.777.27-.813.683l-.382 4.4H3.782c-.414 0-.75.337-.75.75s.336.75.75.75H7.61l-.55 6.327H3c-.414 0-.75.336-.75.75s.336.75.75.75h3.93l-.372 4.272c-.036.412.27.775.682.812l.066.003c.385 0 .712-.295.746-.686l.383-4.4h6.32l-.37 4.27c-.036.413.27.776.682.813l.066.003c.385 0 .712-.295.746-.686l.382-4.4h3.957c.413 0 .75-.337.75-.75s-.337-.75-.75-.75H16.39l.55-6.327H21c.414 0 .75-.336.75-.75s-.336-.75-.75-.75zm-6.115 7.826h-6.32l.55-6.326h6.32l-.55 6.326z" />
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
                  className="h-6 w-6 text-gray-700"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
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
                    className="h-6 w-6 text-gray-700"
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
                    className="h-6 w-6 text-gray-700"
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
      </div>
    </aside>
  );
}
