import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { tagIcon } from "../../assets/icons";
import TweetForm from "../../components/TweetForm";
import TweetList from "../../components/TweetList";
import { tagFilter } from "../api/tweets";
import Base from "../../templates/Base";
import TweetSearch from "../../components/TweetSearch";
import RecentTags from "../../components/RecentTags";
import { useSlug } from "../../hooks/useSlug";
import useTweets from "../../hooks/useTweets";
import useTags from "../../hooks/useTags";

export default function Tags() {
  const router = useRouter();
  const [tag, setTag] = useState<string>("");

  const { tweets, loading, hasMore, loadMore, setFilters } = useTweets();
  const { recentTags } = useTags();

  const slugTag = useSlug(tag);

  const search = (str: string) => {
    router.push(`/tags/${str}`);
  };

  useEffect(() => {
    setTag(router.query.tag as string);
  }, [router.query.tag]);

  useEffect(() => {
    const filters = [tagFilter(slugTag)];
    setFilters(filters);
  }, [setFilters, slugTag]);

  return (
    <Base>
      <div className="flex w-full">
        <div className="mr-16 grow" style={{ position: "relative" }}>
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-skin-primary">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6 text-color-primary">
              Tweets with Tag
            </h2>
          </div>
          <TweetSearch
            placeholder="tag"
            disabled={!slugTag}
            modelValue={slugTag}
            search={search}
          >
            {tagIcon}
          </TweetSearch>
          <TweetForm forceTag={slugTag} />
          <TweetList
            tweets={tweets}
            loading={loading}
            hasMore={hasMore}
            loadMore={loadMore}
          />
        </div>
        <div className="relative mb-8 w-72">
          <div className="duration-400 fixed h-full w-72 pb-44 transition-all">
            <h3 className="mb-4 pb-2.5 font-semibold leading-6 text-color-primary">
              Recent Tags
            </h3>
            <RecentTags tags={recentTags} />
          </div>
        </div>
      </div>
    </Base>
  );
}
