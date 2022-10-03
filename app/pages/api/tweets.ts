import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";
import { TagType, Tweet, UserType } from "../../models";
import { useWorkspace } from "../../utils";
import { web3 } from "@project-serum/anchor";

type TagOriginalType = {
  [key: string]: TagType;
};

type UserOriginalType = {
  [key: string]: UserType;
};

export const fetchTweets = async (filters: any[] = []) => {
  const workspace = useWorkspace();
  if (!workspace) return [];
  const { program } = workspace;
  const tweets = await program.account.tweet.all(filters);
  const orderedTweets = tweets
    .map((tweet) => new Tweet(tweet.publicKey, tweet.account))
    .filter((tweet) => tweet.tag !== "[deleted]")
    .sort((a, b) => b.timestamp - a.timestamp);
  return orderedTweets;
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
  if (!workspace) return;

  const { wallet, program } = workspace;
  const tweet = web3.Keypair.generate();

  try {
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
  } catch (err) {
    console.error(err);
    return;
  }
};

export const updateTweet = async (
  tweet: Tweet,
  tag: string,
  content: string
) => {
  const workspace = useWorkspace();
  if (!workspace) return;
  const { wallet, program } = workspace;

  try {
    await program.methods
      .updateTweet(tag, content)
      .accounts({
        tweet: tweet.publickey,
        user: wallet.publicKey,
      })
      .rpc();

    tweet.tag = tag;
    tweet.content = content;
  } catch (err) {
    console.error(err);
    return;
  }
};

export const deleteTweet = async (tweet: Tweet) => {
  const workspace = useWorkspace();
  if (!workspace) return false;
  const { wallet, program } = workspace;

  try {
    await program.methods
      .deleteTweet()
      .accounts({
        tweet: tweet.publickey,
        user: wallet.publicKey,
      })
      .rpc();
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const fetchTags = async () => {
  const workspace = useWorkspace();
  if (!workspace) return [];
  const { program } = workspace;
  const tweets = await program.account.tweet.all();
  let tags: TagOriginalType = {};
  tweets.forEach((data) => {
    const tweet = new Tweet(data.publicKey, data.account);
    if (Object.keys(tags).includes(tweet.tag)) {
      tags[tweet.tag].count += 1;
    } else {
      tags[tweet.tag] = new TagType(tweet.tag, 1);
    }
  });

  const orderedTags: TagType[] = Object.values(tags)
    .slice()
    .sort((a, b) => b.count - a.count)
    .filter((tag) => tag.tag !== "[deleted]");

  return orderedTags;
};

export const fetchUsers = async () => {
  const workspace = useWorkspace();
  if (!workspace) return [];
  const { program } = workspace;
  const tweets = await program.account.tweet.all();

  let users: UserOriginalType = {};
  tweets.forEach((data) => {
    const tweet = new Tweet(data.publicKey, data.account);
    if (tweet.tag !== "[deleted]") {
      if (Object.keys(users).includes(tweet.user.toBase58())) {
        users[tweet.user.toBase58()].total_posts += 1;
        if (tweet.timestamp > users[tweet.user.toBase58()].last_timestamp) {
          users[tweet.user.toBase58()].last_timestamp = tweet.timestamp;
          users[tweet.user.toBase58()].last_tag = tweet.tag;
        }
      } else {
        users[tweet.user.toBase58()] = new UserType(
          tweet.user,
          tweet.publickey,
          tweet.tag,
          tweet.timestamp,
          1
        );
      }
    }
  });

  return Object.values(users);
};

export const userFilter = (userBase58PublicKey: string) => ({
  memcmp: {
    offset: 8, // discriminator,
    bytes: userBase58PublicKey,
  },
});

export const tagFilter = (tag: string) => ({
  memcmp: {
    offset:
      8 + // Discriminator.
      32 + // User public key.
      8 + // Timestamp.
      4, // Tag string prefix.
    bytes: bs58.encode(Buffer.from(tag)),
  },
});
