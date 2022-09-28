import * as anchor from "@project-serum/anchor";
import { Keypair } from "@solana/web3.js";
import * as assert from "assert";
import * as bs58 from "bs58";
import { program, user, createUser } from "../tests";

// Falling back to `user`: any, as the types of a generated users keypair(wallet) and 
// `provider.wallet` - which is used as the default user in the scope of this test - differ.
export const sendTweet = async (user: any, tag: string, content: string) => {
  const tweetKeypair = Keypair.generate();
  await program.methods.sendTweet(tag, content)
    .accounts({
      tweet: tweetKeypair.publicKey,
      user: user.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers(user instanceof (anchor.Wallet) ? [tweetKeypair] : [user, tweetKeypair])
    .rpc();

  // Fetch the created tweet
  const tweet = await program.account.tweet.fetch(tweetKeypair.publicKey);
  return { publickey: tweetKeypair.publicKey, account: tweet };
}

describe("tweets", () => {
  it("can send and update tweet", async () => {
    // send tweet #1
    const tweet = await sendTweet(user, "veganism", "Hummus, am I right?");;
    
    // Ensure it has the right data.
    assert.equal(tweet.account.user.toBase58(), user.publicKey.toBase58());
    assert.equal(tweet.account.tag, "veganism");
    assert.equal(tweet.account.content, "Hummus, am I right?");
    assert.ok(tweet.account.timestamp);

    const otherUser = await createUser();

    // send tweet #2
    const tweetTwo = await sendTweet(otherUser, "veganism", "Yay, Tofu!");
    assert.equal(tweetTwo.account.user.toBase58(), otherUser.publicKey.toBase58());
    assert.equal(tweetTwo.account.tag, "veganism");
    assert.equal(tweetTwo.account.content, "Yay, Tofu!");
    assert.ok(tweetTwo.account.timestamp);

    // update tweet #2
    await program.methods.updateTweet("banana", "Hello world!")
      .accounts({
        tweet: tweetTwo.publickey,
        user: otherUser.publicKey,
      })
      .signers([otherUser])
      .rpc();

    // Fetch updated tweets state to check if it has the right data
    const updatedTweet = await program.account.tweet.fetch(tweetTwo.publickey);
    assert.equal(updatedTweet.tag, "banana");
    assert.equal(updatedTweet.content, "Hello world!");
    assert.deepEqual(updatedTweet.state, { edited: {} });
  });

  it("can send a new tweet without tag", async () => {
    // send tweet #3 (#2 by userOne)
    const tweet = await sendTweet(user, "", "gm");
    // Ensure it has the right data.
    assert.equal(tweet.account.user.toBase58(), user.publicKey.toBase58());
    assert.equal(tweet.account.tag, "[untagged]");
    assert.equal(tweet.account.content, "gm");
    assert.ok(tweet.account.timestamp);
  });

  it("cannot send a new tweet without content", async () => {
    try {
      await sendTweet(user, "gm", "");
    } catch (err) {
      assert.equal(err.error.errorCode.code, "NoContent");
    }
  });

  it("cannot send a tweet with a tag > 50 or content > 280 characters", async () => {
    try {
      const tag51Chars = "x".repeat(51);
      await sendTweet(user, tag51Chars, "takes over!");
    } catch (err) {
      assert.equal(err.error.errorCode.code, "TooLong");
    }

    try {
      const content281Chars = "x".repeat(281);
      await sendTweet(user, "gm", content281Chars);
    } catch (err) {
      assert.equal(err.error.errorCode.code, "TooLong");
    }
  });

  it("cannot update tweet without changes", async () => {
    // send tweet #4 (#3 by userOne)
    const tweet = await sendTweet(user, "web3", "takes over!");
    assert.equal(tweet.account.tag, "web3");
    assert.equal(tweet.account.content, "takes over!");
    assert.equal(tweet.account.state, null);

    // Try to update tweet with same tag and content
    try {
      await program.methods.updateTweet("web3", "takes over!")
        .accounts({
          tweet: tweet.publickey,
          user: user.publicKey
        })
        .rpc();
    } catch (err) {
      assert.equal(err.error.errorCode.code, "NothingChanged");
      return;
    }

    assert.fail("The instruction should have failed with a tweet without changes.");
  });

  it("can delete own tweets", async () => {
    // send tweet #5 (#4 by userOne)
    const tweetToDelete = await sendTweet(user, "gm", "Can I delete this?");

    await program.methods.deleteTweet()
      .accounts({ tweet: tweetToDelete.publickey, user: user.publicKey })
      .rpc();
    const deletedTweet = await program.account.tweet.fetch(tweetToDelete.publickey);
    assert.equal(deletedTweet.tag, "[deleted]");
    assert.equal(deletedTweet.content, "");

    // Try to delete other user's tweet
    const otherUser = await createUser();
    // send tweet #6 (#2 by userTwo)
    const tweet = await sendTweet(otherUser, "gm", "solana");
    try {
      await program.methods.deleteTweet()
        .accounts({ tweet: tweet.publickey, user: user.publicKey })
        .rpc();
      assert.fail("We shouldn't be able to delete someone else's tweet but did.");
    } catch (err) {
      // Check if tweet account still exists with the right data
      const tweetState = await program.account.tweet.fetch(tweet.publickey);
      assert.equal(tweetState.tag, "gm");
      assert.equal(tweetState.content, "solana");
    }
  });

  it("can fetch and filter tweets", async () => {
    const allTweets = await program.account.tweet.all();
    assert.equal(allTweets.length, 6);

    const userTweets = await program.account.tweet.all([
      // offset: 8 Discriminator
      { memcmp: { offset: 8, bytes: user.publicKey.toBase58() } }
    ]);
    // check if the fetched amount of tweets is equal to those the user sent
    assert.equal(userTweets.length, 4);
    assert.ok(userTweets.every(tweet => tweet.account.user.toBase58() === user.publicKey.toBase58()));

    const tagTweets = await program.account.tweet.all([
      // offset: 8 Deiscriminator + 32 user public key + 8 timestamp + 4 tag string prefix
      { memcmp: { offset: 8 + 32 + 8 + 4, bytes: bs58.encode(Buffer.from("veganism")) } }
    ]);
    assert.equal(tagTweets.length, 1);
    assert.ok(tagTweets.every(tweet => tweet.account.tag === "veganism"));
  });
});
