import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Search from "../../templates/Search";
import { useSlug } from "../../utils";
import { tagIcon } from "../../public/assets/icons";
import { fetchTags } from "../api/tweets";
import TagList from "../../components/TagList";
import { TagType } from "../../models";

export default function Tags() {
  const router = useRouter();
  const [tag, setTag] = useState("");
  const [viewedTag, setViewedTag] = useState("");
  const [allTags, setAllTags] = useState<TagType[]>([]);
  const [filterTags, setFilterTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);

  const slugTag = useSlug(tag);

  const search = () => {
    router.push(`/tags/${slugTag}`);
    setViewedTag(slugTag);
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
    <Search
      icon={tagIcon}
      placeholder="tag"
      disabled={!slugTag}
      modelValue={slugTag}
      setModelValue={onTextChange}
      search={search}
    >
      <TagList tags={filterTags} loading={loading} />
    </Search>
  );
}
