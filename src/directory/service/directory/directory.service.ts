import { Injectable } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';
import { DirectoryEntity } from '../../model/directory.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PropertyInsertOperation } from '../../../common/operation/property-insert.operation';
import { FlagInsertOperation } from '../../../common/operation/flag-insert.operation';
import { Directory2stringEntity } from '../../model/directory2string.entity';
import { Directory2flagEntity } from '../../model/directory2flag.entity';
import { DirectoryInputSchema } from '../../schema/directory-input.schema';
import { ValueInsertOperation } from '../../operation/value-insert.operation';
import { PropertyUpdateOperation } from '../../../common/operation/property-update.operation';
import { FlagUpdateOperation } from '../../../common/operation/flag-update.operation';
import { ValueUpdateOperation } from '../../operation/value-update.operation';

@Injectable()
export class DirectoryService {

  constructor(
    @InjectEntityManager()
    private manager: EntityManager,
  ) {
  }

  async insert(input: DirectoryInputSchema): Promise<DirectoryEntity> {
    const directoryRepo = this.manager.getRepository(DirectoryEntity);
    const created = new DirectoryEntity();

    await this.manager.transaction(async (trans: EntityManager) => {
      created.id = input.id;
      await trans.save(created);

      await new PropertyInsertOperation(trans, Directory2stringEntity).save(created, input);
      await new FlagInsertOperation(trans, Directory2flagEntity).save(created, input);
      await new ValueInsertOperation(trans).save(created, input);
    });

    return directoryRepo.findOne({
      where: { id: created.id },
      loadRelationIds: true,
    });
  }

  async update(input: DirectoryInputSchema): Promise<DirectoryEntity> {
    const directoryRepo = this.manager.getRepository(DirectoryEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      const beforeItem = await directoryRepo.findOne({
        where: { id: input.id },
        relations: {
          string: { property: true },
          flag: { flag: true },
          value: true,
        },
      });
      await beforeItem.save();

      await new PropertyUpdateOperation(trans, Directory2stringEntity).save(beforeItem, input);
      await new FlagUpdateOperation(trans, Directory2flagEntity).save(beforeItem, input);
      await new ValueUpdateOperation(trans).save(beforeItem, input);
    });

    return directoryRepo.findOne({
      where: { id: input.id },
      loadRelationIds: true,
    });
  }

  async delete(id: string[]): Promise<string[]> {
    const directoryRepo = this.manager.getRepository(DirectoryEntity);

    const result = [];
    const list = await directoryRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await directoryRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
