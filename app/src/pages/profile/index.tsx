import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";
import TweetForm from "../../components/TweetForm";
import TweetList from "../../components/TweetList";
import useTweets from "../../hooks/useTweets";
import Base from "../../templates/Base";
import { userFilter } from "../api/tweets";

export default function Profile() {
  const { tweets, loading, hasMore, loadMore, setFilters } = useTweets();
  const wallet = useAnchorWallet();

  useEffect(() => {
    if (wallet) {
      const filters = [userFilter(wallet.publicKey.toBase58())];
      setFilters(filters);
    }
  }, [setFilters, wallet]);

  return (
    <Base>
      <div className="flex w-full">
        <div className="mr-16 grow" style={{ position: "relative" }}>
          <div className="mb-8 flex space-x-6 whitespace-nowrap border-b border-skin-primary">
            <h2 className="-mb-px flex border-b-2 border-sky-500 pb-2.5 font-semibold leading-6 text-color-primary">
              Your tweets
            </h2>
          </div>
          <TweetForm />
          <TweetList
            tweets={tweets}
            loading={loading}
            hasMore={hasMore}
            loadMore={loadMore}
          />
        </div>
        <div className="relative mb-8 w-72"></div>
      </div>
    </Base>
  );
}
