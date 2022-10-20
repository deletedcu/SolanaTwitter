import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TweetCard from "../../components/TweetCard";
import { Tweet as TweetModel } from "../../models";
import Base from "../../templates/Base";
import { deleteTweet, getTweet } from "../api/tweets";
import { notifyLoading, notifyUpdate } from "../../utils";
import useWorkspace from "../../hooks/useWorkspace";
import useTheme from "../../hooks/useTheme";

export default function Tweet() {
  const router = useRouter();
  const [tweet, setTweet] = useState<TweetModel | null>(null);
  const [loading, setLoading] = useState(true);
  const tweetAddress = router.query.tweet as string;

  const { theme } = useTheme();
  const workspace = useWorkspace();

  useEffect(() => {
    if (workspace && tweetAddress) {
      getTweet(
        workspace.program,
        workspace.connection,
        new PublicKey(tweetAddress)
      )
        .then((fetchedTweet) => setTweet(fetchedTweet))
        .finally(() => setLoading(false));
    }
  }, [tweetAddress, workspace]);

  const onDelete = async (tweet: TweetModel) => {
    if (!workspace) return;
    const toastId = notifyLoading(
      "Transaction in progress. Please wait...",
      theme
    );
    const result = await deleteTweet(
      workspace,
      tweet
    );
    notifyUpdate(toastId, result.message, result.success ? "success" : "error");
    if (result.success) {
      setTweet(null);
    }
  };

  return (
    <Base>
      <div className="flex w-full">
        <div className="mr-16 grow">
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-skin-primary">
            <h2 className="-mb-px flex border-b-2 border-primary-500 pb-2.5 font-semibold leading-6 text-color-primary">
              Tweet Details
            </h2>
          </div>
          <div className="pt-4">
            {loading ? (
              <div className="text-center text-color-third">Loading...</div>
            ) : (
              <>
                {tweet ? (
                  <TweetCard tweet={tweet} onDelete={onDelete} />
                ) : (
                  <div className="text-center text-color-third">
                    Tweet not found
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Base>
  );
}
