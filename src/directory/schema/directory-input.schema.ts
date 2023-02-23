import { Field, InputType } from '@nestjs/graphql';

@InputType('DirectoryPropertyInput')
export class DirectoryPropertyInputSchema {

  @Field()
  property: string;

  @Field()
  string: string;

  @Field()
  lang: string;

}

@InputType('DirectoryInput')
export class DirectoryInputSchema {

  @Field()
  id: string;

  @Field(type => [ DirectoryPropertyInputSchema ], { nullable: false })
  property: DirectoryPropertyInputSchema[];

  @Field(type => [ String ], { nullable: false })
  value: string[];

  @Field(type => [ String ], { nullable: false })
  flag: string[];

}