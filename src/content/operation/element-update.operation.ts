import { BlockEntity } from '../model/block.entity';
import { EntityManager } from 'typeorm';
import { BlockInputSchema } from '../schema/block-input.schema';
import { PropertyUpdateOperation } from '../../common/operation/property-update.operation';
import { FlagUpdateOperation } from '../../common/operation/flag-update.operation';
import { Block2stringEntity } from '../model/block2string.entity';
import { Block2flagEntity } from '../model/block2flag.entity';
import { ElementEntity } from '../model/element.entity';
import { Element2stringEntity } from '../model/element2string.entity';
import { Element2flagEntity } from '../model/element2flag.entity';
import { ElementInputSchema } from '../schema/element-input.schema';

export class ElementUpdateOperation {

  beforeItem: ElementEntity;

  constructor(
    private manager: EntityManager,
  ) {
  }

  async save(input: ElementInputSchema): Promise<ElementEntity> {
    const elementRepo = this.manager.getRepository(ElementEntity);
    const blockRepo = this.manager.getRepository(BlockEntity)

    await this.manager.transaction(async (trans: EntityManager) => {
      this.beforeItem = await elementRepo.findOne({
        where: { id: input.id },
        relations: {
          string: { property: true },
          flag: { flag: true },
          block: true,
        },
      });
      this.beforeItem.block = await blockRepo.findOne({ where: { id: input.block }});
      await this.beforeItem.save();

      await new PropertyUpdateOperation(trans, Element2stringEntity).save(this.beforeItem, input);
      await new FlagUpdateOperation(trans, Element2flagEntity).save(this.beforeItem, input);
    });

    return elementRepo.findOne({
      where: { id: input.id },
      loadRelationIds: true,
    });
  }

}