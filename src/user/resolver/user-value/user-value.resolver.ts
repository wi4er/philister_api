import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserValueSchema } from "../../schema/user-property/user-value.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyEntity } from "../../../property/model/property.entity";
import { Repository } from "typeorm";
import { ValueEntity } from "../../../directory/model/value.entity";

@Resolver(of => UserValueSchema)
export class UserValueResolver {

  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,
    @InjectRepository(ValueEntity)
    private valueRepo: Repository<ValueEntity>,
  ) {
  }

  @ResolveField('string')
  async string(
    @Parent()
      current: { value: string }
  ) {
    return current.value;
  }

  @ResolveField('property')
  async property(
    @Parent()
      current: { property: string }
  ) {
    return this.propertyRepo.findOne({
      where: { id: current.property },
      loadRelationIds: true,
    });
  }

  @ResolveField('value')
  async value(
    @Parent()
      current: { value: string }
  ) {
    return  this.valueRepo.findOne({
      where: { id: current.value },
      loadRelationIds: true,
    });
  }

}
