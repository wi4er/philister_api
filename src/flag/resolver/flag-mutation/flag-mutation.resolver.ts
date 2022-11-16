import { Resolver } from '@nestjs/graphql';
import { FlagMutationSchema } from "../../schema/flag-mutation.schema";

@Resolver(of => FlagMutationSchema)
export class FlagMutationResolver {}
