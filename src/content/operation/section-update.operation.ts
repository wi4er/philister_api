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
import { SectionEntity } from '../model/section.entity';
import { Section2stringEntity } from '../model/section2string.entity';
import { Section2flagEntity } from '../model/section2flag.entity';
import { SectionInputSchema } from '../schema/section-input.schema';

export class SectionUpdateOperation {

  beforeItem: SectionEntity;

  constructor(
    private manager: EntityManager,
  ) {
  }

  async save(input: SectionInputSchema): Promise<SectionEntity> {
    const sectionRepo = this.manager.getRepository(SectionEntity);
    const blockRepo = this.manager.getRepository(BlockEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      this.beforeItem = await sectionRepo.findOne({
        where: { id: input.id },
        relations: {
          string: { property: true },
          flag: { flag: true },
          block: true,
        },
      });

      this.beforeItem.block = await blockRepo.findOne({ where: { id: input.block } });
      if (input.parent) this.beforeItem.parent = await sectionRepo.findOne({ where: { id: input.parent } });
      await this.beforeItem.save();

      await new PropertyUpdateOperation(trans, Section2stringEntity).save(this.beforeItem, input);
      await new FlagUpdateOperation(trans, Section2flagEntity).save(this.beforeItem, input);
    });

    return sectionRepo.findOne({
      where: { id: input.id },
      loadRelationIds: true,
    });
  }

}