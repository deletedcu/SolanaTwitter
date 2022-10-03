import Image from "next/image";
import Link from "next/link";
import { Tweet } from "../models";
import { useWorkspace } from "../utils";

export default function TweetCard({
  tweet,
  onDelete,
}: {
  tweet: Tweet;
  onDelete: (t: Tweet) => void;
}) {
  // @ts-ignore
  const { wallet } = useWorkspace();
  const userRoute =
    wallet && wallet.publicKey.toBase58() === tweet.user.toBase58()
      ? "/profile"
      : `/users/${tweet.user.toBase58()}`;
  const isOwner: boolean =
    wallet && wallet.publicKey.toBase58() === tweet.user.toBase58();

  return (
    <div className="px-8 py-4">
      <div className="flex items-center gap-2">
        <div className="mr-2">
          <Link href={userRoute}>
            <a>
              <Image
                src={`https://avatars.dicebear.com/api/jdenticon/${tweet.user.toBase58()}.svg`}
                alt={tweet.user.toBase58()}
                width="35"
                height="35"
              />
            </a>
          </Link>
        </div>
        <h3 className="inline font-semibold" title={tweet.user_display}>
          <Link href={userRoute}>
            <a className="hover:underline">{tweet.user_display}</a>
          </Link>
        </h3>
        <span className="text-gray-500">•</span>
        <time className="text-sm text-gray-500" title={tweet.created_at}>
          <Link href={`/tweet/${tweet.key}`}>
            <a className="hover:underline">{tweet.created_ago}</a>
          </Link>
        </time>
      </div>
      <div className="flex flex-col ml-12 p-4 border border-solid border-primary rounded-lg bg-gray-100">
        <p className="whitespace-pre-wrap">{tweet.content}</p>
        <div className="flex">
          {tweet.tag && (
            <Link href={`/tags/${tweet.tag}`}>
              <a className="text-primary-500 inline-block mt-2 hover:underline">
                {`#${tweet.tag}`}
              </a>
            </Link>
          )}
          <div className="flex items-center space-x-1 ml-auto">
            {isOwner && (
              <button onClick={() => onDelete(tweet)} title="Delete tweet">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  className="h-6 w-6 p-1 text-slate-600 hover:text-primary-600 iconify iconify--heroicons-outline"
                  width="1em"
                  height="1em"
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"
                  ></path>
                </svg>
              </button>
            )}
            {isOwner && (
              <button title="Update tweet">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  role="img"
                  className="h-6 w-6 p-1 text-slate-600 hover:text-primary-600 iconify iconify--heroicons-outline"
                  width="1em"
                  height="1em"
                  preserveAspectRatio="xMidYMid meet"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732Z"
                  ></path>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
