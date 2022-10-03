import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tweet } from "../../models";
import Search from "../../templates/Search";
import { fetchTweets, userFilter } from "../api/tweets";
import { userIcon } from "../../public/assets/icons";
import TweetList from "../../components/TweetList";

export default function User() {
  const router = useRouter();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string>(router.query.user as string);
  const [viewedUser, setViewedUser] = useState("");

  const search = () => {
    router.push(`/users/${user}`);
    setViewedUser(user);
  };

  const fetchUserTweets = () => {
    fetchTweets([userFilter(user)])
      .then((fetchedTweets) => setTweets(fetchedTweets))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUserTweets();
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
        <TweetList tweets={tweets} loading={loading} />
        {tweets.length === 0 && (
          <div className="p-8 text-center text-gray-500">User not found...</div>
        )}
      </div>
    </Search>
  );
}
