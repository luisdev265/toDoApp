import { customAlphabet } from "nanoid";

export class idFactory {
  private nanoid = customAlphabet("1234567890", 21);
  public generateUserId() {
    return parseInt(this.nanoid());
  }
}
