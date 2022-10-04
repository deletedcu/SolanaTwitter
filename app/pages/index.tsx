import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import TweetForm from "../components/TweetForm";
import TweetList from "../components/TweetList";
import { Tweet } from "../models";
import Base from "../templates/Base";
import { initWorkspace } from "../utils";
import { paginateTweets } from "./api/tweets";

const Home: NextPage = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [pagination, setPagination] = useState<any>();

  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const onNewPage = (newTweets: Tweet[]) =>
    setTweets([...tweets, ...newTweets]);

  useEffect(() => {
    if (wallet) {
      initWorkspace(wallet, connection);
      setTweets([]);
      setPagination(() => {
        const newPagination = paginateTweets([], 10, onNewPage);
        newPagination?.prefetch().then(newPagination.getNextPage);
        return newPagination;
      });
    }
  }, [wallet]);

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
            hasMore={pagination.hasNextPage}
            loadMore={pagination.getNextPage}
          />
        )}
      </Base>
    </>
  );
};

export default Home;
