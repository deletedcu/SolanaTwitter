import { useRouter } from "next/router";
import { useState } from "react";
import Search from "../../templates/Search";
import { useSlug } from "../../utils";
import { tagIcon } from "../../public/assets/icons";

export default function Tags() {
  const router = useRouter();
  const [tag, setTag] = useState("");
  const [viewedTag, setViewedTag] = useState("");

  const slugTag = useSlug(tag);

  const search = () => {
    router.push(`/tags/${slugTag}`);
    setViewedTag(slugTag);
  }

  return (
    <Search
      icon={tagIcon}
      placeholder="tag"
      disabled={!slugTag}
      modelValue={slugTag}
      setModelValue={setTag}
      search={search}
    />
  )
}