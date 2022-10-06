import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tweet } from "../../models";
import Search from "../../templates/Search";
import { paginateTweets, userFilter } from "../api/tweets";
import { userIcon } from "../../public/assets/icons";
import TweetList from "../../components/TweetList";
import { initWorkspace, useWorkspace } from "../../utils";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";

export default function User() {
  const router = useRouter();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [user, setUser] = useState<string>(router.query.user as string);
  const [viewedUser, setViewedUser] = useState("");
  const [pagination, setPagination] = useState<any>();
  const [hasMore, setHasMore] = useState(false);

  let workspace = useWorkspace();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected } = useWallet();

  const onNewPage = (newTweets: Tweet[], more: boolean) => {
    setTweets((prev) => [...prev, ...newTweets]);
    setHasMore(more);
  };

  const search = () => {
    router.push(`/users/${user}`);
  };

  useEffect(() => {
    if (wallet && connected && user) {
      if (user === viewedUser) return;
      if (!workspace) {
        initWorkspace(wallet, connection);
        workspace = useWorkspace();
      }
      setTweets([]);
      setViewedUser(user);
      const filters = [userFilter(user)];
      const newPagination = paginateTweets(filters, 10, onNewPage);
      setPagination(newPagination);
    } else {
      setPagination(null);
      setTweets([]);
      setViewedUser("");
    }
  }, [wallet, connected, user]);

  useEffect(() => {
    if (pagination) {
      pagination.prefetch().then(pagination.getNextPage);
    }
  }, [pagination]);

  return (
    <Search
      icon={userIcon}
      placeholder="public key"
      modelValue={user}
      setModelValue={setUser}
      search={search}
    >
      <div>
        {pagination && (
          <TweetList
            tweets={tweets}
            loading={pagination.loading}
            hasMore={hasMore}
            loadMore={pagination.getNextPage}
          />
        )}
        {pagination && !pagination!.loading && tweets.length === 0 && (
          <div className="p-8 text-center text-gray-500">User not found...</div>
        )}
      </div>
    </Search>
  );
}
