import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { DirectoryMutationSchema } from "../../schema/directory-mutation.schema";
import { In, Repository } from "typeorm";
import { DirectorySchema } from "../../schema/directory.schema";
import { DirectoryEntity } from "../../model/directory.entity";
import { DirectoryInputSchema } from "../../schema/directory-input.schema";
import { DirectoryPropertyEntity } from "../../model/directory-property.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Resolver(of => DirectoryMutationSchema)
export class DirectoryMutationResolver {
  constructor(
    @InjectRepository(DirectoryEntity)
    private directoryRepo: Repository<DirectoryEntity>,
  ) {
  }

  @ResolveField('add', type => DirectorySchema)
  async add(
    @Args('item')
      item: DirectoryInputSchema
  ) {
    const inst = new DirectoryEntity();
    inst.id = item.id;

    if (item.property) {
      inst.property = [];
      for (const value of item.property) {
        inst.property.push(await Object.assign(
          new DirectoryPropertyEntity(),
          { value: value.value, property: value.property }
        ).save());
      }
    }

    return await inst.save();
  }

  @ResolveField('delete', type => [DirectorySchema])
  async delete(
    @Args('id', {type: () => [String]})
      id: string[]
  ) {
    const result = [];
    const list = await this.directoryRepo.find({where: {id: In(id)}});

    for (const item of list) {
      await this.directoryRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }
}