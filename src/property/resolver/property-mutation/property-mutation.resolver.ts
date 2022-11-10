import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { PropertySchema } from "../../schema/property.schema";
import { PropertyMutationSchema } from "../../schema/property-mutation.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyPropertyEntity } from "../../model/property-property.entity";
import { Repository } from "typeorm";
import { PropertyEntity } from "../../model/property.entity";
import { PropertyInput } from "../../schema/property-input";

@Resolver(of => PropertyMutationSchema)
export class PropertyMutationResolver {

  constructor(
    @InjectRepository(PropertyPropertyEntity)
    private propertyRepo: Repository<PropertyPropertyEntity>,
  ) {
  }

  @ResolveField('add', type => PropertySchema)
  async add(
    @Args('item')
      item: PropertyInput
  ) {
    const inst = new PropertyEntity();
    inst.id = item.id;

    if (item.property) {
      inst.property = [];
      for (const value of item.property) {
        inst.property.push(await Object.assign(
          new PropertyPropertyEntity(),
          {value: value.value, property: value.property}
        ).save());
      }
    }

    return await inst.save();
  }
}
