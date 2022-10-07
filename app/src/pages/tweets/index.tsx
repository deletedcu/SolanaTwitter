import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import Head from "next/head";
import { useEffect, useState } from "react";
import RecentTweets from "../../components/RecentTweets";
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
  const [recentTweets, setRecentTweets] = useState<Tweet[]>([]);

  let workspace = getWorkspace();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected } = useWallet();

  const onNewPage = (newTweets: Tweet[], more: boolean, page: number) => {
    setTweets((prev) => [...prev, ...newTweets]);
    setHasMore(more);
    if (page === 0) {
      setRecentTweets(newTweets.slice(0, 5));
    }
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

  const addTweet = (tweet: Tweet) => {
    setTweets([tweet, ...tweets]);
    setRecentTweets((prev) => [tweet, ...prev].slice(0, 5));
  };

  return (
    <>
      <Head>
        <title>Solana Twitter</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Base>
        <div className="flex w-full">
          <div className="mr-16 grow" style={{ position: "relative" }}>
            <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-gray-300/50">
              <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6">
                Tweets
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
          <div className="relative mb-8 w-72">
            <div className="duration-400 fixed h-full w-72 pb-44 transition-all">
              <h3 className="mb-4 pb-2.5 font-semibold leading-6">
                Recent Activities
              </h3>
              {wallet && (
                <RecentTweets tweets={recentTweets} owner={wallet.publicKey.toBase58()}/>
              )}
            </div>
          </div>
        </div>
      </Base>
    </>
  );
}