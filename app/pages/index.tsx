import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import TweetForm from "../components/TweetForm";
import TweetList from "../components/TweetList";
import { Tweet } from "../models";
import Base from "../templates/Base";
import { initWorkspace } from "../utils";
import { fetchTweets } from "./api/tweets";

const Home: NextPage = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wallet) {
      initWorkspace(wallet, connection);
    }
  }, [wallet, connection]);

  useEffect(() => {
    if (wallet) {
      fetchTweets()
        .then((data) => setTweets(data))
        .finally(() => setLoading(false));
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
        <TweetList tweets={tweets} loading={loading} />
      </Base>
    </>
  );
};

export default Home;
