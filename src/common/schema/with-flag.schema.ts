import { FlagSchema } from '../../flag/schema/flag.schema';
import { Field, InterfaceType } from '@nestjs/graphql';

@InterfaceType()
export abstract class WithFlagSchema {

  @Field(type => [ FlagSchema ])
  flagList: FlagSchema[];

  @Field(type => [ String ])
  flagString: string[];

}