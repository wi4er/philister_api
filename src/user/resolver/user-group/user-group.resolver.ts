import { Resolver } from '@nestjs/graphql';
import { UserGroupSchema } from "../../schema/user-group.schema";

@Resolver(of => UserGroupSchema)
export class UserGroupResolver {}
