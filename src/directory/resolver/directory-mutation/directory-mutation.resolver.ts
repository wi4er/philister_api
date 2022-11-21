import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { DirectoryMutationSchema } from "../../schema/directory-mutation.schema";
import { In, Repository } from "typeorm";
import { DirectoryEntity } from "../../model/directory.entity";
import { DirectoryInputSchema } from "../../schema/directory-input.schema";
import { DirectoryStringEntity } from "../../model/directory-string.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ValueEntity } from "../../model/value.entity";
import { DirectoryService } from "../../service/directory/directory.service";

@Resolver(of => DirectoryMutationSchema)
export class DirectoryMutationResolver {
  constructor(
    @InjectRepository(DirectoryEntity)
    private directoryRepo: Repository<DirectoryEntity>,

    @InjectRepository(ValueEntity)
    private valueRepo: Repository<ValueEntity>,

    @InjectRepository(DirectoryStringEntity)
    private directoryPropertyRepo: Repository<DirectoryStringEntity>,

    private directoryService: DirectoryService,
  ) {
  }

  @ResolveField('add')
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

    if (item.value) {
      for (const value of item.value) {
        const created = new ValueEntity();
        created.id = value;
        created.directory = inst;

        await created.save();
      }
    }

    await inst.reload();

    return inst;
  }

  @ResolveField('update')
  async update(
    @Args('item')
      item: DirectoryInputSchema
  ) {
    const inst = await this.directoryRepo.findOne({
      where: { id: item.id },
      relations: { property: true, value: true },
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

    const curValues = new Set<string>(inst.value.map(it => it.id));

    for (const value of item.value) {
      const check = await this.valueRepo.findOne({where: {id: value}});

      if (!check) {
        const created = new ValueEntity();
        created.id = value;
        created.directory = inst;

        await created.save();
      }

      curValues.delete(value);
    }

    await this.valueRepo.delete({id: In(Array.from(curValues))});

    await inst.reload();

    return inst;
  }

  @ResolveField('delete')
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
