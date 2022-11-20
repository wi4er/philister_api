import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { DirectoryMutationSchema } from "../../schema/directory-mutation.schema";
import { In, Repository } from "typeorm";
import { DirectorySchema } from "../../schema/directory.schema";
import { DirectoryEntity } from "../../model/directory.entity";
import { DirectoryInputSchema } from "../../schema/directory-input.schema";
import { DirectoryStringEntity } from "../../model/directory-string.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Resolver(of => DirectoryMutationSchema)
export class DirectoryMutationResolver {
  constructor(
    @InjectRepository(DirectoryEntity)
    private directoryRepo: Repository<DirectoryEntity>,
    @InjectRepository(DirectoryStringEntity)
    private directoryPropertyRepo: Repository<DirectoryStringEntity>,
  ) {
  }

  @ResolveField('add', type => DirectorySchema)
  async add(
    @Args('item')
      item: DirectoryInputSchema
  ) {
    const inst = new DirectoryEntity();
    inst.id = item.id;
    const parent = await inst.save();

    if (item.property) {
      for (const value of item.property) {
        await Object.assign(
          new DirectoryStringEntity(),
          {
            string: value.string,
            property: value.property,
            parent,
          }
        ).save();
      }
    }

    await inst.reload();

    return inst;
  }

  @ResolveField('update', type => DirectorySchema)
  async update(
    @Args('item')
      item: DirectoryInputSchema
  ) {
    const inst = await this.directoryRepo.findOne({
      where: { id: item.id },
      relations: { property: true },
    });

    for (const prop of inst.property) {
      await this.directoryPropertyRepo.delete({ id: prop.id });
    }

    inst.property = [];

    if (item.property) {
      for (const value of item.property) {
        await Object.assign(
          new DirectoryStringEntity(),
          {
            string: value.string,
            property: value.property,
            parent: inst,
          }
        ).save();
      }
    }

    await inst.reload();

    return inst;
  }

  @ResolveField('delete', type => [ DirectorySchema ])
  async delete(
    @Args('id', { type: () => [ String ] })
      id: string[]
  ) {
    const result = [];
    const list = await this.directoryRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.directoryRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }
}
