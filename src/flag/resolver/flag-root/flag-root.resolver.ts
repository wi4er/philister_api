import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { PropertyMutationSchema } from "../../../property/schema/property-mutation.schema";
import { FlagQuerySchema } from "../../schema/flag-query.schema";

@Resolver()
export class FlagRootResolver {

  @Query(returns => FlagQuerySchema, { name: 'flag' })
  async getProperty() {
    return {};
  }

  @Mutation(
    returns => PropertyMutationSchema,
    { name: 'flag' }
  )
  async setProperty() {
    return {}
  }

}
