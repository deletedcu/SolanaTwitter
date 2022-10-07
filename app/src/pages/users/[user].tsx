import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tweet } from "../../models";
import { paginateTweets, userFilter } from "../api/tweets";
import TweetList from "../../components/TweetList";
import { getWorkspace, initWorkspace } from "../../utils";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import Base from "../../templates/Base";
import { getUserAlias } from "../api/alias";
import { PublicKey } from "@solana/web3.js";

export default function User() {
  const router = useRouter();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [user, setUser] = useState<string>(router.query.user as string);
  const [userAlias, setUserAlias] = useState("");
  const [viewedUser, setViewedUser] = useState("");
  const [pagination, setPagination] = useState<any>();
  const [hasMore, setHasMore] = useState(false);

  let workspace = getWorkspace();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected } = useWallet();

  const onNewPage = (newTweets: Tweet[], more: boolean, page: number) => {
    setTweets((prev) => [...prev, ...newTweets]);
    setHasMore(more);
  };

  useEffect(() => {
    if (wallet && connected && user) {
      if (user === viewedUser) return;
      if (!workspace) {
        initWorkspace(wallet, connection);
      }
      setTweets([]);
      setViewedUser(user);
      const filters = [userFilter(user)];
      const newPagination = paginateTweets(filters, 10, onNewPage);
      setPagination(newPagination);
      getUserAlias(new PublicKey(user)).then((value) => setUserAlias(value));
    } else {
      setPagination(null);
      setTweets([]);
      setViewedUser("");
    }
  }, [wallet, connected, user, viewedUser, workspace, connection]);

  useEffect(() => {
    if (pagination) {
      pagination.prefetch().then(pagination.getNextPage);
    }
  }, [pagination]);

  return (
    <Base>
      <div className="flex w-full">
        <div className="mr-16 grow" style={{ position: "relative" }}>
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-gray-300/50">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6 text-gray-700">
              {wallet && user && wallet.publicKey.toBase58() === user
                ? "Your Tweets"
                : `${userAlias}'s Tweets`}
            </h2>
          </div>
          {pagination && (
            <TweetList
              tweets={tweets}
              loading={pagination.loading}
              hasMore={hasMore}
              loadMore={pagination.getNextPage}
            />
          )}
          {pagination && !pagination!.loading && tweets.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              User not found...
            </div>
          )}
        </div>
        <div className="relative mb-8 w-72"></div>
      </div>
    </Base>
  );
}
