import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSlug } from "../../utils";
import { tagIcon } from "../../assets/icons";
import { fetchTags } from "../api/tweets";
import TagList from "../../components/TagList";
import { TagType } from "../../models";
import TweetSearch from "../../components/TweetSearch";
import Base from "../../templates/Base";

export default function Tags() {
  const router = useRouter();
  const [tag, setTag] = useState("");
  const [allTags, setAllTags] = useState<TagType[]>([]);
  const [filterTags, setFilterTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);

  const slugTag = useSlug(tag);

  const search = () => {
    router.push(`/tags/${slugTag}`);
  };

  const fetchTweetTags = () => {
    fetchTags()
      .then((fetchedTags) => {
        setAllTags(fetchedTags);
        setFilterTags(fetchedTags);
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
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-gray-300/50">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6 text-gray-700">
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
        <div className="relative mb-8 w-72"></div>
      </div>
    </Base>
  );
}
