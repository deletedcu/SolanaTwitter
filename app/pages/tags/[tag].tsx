import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tweet } from "../../models";
import { useSlug } from "../../utils";
import { tagIcon } from "../../public/assets/icons";
import Search from "../../templates/Search";
import TweetForm from "../../components/TweetForm";
import TweetList from "../../components/TweetList";
import { fetchTweets, tagFilter } from "../api/tweets";

export default function tags() {
  const router = useRouter();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [tag, setTag] = useState<string>(router.query.tag as string);
  const [viewedTag, setViewedTag] = useState<string>(
    router.query.tag as string
  );

  const slugTag = useSlug(tag);

  const search = () => {
    router.push(`/tags/${slugTag}`);
    setViewedTag(slugTag);
  };

  const fetchTagTweets = () => {
    if (slugTag === viewedTag) {
      fetchTweets([tagFilter(slugTag)])
        .then((fetchedTweets) => setTweets(fetchedTweets))
        .finally(() => setLoading(false));
    }
  };

  const addTweet = (tweet: Tweet) => setTweets([tweet, ...tweets]);

  useEffect(() => {
    fetchTagTweets();
  }, [tag]);

  return (
    <Search
      icon={tagIcon}
      placeholder="tag"
      disabled={!slugTag}
      modelValue={slugTag}
      setModelValue={setTag}
      search={search}
    >
      <TweetForm added={addTweet} forceTag={viewedTag} />
      <TweetList tweets={tweets} loading={loading} />
      {tweets.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No tweets were found in this topic...
        </div>
      )}
    </Search>
  );
}
