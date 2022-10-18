import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TagType, Tweet } from "../../models";
import { getWorkspace, initWorkspace, useSlug } from "../../utils";
import { tagIcon } from "../../assets/icons";
import TweetForm from "../../components/TweetForm";
import TweetList from "../../components/TweetList";
import { fetchTags, paginateTweets, tagFilter } from "../api/tweets";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import Base from "../../templates/Base";
import TweetSearch from "../../components/TweetSearch";
import RecentTags from "../../components/RecentTags";

export default function Tags() {
  const router = useRouter();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [tag, setTag] = useState<string>(router.query.tag as string);
  const [viewedTag, setViewedTag] = useState<string>();
  const [pagination, setPagination] = useState<any>();
  const [hasMore, setHasMore] = useState(false);
  const [recentTags, setRecentTags] = useState<TagType[]>([]);

  let workspace = getWorkspace();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const { connected } = useWallet();

  const slugTag = useSlug(tag);

  const onNewPage = (newTweets: Tweet[], more: boolean, page: number) => {
    setTweets((prev) => [...prev, ...newTweets]);
    setHasMore(more);
  };

  const search = (str: string) => {
    router.push(`/tags/${str}`);
  };

  const addTweet = (tweet: Tweet) => setTweets([tweet, ...tweets]);

  useEffect(() => {
    setTweets([]);
    setTag((router.query.tag as string));
  }, [router.query.tag]);

  useEffect(() => {
    if (wallet && connected && slugTag) {
      if (!workspace) {
        initWorkspace(wallet, connection);
      }
      if (slugTag === viewedTag) return;
      setTweets([]);
      setViewedTag(slugTag);
      const filters = [tagFilter(slugTag)];
      const newPagination = paginateTweets(filters, 5, onNewPage);
      setPagination(newPagination);
    } else {
      setPagination(null);
      setTweets([]);
      setViewedTag("");
    }
  }, [wallet, connected, slugTag, workspace, viewedTag, connection]);

  useEffect(() => {
    if (pagination) {
      pagination.prefetch().then(pagination.getNextPage);
      fetchTags().then((fetchedTags) => {
        const recentOrdered = fetchedTags
          .slice(0, 5)
          .sort((a, b) => b.timestamp - a.timestamp);
        setRecentTags(recentOrdered);
      })
    }
  }, [pagination]);

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
            <div className="p-8 text-center text-color-third">
              No tweets were found in this tag...
            </div>
          )}
        </div>
        <div className="relative mb-8 w-72">
          <div className="duration-400 fixed h-full w-72 pb-44 transition-all">
            <h3 className="mb-4 pb-2.5 font-semibold leading-6 text-color-primary">Recent Tags</h3>
            <RecentTags tags={recentTags} />
          </div>
        </div>
      </div>
    </Base>
  );
}
