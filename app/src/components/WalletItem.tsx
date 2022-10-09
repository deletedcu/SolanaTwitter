import { useState } from "react";
import { Menu, MenuButton, MenuDivider, MenuItem } from "@szhsin/react-menu";
import Image from "next/image";
import { PublicKey } from "@solana/web3.js";
import { toCollapse } from "../utils";

import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";

export default function WalletItem({
  publicKey,
  alias,
  showModal,
  disconnect,
}: {
  publicKey: PublicKey;
  alias: string;
  showModal: () => void;
  disconnect: () => Promise<void>;
}) {
  const [copyLabel, setCopyLabel] = useState("Copy to clipboard");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicKey.toBase58());
    setCopyLabel("Successfully Copied");
  };

  return (
    <Menu
      menuButton={
        <MenuButton>
          <Image
            src={`https://avatars.dicebear.com/api/jdenticon/${publicKey.toBase58()}.svg`}
            width="35"
            height="35"
            alt="user icon"
          />
        </MenuButton>
      }
      transition
    >
      <MenuItem className="min-w-[15em]">
        {({ hover }) => (
          <div>
            <button
              className="group flex w-full items-center rounded-md text-left"
              onClick={copyToClipboard}
            >
              <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-md bg-sky-100">
                {hover ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    className="h-5 w-5 iconify iconify--heroicons-outline"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1M8 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M8 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 0h2a2 2 0 0 1 2 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 iconify iconify--heroicons-outline"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 7a2 2 0 0 1 2 2m4 0a6 6 0 0 1-7.743 5.743L11 17H9v2H7v2H4a1 1 0 0 1-1-1v-2.586a1 1 0 0 1 .293-.707l5.964-5.964A6 6 0 1 1 21 9Z"
                    ></path>
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm">
                  {hover ? copyLabel : "Signed in Wallet"}
                </p>
                <p className="font-medium">{toCollapse(publicKey)}</p>
              </div>
            </button>
          </div>
        )}
      </MenuItem>
      <MenuItem>
        {({ hover }) => (
          <div>
            <button
              className="group flex w-full items-center rounded-md text-left"
              onClick={showModal}
            >
              <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-md bg-sky-100">
                {hover ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 iconify iconify--heroicons-outline"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586Z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 iconify iconify--heroicons-outline"
                    width="1em"
                    height="1em"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5.121 17.804A13.937 13.937 0 0 1 12 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 1 1-6 0a3 3 0 0 1 6 0Zm6 2a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z"
                    ></path>
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm">{hover ? "Edit Alias" : "User Alias"}</p>
                <p className="font-medium">{alias}</p>
              </div>
            </button>
          </div>
        )}
      </MenuItem>
      <MenuDivider />
      <MenuItem>
        <button
          className="flex w-full h-8 items-center px-3"
          onClick={disconnect}
        >
          Disconnect wallet
        </button>
      </MenuItem>
    </Menu>
  );
}
