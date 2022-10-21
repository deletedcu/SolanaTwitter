import { useLocalStorage } from "@solana/wallet-adapter-react";
import { createContext, ReactNode } from "react";

interface AutoConnectContextState {
  autoConnect: boolean;
  setAutoConnect(autoConnect: boolean): void;
}

const AutoConnectContext = createContext<AutoConnectContextState>(null!);

export function AutoConnectProvider({ children }: { children: ReactNode }) {
  const [autoConnect, setAutoConnect] = useLocalStorage("autoConnect", true);

  return (
    <AutoConnectContext.Provider value={{ autoConnect, setAutoConnect }}>
      {children}
    </AutoConnectContext.Provider>
  );
}

export default AutoConnectContext;
