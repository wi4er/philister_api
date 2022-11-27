import { Resolver } from '@nestjs/graphql';
import { FetchLogSchema } from "../../schema/fetch-log.schema";

@Resolver(of => FetchLogSchema)
export class FetchLogResolver {

}
