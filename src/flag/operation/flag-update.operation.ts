import { LangEntity } from "../../lang/model/lang.entity";
import { FlagEntity } from "../model/flag.entity";
import { FlagInputSchema } from "../schema/flag-input.schema";
import { EntityManager } from "typeorm";
import { PropertyEntity } from "../../property/model/property.entity";
import { FlagStringEntity } from "../model/flag-string.entity";
import { FlagFlagEntity } from "../model/flag-flag.entity";

export class FlagUpdateOperation {

  beforeItem: FlagEntity;
  manager: EntityManager;

  constructor(
    private updateItem: FlagInputSchema
  ) {
  }

  async save(manager: EntityManager): Promise<FlagEntity> {
    this.manager = manager;
    const flagRepo = this.manager.getRepository(FlagEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      this.beforeItem = await flagRepo.findOne({
        where: { id: this.updateItem.id },
        relations: {
          string: { property: true },
          flag: { flag: true },
        },
      });

      await this.addProperty(trans);
      await this.addFlag(trans)
    });

    return flagRepo.findOne({
      where: { id: this.updateItem.id },
      loadRelationIds: true,
    });
  }

  async addProperty(trans: EntityManager) {
    const propRepo = this.manager.getRepository(PropertyEntity);
    const langRepo = this.manager.getRepository(LangEntity);

    const current: { [key: string]: Array<FlagStringEntity> } = {};

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
        inst = new FlagStringEntity();
      }

      inst.parent = this.beforeItem;
      inst.property = await propRepo.findOne({ where: { id: item.property } });
      inst.string = item.string;
      inst.lang = await langRepo.findOne({ where: { id: item.lang } });

      await trans.save(inst);
    }

    for (const prop of Object.values(current)) {
      for (const item of prop) {
        await trans.delete(FlagStringEntity, item.id);
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
        const inst = new FlagFlagEntity();
        inst.parent = this.beforeItem;
        inst.flag = await flagRepo.findOne({ where: { id: item } });

        await trans.save(inst);
      }
    }

    for (const item of current) {
      await trans.delete(FlagFlagEntity, {
        parent: this.beforeItem.id,
        flag: item
      });
    }
  }

}