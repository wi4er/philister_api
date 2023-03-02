import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { SectionEntity } from '../../model/section.entity';
import { BlockEntity } from '../../model/block.entity';
import { PropertyInsertOperation } from '../../../common/operation/property-insert.operation';
import { Section2stringEntity } from '../../model/section2string.entity';
import { FlagInsertOperation } from '../../../common/operation/flag-insert.operation';
import { Section2flagEntity } from '../../model/section2flag.entity';
import { SectionInputSchema } from '../../schema/section-input.schema';
import { PropertyUpdateOperation } from '../../../common/operation/property-update.operation';
import { FlagUpdateOperation } from '../../../common/operation/flag-update.operation';
import { Element2flagEntity } from '../../model/element2flag.entity';

@Injectable()
export class SectionService {

  constructor(
    @InjectEntityManager()
    private manager: EntityManager,
    @InjectRepository(Section2flagEntity)
    private sectionFlagRepo: Repository<Section2flagEntity>,
    @InjectRepository(SectionEntity)
    private sectionRepo: Repository<SectionEntity>,
    @InjectRepository(BlockEntity)
    private blockRepo: Repository<BlockEntity>,
  ) {
  }

  async insert(input: SectionInputSchema): Promise<SectionEntity> {
    const created = new SectionEntity();

    await this.manager.transaction(async (trans: EntityManager) => {
      created.block = await this.blockRepo.findOne({ where: { id: input.block } });

      if (input.parent) created.parent = await this.sectionRepo.findOne({ where: { id: input.parent } });
      await trans.save(created);

      await new PropertyInsertOperation(trans, Section2stringEntity).save(created, input);
      await new FlagInsertOperation(trans, Section2flagEntity).save(created, input);
    });

    return this.sectionRepo.findOne({
      where: { id: created.id },
      loadRelationIds: true,
    });
  }

  async update(input: SectionInputSchema): Promise<SectionEntity> {
    await this.manager.transaction(async (trans: EntityManager) => {
      const beforeItem = await this.sectionRepo.findOne({
        where: { id: input.id },
        relations: {
          string: { property: true },
          flag: { flag: true },
          block: true,
        },
      });

      beforeItem.block = await this.blockRepo.findOne({ where: { id: input.block } });
      if (input.parent) beforeItem.parent = await this.sectionRepo.findOne({ where: { id: input.parent } });
      await beforeItem.save();

      await new PropertyUpdateOperation(trans, Section2stringEntity).save(beforeItem, input);
      await new FlagUpdateOperation(trans, Section2flagEntity).save(beforeItem, input);
    });

    return this.sectionRepo.findOne({
      where: { id: input.id },
      loadRelationIds: true,
    });
  }

  async toggleFlag(id: number, flag: string): Promise<SectionEntity> {
    await this.manager.transaction(async (trans: EntityManager) => {
      const item = await this.sectionFlagRepo.findOne({
        where: { parent: { id }, flag: { id: flag } },
      });

      if (item === null) {
        await Object.assign(
          new Section2flagEntity(),
          { parent: id, flag },
        ).save();
      } else {
        await trans.delete(Section2flagEntity, { id: item.id });
      }
    });

    return this.sectionRepo.findOne({
      where: { id },
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
