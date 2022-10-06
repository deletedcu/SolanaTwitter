import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TweetCard from "../../components/TweetCard";
import { Tweet as TweetModel } from "../../models";
import Base from "../../templates/Base";
import { deleteTweet, getTweet } from "../api/tweets";

export default function Tweet() {
  const router = useRouter();
  const [tweet, setTweet] = useState<TweetModel | null>(null);
  const [loading, setLoading] = useState(true);
  const tweetAddress = router.query.tweet as string;

  useEffect(() => {
    getTweet(new PublicKey(tweetAddress))
      .then((fetchedTweet) => setTweet(fetchedTweet))
      .finally(() => setLoading(false));
  }, [tweetAddress]);

  const onDelete = async (tweet: TweetModel) => {
    const result = await deleteTweet(tweet);
    if (result) {
      setTweet(null);
    }
  };

  return (
    <Base>
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading...</div>
      ) : (
        <>
          {tweet ? (
            <TweetCard tweet={tweet} onDelete={onDelete} />
          ) : (
            <div className="p-8 text-center text-gray-500">Tweet not found</div>
          )}
        </>
      )}
    </Base>
  );
}
