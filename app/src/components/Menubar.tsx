import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import WalletItem from "./WalletItem";
import UserEditModal from "./UserEditModal";
import { getUserAlias } from "../pages/api/alias";
import { useWorkspace } from "../utils";

export default function Menubar() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [alias, setAlias] = useState("");

  const workspace = useWorkspace();
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
          <div className="sticky top-0 z-40 transition-colors">
            <div className="h-16 flex items-center justify-between border-b border-gray-300/50 px-6 transition-all">
              <div className="relative flex w-full items-center"></div>
              <div className="flex items-center gap-5">
                {workspace && connected && (
                  <>
                    <WalletItem
                      publicKey={workspace.wallet.publicKey}
                      alias={alias}
                      showModal={() => setShowEditModal(true)}
                      disconnect={disconnect}
                    />
                    <UserEditModal
                      visible={showEditModal}
                      setVisible={setShowEditModal}
                      publicKey={workspace.wallet.publicKey}
                      alias={alias}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="relative z-10">

          </div>
        </div>
      </div>
    </div>
  );
}
