import { Args, Int, ResolveField, Resolver } from '@nestjs/graphql';
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

  @ResolveField()
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

  @ResolveField()
  async count(
    @Args('limit', {nullable: true, type: () => Int})
      limit: number,
    @Args('offset', {nullable: true, type: () => Int})
      offset: number,
  ) {
    return this.directoryRepo.count({
      skip: offset,
      take: limit,
    });
  }

  @ResolveField()
  item(
    @Args('id', { type: () => String })
      id: string
  ) {
    return this.directoryRepo.findOne({ where: { id } });
  }

}
