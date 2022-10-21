import dynamic from "next/dynamic";
import { ReactNode } from "react";
import { TagsProvider } from "./TagsContext";
import { ThemeProvider } from "./ThemeContext";
import { TweetsProvider } from "./TweetsContext";
import { UsersProvider } from "./UsersContext";

const SolanaProvider = dynamic(
  () => import("./SolanaContext").then(({ SolanaProvider }) => SolanaProvider),
  { ssr: false }
);

export default function AppContext({ children }: { children: ReactNode }) {
  return (
    <SolanaProvider>
      <ThemeProvider>
        <TweetsProvider>
          <UsersProvider>
            <TagsProvider>{children}</TagsProvider>
          </UsersProvider>
        </TweetsProvider>
      </ThemeProvider>
    </SolanaProvider>
  );
}
