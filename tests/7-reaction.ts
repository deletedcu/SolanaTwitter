import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import * as assert from "assert";
import { program, user } from "../tests";
import { sendTweet } from "./1-tweets";

describe("reactions", () => {
  it("can react on tweets and update and delete reaction", async () => {
    const tweet = await sendTweet(user, "linux", "Don't forget about the GNU 🦬");

    const [reactionPDA, bump] = await PublicKey.findProgramAddress([
      anchor.utils.bytes.utf8.encode("reaction"),
      user.publicKey.toBuffer(),
    ], program.programId);

    // react on tweet
    await program.methods.react(tweet.publickey, "🚀", bump)
      .accounts({ user: user.publicKey, reaction: reactionPDA })
      .rpc();

    const reaction = await program.account.reaction.fetch(reactionPDA);
    assert.equal(reaction.tweet.toBase58(), tweet.publickey.toBase58());
    assert.deepEqual(reaction.reactionChar, { rocket: {} });

    // update reaction
    await program.methods.updateReaction("👀")
      .accounts({ user: user.publicKey, reaction: reactionPDA })
      .rpc();
    const updatedReaction = await program.account.reaction.fetch(reactionPDA);
    assert.deepEqual(updatedReaction.reactionChar, { eye: {} });

    // delete reaction
    await program.methods.deleteReaction()
      .accounts({ user: user.publicKey, reaction: reactionPDA })
      .rpc();
    assert.ok((await program.account.reaction.fetchNullable(reactionPDA)) === null);
  });

  it("cannot send other than predefined reactions", async () => {
    const tweet = await sendTweet(user, "linux", "Don't forget about the GNU 🦬");

    const [reactionPDA, bump] = await PublicKey.findProgramAddress([
      anchor.utils.bytes.utf8.encode("reaction"),
      user.publicKey.toBuffer(),
    ], program.programId);

    try {
      await program.methods.react(tweet.publickey, "💩", bump)
        .accounts({ user: user.publicKey, reaction: reactionPDA })
        .rpc();
    } catch (err) {
      assert.equal(err.error.errorCode.code, "UnallowedChars");
    }
  });
});
