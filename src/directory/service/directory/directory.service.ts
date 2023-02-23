import { Injectable } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';
import { DirectoryEntity } from '../../model/directory.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
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
    @InjectRepository(DirectoryEntity)
    private directoryRepo: Repository<DirectoryEntity>,
  ) {
  }

  async insert(input: DirectoryInputSchema): Promise<DirectoryEntity> {
    const created = new DirectoryEntity();

    await this.manager.transaction(async (trans: EntityManager) => {
      created.id = input.id;
      await trans.save(created);

      await new PropertyInsertOperation(trans, Directory2stringEntity).save(created, input);
      await new FlagInsertOperation(trans, Directory2flagEntity).save(created, input);
      await new ValueInsertOperation(trans).save(created, input);
    });

    return this.directoryRepo.findOne({
      where: { id: created.id },
      loadRelationIds: true,
    });
  }

  async update(input: DirectoryInputSchema): Promise<DirectoryEntity> {
    await this.manager.transaction(async (trans: EntityManager) => {
      const beforeItem = await this.directoryRepo.findOne({
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

    return this.directoryRepo.findOne({
      where: { id: input.id },
      loadRelationIds: true,
    });
  }

  async delete(id: string[]): Promise<string[]> {
    const result = [];
    const list = await this.directoryRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.directoryRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
