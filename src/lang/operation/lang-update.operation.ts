import { LangEntity } from "../model/lang.entity";
import { EntityManager } from "typeorm";
import { LangInputSchema } from "../schema/lang-input.schema";
import { PropertyEntity } from "../../property/model/property.entity";
import { LangStringEntity } from "../model/lang-string.entity";
import { LangFlagEntity } from "../model/lang-flag.entity";
import { FlagEntity } from "../../flag/model/flag.entity";

export class LangUpdateOperation {

  beforeItem: LangEntity;
  manager: EntityManager;

  constructor(
    private updateItem: LangInputSchema
  ) {
  }

  async save(manager: EntityManager): Promise<LangEntity> {
    this.manager = manager;
    const langRepo = this.manager.getRepository(LangEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      this.beforeItem = await langRepo.findOne({
        where: { id: this.updateItem.id },
        relations: {
          string: { property: true },
          flag: {flag: true},
        },
      });

      await this.addProperty(trans);
      await this.addFlag(trans)
    });

    return langRepo.findOne({
      where: { id: this.updateItem.id },
      loadRelationIds: true,
    });
  }

  async addProperty(trans: EntityManager) {
    const propRepo = this.manager.getRepository(PropertyEntity);
    const langRepo = this.manager.getRepository(LangEntity);

    const current: { [key: string]: Array<LangStringEntity> } = {};

    for (const item of this.beforeItem.string) {
      if (!current[item.property.id]) {
        current[item.property.id] = [];
      }

      current[item.property.id].push(item);
    }

    for (const item of this.updateItem.property ?? []) {
      let inst;

      if (current[item.property]?.[0]) {
        inst = current[item.property].shift();
      } else {
        inst = new LangStringEntity();
      }

      inst.parent = this.beforeItem;
      inst.property = await propRepo.findOne({ where: { id: item.property } });
      inst.string = item.string;
      inst.lang = await langRepo.findOne({ where: { id: item.lang } });

      await trans.save(inst);
    }

    for (const prop of Object.values(current)) {
      for (const item of prop) {
        await trans.delete(LangStringEntity, item.id);
      }
    }
  }

  async addFlag(trans: EntityManager) {
    const flagRepo = this.manager.getRepository(FlagEntity);

    const current: Array<string> = this.beforeItem.flag.map(it => it.flag.id);

    for (const item of this.updateItem.flag ?? []) {
      if (current.includes(item)) {
        current.splice(current.indexOf(item), 1);
      } else {
        const inst = new LangFlagEntity();
        inst.parent = this.beforeItem;
        inst.flag = await flagRepo.findOne({ where: { id: item } });

        await trans.save(inst);
      }
    }

    for (const item of current) {
      await trans.delete(LangFlagEntity, {
        parent: this.beforeItem.id,
        flag: item
      });
    }
  }

}