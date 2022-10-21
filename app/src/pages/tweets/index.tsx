import { useEffect } from "react";
import RecentTweets from "../../components/RecentTweets";
import TweetForm from "../../components/TweetForm";
import TweetList from "../../components/TweetList";
import useTweets from "../../hooks/useTweets";
import useWorkspace from "../../hooks/useWorkspace";
import Base from "../../templates/Base";

export default function Tweets() {
  const workspace = useWorkspace();
  const { tweets, recentTweets, loading, hasMore, loadMore, prefetch } =
    useTweets();

  useEffect(() => {
    prefetch([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace]);

  return (
    <Base>
      <div className="flex w-full">
        <div className="mr-16 grow" style={{ position: "relative" }}>
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-skin-primary">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6 text-color-primary">
              Tweets
            </h2>
          </div>
          <TweetForm />
          {workspace ? (
            <TweetList
              tweets={tweets}
              loading={loading}
              hasMore={hasMore}
              loadMore={loadMore}
            />
          ) : null}
        </div>
        <div className="relative mb-8 w-72">
          <div className="duration-400 fixed h-full w-72 pb-44 transition-all">
            <h3 className="mb-4 pb-2.5 font-semibold leading-6 text-color-primary">
              Recent Activities
            </h3>
            {workspace ? <RecentTweets tweets={recentTweets} /> : null}
          </div>
        </div>
      </div>
    </Base>
  );
}
