import { EntityManager } from "typeorm";
import { PropertyEntity } from "../../property/model/property.entity";
import { User2stringEntity } from "../model/user2string.entity";
import { UserContactInputSchema } from "../schema/user-contact-input.schema";
import { UserContactEntity } from "../model/user-contact.entity";
import { UserContact2stringEntity } from "../model/user-contact2string.entity";

export class UserContactUpdateOperation {

  beforeItem: UserContactEntity;

  manager: EntityManager;

  constructor(
    private updateItem: UserContactInputSchema
  ) {
  }

  async save(manager: EntityManager): Promise<UserContactEntity> {
    this.manager = manager;
    const langRepo = this.manager.getRepository(UserContactEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      this.beforeItem = await langRepo.findOne({
        where: { id: this.updateItem.id },
        relations: {
          string: { property: true },
          flag: {flag: true},
        },
      });

      this.beforeItem.type = this.updateItem.type;
      await this.addProperty(trans);

      await this.beforeItem.save();
    });

    return langRepo.findOne({
      where: { id: this.updateItem.id },
      loadRelationIds: true,
    });
  }

  async addProperty(trans: EntityManager) {
    const propRepo = this.manager.getRepository(PropertyEntity);

    const current: { [key: string]: Array<UserContact2stringEntity> } = {};

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
        inst = new User2stringEntity();
      }

      inst.parent = this.beforeItem;
      inst.property = await propRepo.findOne({ where: { id: item.property } });
      inst.string = item.string;

      await trans.save(inst);
    }

    for (const prop of Object.values(current)) {
      for (const item of prop) {
        await trans.delete(UserContact2stringEntity, item.id);
      }
    }
  }
}