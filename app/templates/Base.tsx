import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { toCapitalize, toCollapse, useWorkspace } from "../utils";
import { useWallet } from "@solana/wallet-adapter-react";
import TopMenu from "../components/TopMenu";
import UserEditModal from "../components/UserEditModal";

interface Props {
  children?: ReactNode;
}

export default function Base({ children }: Props) {
  const router = useRouter();
  const [routeName, setRouteName] = useState<string>();
  const [showEditModal, setShowEditModal] = useState(false);

  const workspace = useWorkspace();
  const { disconnect, connected } = useWallet();

  useEffect(() => {
    if (router.pathname === "/") setRouteName("Home");
    else if (router.pathname === "/404") setRouteName("NotFound");
    else setRouteName(toCapitalize(router.pathname.split("/")[1]));
  }, [router.pathname]);

  return (
    <div className="mx-auto w-full max-w-4xl lg:max-w-5xl">
      <Sidebar />
      <main className="ml-20 min-h-screen flex-1 border-r border-l md:ml-64">
        <header className="flex items-center justify-between space-x-6 border-b px-8 py-4">
          <div className="text-xl font-bold">{routeName}</div>
          {workspace && connected && (
            <div className="ml-auto">
              <TopMenu
                publicKey={workspace.wallet.publicKey}
                showModal={() => setShowEditModal(true)}
                disconnect={disconnect}
              />
              <UserEditModal
                visible={showEditModal}
                setVisible={setShowEditModal}
                publicKey={workspace.wallet.publicKey.toBase58()}
                placeholder={toCollapse(workspace.wallet.publicKey)}
              />
            </div>
          )}
        </header>
        {children}
      </main>
    </div>
  );
}
