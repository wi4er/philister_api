import { BaseEntity, EntityManager } from "typeorm";
import { PropertyEntity } from "../../property/model/property.entity";
import { FlagEntity } from "../../flag/model/flag.entity";
import { WithPropertyInputSchema } from "../schema/with-property-input.schema";
import { WithFlagInputSchema } from "../schema/with-flag.input.schema";
import { CommonStringEntity } from "../model/common-string.entity";
import { WithStringEntity } from "../model/with-string.entity";
import { CommonFlagEntity } from "../model/common-flag.entity";
import { WithFlagEntity } from "../model/with-flag.entity";
import { LangEntity } from "../../lang/model/lang.entity";

export class UpdateOperation<T extends BaseEntity> {

  beforeItem: T & WithStringEntity<BaseEntity> & WithFlagEntity<BaseEntity>;

  protected input: WithPropertyInputSchema & WithFlagInputSchema;

  protected manager: EntityManager;

  async addString(trans: EntityManager, entity: new () => CommonStringEntity<T>) {
    const propRepo = this.manager.getRepository(PropertyEntity);
    const langRepo = this.manager.getRepository(LangEntity);
    const current: { [key: string]: Array<CommonStringEntity<BaseEntity>> } = {};

    for (const item of this.beforeItem.string) {
      if (!current[item.property.id]) {
        current[item.property.id] = [];
      }

      current[item.property.id].push(item);
    }

    for (const item of this.input.property ?? []) {
      let inst;

      if (current[item.property]?.[0]) {
        inst = current[item.property].shift();
      } else {
        inst = new entity();
      }


      inst.parent = this.beforeItem;
      inst.property = await propRepo.findOne({ where: { id: item.property } });
      inst.string = item.string;
      inst.lang = await langRepo.findOne({ where: {id: item.lang }});

      await trans.save(inst);
    }

    for (const prop of Object.values(current)) {
      for (const item of prop) {
        await trans.delete(entity, item.id);
      }
    }
  }

  async addFlag(trans: EntityManager, entity: new () => CommonFlagEntity<T>) {
    const flagRepo = this.manager.getRepository(FlagEntity);

    const current: Array<string> = this.beforeItem.flag.map(it => it.flag.id);

    for (const item of this.input.flag ?? []) {
      if (current.includes(item)) {
        current.splice(current.indexOf(item), 1);
      } else {
        const inst = new entity();
        inst.parent = this.beforeItem;
        inst.flag = await flagRepo.findOne({ where: { id: item } });

        await trans.save(inst);
      }
    }

    for (const item of current) {
      await trans.delete(entity, {
        parent: this.beforeItem,
        flag: item
      });
    }
  }

}