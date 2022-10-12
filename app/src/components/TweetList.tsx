import { utils } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { Tweet } from "../models";
import { AliasProps, fetchUsersAlias } from "../pages/api/alias";
import { deleteTweet } from "../pages/api/tweets";
import { getWorkspace } from "../utils";
import TweetCard from "./TweetCard";

interface TweetListProps {
  tweets: Tweet[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export default function TweetList(props: TweetListProps) {
  const { tweets, loading, hasMore, loadMore } = props;
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);
  const [usersAlias, setUsersAlias] = useState<AliasProps>({});
  const workspace = getWorkspace();

  useEffect(() => {
    fetchUsersAlias().then((value) => setUsersAlias(value));
  }, []);

  useEffect(() => {
    if (workspace) {
      const fTweets = tweets.map((tweet) => {
        const [aliasPDA, _] = PublicKey.findProgramAddressSync(
          [utils.bytes.utf8.encode("user-alias"), tweet.user.toBuffer()],
          workspace.program.programId
        );
        if (usersAlias[aliasPDA.toBase58()]) {
          tweet.user_display = usersAlias[aliasPDA.toBase58()];
        }

        tweet.comments.map((comment) => {
          const [aPDA, _] = PublicKey.findProgramAddressSync(
            [utils.bytes.utf8.encode("user-alias"), comment.user.toBuffer()],
            workspace.program.programId
          );
          if (usersAlias[aPDA.toBase58()]) {
            comment.user_display = usersAlias[aPDA.toBase58()];
          }
          return comment;
        });

        return tweet;
      });
      setFilteredTweets(fTweets);
    }
  }, [tweets, usersAlias, workspace]);

  const onDelete = async (tweet: Tweet) => {
    const result = await deleteTweet(tweet);
    if (result) {
      const fTweets = filteredTweets.filter(
        (t) => t.publickey.toBase58() !== tweet.publickey.toBase58()
      );
      setFilteredTweets(fTweets);
    }
  };

  return (
    <>
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading...</div>
      ) : (
        <div className="items">
          {filteredTweets.map((tweet, i) => (
            <TweetCard key={i} tweet={tweet} onDelete={onDelete} />
          ))}
          {hasMore && (
            <div className="m-4 text-center">
              <button
                onClick={loadMore}
                className="px-4 py-2 rounded-full border bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
