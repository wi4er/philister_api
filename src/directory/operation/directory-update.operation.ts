import { LangEntity } from "../../lang/model/lang.entity";
import { EntityManager } from "typeorm";
import { getManager } from "typeorm/globals";
import { PropertyEntity } from "../../property/model/property.entity";
import { LangStringEntity } from "../../lang/model/lang-string.entity";
import { FlagEntity } from "../../flag/model/flag.entity";
import { DirectoryInputSchema } from "../schema/directory-input.schema";
import { DirectoryEntity } from "../model/directory.entity";
import { DirectoryStringEntity } from "../model/directory-string.entity";
import { DirectoryFlagEntity } from "../model/directory-flag.entity";
import { ValueEntity } from "../model/value.entity";

export class DirectoryUpdateOperation {

  beforeItem: DirectoryEntity;
  manager: EntityManager;

  constructor(
    private updateItem: DirectoryInputSchema
  ) {
  }

  async save(manager: EntityManager): Promise<DirectoryEntity> {
    this.manager = manager;
    const dirRepo = this.manager.getRepository(DirectoryEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      this.beforeItem = await dirRepo.findOne({
        where: { id: this.updateItem.id },
        relations: {
          string: { property: true },
          flag: { flag: true },
          value: true,
        },
      });

      await this.addProperty(trans);
      await this.addValue(trans);
      await this.addFlag(trans);

      await  this.beforeItem.save();
    });

    return dirRepo.findOne({
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
        inst = new DirectoryStringEntity();
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

  async addValue(trans: EntityManager) {
    const current: Array<string> = this.beforeItem.value.map(it => it.id);

    for (const item of this.updateItem.value ?? []) {
      if (current.includes(item)) {
        current.splice(current.indexOf(item), 1);
      } else {
        const inst = new ValueEntity();
        inst.id = item;
        inst.directory = this.beforeItem;

        await trans.save(inst);
      }
    }

    for (const item of current) {
      await trans.delete(ValueEntity, { id: item });
    }
  }

  async addFlag(trans: EntityManager) {
    const flagRepo = this.manager.getRepository(FlagEntity);
    const current: Array<string> = this.beforeItem.flag.map(it => it.flag.id);

    for (const item of this.updateItem.flag ?? []) {
      if (current.includes(item)) {
        current.splice(current.indexOf(item), 1);
      } else {
        const inst = new DirectoryFlagEntity();
        inst.parent = this.beforeItem;
        inst.flag = await flagRepo.findOne({ where: { id: item } });

        await trans.save(inst);
      }
    }

    for (const item of current) {
      await trans.delete(DirectoryFlagEntity, {
        parent: this.beforeItem.id,
        flag: item
      });
    }
  }
}