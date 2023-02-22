import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import { BlockInputSchema } from '../../schema/block-input.schema';
import { BlockEntity } from '../../model/block.entity';
import { PropertyInsertOperation } from '../../../common/operation/property-insert.operation';
import { Block2stringEntity } from '../../model/block2string.entity';
import { FlagInsertOperation } from '../../../common/operation/flag-insert.operation';
import { Block2flagEntity } from '../../model/block2flag.entity';
import { PropertyUpdateOperation } from '../../../common/operation/property-update.operation';
import { FlagUpdateOperation } from '../../../common/operation/flag-update.operation';

@Injectable()
export class BlockService {

  constructor(
    @InjectEntityManager()
    private manager: EntityManager,
  ) {
  }

  async insert(input: BlockInputSchema): Promise<BlockEntity> {
    const userRepo = this.manager.getRepository(BlockEntity);
    const created = new BlockEntity();

    await this.manager.transaction(async (trans: EntityManager) => {
      await trans.save(created);

      await new PropertyInsertOperation(trans, Block2stringEntity).save(created, input);
      await new FlagInsertOperation(trans, Block2flagEntity).save(created, input);
    });

    return userRepo.findOne({
      where: { id: created.id },
      loadRelationIds: true,
    });
  }

  async update(input: BlockInputSchema): Promise<BlockEntity> {
    const blockRepo = this.manager.getRepository(BlockEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      const beforeItem = await blockRepo.findOne({
        where: { id: input.id },
        relations: {
          string: { property: true },
          flag: { flag: true },
        },
      });

      await beforeItem.save();

      await new PropertyUpdateOperation(trans, Block2stringEntity).save(beforeItem, input);
      await new FlagUpdateOperation(trans, Block2flagEntity).save(beforeItem, input);
    });

    return blockRepo.findOne({
      where: { id: input.id },
      loadRelationIds: true,
    });
  }

  async delete(id: number[]): Promise<number[]> {
    const blockRepo = this.manager.getRepository(BlockEntity);

    const result = [];
    const list = await blockRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await blockRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }
}
