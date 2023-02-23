import { Injectable } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';
import { PropertyInsertOperation } from '../../../common/operation/property-insert.operation';
import { FlagInsertOperation } from '../../../common/operation/flag-insert.operation';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { ValueInputSchema } from '../../schema/value-input.schema';
import { ValueEntity } from '../../model/value.entity';
import { Value2stringEntity } from '../../model/value2string.entity';
import { Value2flagEntity } from '../../model/value2flag.entity';
import { DirectoryEntity } from '../../model/directory.entity';
import { DirectoryInputSchema } from '../../schema/directory-input.schema';
import { PropertyUpdateOperation } from '../../../common/operation/property-update.operation';
import { Directory2stringEntity } from '../../model/directory2string.entity';
import { FlagUpdateOperation } from '../../../common/operation/flag-update.operation';
import { Directory2flagEntity } from '../../model/directory2flag.entity';
import { ValueUpdateOperation } from '../../operation/value-update.operation';

@Injectable()
export class ValueService {

  constructor(
    @InjectEntityManager()
    private manager: EntityManager,
    @InjectRepository(ValueEntity)
    private valueRepo: Repository<ValueEntity>,
    @InjectRepository(DirectoryEntity)
    private directoryRepo: Repository<DirectoryEntity>,
  ) {
  }

  async insert(input: ValueInputSchema): Promise<ValueEntity> {
    const created = new ValueEntity();

    await this.manager.transaction(async (trans: EntityManager) => {
      created.id = input.id;
      created.directory = await this.directoryRepo.findOne({ where: { id: input.directory } });
      await trans.save(created);

      await new PropertyInsertOperation(trans, Value2stringEntity).save(created, input);
      await new FlagInsertOperation(trans, Value2flagEntity).save(created, input);
    });

    return this.valueRepo.findOne({
      where: { id: created.id },
      loadRelationIds: true,
    });
  }

  async update(input: ValueInputSchema): Promise<ValueEntity> {
    await this.manager.transaction(async (trans: EntityManager) => {
      const beforeItem = await this.valueRepo.findOne({
        where: { id: input.id },
        relations: {
          string: { property: true },
          flag: { flag: true },
        },
      });
      beforeItem.directory = await this.directoryRepo.findOne({ where: { id: input.directory } });
      await beforeItem.save();

      await new PropertyUpdateOperation(trans, Value2stringEntity).save(beforeItem, input);
      await new FlagUpdateOperation(trans, Value2flagEntity).save(beforeItem, input);
    });

    return this.valueRepo.findOne({
      where: { id: input.id },
      loadRelationIds: true,
    });
  }

  async delete(id: string[]): Promise<string[]> {
    const result = [];
    const list = await this.valueRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.valueRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
