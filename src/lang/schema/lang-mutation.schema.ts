import { Field, ObjectType } from "@nestjs/graphql";
import { DirectorySchema } from "../../directory/schema/directory.schema";
import { LangSchema } from "./lang.schema";

@ObjectType(
  'LangMutation'
)
export class LangMutationSchema {

  @Field(
    type => LangSchema,
    { description: 'Adding new lang' }
  ) add: LangSchema;

  @Field(
    type => [String],
    { description: 'Deletion existent lang' }
  ) delete: String[];

  @Field(
    type => LangSchema,
    { description: 'Updating existent lang' }
  ) update: LangSchema;

}