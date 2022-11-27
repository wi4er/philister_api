import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { DirectoryQuerySchema } from "../../schema/directory-query.schema";
import { DirectoryMutationSchema } from "../../schema/directory-mutation.schema";
import { ValueQuerySchema } from "../../schema/value-query.schema";
import { ValueMutationSchema } from "../../schema/value-mutation.schema";

@Resolver()
export class DirectoryRootResolver {

  @Query(
    returns => DirectoryQuerySchema,
    { name: 'directory' }
  )
  async getDirectory() {
    return {};
  }

  @Query(
    returns => ValueQuerySchema,
    { name: 'value' }
  )
  async getValue() {
    return {};
  }

  @Mutation(
    returns => DirectoryMutationSchema,
    { name: 'directory' }
  )
  async setDirectory() {
    return {}
  }

  @Mutation(
    returns => ValueMutationSchema,
    { name: 'value' }
  )
  async setValue() {
    return {}
  }

}
