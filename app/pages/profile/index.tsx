import { useEffect, useState } from "react";
import TweetForm from "../../components/TweetForm";
import TweetList from "../../components/TweetList";
import { Tweet } from "../../models";
import Base from "../../templates/Base";
import { useWorkspace } from "../../utils";
import { paginateTweets, userFilter } from "../api/tweets";

export default function Profile() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [pagination, setPagination] = useState<any>();

  const workspace = useWorkspace();

  const onNewPage = (newTweets: Tweet[]) =>
    setTweets([...tweets, ...newTweets]);

  const addTweet = (tweet: Tweet) => setTweets([tweet, ...tweets]);

  useEffect(() => {
    if (workspace) {
      setTweets([]);
      const filters = [userFilter(workspace.wallet.publicKey.toBase58())];

      setPagination(() => {
        const newPagination = paginateTweets(filters, 10, onNewPage);
        newPagination?.prefetch().then(newPagination.getNextPage);
        return newPagination;
      });
    }
  }, [workspace]);

  return (
    <Base>
      {workspace && (
        <div className="border-b bg-gray-50 px-8 py-4">
          {workspace.wallet.publicKey.toBase58()}
        </div>
      )}
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
  );
}
