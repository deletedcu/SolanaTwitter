import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { userFilter } from "../api/tweets";
import TweetList from "../../components/TweetList";
import Base from "../../templates/Base";
import { PublicKey } from "@solana/web3.js";
import RecentUsers from "../../components/RecentUsers";
import useTweets from "../../hooks/useTweets";
import useUsers from "../../hooks/useUsers";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

export default function User() {
  const router = useRouter();
  const [user] = useState<string>(router.query.user as string);
  const [userAlias, setUserAlias] = useState("");
  const [viewedUser, setViewedUser] = useState("");

  const { tweets, loading, hasMore, loadMore, setFilters } = useTweets();
  const { recentUsers, getUserAlias } = useUsers();
  const wallet = useAnchorWallet();

  useEffect(() => {
    if (user === viewedUser) return;
    getUserAlias(new PublicKey(user)).then((value) => setUserAlias(value));
    setViewedUser(user);
    const filters = [userFilter(user)];
    setFilters(filters);
  }, [getUserAlias, setFilters, user, viewedUser]);

  return (
    <Base>
      <div className="flex w-full">
        <div className="mr-16 grow" style={{ position: "relative" }}>
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-skin-primary">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6 text-color-primary">
              {wallet && user && wallet.publicKey.toBase58() === user
                ? "Your Tweets"
                : `${userAlias}'s Tweets`}
            </h2>
          </div>
          <TweetList
            tweets={tweets}
            loading={loading}
            hasMore={hasMore}
            loadMore={loadMore}
          />
          {!loading && tweets.length === 0 && (
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
