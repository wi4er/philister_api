import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, In } from 'typeorm';
import { SectionEntity } from '../../model/section.entity';
import { BlockEntity } from '../../model/block.entity';
import { PropertyInsertOperation } from '../../../common/operation/property-insert.operation';
import { Section2stringEntity } from '../../model/section2string.entity';
import { FlagInsertOperation } from '../../../common/operation/flag-insert.operation';
import { Section2flagEntity } from '../../model/section2flag.entity';
import { SectionInputSchema } from '../../schema/section-input.schema';
import { PropertyUpdateOperation } from '../../../common/operation/property-update.operation';
import { FlagUpdateOperation } from '../../../common/operation/flag-update.operation';

@Injectable()
export class SectionService {

  constructor(
    @InjectEntityManager()
    private manager: EntityManager,
  ) {
  }

  async insert(input: SectionInputSchema): Promise<SectionEntity> {
    const sectionRepo = this.manager.getRepository(SectionEntity);
    const blockRepo = this.manager.getRepository(BlockEntity);
    const created = new SectionEntity();

    await this.manager.transaction(async (trans: EntityManager) => {
      created.block = await blockRepo.findOne({ where: { id: input.block } });

      if (input.parent) created.parent = await sectionRepo.findOne({ where: { id: input.parent } });
      await trans.save(created);

      await new PropertyInsertOperation(trans, Section2stringEntity).save(created, input);
      await new FlagInsertOperation(trans, Section2flagEntity).save(created, input);
    });

    return sectionRepo.findOne({
      where: { id: created.id },
      loadRelationIds: true,
    });
  }

  async update(input: SectionInputSchema): Promise<SectionEntity> {
    const sectionRepo = this.manager.getRepository(SectionEntity);
    const blockRepo = this.manager.getRepository(BlockEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      const beforeItem = await sectionRepo.findOne({
        where: { id: input.id },
        relations: {
          string: { property: true },
          flag: { flag: true },
          block: true,
        },
      });

      beforeItem.block = await blockRepo.findOne({ where: { id: input.block } });
      if (input.parent) beforeItem.parent = await sectionRepo.findOne({ where: { id: input.parent } });
      await beforeItem.save();

      await new PropertyUpdateOperation(trans, Section2stringEntity).save(beforeItem, input);
      await new FlagUpdateOperation(trans, Section2flagEntity).save(beforeItem, input);
    });

    return sectionRepo.findOne({
      where: { id: input.id },
      loadRelationIds: true,
    });
  }

  async delete(id: number[]) {
    const sectionRepo = this.manager.getRepository(SectionEntity);

    const result = [];
    const list = await sectionRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await sectionRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
