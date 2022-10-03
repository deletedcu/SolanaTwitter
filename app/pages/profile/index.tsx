import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import TweetForm from "../../components/TweetForm";
import TweetList from "../../components/TweetList";
import { Tweet } from "../../models";
import Base from "../../templates/Base";
import { fetchTweets, userFilter } from "../api/tweets";

export default function Profile() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  const wallet = useAnchorWallet();

  const addTweet = (tweet: Tweet) => setTweets([tweet, ...tweets]);

  useEffect(() => {
    if (!wallet) return;
    fetchTweets([userFilter(wallet.publicKey.toBase58())])
      .then((fetchedTweets) => setTweets(fetchedTweets))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Base>
      {wallet && (
        <div className="border-b bg-gray-50 px-8 py-4">
          {wallet.publicKey.toBase58()}
        </div>
      )}
      <TweetForm added={addTweet} />
      <TweetList tweets={tweets} loading={loading} />
    </Base>
  );
}
