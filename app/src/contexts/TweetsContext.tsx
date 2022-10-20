import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import useTheme from "../hooks/useTheme";
import useWorkspace from "../hooks/useWorkspace";
import { Tweet } from "../models";
import {
  deleteTweet,
  getTweet,
  paginateTweets,
  sendTweet,
  updateTweet,
} from "../pages/api/tweets";
import { notifyLoading, notifyUpdate } from "../utils";

interface TweetsContextConfig {
  tweets: Tweet[];
  recentTweets: Tweet[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  sendTweet: (tag: string, content: string) => Promise<boolean>;
  updateTweet: (tweet: Tweet, tag: string, content: string) => Promise<boolean>;
  deleteTweet: (tweet: Tweet) => Promise<boolean>;
  getTweet: (pubkey: PublicKey) => Promise<Tweet | null>;
}

const TweetsContext = createContext<TweetsContextConfig>(null!);

export function TweetsProvider({ children }: { children: ReactNode }) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [recentTweets, setRecentTweets] = useState<Tweet[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const { theme } = useTheme();
  const workspace = useWorkspace();
  const { connected } = useWallet();

  const onNewPage = (newTweets: Tweet[], more: boolean, page: number) => {
    setTweets((prev) => [...prev, ...newTweets]);
    setLoading(false);
    setHasMore(more);
  };

  useEffect(() => {
    setRecentTweets(tweets.slice(0, 5));
  }, [tweets]);

  useEffect(() => {
    if (workspace) {
      setTweets([]);
      const newPagination = paginateTweets(workspace, [], 10, onNewPage);
      setPagination(newPagination);
    } else {
      setPagination(null);
      setTweets([]);
      setInitialLoading(false);
      setLoading(false);
    }
  }, [workspace, connected]);

  useEffect(() => {
    if (pagination && !initialLoading) {
      setLoading(true);
      pagination.prefetch().then(pagination.getNextPage);
      setInitialLoading(true);
    }
  }, [initialLoading, pagination]);

  const sendTweetAndRefresh = useCallback(
    async (tag: string, content: string) => {
      if (workspace) {
        const toastId = notifyLoading(
          "Transaction in progress. Please wait...",
          theme
        );
        const result = await sendTweet(workspace, tag, content);
        notifyUpdate(
          toastId,
          result.message,
          result.tweet ? "success" : "error"
        );
        if (result.tweet) {
          setTweets([result.tweet, ...tweets]);
          return true;
        }
      }

      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tweets, workspace]
  );

  const updateTweetAndRefresh = useCallback(
    async (tweet: Tweet, tag: string, content: string) => {
      if (workspace) {
        const toastId = notifyLoading(
          "Transaction in progress. Please wait...",
          theme
        );
        const result = await updateTweet(workspace, tweet, tag, content);
        notifyUpdate(
          toastId,
          result.message,
          result.success ? "success" : "error"
        );

        return result.success;
      }
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspace]
  );

  const deleteTweetAndRefresh = useCallback(
    async (tweet: Tweet) => {
      if (workspace) {
        const toastId = notifyLoading(
          "Transaction in progress. Please wait...",
          theme
        );
        const result = await deleteTweet(workspace, tweet);
        notifyUpdate(
          toastId,
          result.message,
          result.success ? "success" : "error"
        );

        if (result.success) {
          setTweets(
            tweets.filter(
              (t) => t.publickey.toBase58() !== tweet.publickey.toBase58()
            )
          );
        }

        return result.success;
      }
      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tweets, workspace]
  );

  const getTweetFromPublicKey = useCallback(
    async (publickey: PublicKey) => {
      if (workspace) {
        const tweet = await getTweet(workspace, publickey);
        return tweet;
      }
      return null;
    },
    [workspace]
  );

  const loadMore = useCallback(() => {
    if (pagination) {
      setLoading(true);
      pagination.getNextPage();
    }
  }, [pagination]);

  const value = useMemo(
    () => ({
      tweets,
      recentTweets,
      loading,
      hasMore,
      loadMore: loadMore,
      sendTweet: sendTweetAndRefresh,
      updateTweet: updateTweetAndRefresh,
      deleteTweet: deleteTweetAndRefresh,
      getTweet: getTweetFromPublicKey,
    }),
    [
      tweets,
      recentTweets,
      loading,
      hasMore,
      loadMore,
      sendTweetAndRefresh,
      updateTweetAndRefresh,
      deleteTweetAndRefresh,
      getTweetFromPublicKey,
    ]
  );

  return (
    <TweetsContext.Provider value={value}>{children}</TweetsContext.Provider>
  );
}

export default TweetsContext;
