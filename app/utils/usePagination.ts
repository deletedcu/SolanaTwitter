import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { Tweet } from "../models";

export const usePagination = (
  perPage: number,
  prefetchCb: () => Promise<PublicKey[]>,
  pageCb: (page: number, pubkeys: PublicKey[]) => Promise<Tweet[]>
) => {
  const [allPublicKeys, setAllPublicKeys] = useState<PublicKey[]>([]);
  const [prefetchLoading, setPrefetchLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const loading = prefetchLoading || pageLoading;
  let prefetchPromise: Promise<void>;

  const prefetch = () => {
    prefetchPromise = (async () => {
      try {
        setPrefetchLoading(true);
        const allKeys = await prefetchCb();
        setAllPublicKeys(allKeys);
      } finally {
        setPrefetchLoading(false);
      }
    })();

    return prefetchPromise;
  };

  const getPagePublicKeys = (page: number) => {
    return allPublicKeys.slice((page - 1) * perPage, page * perPage);
  };

  const hasPage = (page: number) => {
    return getPagePublicKeys(page).length > 0;
  };

  const getPage = async (page: number) => {
    await prefetchPromise;
    if (!hasPage(page)) return [];
    try {
      setPageLoading(true);
      return await pageCb(page, getPagePublicKeys(page));
    } finally {
      setPageLoading(false);
    }
  };

  return {
    perPage,
    allPublicKeys,
    prefetchLoading,
    pageLoading,
    loading,
    getPagePublicKeys,
    hasPage,
    getPage,
    prefetch,
  };
};
