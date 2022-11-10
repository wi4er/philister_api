import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { PropertyQuerySchema } from '../../schema/property-query.schema';
import { PropertyMutationSchema } from '../../schema/property-mutation.schema';

@Resolver()
export class PropertyRootResolver {

  @Query(returns => PropertyQuerySchema, {name: 'property'})
  async getProperty() {
    return {};
  }

  @Mutation(
    returns => PropertyMutationSchema,
    {name: 'property'}
  )
  async setProperty() {
    return {}
  }

}
