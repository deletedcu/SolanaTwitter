import { Connection, PublicKey } from "@solana/web3.js";
import {
  Provider,
  AnchorProvider,
  Program,
} from "@project-serum/anchor";
import idl from "../idl/solana_twitter.json";
import { AnchorWallet } from "@solana/wallet-adapter-react";

export interface Workspace {
  wallet: AnchorWallet;
  connection: Connection;
  provider: Provider;
  program: Program;
}

const preflightCommitment = "processed";
const commitment = "processed";
const programId = new PublicKey(idl.metadata.address);
let workspace: Workspace | null = null;

export const useWorkspace = () => workspace;

export const initWorkspace = (wallet: AnchorWallet, connection: Connection) => {
  if (workspace) return;
  const provider: Provider = new AnchorProvider(connection, wallet, {
    preflightCommitment,
    commitment,
  });

  // @ts-ignore
  const program: Program = new Program(idl, programId, provider);

  workspace = {
    wallet,
    connection,
    provider,
    program,
  };
};
