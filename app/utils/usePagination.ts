import { PublicKey } from "@solana/web3.js";
import { Tweet } from "../models";
import { AliasProps } from "../pages/api/alias";

export const usePagination = (
  perPage: number,
  prefetchCb: () => Promise<PublicKey[]>,
  prefetchAlias: () => Promise<AliasProps>,
  pageCb: (page: number, pubkeys: PublicKey[], aliasObj: AliasProps) => Promise<Tweet[]>
) => {
  let allPublicKeys: PublicKey[] = [];
  let userAliasObj: AliasProps = {};
  let prefetchLoading = false;
  let pageLoading = false;

  const loading = prefetchLoading || pageLoading;
  let prefetchPromise: Promise<void>;

  const prefetch = () => {
    prefetchPromise = (async () => {
      try {
        prefetchLoading = true;
        allPublicKeys = await prefetchCb();
        userAliasObj = await prefetchAlias();
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
      return await pageCb(page, getPagePublicKeys(page), userAliasObj);
    } finally {
      pageLoading = false;
    }
  };

  return {
    perPage,
    allPublicKeys,
    userAliasObj,
    prefetchLoading,
    pageLoading,
    loading,
    getPagePublicKeys,
    hasPage,
    getPage,
    prefetch,
  };
};
