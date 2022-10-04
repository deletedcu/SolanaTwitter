import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import TweetForm from "../components/TweetForm";
import TweetList from "../components/TweetList";
import { Tweet } from "../models";
import Base from "../templates/Base";
import { initWorkspace, useWorkspace } from "../utils";
import { paginateTweets } from "./api/tweets";

const Home: NextPage = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [hasMore, setHasMore] = useState(false);

  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const workspace = useWorkspace();

  const onNewPage = (newTweets: Tweet[], more: boolean) => {
    setTweets((prev) => [...prev, ...newTweets]);
    setHasMore(more);
  };

  const pagination = useMemo(() => {
    return workspace && paginateTweets([], 10, onNewPage);
  }, [workspace]);

  useEffect(() => {
    if (wallet) {
      initWorkspace(wallet, connection);
    }
  }, [wallet]);

  useEffect(() => {
    if (pagination) {
      setTweets([]);
      pagination?.prefetch().then(pagination.getNextPage);
    }
  }, [pagination]);

  const addTweet = (tweet: Tweet) => setTweets([tweet, ...tweets]);

  return (
    <>
      <Head>
        <title>Solana Twitter</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
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
    </>
  );
};

export default Home;
