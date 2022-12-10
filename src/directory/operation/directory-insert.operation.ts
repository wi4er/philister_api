import { LangEntity } from "../../lang/model/lang.entity";
import { EntityManager } from "typeorm";
import { DirectoryEntity } from "../model/directory.entity";
import { PropertyEntity } from "../../property/model/property.entity";
import { getManager } from "typeorm/globals";
import { DirectoryInputSchema } from "../schema/directory-input.schema";
import { DirectoryStringEntity } from "../model/directory-string.entity";
import { ValueEntity } from "../model/value.entity";
import { FlagEntity } from "../../flag/model/flag.entity";
import { DirectoryFlagEntity } from "../model/directory-flag.entity";

export class DirectoryInsertOperation {

  created: DirectoryEntity;
  manager: EntityManager;

  constructor(
    private item: DirectoryInputSchema
  ) {
    this.created = new DirectoryEntity();
    this.created.id = this.item.id;
  }

  async save(): Promise<DirectoryEntity> {
    this.manager = getManager();
    const directoryRepo = this.manager.getRepository(DirectoryEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      await trans.save(this.created);

      await this.addProperty(trans);
      await this.addValue(trans);
      await this.addFlag(trans);
    });

    return directoryRepo.findOne({
      where: { id: this.item.id },
      loadRelationIds: true,
    });
  }

  async addProperty(trans: EntityManager) {
    const propRepo = this.manager.getRepository(PropertyEntity);
    const langRepo = this.manager.getRepository(LangEntity);

    for (const item of this.item.property ?? []) {
      const inst = new DirectoryStringEntity();
      inst.parent = this.created;
      inst.property = await propRepo.findOne({ where: { id: item.property } });
      inst.string = item.string;
      inst.lang = await langRepo.findOne({ where: { id: item.lang } });

      await trans.save(inst);
    }
  }

  async addValue(trans: EntityManager) {
    for (const item of this.item.value ?? []) {
      const inst = new ValueEntity();
      inst.id = item;
      inst.directory = this.created;

      await trans.save(inst);
    }
  }

  async addFlag(trans: EntityManager) {
    const flagRepo = this.manager.getRepository(FlagEntity);

    for (const item of this.item.flag ?? []) {
      const inst = new DirectoryFlagEntity();
      inst.parent = this.created;
      inst.flag = await flagRepo.findOne({ where: { id: item } });

      await trans.save(inst);
    }
  }

}