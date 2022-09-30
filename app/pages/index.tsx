import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import type { NextPage } from "next";
import Head from "next/head";
import Base from "../templates/Base";
import { initWorkspace } from "../utils";

const Home: NextPage = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  initWorkspace(wallet, connection);

  return (
    <>
      <Head>
        <title>Solana Twitter</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Base></Base>
    </>
  );
};

export default Home;
