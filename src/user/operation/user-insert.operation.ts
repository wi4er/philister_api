import { EntityManager } from "typeorm";
import { FlagEntity } from "../../flag/model/flag.entity";
import { UserInputSchema } from "../schema/user-input.schema";
import { UserEntity } from "../model/user.entity";
import { PropertyEntity } from "../../property/model/property.entity";
import { User2stringEntity } from "../model/user2string.entity";

export class UserInsertOperation {

  created: UserEntity;
  manager: EntityManager;

  constructor(
    private item: UserInputSchema
  ) {
    this.created = new UserEntity();
    this.created.id = this.item.id;
    this.created.login = item.login;
  }

  async save(manager: EntityManager): Promise<UserEntity> {
    this.manager = manager;
    const langRepo = this.manager.getRepository(UserEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      await trans.save(this.created);

      for await (const prop of this.addProperty()) {
        await trans.save(prop);
      }
    });

    return langRepo.findOne({
      where: { id: this.item.id },
      loadRelationIds: true,
    });
  }

  async* addProperty() {
    const propRepo = this.manager.getRepository(PropertyEntity);

    for (const item of this.item.property ?? []) {
      const inst = new User2stringEntity();
      inst.parent = this.created;
      inst.property = await propRepo.findOne({ where: { id: item.property } });
      inst.string = item.string;

      yield inst;
    }
  }

}