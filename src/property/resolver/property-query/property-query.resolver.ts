import { Args, ResolveField, Resolver } from '@nestjs/graphql';
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
  list() {
    return this.propertyRepo.find()
  }

  @ResolveField('item', type => PropertyEntity)
  item(
    @Args('id', { type: () => String})
      id: string
  ) {
    return this.propertyRepo.findOne({where: {id}})
  }
}
