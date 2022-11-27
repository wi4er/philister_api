import { Resolver } from '@nestjs/graphql';
import { ChangeLogSchema } from "../../schema/change-log.schema";

@Resolver(of => ChangeLogSchema)
export class ChangeLogResolver {}
