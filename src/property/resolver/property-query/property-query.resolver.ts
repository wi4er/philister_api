import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { PropertyEntity } from "../../model/property.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PropertyQuerySchema } from "../../schema/property-query.schema";

@Resolver(of => PropertyQuerySchema)
export class PropertyQueryResolver {

  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,
  ) {
  }

  @ResolveField('list', type => [ PropertyEntity ])
  list(
    @Args('limit', {nullable: true, type: () => Int})
      limit: number,
    @Args('offset', {nullable: true, type: () => Int})
      offset: number,
  ) {
    return this.propertyRepo.find({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField('count', type => Int)
  count(
    @Args('limit', {nullable: true, type: () => Int})
      limit: number,
    @Args('offset', {nullable: true, type: () => Int})
      offset: number,
  ) {
    return this.propertyRepo.count({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField('item', type => PropertyEntity)
  item(
    @Args('id', { type: () => String })
      id: string
  ) {
    return this.propertyRepo.findOne({ where: { id } })
  }
}
