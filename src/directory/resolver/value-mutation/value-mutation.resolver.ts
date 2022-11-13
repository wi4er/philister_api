import { Resolver } from '@nestjs/graphql';
import { ValueMutationSchema } from "../../schema/value-mutation.schema";

@Resolver(of => ValueMutationSchema)
export class ValueMutationResolver {}
