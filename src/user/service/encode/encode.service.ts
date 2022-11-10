import { Injectable } from '@nestjs/common';
import { createHash } from "crypto";

@Injectable()
export class EncodeService {
  toSha256(payload: Object): string {
    return createHash('sha256')
      .update(payload.toString())
      .digest('hex');
  }
}
