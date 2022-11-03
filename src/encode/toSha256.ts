import { createHash } from "crypto";

export function toSha256(payload: Object): string {
  return createHash('sha256')
    .update(payload.toString())
    .digest('hex');
}