import Link from "next/link";
import { Tweet } from "../models";

export default function RecentTweets({ tweets }: { tweets: Tweet[] }) {
  return (
    <div className="h-full overflow-y-auto pl-2">
      <ol className="relative border-l border-gray-300">
        {tweets.map((tweet, i) => (
          <li key={i} className="ml-4 mb-4">
            <div className="absolute w-3 h-3 bg-gray-300 rounded-full mt-1.5 -left-1.5 border border-white"></div>
            <div className="relative mb-4 text-left">
              <time className="mb-1 text-sm leading-none text-gray-400">
                <Link href={`/tweets/${tweet.key}`}>
                  <a className="text-sm text-gray-500 hover:underline">
                    {tweet.created_ago}
                  </a>
                </Link>
              </time>
              <div>
                <Link href={`/users/${tweet.user.toBase58()}`}>
                  <a className="font-bold hover:underline">
                    {tweet.user_display}
                  </a>
                </Link>
                <span className="text-gray-500 ml-1">posted</span>
              </div>
              <div className="truncate text-gray-700">{tweet.content}</div>
              <div>
                <Link href={`/tags/${tweet.tag}`}>
                  <a className="text-primary-500 transition-colors hover:underline">
                    {`#${tweet.tag}`}
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
