import Link from "next/link";
import { Tweet } from "../models";

export default function RecentTweets({
  tweets,
  owner,
}: {
  tweets: Tweet[];
  owner: string;
}) {
  return (
    <div className="h-full overflow-y-auto pl-2">
      <ol className="relative border-l border-current">
        {tweets.map((tweet, i) => {
          const userRoute =
            tweet.user.toBase58() === owner
              ? "/profile"
              : `/users/${tweet.user.toBase58()}`;
          return (
            <li key={i} className="ml-4 mb-4">
              <div className="absolute w-3 h-3 bg-current rounded-full mt-1.5 -left-1.5 border border-white"></div>
              <div className="relative mb-4 text-left">
                <time className="mb-1 leading-none">
                  <Link href={`/tweets/${tweet.key}`}>
                    <a className="text-sm text-skin-third hover:underline">
                      {tweet.created_ago}
                    </a>
                  </Link>
                </time>
                <div>
                  <Link href={userRoute}>
                    <a className="font-bold hover:underline text-skin-primary">
                      {tweet.user_display}
                    </a>
                  </Link>
                  <span className="text-skin-third ml-1">posted</span>
                </div>
                <div className="truncate text-skin-secondary">{tweet.content}</div>
                <div>
                  <Link href={`/tags/${tweet.tag}`}>
                    <a className="text-primary-500 transition-colors hover:underline">
                      {`#${tweet.tag}`}
                    </a>
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
