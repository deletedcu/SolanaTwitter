import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ReactNode, useEffect } from "react";
import Menubar from "../components/Menubar";
import Sidebar from "../components/Sidebar";
import { useTheme } from "../contexts/themeProvider";
import { initWorkspace, resetWorkspace } from "../utils";

interface Props {
  children?: ReactNode;
}

export default function Base({ children }: Props) {
  const { theme } = useTheme();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected } = useWallet();

  useEffect(() => {
    if (wallet && connected) {
      initWorkspace(wallet, connection);
    } else {
      resetWorkspace();
    }
  }, [wallet, connected, connection]);

  return (
    <div className={theme === "dark" ? "theme-dark" : ""}>
      <Menubar />
      <div className="relative flex overflow-x-hidden bg-fill-primary">
        <Sidebar />
        <main className="relative ml-72 flex min-h-screen grow flex-col">
          <div className="mt-16 mb-12 flex flex-grow">
            <div className="mx-auto mt-14 flex max-w-screen-xl flex-grow justify-center px-8 2xl:px-16">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
