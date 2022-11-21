import { Field, InputType } from "@nestjs/graphql";

@InputType('DirectoryPropertyInput')
export class DirectoryPropertyInputSchema {

  @Field()
  property: string;

  @Field()
  string: string;

}

@InputType('DirectoryInput')
export class DirectoryInputSchema {

  @Field()
  id: string;

  @Field(type => [ DirectoryPropertyInputSchema ], { nullable: true })
  property: DirectoryPropertyInputSchema[];

  @Field(type => [ String ], { nullable: true })
  value: string[];

}