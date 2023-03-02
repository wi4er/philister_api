import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { ElementEntity } from '../../model/element.entity';
import { BlockEntity } from '../../model/block.entity';
import { PropertyInsertOperation } from '../../../common/operation/property-insert.operation';
import { Element2stringEntity } from '../../model/element2string.entity';
import { FlagInsertOperation } from '../../../common/operation/flag-insert.operation';
import { Element2flagEntity } from '../../model/element2flag.entity';
import { ElementInputSchema } from '../../schema/element-input.schema';
import { PropertyUpdateOperation } from '../../../common/operation/property-update.operation';
import { FlagUpdateOperation } from '../../../common/operation/flag-update.operation';

@Injectable()
export class ElementService {

  constructor(
    @InjectEntityManager()
    private manager: EntityManager,
    @InjectRepository(ElementEntity)
    private elementRepo: Repository<ElementEntity>,
    @InjectRepository(Element2flagEntity)
    private elementFlagRepo: Repository<Element2flagEntity>,
    @InjectRepository(BlockEntity)
    private blockRepo: Repository<BlockEntity>,
  ) {
  }

  async insert(input: ElementInputSchema): Promise<ElementEntity> {
    const created = new ElementEntity();

    await this.manager.transaction(async (trans: EntityManager) => {
      created.block = await this.blockRepo.findOne({ where: { id: input.block } });
      await trans.save(created);

      await new PropertyInsertOperation(trans, Element2stringEntity).save(created, input);
      await new FlagInsertOperation(trans, Element2flagEntity).save(created, input);
    });

    return this.elementRepo.findOne({
      where: { id: created.id },
      loadRelationIds: true,
    });
  }

  async update(input: ElementInputSchema): Promise<ElementEntity> {
    await this.manager.transaction(async (trans: EntityManager) => {
      const beforeItem = await this.elementRepo.findOne({
        where: { id: input.id },
        relations: {
          string: { property: true },
          flag: { flag: true },
          block: true,
        },
      });
      beforeItem.block = await this.blockRepo.findOne({ where: { id: input.block } });
      await beforeItem.save();

      await new PropertyUpdateOperation(trans, Element2stringEntity).save(beforeItem, input);
      await new FlagUpdateOperation(trans, Element2flagEntity).save(beforeItem, input);
    });

    return this.elementRepo.findOne({
      where: { id: input.id },
      loadRelationIds: true,
    });
  }

  async toggleFlag(id: number, flag: string): Promise<ElementEntity> {
    await this.manager.transaction(async (trans: EntityManager) => {
      const item = await this.elementFlagRepo.findOne({
        where: { parent: { id }, flag: { id: flag } },
      });

      if (item === null) {
        await Object.assign(
          new Element2flagEntity(),
          { parent: id, flag },
        ).save();
      } else {
        await trans.delete(Element2flagEntity, { id: item.id });
      }
    });

    return this.elementRepo.findOne({
      where: { id },
      loadRelationIds: true,
    });
  }

  async delete(id: number[]): Promise<number[]> {
    const result = [];
    const list = await this.elementRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await this.elementRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}
