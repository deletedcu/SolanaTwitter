import Link from "next/link";
import { useState } from "react";
import { SuperEllipseImg } from "react-superellipse";
import { Tweet } from "../models";
import { Comment } from "../models/Comment";
import { useWorkspace } from "../utils";
import CommentCard from "./CommentCard";
import CommentForm from "./CommentForm";
import TweetFormUpdate from "./TweetFormUpdate";

export default function TweetCard({
  tweet,
  onDelete,
}: {
  tweet: Tweet;
  onDelete: (t: Tweet) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCommentEditing, setIsCommentEditing] = useState(false);

  // @ts-ignore
  const { wallet } = useWorkspace();
  const userRoute =
    wallet && wallet.publicKey.toBase58() === tweet.user.toBase58()
      ? "/profile"
      : `/users/${tweet.user.toBase58()}`;
  const isOwner: boolean =
    wallet && wallet.publicKey.toBase58() === tweet.user.toBase58();

  const addComment = (comment: Comment) => {
    tweet.comments = [comment, ...tweet.comments];
  };

  return (
    <>
      {isEditing ? (
        <TweetFormUpdate onClose={() => setIsEditing(false)} tweet={tweet} />
      ) : (
        <div className="px-8 pt-4">
          <div className="flex items-center gap-2">
            <div className="mr-2">
              <Link href={userRoute}>
                <a>
                  <SuperEllipseImg
                    width={36}
                    height={36}
                    href={`https://avatars.dicebear.com/api/jdenticon/${tweet.user.toBase58()}.svg`}
                    r1={0.1}
                    r2={0.3}
                    strokeColor="rgba(156, 163, 175, 0.3)"
                    strokeWidth={1}
                  />
                </a>
              </Link>
            </div>
            <h3 className="inline font-semibold text-color-primary" title={tweet.user_display}>
              <Link href={userRoute}>
                <a className="hover:underline">{tweet.user_display}</a>
              </Link>
            </h3>
            <span className="text-color-secondary">•</span>
            <time className="text-sm text-color-secondary" title={tweet.created_at}>
              <Link href={`/tweets/${tweet.key}`}>
                <a className="hover:underline">{tweet.created_ago}</a>
              </Link>
            </time>
            {tweet.state && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                role="img"
                className="h-4 w-4 p-0.5 text-color-third iconify iconify--heroicons-outline"
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
            )}
          </div>
          <div className="ml-12 border-b border-skin-primary pb-4">
            <div className="flex flex-col py-4 px-8 border border-skin-primary rounded-lg bg-fill-secondary">
              <p className="whitespace-pre-wrap text-color-secondary">{tweet.content}</p>
              <div className="flex">
                {tweet.tag && tweet.tag !== "[untagged]" && (
                  <Link href={`/tags/${tweet.tag}`}>
                    <a className="text-primary-500 inline-block mt-2 hover:underline">
                      {`#${tweet.tag}`}
                    </a>
                  </Link>
                )}
                <div className="flex items-center space-x-1 ml-auto">
                  {isOwner && (
                    <button
                      onClick={() => onDelete(tweet)}
                      title="Delete tweet"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="h-6 w-6 p-1 text-color-third hover:text-primary-600 iconify iconify--heroicons-outline"
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
                    <button
                      title="Update tweet"
                      onClick={() => setIsEditing(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        role="img"
                        className="h-6 w-6 p-1 text-color-third hover:text-primary-600 iconify iconify--heroicons-outline"
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
                  <button
                    title="Add Comment"
                    onClick={() => setIsCommentEditing(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 p-1 text-color-third hover:text-primary-600 iconify iconify--heroicons-outline"
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
                        d="M17 8h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v4l-4-4H9a1.994 1.994 0 0 1-1.414-.586m0 0L11 14h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2v4l.586-.586Z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
              {isCommentEditing && (
                <CommentForm
                  tweet={tweet.publickey}
                  onClose={() => setIsCommentEditing(false)}
                  added={addComment}
                />
              )}
              {tweet.comments.length > 0 &&
                tweet.comments.map((comment, i) => (
                    <CommentCard key={i} comment={comment} />
                  ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
