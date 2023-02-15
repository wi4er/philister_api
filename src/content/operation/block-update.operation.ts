import { BlockEntity } from '../model/block.entity';
import { EntityManager } from 'typeorm';
import { BlockInputSchema } from '../schema/block-input.schema';
import { PropertyUpdateOperation } from '../../common/operation/property-update.operation';
import { FlagUpdateOperation } from '../../common/operation/flag-update.operation';
import { Block2stringEntity } from '../model/block2string.entity';
import { Block2flagEntity } from '../model/block2flag.entity';

export class BlockUpdateOperation {

  beforeItem: BlockEntity;

  constructor(
    private manager: EntityManager,
  ) {
  }

  async save(input: BlockInputSchema): Promise<BlockEntity> {
    const userRepo = this.manager.getRepository(BlockEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      this.beforeItem = await userRepo.findOne({
        where: { id: input.id },
        relations: {
          string: { property: true },
          flag: { flag: true },
        },
      });

      await this.beforeItem.save();

      await new PropertyUpdateOperation(trans, Block2stringEntity).save(this.beforeItem, input);
      await new FlagUpdateOperation(trans, Block2flagEntity).save(this.beforeItem, input);
    });

    return userRepo.findOne({
      where: { id: input.id },
      loadRelationIds: true,
    });
  }

}