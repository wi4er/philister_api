import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
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
    @InjectRepository(BlockEntity)
    private blockRepo: Repository<BlockEntity>,
    @InjectRepository(Block2flagEntity)
    private blockFlagRepo: Repository<Block2flagEntity>,
  ) {
  }

  async insert(input: BlockInputSchema): Promise<BlockEntity> {
    const created = new BlockEntity();

    await this.manager.transaction(async (trans: EntityManager) => {
      await trans.save(created);

      await new PropertyInsertOperation(trans, Block2stringEntity).save(created, input);
      await new FlagInsertOperation(trans, Block2flagEntity).save(created, input);
    });

    return this.blockRepo.findOne({
      where: { id: created.id },
      loadRelationIds: true,
    });
  }

  async update(input: BlockInputSchema): Promise<BlockEntity> {
    await this.manager.transaction(async (trans: EntityManager) => {
      const beforeItem = await this.blockRepo.findOne({
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

    return this.blockRepo.findOne({
      where: { id: input.id },
      loadRelationIds: true,
    });
  }

  async toggleFlag(id: number, flag: string): Promise<BlockEntity> {
    await this.manager.transaction(async (trans: EntityManager) => {
      const item = await this.blockFlagRepo.findOne({
        where: { parent: { id }, flag: { id: flag } },
      });

      if (item === null) {
        await Object.assign(
          new Block2flagEntity(),
          { parent: id, flag },
        ).save();
      } else {
        await trans.delete(Block2flagEntity, { id: item.id });
      }
    });

    return this.blockRepo.findOne({
      where: { id },
      loadRelationIds: true,
    });
  }

  async delete(id: number[]): Promise<number[]> {
    const result = [];
    const list = await this.blockRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.blockRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
