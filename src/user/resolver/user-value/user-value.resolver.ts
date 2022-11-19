import { Field, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserValueSchema } from "../../schema/user-property/user-value.schema";
import { UserValueEntity } from "../../model/user-value.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyEntity } from "../../../property/model/property.entity";
import { Repository } from "typeorm";

@Resolver(of => UserValueSchema)
export class UserValueResolver {
  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,
  ) {
  }

  @ResolveField('string')
  async string(
    @Parent()
      value: UserValueEntity
  ) {
    return value.value.id;
  }

  @ResolveField('property')
  async property(
    @Parent()
      value: UserValueEntity
  ) {
    return value.property;
  }

  @ResolveField('value')
  async value(
    @Parent()
      value: UserValueEntity
  ) {
    return value.value;
  }

}
