import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSlug } from "../../utils";
import { tagIcon } from "../../assets/icons";
import { fetchTags } from "../api/tweets";
import TagList from "../../components/TagList";
import { TagType } from "../../models";
import TweetSearch from "../../components/TweetSearch";
import Base from "../../templates/Base";
import RecentTags from "../../components/RecentTags";

export default function Tags() {
  const router = useRouter();
  const [tag, setTag] = useState("");
  const [allTags, setAllTags] = useState<TagType[]>([]);
  const [filterTags, setFilterTags] = useState<TagType[]>([]);
  const [recentTags, setRecentTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);

  const slugTag = useSlug(tag);

  const search = () => {
    router.push(`/tags/${slugTag}`);
  };

  const fetchTweetTags = () => {
    fetchTags()
      .then((fetchedTags) => {
        const countOrdered = fetchedTags.sort((a, b) => b.count - a.count);
        const recentOrdered = fetchedTags
          .slice(0, 5)
          .sort((a, b) => b.timestamp - a.timestamp);
        setAllTags(countOrdered);
        setFilterTags(countOrdered);
        setRecentTags(recentOrdered);
      })
      .finally(() => setLoading(false));
  };

  const onTextChange = (text: string) => {
    const fTags = allTags.filter((k) => k.tag.includes(text));
    setTag(text);
    setFilterTags(fTags);
  };

  useEffect(() => {
    fetchTweetTags();
  }, []);

  return (
    <Base>
      <div className="flex w-full">
        <div className="mr-16 grow" style={{ position: "relative" }}>
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-skin-primary">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6 text-color-primary">
              Tags
            </h2>
          </div>
          <TweetSearch
            placeholder="tag"
            disabled={!slugTag}
            modelValue={slugTag}
            setModelValue={onTextChange}
            search={search}
          >
            {tagIcon}
          </TweetSearch>
          <TagList tags={filterTags} loading={loading} />
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
