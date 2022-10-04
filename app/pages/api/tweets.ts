import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";
import { TagType, Tweet, UserType } from "../../models";
import { sleep, useWorkspace } from "../../utils";
import { web3 } from "@project-serum/anchor";
import { usePagination } from "../../utils/usePagination";

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

export const paginateTweets = (
  filters: any[] = [],
  perPage = 10,
  onNewPage = (a: Tweet[], b: boolean) => {}
) => {
  const workspace = useWorkspace();
  if (!workspace) return;
  const { program, connection } = workspace;
  let page = 0;

  const prefetchCb = async () => {
    // Reset page number
    page = 0;

    // Prepare the discriminator filter
    const tweetClient = program.account.tweet;
    const tweetAccountName = "Tweet";
    const tweetDiscriminatorFilter = {
      memcmp: tweetClient.coder.accounts.memcmp(tweetAccountName),
    };

    // Prefetch all tweets with their timestamps only
    const allTweets = await connection.getProgramAccounts(program.programId, {
      filters: [tweetDiscriminatorFilter, ...filters],
      dataSlice: { offset: 40, length: 8 },
    });

    // Parse the timestamp from the account's data
    const allTweetsWithTimestamps = allTweets.map(({ account, pubkey }) => ({
      pubkey,
      timestamp: account.data.readInt32LE(),
    }));

    return allTweetsWithTimestamps
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(({ pubkey }) => pubkey);
  };

  const pageCb = async (page: number, paginatedPublicKeys: PublicKey[]) => {
    const tweets = await program.account.tweet.fetchMultiple(
      paginatedPublicKeys
    );

    return tweets
      .map((tweet, index) => new Tweet(paginatedPublicKeys[index], tweet))
      .filter((tweet) => tweet.tag !== "[deleted]");
  };

  const pagination = usePagination(perPage, prefetchCb, pageCb);
  const { hasPage, getPage } = pagination;

  const getNextPage = async () => {
    const newPageTweets = await getPage(page + 1);
    page += 1;
    const hasNextPage = hasPage(page + 1);
    onNewPage(newPageTweets, hasNextPage);
  };

  return { page, getNextPage, ...pagination };
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

    sleep(1000);
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
  const { program, connection } = workspace;

  // Prepare the discriminator filter
  const tweetClient = program.account.tweet;
  const tweetAccountName = "Tweet";
  const tweetDiscriminatorFilter = {
    memcmp: tweetClient.coder.accounts.memcmp(tweetAccountName),
  };

  // Prefetch all tweets with their tags only
  const allTweets = await connection.getProgramAccounts(program.programId, {
    filters: [tweetDiscriminatorFilter],
    dataSlice: { offset: 8 + 32 + 8, length: 4 + 50 * 4 },
  });

  const allTags = allTweets.map(({ account }) => {
    const prefix = account.data.subarray(0, 4).readInt8();
    const tag = account.data.subarray(4, 4 + prefix).toString();
    return tag;
  });

  type tagProps = {
    [key: string]: number;
  };

  const tags = allTags.reduce((acc: tagProps, tag: string) => {
    if (tag !== "[deleted]") {
      if (acc[tag]) {
        acc[tag] += 1;
      } else {
        acc[tag] = 1;
      }
    }
    return acc;
  }, {});

  const orderedTags: TagType[] = Object.entries(tags)
    .map((k) => ({ tag: k[0], count: k[1] }))
    .sort((a, b) => b.count - a.count);

  return orderedTags;
};

export const fetchUsers = async () => {
  const workspace = useWorkspace();
  if (!workspace) return [];
  const { program, connection } = workspace;

  // Prepare the discriminator filter
  const tweetClient = program.account.tweet;
  const tweetAccountName = "Tweet";
  const tweetDiscriminatorFilter = {
    memcmp: tweetClient.coder.accounts.memcmp(tweetAccountName),
  };

  // Prefetch all tweets with their user + timestamp + tag only
  const allTweets = await connection.getProgramAccounts(program.programId, {
    filters: [tweetDiscriminatorFilter],
    dataSlice: { offset: 8, length: 32 + 8 + 4 + 50 * 4 },
  });

  const tweetMap = allTweets.map(({ pubkey, account }) => {
    const user = new PublicKey(account.data.subarray(0, 32));
    const timestamp = account.data.subarray(32, 32 + 8).readInt32LE();
    const prefix = account.data.subarray(40, 40 + 4).readInt8();
    const tag = account.data.subarray(44, 44 + prefix).toString();
    return new UserType(user, pubkey, tag, timestamp, 0);
  });

  type accType = {
    [key: string]: UserType;
  };

  const users = tweetMap.reduce((acc: accType, item: UserType) => {
    if (item.last_tag !== "[deleted]") {
      const userKey = item.user.toBase58();
      if (acc[userKey]) {
        acc[userKey].total_posts += 1;
        if (item.last_timestamp > acc[userKey].last_timestamp) {
          acc[userKey].tweet = item.tweet;
          acc[userKey].last_timestamp = item.last_timestamp;
          acc[userKey].last_tag = item.last_tag;
        }
      } else {
        acc[userKey] = new UserType(
          item.user,
          item.tweet,
          item.last_tag,
          item.last_timestamp,
          1
        );
      }
    }
    return acc;
  }, {});

  const orderedUsers = Object.values(users).sort(
    (a, b) => b.total_posts - a.total_posts
  );
  return orderedUsers;
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
