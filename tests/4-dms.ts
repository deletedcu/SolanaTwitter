import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as assert from "assert";
import { program, user } from "../tests";

// Hardcode address(e.g., phantom wallet) to allow testing dms in frontend
const dmRecipient = new PublicKey("CzksPPvjZa5q5pX4rTQVzm6PrWP3A72SD5knhHDEFYJM");

export const sendDm = async (user: any, recipient: PublicKey, content: string) => {
  const dmKeypair = Keypair.generate();

  await program.methods.sendDm(recipient, content)
    .accounts({
      dm: dmKeypair.publicKey,
      user: user.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers(user instanceof (anchor.Wallet as any) ? [dmKeypair] : [user, dmKeypair])
    .rpc();

  const dm = await program.account.dm.fetch(dmKeypair.publicKey);
  return { publickey: dmKeypair.publicKey, account: dm };
}

describe("dms", () => {
  it("can send and update dm", async () => {
    const dm = await sendDm(user, dmRecipient, "Hello, how are you?");
    assert.equal((await program.account.dm.fetch(dm.publickey)).recipient.toBase58(), dmRecipient.toBase58());

    // update dm
    await program.methods.updateDm("Good morning")
      .accounts({ dm: dm.publickey, user: user.publicKey })
      .rpc();
    const updatedDm = await program.account.dm.fetch(dm.publickey);
    assert.equal(updatedDm.content, "Good morning");
    assert.deepEqual(updatedDm.edited, true);
  });

  it("can delete dms", async () => {
    const dm = await sendDm(user, dmRecipient, "Hi, there");
    assert.equal((await program.account.dm.fetch(dm.publickey)).recipient.toBase58(), dmRecipient.toBase58());

    // delete dm
    await program.methods.deleteDm()
      .accounts({ dm: dm.publickey, user: user.publicKey })
      .rpc();
    assert.ok((await program.account.dm.fetchNullable(dm.publickey)) === null)
  });

  it("can fetch and filter dms", async () => {
    const allDms = await program.account.dm.all([
      { memcmp: { offset: 8, bytes: user.publicKey.toBase58() }}
    ]);
    assert.equal(allDms.length, 1);
    assert.ok(allDms.every(dm => dm.account.user.toBase58() === user.publicKey.toBase58()));

    const userDms = await program.account.dm.all([
      // offset: 8 Discriminator + 32 User public key
      { memcmp: { offset: 8 + 32, bytes: dmRecipient.toBase58()}}
    ]);
    assert.equal(userDms.length, 1);
    assert.ok(userDms.every(dm => dm.account.recipient.toBase58() === dmRecipient.toBase58()));
  });
});
