import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { BlockEntity } from "../../model/block.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ElementEntity } from "../../model/element.entity";
import { Repository } from "typeorm";
import { SectionEntity } from "../../model/section.entity";
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
  ) {
    console.log(id)
    return this.stringRepo.findOne({
      where: {
        property: { id },
        parent: { id: current.id },
      }
    });
  }

  @ResolveField()
  async propertyString(
    @Args('id')
      id: string,
    @Parent()
      current: BlockEntity
  ) {
    return this.stringRepo.findOne({
      where: {
        property: { id },
        parent: { id: current.id },
      }
    }).then(item => item.string);
  }

}
