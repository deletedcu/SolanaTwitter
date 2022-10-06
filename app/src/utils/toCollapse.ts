import { PublicKey } from "@solana/web3.js";

export const toCollapse = (publicKey: PublicKey) => {
  const key = publicKey.toBase58();
  return key.slice(0, 4) + ".." + key.slice(-4);
};
