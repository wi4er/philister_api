import { BlockEntity } from '../model/block.entity';
import { EntityManager } from 'typeorm';
import { BlockInputSchema } from '../schema/block-input.schema';
import { PropertyInsertOperation } from '../../common/operation/property-insert.operation';
import { Block2stringEntity } from '../model/block2string.entity';
import { Block2flagEntity } from '../model/block2flag.entity';
import { FlagInsertOperation } from '../../common/operation/flag-insert.operation';

export class BlockInsertOperation {

  created: BlockEntity;

  constructor(
    private manager: EntityManager
  ) {
    this.created = new BlockEntity();
  }

  async save(input: BlockInputSchema): Promise<BlockEntity> {
    const userRepo = this.manager.getRepository(BlockEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      await trans.save(this.created);

      await new PropertyInsertOperation(trans, Block2stringEntity).save(this.created, input);
      await new FlagInsertOperation(trans, Block2flagEntity).save(this.created, input);
    });

    return userRepo.findOne({
      where: { id: this.created.id },
      loadRelationIds: true,
    });
  }

}