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
      <div className="flex w-full">
        <div className="mr-16 grow">
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-gray-300/50">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6 text-gray-700">
              Tweet Details
            </h2>
          </div>
          <div className="pt-4">
            {loading ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              <>
                {tweet ? (
                  <TweetCard tweet={tweet} onDelete={onDelete} />
                ) : (
                  <div className="text-center text-gray-500">
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
