import { PublicKey } from "@solana/web3.js";
import dayjs from "dayjs";
import { toCollapse } from "../utils";

export type TweetAccount = {
  readonly user: PublicKey;
  readonly timestamp: number;
  readonly tag: string;
  readonly content: string;
  readonly state: TweetState | undefined;
}

export enum TweetState {
  Edited,
  Deleted,
}

export class Tweet {
  publickey: PublicKey;
  user: PublicKey;
  timestamp: number;
  tag: string;
  content: string;
  state: TweetState | undefined;
  user_display: string;

  constructor(publickey: PublicKey, account: any, alias: string) {
    this.publickey = publickey;
    this.user = account.user;
    this.timestamp = account.timestamp;
    this.tag = account.tag;
    this.content = account.content;
    this.state = account.state;
    this.user_display = alias;
  }

  get key(): string {
    return this.publickey.toBase58();
  }

  get created_at(): string {
    return dayjs.unix(this.timestamp).format("lll");
  }

  get created_ago(): string {
    return dayjs.unix(this.timestamp).fromNow();
  }
}
