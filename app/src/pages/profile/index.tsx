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
import { paginateTweets, userFilter } from "../api/tweets";

export default function Profile() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [pagination, setPagination] = useState<any>();
  const [hasMore, setHasMore] = useState(false);

  let workspace = getWorkspace();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected } = useWallet();

  const onNewPage = (newTweets: Tweet[], more: boolean) => {
    setTweets((prev) => [...prev, ...newTweets]);
    setHasMore(more);
  };

  const addTweet = (tweet: Tweet) => setTweets([tweet, ...tweets]);

  useEffect(() => {
    if (wallet && connected) {
      if (!workspace) {
        initWorkspace(wallet, connection);
      }
      const filters = [userFilter(wallet.publicKey.toBase58())];
      const newPagination = paginateTweets(filters, 10, onNewPage);
      setTweets([]);
      setPagination(newPagination);
    } else {
      setPagination(null);
      setTweets([]);
    }
  }, [wallet, connected, workspace, connection]);

  useEffect(() => {
    if (pagination) {
      pagination.prefetch().then(pagination.getNextPage);
    }
  }, [pagination]);

  return (
    <Base>
      {workspace && (
        <div className="border-b bg-gray-50 px-8 py-4">
          {workspace.wallet.publicKey.toBase58()}
        </div>
      )}
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
