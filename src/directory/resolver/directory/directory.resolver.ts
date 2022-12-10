import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { DirectorySchema } from "../../schema/directory.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DirectoryStringEntity } from "../../model/directory-string.entity";
import { DirectoryEntity } from "../../model/directory.entity";
import { ValueEntity } from "../../model/value.entity";
import { DirectoryFlagEntity } from "../../model/directory-flag.entity";

@Resolver(of => DirectorySchema)
export class DirectoryResolver {

  constructor(
    @InjectRepository(DirectoryStringEntity)
    private propertyRepo: Repository<DirectoryStringEntity>,
    @InjectRepository(ValueEntity)
    private valueRepo: Repository<ValueEntity>,
    @InjectRepository(DirectoryFlagEntity)
    private flagRepo: Repository<DirectoryFlagEntity>,
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
