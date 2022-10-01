import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";
import { Tweet } from "../../models";
import { useWorkspace } from "../../utils";
import { web3 } from "@project-serum/anchor";

export const fetchTweets = async (filters = []) => {
  const workspace = useWorkspace();
  if (!workspace) return [];
  const { program } = workspace;
  const tweets = await program.account.tweet.all(filters);
  return tweets.map((tweet) => new Tweet(tweet.publicKey, tweet.account));
};

export const getTweet = async (publicKey: PublicKey) => {
  const workspace = useWorkspace();
  if (!workspace) return null;
  const { program } = workspace;
  const account = await program.account.tweet.fetch(publicKey);
  return new Tweet(publicKey, account);
};

export const sendTweet = async (tag: string, content: string) => {
  const workspace = useWorkspace();
  if (!workspace) return null;
  const { wallet, program } = workspace;
  const tweet = web3.Keypair.generate();

  await program.methods
    .sendTweet(tag, content)
    .accounts({
      user: wallet.publicKey,
      tweet: tweet.publicKey,
      systemPrgram: web3.SystemProgram.programId,
    })
    .signers([tweet])
    .rpc();

  const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);
  return new Tweet(tweet.publicKey, tweetAccount);
};

export const userFilter = (user: PublicKey) => ({
  memcmp: {
    offset: 8, // discriminator,
    bytes: user.toBase58(),
  },
});

export const tagFilter = (tag: string) => ({
  memcmp: {
    offset:
      8 + // Discriminator.
      32 + // Author public key.
      8 + // Timestamp.
      4, // Topic string prefix.
    bytes: bs58.encode(Buffer.from(tag)),
  },
});
