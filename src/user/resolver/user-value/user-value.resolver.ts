import { Field, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserValueSchema } from "../../schema/user-property/user-value.schema";
import { User2valueEntity } from "../../model/user2value.entity";
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
      value: User2valueEntity
  ) {
    return value.value.id;
  }

  @ResolveField('property')
  async property(
    @Parent()
      value: User2valueEntity
  ) {
    return value.property;
  }

  @ResolveField('value')
  async value(
    @Parent()
      value: User2valueEntity
  ) {
    return value.value;
  }

}
