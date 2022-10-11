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

  const onNewPage = (newTweets: Tweet[], more: boolean, page: number) => {
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
      const newPagination = paginateTweets(filters, 5, onNewPage);
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
      <div className="flex w-full">
        <div className="mr-16 grow" style={{ position: "relative" }}>
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-gray-300/50">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6">
              Your tweets
            </h2>
          </div>
          <TweetForm added={addTweet} />
          {pagination && (
            <TweetList
              tweets={tweets}
              loading={pagination.loading}
              hasMore={hasMore}
              loadMore={pagination.getNextPage}
            />
          )}
        </div>
        <div className="relative mb-8 w-72"></div>
      </div>
    </Base>
  );
}
