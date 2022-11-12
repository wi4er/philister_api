import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { DirectoryQuerySchema } from "../../schema/directory-query.schema";
import { DirectoryMutationSchema } from "../../schema/directory-mutation.schema";

@Resolver()
export class DirectoryRootResolver {

  @Query(
    returns => DirectoryQuerySchema,
    {name: 'directory'}
  )
  async getDirectory() {
    return {};
  }

  @Mutation(
    returns => DirectoryMutationSchema,
    {name: 'directory'}
  )
  async setDirectory() {
    return {}
  }

}
