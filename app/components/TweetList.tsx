import { useEffect, useState } from "react";
import { Tweet } from "../models";
import { deleteTweet } from "../pages/api/tweets";
import TweetCard from "./TweetCard";

interface TweetListProps {
  tweets: Tweet[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export default function TweetList(props: TweetListProps) {
  const { tweets, loading, hasMore, loadMore } = props;
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);

  useEffect(() => {
    setFilteredTweets(tweets.slice().sort((a, b) => b.timestamp - a.timestamp));
  }, [tweets]);

  const onDelete = async (tweet: Tweet) => {
    const result = await deleteTweet(tweet);
    if (result) {
      const fTweets = filteredTweets.filter(
        (t) => t.publickey.toBase58() !== tweet.publickey.toBase58()
      );
      setFilteredTweets(fTweets);
    }
  };

  return (
    <>
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading...</div>
      ) : (
        <div className="items">
          {filteredTweets.map((tweet, i) => (
            <TweetCard key={i} tweet={tweet} onDelete={onDelete} />
          ))}
          {hasMore && (
            <div className="m-4 text-center">
              <button
                onClick={loadMore}
                className="px-4 py-2 rounded-full border bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
