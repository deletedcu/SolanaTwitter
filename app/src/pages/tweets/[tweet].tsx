import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TweetCard from "../../components/TweetCard";
import { Tweet as TweetModel } from "../../models";
import Base from "../../templates/Base";
import { AliasProps } from "../api/alias";
import { deleteTweet, getTweet } from "../api/tweets";
import { fetchUsersAlias } from "../api/alias";
import { utils } from "@project-serum/anchor";
import { useWorkspace, notifyLoading, notifyUpdate } from "../../utils";
import { useTheme } from "../../contexts/themeProvider";

export default function Tweet() {
  const router = useRouter();
  const [originTweet, setOriginTweet] = useState<TweetModel | null>(null);
  const [tweet, setTweet] = useState<TweetModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [usersAlias, setUsersAlias] = useState<AliasProps>({});
  const tweetAddress = router.query.tweet as string;

  const { theme } = useTheme();
  const workspace = useWorkspace();

  useEffect(() => {
    if (workspace) {
      fetchUsersAlias(workspace.program, workspace.connection).then((value) =>
        setUsersAlias(value)
      );
    }
  }, [workspace]);

  useEffect(() => {
    if (workspace && tweetAddress) {
      getTweet(workspace.program, new PublicKey(tweetAddress))
        .then((fetchedTweet) => setOriginTweet(fetchedTweet))
        .finally(() => setLoading(false));
    }
  }, [tweetAddress, workspace]);

  useEffect(() => {
    if (!workspace || !originTweet) return;
    let fTweet = originTweet;
    const [aliasPDA, _] = PublicKey.findProgramAddressSync(
      [utils.bytes.utf8.encode("user-alias"), fTweet.user.toBuffer()],
      workspace.program.programId
    );
    if (usersAlias[aliasPDA.toBase58()]) {
      fTweet.user_display = usersAlias[aliasPDA.toBase58()];
    }
    fTweet.comments.map((comment) => {
      const [aPDA, _] = PublicKey.findProgramAddressSync(
        [utils.bytes.utf8.encode("user-alias"), comment.user.toBuffer()],
        workspace.program.programId
      );
      if (usersAlias[aPDA.toBase58()]) {
        comment.user_display = usersAlias[aPDA.toBase58()];
      }
      return comment;
    });
    setTweet(fTweet);
  }, [originTweet, usersAlias, workspace]);

  const onDelete = async (tweet: TweetModel) => {
    if (!workspace) return;
    const toastId = notifyLoading(
      "Transaction in progress. Please wait...",
      theme
    );
    const result = await deleteTweet(
      workspace.program,
      workspace.wallet,
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
