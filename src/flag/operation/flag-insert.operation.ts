import { EntityManager } from "typeorm";
import { PropertyEntity } from "../../property/model/property.entity";
import { FlagStringEntity } from "../model/flag-string.entity";
import { FlagFlagEntity } from "../model/flag-flag.entity";
import { FlagInputSchema } from "../schema/flag-input.schema";
import { FlagEntity } from "../model/flag.entity";
import { LangEntity } from "../../lang/model/lang.entity";
import { CommonFlagEntity } from "../../common/model/common-flag.entity";

export class FlagInsertOperation {

  created: FlagEntity;
  manager: EntityManager;

  constructor(
    private item: FlagInputSchema,
  ) {
    this.created = new FlagEntity();
    this.created.id = this.item.id;
  }

  async save(manager: EntityManager): Promise<FlagEntity> {
    this.manager = manager;
    const flagRepo = this.manager.getRepository(FlagEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      await trans.save(this.created);

      for await (const prop of this.addProperty()) {
        await trans.save(prop);
      }

      for await (const flag of this.addFlag()) {
        await trans.save(flag);
      }
    });

    return flagRepo.findOne({
      where: { id: this.item.id },
      loadRelationIds: true,
    });
  }

  async* addProperty() {
    const propRepo = this.manager.getRepository(PropertyEntity);
    const langRepo = this.manager.getRepository(LangEntity);

    for (const item of this.item.property ?? []) {
      const inst = new FlagStringEntity();
      inst.parent = this.created;
      inst.property = await propRepo.findOne({ where: { id: item.property } });
      inst.string = item.string;
      inst.lang = await langRepo.findOne({ where: { id: item.lang } });

      yield inst;
    }
  }

  async* addFlag() {
    const flagRepo = this.manager.getRepository(FlagEntity);

    for (const item of this.item.flag ?? []) {
      const inst = new FlagFlagEntity();
      inst.parent = this.created;
      inst.flag = await flagRepo.findOne({ where: { id: item } });

      yield inst;
    }
  }

}