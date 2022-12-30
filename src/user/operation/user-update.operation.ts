import { UserEntity } from "../model/user.entity";
import { EntityManager } from "typeorm";
import { UserInputSchema } from "../schema/user-input.schema";
import { PropertyEntity } from "../../property/model/property.entity";
import { UserStringEntity } from "../model/user-string.entity";

export class UserUpdateOperation {

  beforeItem: UserEntity;
  manager: EntityManager;

  constructor(
    private updateItem: UserInputSchema
  ) {
  }

  async save(manager: EntityManager): Promise<UserEntity> {
    this.manager = manager;
    const langRepo = this.manager.getRepository(UserEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      this.beforeItem = await langRepo.findOne({
        where: { id: this.updateItem.id },
        relations: {
          string: { property: true },
          flag: {flag: true},
        },
      });

      this.beforeItem.login = this.updateItem.login;
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

    const current: { [key: string]: Array<UserStringEntity> } = {};

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
        inst = new UserStringEntity();
      }

      inst.parent = this.beforeItem;
      inst.property = await propRepo.findOne({ where: { id: item.property } });
      inst.string = item.string;

      await trans.save(inst);
    }

    for (const prop of Object.values(current)) {
      for (const item of prop) {
        await trans.delete(UserStringEntity, item.id);
      }
    }
  }
}