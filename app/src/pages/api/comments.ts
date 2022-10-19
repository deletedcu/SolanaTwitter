import { web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { Comment } from "../../models/Comment";
import { getWorkspace, sleep, toCollapse } from "../../utils";
import { getUserAlias } from "./alias";

export const sendComment = async (tweet: PublicKey, content: string) => {
  const workspace = getWorkspace();
  if (!workspace) {
    return {
      comment: null,
      message: "Connect wallet to send comment...",
    };
  }
  const { program, wallet } = workspace;
  const comment = web3.Keypair.generate();

  try {
    await program.methods
      .sendComment(tweet, content, null)
      .accounts({
        comment: comment.publicKey,
        user: wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([comment])
      .rpc();

    sleep(2000);
    const commentAccount = await program.account.comment.fetch(
      comment.publicKey
    );
    const alias = await getUserAlias(commentAccount.user as PublicKey);
    return {
      comment: new Comment(comment.publicKey, commentAccount, alias),
      message: "Your comment was sent successfully!",
    };
  } catch (err) {
    console.error(err);
    return {
      comment: null,
      // @ts-ignore
      message: err.toString(),
    };
  }
};

export const updateComment = async (commentKey: PublicKey, content: string) => {
  const workspace = getWorkspace();
  if (!workspace)
    return { success: false, message: "Connect wallet to update comment..." };
  const { program, wallet } = workspace;

  try {
    await program.methods
      .updateComment(content)
      .accounts({
        comment: commentKey,
        user: wallet.publicKey,
      })
      .rpc();

    return {
      success: true,
      message: "Your comment was updated successfully!",
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      // @ts-ignore
      message: err.toString(),
    };
  }
};

export const deleteComment = async (commentKey: PublicKey) => {
  const workspace = getWorkspace();
  if (!workspace)
    return { success: false, message: "Connect wallet to delete comment..." };
  const { program, wallet } = workspace;

  try {
    await program.methods
      .deleteComment()
      .accounts({
        comment: commentKey,
        user: wallet.publicKey,
      })
      .rpc();

    return { success: true, message: "Your comment was deleted successfully!" };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      // @ts-ignore
      message: err.toString(),
    };
  }
};

export const fetchComments = async (filters: any[]) => {
  const workspace = getWorkspace();
  if (!workspace) return [];
  const { program } = workspace;

  const comments = await program.account.comment.all(filters);
  const allComments = comments.map((comment) => {
    const alias = toCollapse(comment.account.user as PublicKey);
    return new Comment(comment.publicKey, comment.account, alias);
  });

  return allComments.sort((a, b) => b.timestamp - a.timestamp);

  // type commentProps = {
  //   [key: string]: [Comment];
  // };

  // const result = allComments.reduce((acc: commentProps, item: Comment) => {
  //   if (acc[item.key]) {
  //     acc[item.key].push(item);
  //   } else {
  //     acc[item.key] = [item];
  //   }
  //   return acc;
  // }, {});

  // return result;
};

export const commentTweetFilter = (tweetKey: string) => ({
  memcmp: {
    offset: 8 + 32, // discriminator(8) + user(32),
    bytes: tweetKey,
  },
});
