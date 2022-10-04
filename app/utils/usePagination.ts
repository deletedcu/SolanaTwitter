import { PublicKey } from "@solana/web3.js";
import { Tweet } from "../models";

export const usePagination = (
  perPage: number,
  prefetchCb: () => Promise<PublicKey[]>,
  pageCb: (page: number, pubkeys: PublicKey[]) => Promise<Tweet[]>
) => {
  let allPublicKeys: PublicKey[] = [];
  let prefetchLoading = false;
  let pageLoading = false;

  const loading = prefetchLoading || pageLoading;
  let prefetchPromise: Promise<void>;

  const prefetch = () => {
    prefetchPromise = (async () => {
      try {
        prefetchLoading = true;
        allPublicKeys = await prefetchCb();
      } finally {
        prefetchLoading = false;
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
      pageLoading = true;
      return await pageCb(page, getPagePublicKeys(page));
    } finally {
      pageLoading = false;
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
