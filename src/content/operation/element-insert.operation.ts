import { BlockEntity } from '../model/block.entity';
import { EntityManager } from 'typeorm';
import { BlockInputSchema } from '../schema/block-input.schema';
import { PropertyInsertOperation } from '../../common/operation/property-insert.operation';
import { Block2stringEntity } from '../model/block2string.entity';
import { Block2flagEntity } from '../model/block2flag.entity';
import { FlagInsertOperation } from '../../common/operation/flag-insert.operation';
import { ElementInputSchema } from '../schema/element-input.schema';
import { ElementEntity } from '../model/element.entity';
import { Element2stringEntity } from '../model/element2string.entity';
import { Element2flagEntity } from '../model/element2flag.entity';

export class ElementInsertOperation {

  created: ElementEntity;

  constructor(
    private manager: EntityManager
  ) {
    this.created = new ElementEntity();
  }

  async save(input: ElementInputSchema): Promise<ElementEntity> {
    const elementRepo = this.manager.getRepository(ElementEntity);
    const blockRepo = this.manager.getRepository(BlockEntity)

    await this.manager.transaction(async (trans: EntityManager) => {
      this.created.block = await blockRepo.findOne({ where: { id: input.block }});
      await trans.save(this.created);

      await new PropertyInsertOperation(trans, Element2stringEntity).save(this.created, input);
      await new FlagInsertOperation(trans, Element2flagEntity).save(this.created, input);
    });

    return elementRepo.findOne({
      where: { id: this.created.id },
      loadRelationIds: true,
    });
  }

}