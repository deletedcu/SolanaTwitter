import { useContext } from "react";
import AutoConnectContext from "../contexts/AutoConnectContext";

export default function useAutoConnect() {
  const context = useContext(AutoConnectContext);
  if (typeof context === "undefined") {
    throw new Error("useAutoConnect must be used within a AutoConnectProvider");
  }

  return context;
}
