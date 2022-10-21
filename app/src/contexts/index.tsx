import { ReactNode } from "react";
import { AutoConnectProvider } from "./AutoConnectContext";
import { CommentsProvider } from "./CommentsContext";
import { SolanaProvider } from "./SolanaContext";
import { TagsProvider } from "./TagsContext";
import { ThemeProvider } from "./ThemeContext";
import { TweetsProvider } from "./TweetsContext";
import { UsersProvider } from "./UsersContext";

export default function AppContext({ children }: { children: ReactNode }) {
  return (
    <AutoConnectProvider>
      <SolanaProvider>
        <ThemeProvider>
          <TweetsProvider>
            <UsersProvider>
              <TagsProvider>
                <CommentsProvider>{children}</CommentsProvider>
              </TagsProvider>
            </UsersProvider>
          </TweetsProvider>
        </ThemeProvider>
      </SolanaProvider>
    </AutoConnectProvider>
  );
}
