import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import TextareaAutosize from "react-autosize-textarea";
import { SubmitHandler, useForm } from "react-hook-form";
import { CONTENT_LIMIT, TAG_LIMIT } from "../constants";
import { useCountCharacterLimit } from "../hooks/useCountCharacterLimit";
import { useSlug } from "../hooks/useSlug";
import useTweets from "../hooks/useTweets";

type FormValues = {
  content: string;
  tag: string;
};

export default function TweetForm({ forceTag }: { forceTag?: string }) {
  const { sendTweet } = useTweets();
  const { connected } = useWallet();
  const { register, resetField, handleSubmit, watch } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) => send(data);

  // Form data
  const [tag, setTag] = useState<string>("");
  const slugTag = useSlug(tag);
  const effectiveTag = forceTag ?? slugTag;

  // Character limit / count-down
  const characterLimit = useCountCharacterLimit(watch("content"));
  let characterLimitColor = "text-color-third";
  if (CONTENT_LIMIT - characterLimit <= 10)
    characterLimitColor = "text-yellow-500";
  if (CONTENT_LIMIT - characterLimit < 0) characterLimitColor = "text-red-500";

  // Permissions
  const canTweet = watch("content") && CONTENT_LIMIT - characterLimit > 0;

  // Actions
  const send = async (data: FormValues) => {
    if (!canTweet) return;
    const result = await sendTweet(effectiveTag, data.content);

    if (result) {
      resetField("content");
      setTag("");
    }
  };

  return (
    <>
      {connected ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-b border-skin-primary px-8 py-4"
        >
          {/* <!-- Content field. --> */}
          <TextareaAutosize
            {...register("content", {
              required: true,
              maxLength: CONTENT_LIMIT,
            })}
            id="content"
            rows={1}
            className="mb-3 w-full resize-none text-xl focus:outline-none text-color-secondary bg-transparent"
            placeholder="What's happening?"
          />
          <div className="-m-2 flex flex-wrap items-center justify-between">
            {/* <!-- Topic field. --> */}
            <div className="relative m-2 mr-4">
              <input
                {...register("tag", { maxLength: TAG_LIMIT })}
                onChange={(e) => setTag(e.target.value)}
                value={effectiveTag}
                type="text"
                placeholder="tag"
                className="text-primary-500 rounded-full bg-fill-secondary focus:focus-input py-2 pl-10 pr-4"
                disabled={!!forceTag}
                autoComplete="off"
              />
              <div className="absolute inset-y-0 left-0 flex pl-3 pr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={
                    (effectiveTag ? "text-primary-500 " : "text-color-third ") +
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
                <span className="text-color-secondary">{` / ${CONTENT_LIMIT}`}</span>
              </div>
              {/* <!-- Tweet button. --> */}
              <button
                disabled={!canTweet}
                className={
                  (canTweet
                    ? "bg-primary-500 "
                    : "bg-primary-300/80 cursor-not-allowed ") +
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
        <div className="border-b border-skin-primary bg-curent px-8 py-4 text-center text-color-secondary">
          Connect your wallet to start tweeting...
        </div>
      )}
    </>
  );
}
