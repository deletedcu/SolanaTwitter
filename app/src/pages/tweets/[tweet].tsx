import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TweetCard from "../../components/TweetCard";
import { Tweet as TweetModel } from "../../models";
import Base from "../../templates/Base";
import useTweets from "../../hooks/useTweets";

export default function Tweet() {
  const router = useRouter();
  const [tweet, setTweet] = useState<TweetModel | null>(null);
  const [loading, setLoading] = useState(true);
  const tweetAddress = router.query.tweet as string;

  const { getTweet, deleteTweet } = useTweets();

  useEffect(() => {
    if (tweetAddress) {
      getTweet(new PublicKey(tweetAddress))
        .then((fetchedTweet) => setTweet(fetchedTweet))
        .finally(() => setLoading(false));
    }
  }, [getTweet, tweetAddress]);

  const onDelete = async (tweet: TweetModel) => {
    const result = await deleteTweet(tweet);
    if (result) {
      setTweet(null);
    }
  };

  return (
    <Base>
      <div className="flex w-full">
        <div className="mr-16 grow">
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-skin-primary">
            <h2 className="-mb-px flex border-b-2 border-primary-500 pb-2.5 font-semibold leading-6 text-color-primary">
              Tweet Details
            </h2>
          </div>
          <div className="pt-4">
            {loading ? (
              <div className="text-center text-color-third">Loading...</div>
            ) : (
              <>
                {tweet ? (
                  <TweetCard tweet={tweet} onDelete={onDelete} />
                ) : (
                  <div className="text-center text-color-third">
                    Tweet not found
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Base>
  );
}
