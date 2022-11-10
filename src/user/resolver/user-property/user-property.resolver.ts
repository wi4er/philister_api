import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserPropertySchema } from "../../schema/user-property.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PropertyEntity } from "../../../property/model/property.entity";
import { UserPropertyEntity } from "../../model/user-property.entity";

@Resolver(of => UserPropertySchema)
export class UserPropertyResolver {

  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,
  ) {
  }

  @ResolveField("property", returns => [ UserPropertySchema ])
  async property(@Parent() userProperty: UserPropertyEntity) {
    return userProperty.property;
  }
}
