import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { PropertyEntity } from "../../model/property.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PropertyQuerySchema } from "../../schema/property-query.schema";
import { LogService } from "../../../log/service/log/log.service";

@Resolver(of => PropertyQuerySchema)
export class PropertyQueryResolver {

  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,

    private logService: LogService,
  ) {
  }

  @ResolveField()
  list(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ) {
    return this.propertyRepo.find({
      skip: offset,
      take: limit,
    }).then(res => {
      this.logService.get('property', 'list');

      return res;
    });
  }

  @ResolveField()
  count(
    @Args('limit', { nullable: true, type: () => Int })
      limit: number,
    @Args('offset', { nullable: true, type: () => Int })
      offset: number,
  ) {
    return this.propertyRepo.count({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField()
  item(
    @Args('id', { type: () => String })
      id: string
  ) {
    return this.propertyRepo.findOne({ where: { id } })
  }

}
