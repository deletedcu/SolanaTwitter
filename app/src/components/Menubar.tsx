import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import WalletItem from "./WalletItem";
import UserEditModal from "./UserEditModal";
import { getUserAlias } from "../pages/api/alias";
import { getWorkspace } from "../utils";
import { useRouter } from "next/router";
import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Menubar() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [alias, setAlias] = useState("");

  const workspace = getWorkspace();
  const { disconnect, connected } = useWallet();

  useEffect(() => {
    if (workspace && !showEditModal) {
      getUserAlias(workspace.wallet.publicKey).then((value) => setAlias(value));
    }
  }, [workspace, showEditModal]);

  return (
    <div className="fixed top-0 w-full z-40">
      <div className="ml-72">
        <div className="duration-400 sticky top-0 z-20 ml-px">
          <div className="sticky top-0 z-40 transition-colors bg-fill-opacity backdrop-blur">
            <div className="h-16 flex items-center justify-between border-b border-skin-primary px-2 transition-all">
              <div className="relative flex w-full items-center"></div>
              <div className="flex items-center gap-5">
                <ThemeSwitcher />
                {workspace && connected && (
                  <>
                    <WalletItem
                      publicKey={workspace.wallet.publicKey}
                      alias={alias}
                      showModal={() => setShowEditModal(true)}
                      disconnect={disconnect}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="relative z-10">
            <div className="fixed">
              <Path />
            </div>
          </div>
        </div>
      </div>
      {workspace && (
        <UserEditModal
          visible={showEditModal}
          setVisible={setShowEditModal}
          publicKey={workspace.wallet.publicKey}
          alias={alias}
        />
      )}
    </div>
  );
}

function Path() {
  const [pathName, setPathName] = useState("");
  const router = useRouter();

  useEffect(() => {
    setPathName(router.pathname);
  }, [router.pathname]);

  type PathType = {
    path: string;
    name: string;
  };

  const generatePaths = () => {
    let data: PathType[] = [];
    switch (pathName) {
      case "/":
        data.push({ path: "", name: "Tweets" });
        break;
      case "/404":
        data.push({ path: "", name: "NotFound" });
        break;
      case "/tweets":
        data.push({ path: "", name: "Tweets" });
        break;
      case "/tags":
        data.push({ path: "", name: "Tags" });
        break;
      case "/users":
        data.push({ path: "", name: "Users" });
        break;
      case "/profile":
        data.push({ path: "", name: "Profile" });
        break;
      case "/tags/[tag]":
        data.push({ path: "/tags", name: "Tags" });
        data.push({ path: "", name: router.query.tag as string });
        break;
      case "/users/[user]":
        data.push({ path: "/users", name: "Users" });
        data.push({ path: "", name: router.query.user as string });
        break;
      case "/tweets/[tweet]":
        data.push({ path: "/tweets", name: "Tweets" });
        data.push({ path: "", name: router.query.tweet as string });
        break;
    }

    return generatePath(data);
  };

  const generatePath = (data: PathType[]) => {
    return (
      <ul className="relative z-40 flex items-center py-0.5 px-6 text-color-secondary">
        <li>
          <Link href="/">
            <a className="flex items-center hover:underline">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 iconify iconify--heroicons-outline"
                width="1em"
                height="1em"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m3 12l2-2m0 0l7-7l7 7M5 10v10a1 1 0 0 0 1 1h3m10-11l2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6"
                ></path>
              </svg>
              <span className="ml-px">Home</span>
            </a>
          </Link>
        </li>
        {data.map((item, i) => (
          <li key={i} className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 relative mx-1 iconify iconify--heroicons-outline"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m9 5l7 7l-7 7"
              ></path>
            </svg>
            {item.path ? (
              <span className="ml-px">
                <Link href={item.path}>
                  <a className="hover:underline">{item.name}</a>
                </Link>
              </span>
            ) : (
              <span className="ml-px">{item.name}</span>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="fixed">
      <div className="text-sm relative z-20 bg-gradient-to-r from-gray-800/20 to-transparent pb-px backdrop-blur transition-all">
        <div className="glass absolute z-10 -ml-[0.5px] h-full w-full opacity-5"></div>
        {generatePaths()}
      </div>
    </div>
  );
}
