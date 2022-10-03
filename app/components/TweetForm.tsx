import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import TextareaAutosize from "react-autosize-textarea";
import { SubmitHandler, useForm } from "react-hook-form";
import { Tweet } from "../models";
import { sendTweet } from "../pages/api/tweets";
import { useCountCharacterLimit, useSlug } from "../utils";

type FormValues = {
  content: string;
  tag: string;
}

const LIMIT = 280;

export default function TweetForm({
  added,
  forceTag,
}: {
  added: (a: Tweet) => void;
  forceTag?: string;
}) {
  const { register, handleSubmit, watch } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => send(data);

  // Form data
  const [tag, setTag] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const slugTag = useSlug(tag);
  const effectiveTag = forceTag ?? slugTag;

  // Character limit / count-down
  const characterLimit = useCountCharacterLimit(watch("content"), LIMIT);
  let characterLimitColor = "text-gray-400";
  if (LIMIT - characterLimit <= 10) characterLimitColor = "text-yellow-500";
  if (LIMIT - characterLimit < 0) characterLimitColor = "text-red-500";

  // Permissions
  const { connected } = useWallet();
  const canTweet = watch("content") && (LIMIT - characterLimit) > 0;

  // Actions
  const send = async (data: FormValues) => {
    const tweet = await sendTweet(tag, data.content);
    if (tweet) {
      added(tweet);
      setTag("");
      setContent("");
    }
  };

  return (
    <>
      {connected ? (
        <form onSubmit={handleSubmit(onSubmit)} className="border-b px-8 py-4">
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
                value={effectiveTag}
                type="text"
                placeholder="tag"
                className="text-primary-500 rounded-full bg-gray-100 py-2 pl-10 pr-4"
                disabled={!!forceTag}
              />
              <div className="absolute inset-y-0 left-0 flex pl-3 pr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={
                    (effectiveTag ? "text-primary-500 " : "text-gray-400 ") +
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
            <div className="m-2 ml-auto flex items-center space-x-6">
              {/* <!-- Character limit. --> */}
              <div className="text-sm">
                <span className={characterLimitColor}>{characterLimit}</span>
                <span>{` / ${LIMIT}`}</span>
              </div>
              {/* <!-- Tweet button. --> */}
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
                Tweet
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="border-b bg-gray-50 px-8 py-4 text-center text-gray-500">
          Connect your wallet to start tweeting...
        </div>
      )}
    </>
  );
}
