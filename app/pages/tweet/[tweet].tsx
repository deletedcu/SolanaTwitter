import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TweetCard from "../../components/TweetCard";
import { Tweet as TweetModel } from "../../models";
import Base from "../../templates/Base";
import { getTweet } from "../api/tweets";

export default function Tweet() {
  const router = useRouter();
  const [tweet, setTweet] = useState<TweetModel | null>(null);
  const [loading, setLoading] = useState(true);
  const tweetAddress = router.query.tweet as string;

  const fetchTweet = () => {
    getTweet(new PublicKey(tweetAddress))
      .then((fetchedTweet) => setTweet(fetchedTweet))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTweet();
  }, []);

  return (
    <Base>
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading...</div>
      ) : (
        <>
          {tweet ? (
            <TweetCard tweet={tweet} />
          ) : (
            <div className="p-8 text-center text-gray-500">Tweet not found</div>
          )}
        </>
      )}
    </Base>
  );
}
