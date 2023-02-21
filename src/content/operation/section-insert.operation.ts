import { BlockEntity } from '../model/block.entity';
import { EntityManager } from 'typeorm';
import { PropertyInsertOperation } from '../../common/operation/property-insert.operation';
import { FlagInsertOperation } from '../../common/operation/flag-insert.operation';
import { SectionEntity } from '../model/section.entity';
import { SectionInputSchema } from '../schema/section-input.schema';
import { Section2stringEntity } from '../model/section2string.entity';
import { Section2flagEntity } from '../model/section2flag.entity';

export class SectionInsertOperation {

  created: SectionEntity;

  constructor(
    private manager: EntityManager,
  ) {
    this.created = new SectionEntity();
  }

  async save(input: SectionInputSchema): Promise<SectionEntity> {
    const sectionRepo = this.manager.getRepository(SectionEntity);
    const blockRepo = this.manager.getRepository(BlockEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      this.created.block = await blockRepo.findOne({ where: { id: input.block } });

      console.log(input.parent);

      if (input.parent) this.created.parent = await sectionRepo.findOne({ where: { id: input.parent } });
      await trans.save(this.created);

      await new PropertyInsertOperation(trans, Section2stringEntity).save(this.created, input);
      await new FlagInsertOperation(trans, Section2flagEntity).save(this.created, input);
    });

    return sectionRepo.findOne({
      where: { id: this.created.id },
      loadRelationIds: true,
    });
  }

}