import { EntityManager } from "typeorm";
import { PropertyEntity } from "../../property/model/property.entity";
import { UserContactEntity } from "../model/user-contact.entity";
import { UserContact2stringEntity } from "../model/user-contact2string.entity";
import { UserContactInputSchema } from "../schema/user-contact/user-contact-input.schema";

export class UserContactInsertOperation {

  created: UserContactEntity;
  manager: EntityManager;

  constructor(
    private item: UserContactInputSchema
  ) {
    this.created = new UserContactEntity();
    this.created.id = this.item.id;
    this.created.type = this.item.type;
  }

  async save(manager: EntityManager): Promise<UserContactEntity> {
    this.manager = manager;
    const langRepo = this.manager.getRepository(UserContactEntity);

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
      const inst = new UserContact2stringEntity();
      inst.parent = this.created;
      inst.property = await propRepo.findOne({ where: { id: item.property } });
      inst.string = item.string;

      yield inst;
    }
  }

}