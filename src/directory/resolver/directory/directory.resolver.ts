import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { DirectorySchema } from "../../schema/directory.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Directory2stringEntity } from "../../model/directory2string.entity";
import { DirectoryEntity } from "../../model/directory.entity";
import { ValueEntity } from "../../model/value.entity";
import { Directory2flagEntity } from "../../model/directory2flag.entity";

@Resolver(of => DirectorySchema)
export class DirectoryResolver {

  constructor(
    @InjectRepository(Directory2stringEntity)
    private propertyRepo: Repository<Directory2stringEntity>,
    @InjectRepository(ValueEntity)
    private valueRepo: Repository<ValueEntity>,
    @InjectRepository(Directory2flagEntity)
    private flagRepo: Repository<Directory2flagEntity>,
  ) {
  }

  @ResolveField()
  created_at(
    @Parent()
      current: DirectoryEntity
  ) {
    return new Date(current.created_at).toISOString();
  }

  @ResolveField()
  updated_at(
    @Parent()
      current: DirectoryEntity
  ) {
    return new Date(current.updated_at).toISOString();
  }

  @ResolveField()
  async property(
    @Parent()
      current: DirectoryEntity
  ) {
    return this.propertyRepo.find({
      where: { parent: { id: current.id } },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async value(
    @Parent()
      current: DirectoryEntity
  ) {
    return this.valueRepo.find({
      where: { directory: { id: current.id } },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async flagList(
    @Parent()
      current: { id: string }
  ) {
    return this.flagRepo.find({
      where: {
        parent: { id: current.id },
      },
      loadRelationIds: true,
    });
  }

  @ResolveField()
  async flagString(
    @Parent()
      current: { id: string }
  ) {
    return this.flagRepo.find({
      where: {
        parent: { id: current.id },
      },
      loadRelationIds: true,
    }).then(list => list.map(item => item.flag));
  }

}
