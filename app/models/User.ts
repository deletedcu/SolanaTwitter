import { PublicKey } from "@solana/web3.js";
import dayjs from "dayjs";

export class UserType {
  user: PublicKey;
  tweet: PublicKey;
  last_tag: string;
  last_timestamp: number;
  total_posts: number;

  constructor(
    user: PublicKey,
    tweet: PublicKey,
    last_tag: string,
    last_timestamp: number,
    total_posts: number
  ) {
    this.user = user;
    this.tweet = tweet;
    this.last_tag = last_tag;
    this.last_timestamp = last_timestamp;
    this.total_posts = total_posts;
  }

  get user_display(): string {
    const userkey = this.user.toBase58();
    return userkey.slice(0, 4) + ".." + userkey.slice(-4);
  }

  get created_ago(): string {
    return dayjs.unix(this.last_timestamp).fromNow();
  }
}
