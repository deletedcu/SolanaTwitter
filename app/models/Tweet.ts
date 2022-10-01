import { PublicKey } from "@solana/web3.js";
import dayjs from "dayjs";

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

  constructor(publickey: PublicKey, account: any) {
    this.publickey = publickey;
    this.user = account.user;
    this.timestamp = account.timestamp;
    this.tag = account.tag;
    this.content = account.content;
    this.state = account.state;
  }

  get key(): string {
    return this.publickey.toBase58();
  }

  get user_display(): string {
    const userkey = this.user.toBase58();
    return userkey.slice(0, 4) + ".." + userkey.slice(-4);
  }

  get created_at(): string {
    return dayjs.unix(this.timestamp).format("lll");
  }

  get created_ago(): string {
    return dayjs.unix(this.timestamp).fromNow();
  }
}
