import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PropertySchema } from "../../../property/schema/property.schema";
import { DirectorySchema } from "../../schema/directory.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DirectoryPropertyEntity } from "../../model/directory-property.entity";
import { DirectoryEntity } from "../../model/directory.entity";

@Resolver(of => DirectorySchema)
export class DirectoryResolver {

  constructor(
    @InjectRepository(DirectoryPropertyEntity)
    private propertyRepo: Repository<DirectoryPropertyEntity>,
  ) {
  }

  @ResolveField("property", type => PropertySchema)
  async property(
    @Parent()
      prop: DirectoryEntity
  ) {
    return this.propertyRepo.find({
      where: {parent: {id: prop.id}},
      relations: {property: true},
    });
  }
}
