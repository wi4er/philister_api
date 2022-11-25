import { Resolver } from '@nestjs/graphql';
import { BlockStringSchema } from "../../schema/block-string.schema";

@Resolver(
  of => BlockStringSchema,
)
export class BlockStringResolver {

}
