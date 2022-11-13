import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { DirectoryEntity } from "../../model/directory.entity";
import { ValueEntity } from "../../model/value.entity";
import { ValueSchema } from "../../schema/value.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Resolver(of => ValueSchema)
export class ValueResolver {

  constructor(
    @InjectRepository(DirectoryEntity)
    private directoryRepo: Repository<DirectoryEntity>,
  ) {
  }

  @ResolveField('directory', type => DirectoryEntity)
  async directory(@Parent() value: ValueEntity) {
    return value.directory;
  }

}
