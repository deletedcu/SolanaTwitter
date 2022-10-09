import Link from "next/link";
import { TagType } from "../models";

export default function RecentTags({tags}: {tags: TagType[]}) {
  return (
    <div className="h-full overflow-y-auto pl-2">
      <ol className="relative border-l border-gray-300">
        {tags.map((tag, i) => (
          <li key={i} className="ml-4 mb-4">
            <div className="absolute w-3 h-3 bg-gray-300 rounded-full mt-1.5 -left-1.5 border border-white"></div>
            <div className="relative mb-4 text-left">
              <time className="mb-1 text-sm leading-none text-gray-400">
                <Link href={`/tweets/${tag.tweetKey}`}>
                  <a className="text-sm text-gray-500 hover:underline">
                    {tag.created_ago}
                  </a>
                </Link>
              </time>
              <div>
                <Link href={`/tags/${tag.tag}`}>
                  <a className="text-primary-500 transition-colors hover:underline">
                    {`#${tag.tag}`}
                  </a>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}