import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import TweetForm from "../../components/TweetForm";
import TweetList from "../../components/TweetList";
import useWorkspace from "../../hooks/useWorkspace";
import { Tweet } from "../../models";
import Base from "../../templates/Base";
import { paginateTweets, userFilter } from "../api/tweets";

export default function Profile() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [pagination, setPagination] = useState<any>();
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  let workspace = useWorkspace();
  const { connected } = useWallet();

  const onNewPage = (newTweets: Tweet[], more: boolean, page: number) => {
    setTweets((prev) => [...prev, ...newTweets]);
    setHasMore(more);
    setLoading(false);
  };

  const addTweet = (tweet: Tweet) => setTweets([tweet, ...tweets]);

  useEffect(() => {
    if (workspace) {
      const filters = [userFilter(workspace.wallet.publicKey.toBase58())];
      const newPagination = paginateTweets(
        workspace,
        filters,
        10,
        onNewPage
      );
      setTweets([]);
      setPagination(newPagination);
    } else {
      setPagination(null);
      setTweets([]);
      setLoading(false);
    }
  }, [workspace, connected]);

  useEffect(() => {
    if (pagination) {
      setLoading(true);
      pagination.prefetch().then(pagination.getNextPage);
    }
  }, [pagination]);

  const loadMore = () => {
    setLoading(true);
    pagination.getNextPage();
  };

  return (
    <Base>
      <div className="flex w-full">
        <div className="mr-16 grow" style={{ position: "relative" }}>
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-skin-primary">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6 text-color-primary">
              Your tweets
            </h2>
          </div>
          <TweetForm />
          {pagination && (
            <TweetList
              tweets={tweets}
              loading={loading}
              hasMore={hasMore}
              loadMore={loadMore}
            />
          )}
        </div>
        <div className="relative mb-8 w-72"></div>
      </div>
    </Base>
  );
}
