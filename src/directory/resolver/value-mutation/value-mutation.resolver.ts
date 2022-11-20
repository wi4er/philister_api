import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { ValueMutationSchema } from "../../schema/value-mutation.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { ValueEntity } from "../../model/value.entity";
import { ValueSchema } from "../../schema/value.schema";
import { ValueInputSchema } from "../../schema/value-input.schema";
import { DirectoryEntity } from "../../model/directory.entity";

@Resolver(of => ValueMutationSchema)
export class ValueMutationResolver {

  constructor(
    @InjectRepository(ValueEntity)
    private valueRepo: Repository<ValueEntity>,

    @InjectRepository(DirectoryEntity)
    private directoryRepo: Repository<DirectoryEntity>,
  ) {
  }

  @ResolveField('add', type => ValueSchema)
  async add(
    @Args('item')
      item: ValueInputSchema
  ) {
    const directory = await this.directoryRepo.findOne({where: {id: item.directory}});

    if (!directory) {
      throw Error("Wrong directory.");
    }

    const inst = new ValueEntity();
    inst.id = item.id;
    inst.directory = directory;

    await inst.save();

    return this.valueRepo.findOne({
      where: {id: inst.id},
      loadRelationIds: true,
    });
  }

  @ResolveField('update', type => ValueSchema)
  async update(
    @Args('item')
      item: ValueInputSchema
  ) {
    const inst = await this.valueRepo.findOne({where: { id: item.id }});
    const directory = await this.directoryRepo.findOne({where: {id: item.directory}});

    inst.directory = directory;
    await inst.save();

    return this.valueRepo.findOne({
      where: {id: inst.id},
      loadRelationIds: true,
    });
  }

  @ResolveField('delete', type => [ ValueSchema ])
  async delete(
    @Args('id', { type: () => [ String ] })
      id: string[]
  ) {
    const result = [];
    const list = await this.valueRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.valueRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
