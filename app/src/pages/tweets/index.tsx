import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import TweetForm from "../../components/TweetForm";
import TweetList from "../../components/TweetList";
import { Tweet } from "../../models";
import Base from "../../templates/Base";
import { getWorkspace, initWorkspace } from "../../utils";
import { paginateTweets } from "../api/tweets";

export default function Tweets() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(false);
  
  let workspace = getWorkspace();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected } = useWallet();

  const onNewPage = (newTweets: Tweet[], more: boolean) => {
    setTweets((prev) => [...prev, ...newTweets]);
    setHasMore(more);
  };

  useEffect(() => {
    if (wallet && connected) {
      if (!workspace) {
        initWorkspace(wallet, connection);
      }
      setTweets([]);
      const newPagination = paginateTweets([], 10, onNewPage);
      setPagination(newPagination);
    } else {
      setPagination(null);
      setTweets([]);
      setInitialLoading(false);
    }
  }, [wallet, connected, workspace, connection]);

  useEffect(() => {
    if (pagination && !initialLoading) {
      pagination.prefetch().then(pagination.getNextPage);
      setInitialLoading(true);
    }
  }, [initialLoading, pagination]);

  const addTweet = (tweet: Tweet) => setTweets([tweet, ...tweets]);

  return (
    <Base>
      <TweetForm added={addTweet} />
      {pagination && (
        <TweetList
          tweets={tweets}
          loading={pagination.loading}
          hasMore={hasMore}
          loadMore={pagination.getNextPage}
        />
      )}
    </Base>
  );
}
