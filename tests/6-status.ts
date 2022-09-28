import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as assert from "assert";
import { program, user } from "../tests";

describe("status", () => {
  it("cannot set status message > 50", async () => {
    const [statusPDA, _] = await PublicKey.findProgramAddress([
      anchor.utils.bytes.utf8.encode("status"),
      user.publicKey.toBuffer(),
    ], program.programId);

    try {
      await program.methods.createStatus("x".repeat(51))
        .accounts({ user: user.publicKey, status: statusPDA })
        .rpc();
    } catch (err) {
      assert.equal(err.error.errorCode.code, "TooLong");
    }
  });

  it("can create and update status message", async () => {
    const [statusPDA, _] = await PublicKey.findProgramAddress([
      anchor.utils.bytes.utf8.encode("status"),
      user.publicKey.toBuffer(),
    ], program.programId);

    await program.methods.createStatus("Focusing")
      .accounts({ user: user.publicKey, status: statusPDA })
      .rpc();
    assert.equal((await program.account.status.fetch(statusPDA)).message, "Focusing");

    await program.methods.updateStatus("Celebrating")
      .accounts({ user: user.publicKey, status: statusPDA })
      .rpc();
    assert.equal((await program.account.status.fetch(statusPDA)).message, "Celebrating");
  });

  it("can delete status message", async () => {
    const [statusPDA, _] = await PublicKey.findProgramAddress([
      anchor.utils.bytes.utf8.encode("status"),
      user.publicKey.toBuffer(),
    ], program.programId);

    await program.methods.deleteStatus()
      .accounts({ user: user.publicKey, status: statusPDA })
      .rpc();
    assert.ok((await program.account.status.fetchNullable(statusPDA)) === null);
  });
});
