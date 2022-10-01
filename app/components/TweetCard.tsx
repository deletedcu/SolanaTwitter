import Link from "next/link";
import { Tweet } from "../models";
import { useWorkspace } from "../utils";

export default function TweetCard({ tweet }: { tweet: Tweet }) {
  const { wallet } = useWorkspace();
  const userRoute =
    wallet && wallet.publicKey.toBase58() === tweet.user.toBase58()
      ? "/profile"
      : `/users/${tweet.user.toBase58()}`;

  return (
    <div className="px-8 py-4">
      <div>
        <h3 className="inline font-semibold" title={tweet.user_display}>
          <Link href={userRoute}>
            <a className="hover:underline">{tweet.user_display}</a>
          </Link>
        </h3>
        <span className="text-gray-500"> • </span>
        <time className="text-sm text-gray-500" title={tweet.created_at}>
          <Link href={`/tweet/${tweet.key}`}>
            <a className="hover:underline">{tweet.created_ago}</a>
          </Link>
        </time>
      </div>
      <p className="whitespace-pre-wrap">{tweet.content}</p>
      {tweet.tag && (
        <Link href={`/tags/${tweet.tag}`}>
          <a className="text-primary-500 inline-block mt-2 hover:underline">
            {`#${tweet.tag}`}
          </a>
        </Link>
      )}
    </div>
  );
}
