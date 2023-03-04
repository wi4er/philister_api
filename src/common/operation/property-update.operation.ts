import { BaseEntity, EntityManager } from 'typeorm';
import { CommonStringEntity } from '../model/common-string.entity';
import { PropertyEntity } from '../../property/model/property.entity';
import { LangEntity } from '../../lang/model/lang.entity';
import { WithStringEntity } from '../model/with-string.entity';
import { WithPropertyInputSchema } from '../schema/with-property-input.schema';

export class PropertyUpdateOperation<T extends WithStringEntity<BaseEntity>> {

  constructor(
    private trans: EntityManager,
    private entity: new() => CommonStringEntity<T>,
  ) {
  }

  async save(beforeItem: T, input: WithPropertyInputSchema) {
    const propRepo = this.trans.getRepository(PropertyEntity);
    const langRepo = this.trans.getRepository(LangEntity);
    const current: { [key: string]: Array<CommonStringEntity<BaseEntity>> } = {};

    for (const item of beforeItem.string) {
      if (!current[item.property.id]) {
        current[item.property.id] = [];
      }

      current[item.property.id].push(item);
    }

    for (const item of input.property ?? []) {
      let inst;

      if (current[item.property]?.[0]) {
        inst = current[item.property].shift();
      } else {
        inst = new this.entity();
      }

      inst.parent = beforeItem;
      inst.property = await propRepo.findOne({ where: { id: item.property } });
      inst.string = item.string;
      inst.lang = await langRepo.findOne({ where: { id: item.lang } });

      await this.trans.save(inst);
    }

    for (const prop of Object.values(current)) {
      for (const item of prop) {
        await this.trans.delete(this.entity, item.id);
      }
    }
  }

}