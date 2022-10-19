import { PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { getWorkspace, toCollapse } from "../../utils";

export const createUserAlias = async (alias: string) => {
  const workspace = getWorkspace();
  if (!workspace)
    return { success: false, message: "Connect wallet to create alias..." };
  const { program, wallet } = workspace;

  const [userAliasPDA, _] = await PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode("user-alias"), wallet.publicKey.toBuffer()],
    program.programId
  );

  try {
    await program.methods
      .createUserAlias(alias)
      .accounts({
        user: wallet.publicKey,
        userAlias: userAliasPDA,
      })
      .rpc();

    return {
      success: true,
      message: "Your alias was created successfully!",
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

export const updateUserAlias = async (alias: string) => {
  const workspace = getWorkspace();
  if (!workspace)
    return { success: false, message: "Connect wallet to update alias..." };
  const { program, wallet } = workspace;

  const [userAliasPDA, _] = await PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode("user-alias"), wallet.publicKey.toBuffer()],
    program.programId
  );

  try {
    await program.methods
      .updateUserAlias(alias)
      .accounts({
        user: wallet.publicKey,
        userAlias: userAliasPDA,
      })
      .rpc();

    return {
      success: true,
      message: "Your alias was updated successfully!",
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

export const deleteUserAlias = async () => {
  const workspace = getWorkspace();
  if (!workspace)
    return { success: false, message: "Connect wallet to delete alias" };
  const { program, wallet } = workspace;

  const [userAliasPDA, _] = await PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode("user-alias"), wallet.publicKey.toBuffer()],
    program.programId
  );

  try {
    await program.methods
      .deleteUserAlias()
      .accounts({
        user: wallet.publicKey,
        userAlias: userAliasPDA,
      })
      .rpc();

    return {
      success: true,
      message: "Your alias was deleted successfully!",
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

export const getUserAlias = async (publicKey: PublicKey): Promise<string> => {
  const workspace = getWorkspace();
  if (!workspace) return toCollapse(publicKey);
  const { program } = workspace;

  const [userAliasPDA, _] = await PublicKey.findProgramAddress(
    [anchor.utils.bytes.utf8.encode("user-alias"), publicKey.toBuffer()],
    program.programId
  );

  const account = await program.account.userAlias.fetchNullable(userAliasPDA);
  if (account) {
    return account.alias as string;
  } else {
    return toCollapse(publicKey);
  }
};

export type AliasProps = {
  [key: string]: string;
};

export const fetchUsersAlias = async () => {
  const workspace = getWorkspace();
  if (!workspace) return {};
  const { program, connection } = workspace;

  // Prepare the discriminator filter
  const aliasClient = program.account.userAlias;
  const aliasAccountName = "UserAlias";
  const aliasDiscriminatorFilter = {
    memcmp: aliasClient.coder.accounts.memcmp(aliasAccountName),
  };

  // Prefetch all users alias with alias only
  const data = await connection.getProgramAccounts(program.programId, {
    filters: [aliasDiscriminatorFilter],
    dataSlice: { offset: 8, length: 4 + 50 * 4 },
  });

  const allAliases = data.map(({ pubkey, account }) => {
    const prefix = account.data.subarray(0, 4).readInt8();
    const alias = account.data.subarray(4, 4 + prefix).toString();
    return { pubkey, alias };
  });

  let result: AliasProps = {};
  allAliases.forEach((item) => {
    result[item.pubkey.toBase58()] = item.alias;
  });

  return result;
};
