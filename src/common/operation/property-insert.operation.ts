import { WithPropertyInputSchema } from '../schema/with-property-input.schema';
import { BaseEntity, EntityManager } from 'typeorm';
import { CommonStringEntity } from '../model/common-string.entity';
import { PropertyEntity } from '../../property/model/property.entity';
import { LangEntity } from '../../lang/model/lang.entity';

export class PropertyInsertOperation<T extends BaseEntity> {

  constructor(
    private trans: EntityManager,
    private entity: new() => CommonStringEntity<T>,
  ) {

  }

  async save(created: T, input: WithPropertyInputSchema) {
    const propRepo = this.trans.getRepository(PropertyEntity);
    const langRepo = this.trans.getRepository(LangEntity);

    for (const item of input.property ?? []) {
      const inst = new this.entity();
      inst.parent = created;
      inst.property = await propRepo.findOne({ where: { id: item.property } });
      inst.string = item.string;
      inst.lang = item.lang ? await langRepo.findOne({ where: { id: item.lang } }) : null;

      await this.trans.save(inst);
    }
  }

}