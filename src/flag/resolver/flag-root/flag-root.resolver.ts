import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { FlagQuerySchema } from "../../schema/flag-query.schema";
import { FlagMutationSchema } from "../../schema/flag-mutation.schema";

@Resolver()
export class FlagRootResolver {

  @Query(returns => FlagQuerySchema, { name: 'flag' })
  async getFlag() {
    return {};
  }

  @Mutation(
    returns => FlagMutationSchema,
    { name: 'flag' }
  )
  async setFlag() {
    return {}
  }

}
