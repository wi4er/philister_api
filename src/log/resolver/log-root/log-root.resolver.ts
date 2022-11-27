import { Query, Resolver } from '@nestjs/graphql';
import { FetchLogQuerySchema } from "../../schema/fetch-log-query.schema";
import { ChangeLogQuerySchema } from "../../schema/change-log-query.schema";

@Resolver()
export class LogRootResolver {

  @Query(
    type => ChangeLogQuerySchema,
    { name: 'changeLog' },
  )
  getChangeLog() {
    return {};
  }

  @Query(
    type => FetchLogQuerySchema,
    { name: 'fetchLog' },
  )
  getFetchLog() {
    return {};
  }

}
