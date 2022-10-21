import { useEffect } from "react";
import TweetForm from "../../components/TweetForm";
import TweetList from "../../components/TweetList";
import useTweets from "../../hooks/useTweets";
import useWorkspace from "../../hooks/useWorkspace";
import Base from "../../templates/Base";
import { userFilter } from "../api/tweets";

export default function Profile() {
  const workspace = useWorkspace();
  const { tweets, loading, hasMore, loadMore, prefetch } = useTweets();

  useEffect(() => {
    if (workspace) {
      const filters = [userFilter(workspace.wallet.publicKey.toBase58())];
      prefetch(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace]);

  return (
    <Base>
      <div className="flex w-full">
        <div className="mr-16 grow" style={{ position: "relative" }}>
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-skin-primary">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6 text-color-primary">
              Your tweets
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
        <div className="relative mb-8 w-72"></div>
      </div>
    </Base>
  );
}
