import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { PropertySchema } from "../../schema/property.schema";
import { PropertyMutationSchema } from "../../schema/property-mutation.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { PropertyPropertyEntity } from "../../model/property-property.entity";
import { In, Repository } from "typeorm";
import { PropertyEntity } from "../../model/property.entity";
import { PropertyInputSchema } from "../../schema/property-input.schema";

@Resolver(of => PropertyMutationSchema)
export class PropertyMutationResolver {

  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,
    @InjectRepository(PropertyPropertyEntity)
    private propertyPropertyRepo: Repository<PropertyPropertyEntity>,
  ) {
  }

  @ResolveField()
  async add(
    @Args('item')
      item: PropertyInputSchema
  ) {
    const inst = new PropertyEntity();
    inst.id = item.id;

    if (item.property) {
      inst.property = [];
      for (const value of item.property) {
        inst.property.push(await Object.assign(
          new PropertyPropertyEntity(),
          { value: value.value, property: value.property }
        ).save());
      }
    }

    return await inst.save();
  }

  @ResolveField()
  async update(
    @Args('item')
      item: PropertyInputSchema
  ) {
    const inst = await this.propertyRepo.findOne({
      where: { id: item.id },
      relations: { property: true },
    });

    for (const prop of inst.property) {
      await this.propertyPropertyRepo.delete({ id: prop.id });
    }

    inst.property = [];

    if (item.property) {
      for (const value of item.property) {
        inst.property.push(await Object.assign(
          new PropertyPropertyEntity(),
          { value: value.value, property: value.property }
        ).save());
      }
    }

    return await inst.save();
  }

  @ResolveField()
  async delete(
    @Args('id', { type: () => [ String ] })
      id: string[]
  ) {
    const result = [];
    const list = await this.propertyRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.propertyRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }
}
