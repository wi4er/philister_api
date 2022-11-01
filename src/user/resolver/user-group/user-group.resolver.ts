import { Resolver } from '@nestjs/graphql';
import { UserGroup } from "../../schema/UserGroup";

@Resolver(of => UserGroup)
export class UserGroupResolver {}
