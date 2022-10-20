import { useEffect, useState } from "react";
import { useTheme } from "../contexts/themeProvider";
import { Tweet } from "../models";
import { deleteTweet } from "../pages/api/tweets";
import { useWorkspace, notifyLoading, notifyUpdate } from "../utils";
import TweetCard from "./TweetCard";

interface TweetListProps {
  tweets: Tweet[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

export default function TweetList(props: TweetListProps) {
  const { tweets, loading, hasMore, loadMore } = props;
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);
  const workspace = useWorkspace();
  const { theme } = useTheme();

  useEffect(() => {
    setFilteredTweets(tweets);
  }, [tweets]);

  const onDelete = async (tweet: Tweet) => {
    if (!workspace) return;
    const toastId = notifyLoading(
      "Transaction in progress. Please wait...",
      theme
    );
    const result = await deleteTweet(
      workspace.program,
      workspace.wallet,
      tweet
    );
    notifyUpdate(toastId, result.message, result.success ? "success" : "error");
    if (result.success) {
      const fTweets = filteredTweets.filter(
        (t) => t.publickey.toBase58() !== tweet.publickey.toBase58()
      );
      setFilteredTweets(fTweets);
    }
  };

  return (
    <>
      <div className="items">
        {filteredTweets.map((tweet, i) => (
          <TweetCard key={i} tweet={tweet} onDelete={onDelete} />
        ))}
        {loading ? (
          <div className="p-8 text-center text-color-third">Loading...</div>
        ) : (
          hasMore && (
            <div className="m-4 text-center">
              <button
                onClick={loadMore}
                className="px-4 py-2 rounded-full border border-skin-primary bg-fill-secondary hover:bg-fill-third text-color-secondary hover:text-color-primary"
              >
                Load more
              </button>
            </div>
          )
        )}
      </div>
    </>
  );
}
