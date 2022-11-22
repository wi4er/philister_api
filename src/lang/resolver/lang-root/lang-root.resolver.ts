import { Query, Resolver } from '@nestjs/graphql';
import { LangQuerySchema } from "../../schema/lang-query.schema";

@Resolver()
export class LangRootResolver {

  @Query(returns => LangQuerySchema, { name: 'lang' })
  async getLang() {
    return {};
  }
}
