import { BaseEntity, EntityManager } from "typeorm";
import { CommonStringEntity } from "../model/common-string.entity";
import { PropertyEntity } from "../../property/model/property.entity";
import { WithPropertyInputSchema } from "../schema/with-property-input.schema";
import { FlagEntity } from "../../flag/model/flag.entity";
import { CommonFlagEntity } from "../model/common-flag.entity";
import { WithFlagInputSchema } from "../schema/with-flag.input.schema";
import { LangEntity } from "../../lang/model/lang.entity";

export abstract class InsertOperation<T extends BaseEntity> {

  created: T;

  protected input: WithPropertyInputSchema & WithFlagInputSchema;

  protected manager: EntityManager;

  protected constructor() {

  }

  async addString(trans: EntityManager, entity: { new(): CommonStringEntity<T> }) {
    const propRepo = this.manager.getRepository(PropertyEntity);
    const langRepo = this.manager.getRepository(LangEntity);

    for (const item of this.input.property ?? []) {
      const inst = new entity();
      inst.parent = this.created;
      inst.property = await propRepo.findOne({ where: { id: item.property } });
      inst.string = item.string;
      inst.lang = await langRepo.findOne({ where: { id: item.lang } });

      await trans.save(inst);
    }
  }

  async addFlag(trans: EntityManager, entity: { new(): CommonFlagEntity<T> }) {
    const flagRepo = this.manager.getRepository(FlagEntity);

    for (const item of this.input.flag ?? []) {
      const inst = new entity();
      inst.parent = this.created;
      inst.flag = await flagRepo.findOne({ where: { id: item } });

      await trans.save(inst);
    }
  }
}