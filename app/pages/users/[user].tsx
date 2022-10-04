import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tweet } from "../../models";
import Search from "../../templates/Search";
import { paginateTweets, userFilter } from "../api/tweets";
import { userIcon } from "../../public/assets/icons";
import TweetList from "../../components/TweetList";

export default function User() {
  const router = useRouter();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [user, setUser] = useState<string>(router.query.user as string);
  const [viewedUser, setViewedUser] = useState("");
  const [pagination, setPagination] = useState<any>();

  const onNewPage = (newTweets: Tweet[]) =>
    setTweets([...tweets, ...newTweets]);
  
  const search = () => {
    router.push(`/users/${user}`);
  };

  useEffect(() => {
    if (user) {
      if (user === viewedUser) return;
      setTweets([]);
      setViewedUser(user);
      const filters = [userFilter(user)];
      setPagination(() => {
        const newPagination = paginateTweets(filters, 10, onNewPage);
        newPagination?.prefetch().then(newPagination.getNextPage);
        return newPagination;
      });
    } else {
      setTweets([]);
      setViewedUser("");
    }
  }, [user]);

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
            hasMore={pagination.hasNextPage}
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
