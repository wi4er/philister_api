import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { LangQuerySchema } from "../../schema/lang-query.schema";
import { LangMutationSchema } from "../../schema/lang-mutation.schema";

@Resolver()
export class LangRootResolver {

  @Query(returns => LangQuerySchema, { name: 'lang' })
  async getLang() {
    return {};
  }

  @Mutation(returns => LangMutationSchema, { name: 'lang' })
  async setLang() {
    return {};
  }
}
