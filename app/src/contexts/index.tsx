import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { ThemeProvider } from "./ThemeContext";
import { TweetsProvider } from "./TweetsContext";

const SolanaProvider = dynamic(
  () => import("./SolanaContext").then(({ SolanaProvider }) => SolanaProvider),
  { ssr: false }
);

export default function AppContext({ children }: { children: ReactNode }) {
  return (
    <SolanaProvider>
      <ThemeProvider>
        <TweetsProvider>
          {children}
        </TweetsProvider>
      </ThemeProvider>
    </SolanaProvider>
  )
}
