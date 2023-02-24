import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { PropertyInsertOperation } from '../../../common/operation/property-insert.operation';
import { FlagInsertOperation } from '../../../common/operation/flag-insert.operation';
import { PropertyUpdateOperation } from '../../../common/operation/property-update.operation';
import { FlagUpdateOperation } from '../../../common/operation/flag-update.operation';
import { PropertyEntity } from '../../model/property.entity';
import { Property2stringEntity } from '../../model/property2string.entity';
import { Property2flagEntity } from '../../model/property2flag.entity';
import { PropertyInputSchema } from '../../schema/property-input.schema';

@Injectable()
export class PropertyService {

  constructor(
    @InjectEntityManager()
    private manager: EntityManager,
    @InjectRepository(PropertyEntity)
    private propertyRepo: Repository<PropertyEntity>,
  ) {
  }

  async insert(input: PropertyInputSchema): Promise<PropertyEntity> {
    const created = new PropertyEntity();

    await this.manager.transaction(async (trans: EntityManager) => {
      created.id = input.id;
      await trans.save(created);

      await new PropertyInsertOperation(trans, Property2stringEntity).save(created, input);
      await new FlagInsertOperation(trans, Property2flagEntity).save(created, input);
    });

    return this.propertyRepo.findOne({
      where: { id: created.id },
      loadRelationIds: true,
    });
  }

  async update(input: PropertyInputSchema): Promise<PropertyEntity> {
    await this.manager.transaction(async (trans: EntityManager) => {
      const beforeItem = await this.propertyRepo.findOne({
        where: { id: input.id },
        relations: {
          string: { property: true },
          flag: { flag: true },
        },
      });
      await beforeItem.save();

      await new PropertyUpdateOperation(trans, Property2stringEntity).save(beforeItem, input);
      await new FlagUpdateOperation(trans, Property2flagEntity).save(beforeItem, input);
    });

    return this.propertyRepo.findOne({
      where: { id: input.id },
      loadRelationIds: true,
    });
  }

  async delete(id: string[]): Promise<string[]> {
    const result = [];
    const list = await this.propertyRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.propertyRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
