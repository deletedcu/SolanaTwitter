import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Tweet } from "../../models";
import { useSlug } from "../../utils";
import { tagIcon } from "../../public/assets/icons";
import Search from "../../templates/Search";
import TweetForm from "../../components/TweetForm";
import TweetList from "../../components/TweetList";
import { paginateTweets, tagFilter } from "../api/tweets";
import { useWallet } from "@solana/wallet-adapter-react";

export default function tags() {
  const router = useRouter();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [tag, setTag] = useState<string>(router.query.tag as string);
  const [viewedTag, setViewedTag] = useState<string>();
  const [pagination, setPagination] = useState<any>();
  const [hasMore, setHasMore] = useState(false);

  const slugTag = useSlug(tag);

  const onNewPage = (newTweets: Tweet[], more: boolean) => {
    setTweets((prev) => [...prev, ...newTweets]);
    setHasMore(more);
  }

  const search = () => {
    router.push(`/tags/${slugTag}`);
  };

  const addTweet = (tweet: Tweet) => setTweets([tweet, ...tweets]);

  useEffect(() => {
    if (tag) {
      if (slugTag === viewedTag) return;
      setTweets([]);
      setViewedTag(slugTag);
      const filters = [tagFilter(slugTag)];

      setPagination(() => {
        const newPagination = paginateTweets(filters, 10, onNewPage);
        newPagination?.prefetch().then(newPagination.getNextPage);
        return newPagination;
      });
    } else {
      setTweets([]);
      setViewedTag("");
    }
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
      {pagination && (
        <TweetList
          tweets={tweets}
          loading={pagination.loading}
          hasMore={hasMore}
          loadMore={pagination.getNextPage}
        />
      )}
      {pagination && !pagination.loading && tweets.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No tweets were found in this tag...
        </div>
      )}
    </Search>
  );
}
