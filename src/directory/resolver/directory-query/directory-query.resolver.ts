import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
import { DirectorySchema } from "../../schema/directory.schema";
import { DirectoryQuerySchema } from "../../schema/directory-query.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DirectoryEntity } from "../../model/directory.entity";

@Resolver(of => DirectoryQuerySchema)
export class DirectoryQueryResolver {

  constructor(
    @InjectRepository(DirectoryEntity)
    private directoryRepo: Repository<DirectoryEntity>,
  ) {
  }

  @ResolveField('list', type => [DirectorySchema])
  async list(
    @Args('limit', {nullable: true, type: () => Int})
      limit: number,
    @Args('offset', {nullable: true, type: () => Int})
      offset: number,
  ) {
    return this.directoryRepo.find({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField('count', type => [DirectorySchema])
  async count(
    @Args('limit', {nullable: true, type: () => Int})
      limit: number,
    @Args('offset', {nullable: true, type: () => Int})
      offset: number,
  ) {
    return this.directoryRepo.find({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField('item', type => DirectorySchema)
  item(
    @Args('id', { type: () => String })
      id: string
  ) {
    return this.directoryRepo.findOne({ where: { id } })
  }
}
