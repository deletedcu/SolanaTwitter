import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tweet, UserType } from "../../models";
import { fetchUsers, paginateTweets, userFilter } from "../api/tweets";
import TweetList from "../../components/TweetList";
import { useWallet } from "@solana/wallet-adapter-react";
import Base from "../../templates/Base";
import { getUserAlias } from "../api/alias";
import { PublicKey } from "@solana/web3.js";
import RecentUsers from "../../components/RecentUsers";
import useWorkspace from "../../hooks/useWorkspace";

export default function User() {
  const router = useRouter();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [user] = useState<string>(router.query.user as string);
  const [userAlias, setUserAlias] = useState("");
  const [viewedUser, setViewedUser] = useState("");
  const [pagination, setPagination] = useState<any>();
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentUsers, setRecentUsers] = useState<UserType[]>([]);

  let workspace = useWorkspace();
  const { connected } = useWallet();

  const onNewPage = (newTweets: Tweet[], more: boolean, page: number) => {
    setTweets((prev) => [...prev, ...newTweets]);
    setHasMore(more);
    setLoading(false);
  };

  useEffect(() => {
    if (workspace) {
      if (user === viewedUser) return;
      setTweets([]);
      setViewedUser(user);
      const filters = [userFilter(user)];
      const newPagination = paginateTweets(
        workspace,
        filters,
        10,
        onNewPage
      );
      setPagination(newPagination);
      getUserAlias(workspace!.program, new PublicKey(user)).then((value) =>
        setUserAlias(value)
      );
    } else {
      setPagination(null);
      setTweets([]);
      setRecentUsers([]);
      setViewedUser("");
      setLoading(false);
    }
  }, [user, viewedUser, workspace, connected]);

  useEffect(() => {
    if (pagination && workspace) {
      setLoading(true);
      pagination.prefetch().then(pagination.getNextPage);
      fetchUsers(workspace.program, workspace.connection).then((value) =>
        setRecentUsers(
          value.sort((a, b) => b.last_timestamp - a.last_timestamp).slice(0, 5)
        )
      );
    }
  }, [pagination, workspace]);

  const loadMore = () => {
    setLoading(true);
    pagination.getNextPage();
  };

  return (
    <Base>
      <div className="flex w-full">
        <div className="mr-16 grow" style={{ position: "relative" }}>
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-skin-primary">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6 text-color-primary">
              {workspace &&
              user &&
              workspace.wallet.publicKey.toBase58() === user
                ? "Your Tweets"
                : `${userAlias}'s Tweets`}
            </h2>
          </div>
          {pagination && (
            <TweetList
              tweets={tweets}
              loading={loading}
              hasMore={hasMore}
              loadMore={loadMore}
            />
          )}
          {pagination && !loading && tweets.length === 0 && (
            <div className="p-8 text-center text-color-third">
              User not found...
            </div>
          )}
        </div>
        <div className="relative mb-8 w-72">
          <div className="duration-400 fixed h-full w-72 pb-44 transition-all">
            <h3 className="mb-4 pb-2.5 font-semibold leading-6 text-color-primary">
              Recent Users
            </h3>
            <RecentUsers users={recentUsers} />
          </div>
        </div>
      </div>
    </Base>
  );
}
