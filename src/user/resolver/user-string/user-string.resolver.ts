import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PropertyEntity } from "../../../property/model/property.entity";
import { UserStringEntity } from "../../model/user-string.entity";
import { UserStringSchema } from "../../schema/user-property/user-string.schema";

@Resolver(of => UserStringSchema)
export class UserStringResolver {

  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,
  ) {
  }

  @ResolveField("property", returns => [ UserStringSchema ])
  async property(@Parent() userProperty: UserStringEntity) {
    return userProperty.property;
  }
}
