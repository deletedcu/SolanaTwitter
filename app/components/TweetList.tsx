import { useEffect, useState } from "react";
import { Tweet } from "../models";
import { deleteTweet } from "../pages/api/tweets";
import TweetCard from "./TweetCard";

interface TweetListProps {
  tweets: Tweet[];
  loading: boolean;
}

export default function TweetList(props: TweetListProps) {
  const { tweets, loading } = props;
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);

  useEffect(() => {
    setFilteredTweets(tweets);
  }, [tweets]);

  const onDelete = async (tweet: Tweet) => {
    const result = await deleteTweet(tweet);
    if (result) {
      const fTweets = filteredTweets.filter((t) => t.publickey.toBase58() !== tweet.publickey.toBase58());
      setFilteredTweets(fTweets);
    }
  }

  return (
    <>
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading...</div>
      ) : (
        <div className="divide-y">
          {filteredTweets.map((tweet, i) => (
            <TweetCard key={i} tweet={tweet} onDelete={onDelete}/>
          ))}
        </div>
      )}
    </>
  );
}
