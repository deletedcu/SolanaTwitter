export class TagType {
  tag: string;
  count: number;
  timestamp: number;

  constructor(tag: string, count: number, timestamp: number) {
    this.tag = tag;
    this.count = count;
    this.timestamp = timestamp
  }
}
