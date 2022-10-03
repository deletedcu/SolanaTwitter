import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useState } from "react";
import TextareaAutosize from "react-autosize-textarea";
import { SubmitHandler, useForm } from "react-hook-form";
import { Tweet } from "../models";
import { updateTweet } from "../pages/api/tweets";
import { useCountCharacterLimit, useSlug } from "../utils";

type FormValues = {
  content: string;
  tag: string;
};

const LIMIT = 280;

export default function TweetFormUpdate({
  tweet,
  onClose,
}: {
  tweet: Tweet;
  onClose: () => void;
}) {
  const { register, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      content: tweet.content,
    },
  });
  const onSubmit: SubmitHandler<FormValues> = (data) => update(data);

  // Form data
  const [tag, setTag] = useState<string>(tweet.tag);
  const slugTag = useSlug(tag);

  // Character limit / count-down
  const characterLimit = useCountCharacterLimit(watch("content"));
  let characterLimitColor = "text-gray-400";
  if (LIMIT - characterLimit <= 10) characterLimitColor = "text-yellow-500";
  if (LIMIT - characterLimit < 0) characterLimitColor = "text-red-500";

  // Permissions
  const { connected } = useWallet();
  const canTweet = watch("content") && (LIMIT - characterLimit) > 0 && (tweet.tag !== slugTag || tweet.content !== watch("content")) ;

  // Actions
  const update = async (data: FormValues) => {
    if (!canTweet) return;
    await updateTweet(tweet, slugTag, data.content);
    onClose();
  };

  return (
    <>
      {connected ? (
        <div className="px-6 py-4">
          <div className="flex items-center gap-2">
            <h3 className="inline font-semibold" title={tweet.user_display}>
              <Link href="/profile">
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="pt-2"
          >
            {/* <!-- Content field. --> */}
            <TextareaAutosize
              {...register("content", {
                required: true,
                maxLength: LIMIT,
              })}
              id="content"
              rows={1}
              className="mb-3 w-full resize-none text-xl focus:outline-none"
              placeholder="What's happening?"
            />
            <div className="-m-2 flex flex-wrap items-center justify-between">
              {/* <!-- Topic field. --> */}
              <div className="relative m-2 mr-4">
                <input
                  {...register("tag")}
                  onChange={(e) => setTag(e.target.value)}
                  value={slugTag}
                  type="text"
                  placeholder="tag"
                  className="text-primary-500 rounded-full bg-gray-100 py-2 pl-10 pr-4"
                  disabled={!slugTag}
                />
                <div className="absolute inset-y-0 left-0 flex pl-3 pr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={
                      (slugTag ? "text-primary-500 " : "text-gray-400 ") +
                      "m-auto h-5 w-5"
                    }
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="m-2 ml-auto flex items-center space-x-4">
                {/* <!-- Character limit. --> */}
                <div className="text-sm">
                  <span className={characterLimitColor}>{characterLimit}</span>
                  <span>{` / ${LIMIT}`}</span>
                </div>
                {/* <!-- Tweet button. --> */}
                <button
                  onClick={onClose}
                  className="rounded-full px-4 py-2 font-semibold text-gray-900 bg-gray-200"
                >
                  Close
                </button>
                <button
                  disabled={!canTweet}
                  className={
                    (canTweet
                      ? "bg-primary-500 "
                      : "bg-primary-300 cursor-not-allowed ") +
                    "rounded-full px-4 py-2 font-semibold text-white"
                  }
                  type="submit"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="border-b bg-gray-50 px-8 py-4 text-center text-gray-500">
          Connect your wallet to start tweeting...
        </div>
      )}
    </>
  );
}
