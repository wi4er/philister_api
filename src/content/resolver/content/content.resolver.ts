import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { BlockEntity } from "../../model/block.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlockStringEntity } from "../../model/block-string.entity";
import { ContentSchema } from "../../schema/content.schema";

@Resolver(of => ContentSchema)
export class ContentResolver {
  constructor(
    @InjectRepository(BlockStringEntity)
    private stringRepo: Repository<BlockStringEntity>,
  ) {
  }

  @ResolveField()
  async propertyItem(
    @Args('id')
      id: string,
    @Parent()
      current: BlockEntity
  ) {}

  @ResolveField()
  async propertyString(
    @Args('id')
      id: string,
    @Parent()
      current: BlockEntity
  ) {
  }

}
