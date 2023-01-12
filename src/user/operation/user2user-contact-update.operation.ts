import { EntityManager } from "typeorm";
import { UserEntity } from "../model/user.entity";
import { UserInputSchema } from "../schema/user-input.schema";
import { User2userContactEntity } from "../model/user2user-contact.entity";
import { UserContactEntity } from "../model/user-contact.entity";

export class User2userContactUpdateOperation {
  constructor(
    private trans: EntityManager,
  ) {
  }

  async save(beforeItem: UserEntity, input: UserInputSchema) {
    const contactRepo = this.trans.getRepository(UserContactEntity);
    const current: { [key: string]: User2userContactEntity } = {};

    for (const item of beforeItem.contact) {
      current[item.contact.id] = item;
    }

    for (const item of input.contact ?? []) {
      let inst: User2userContactEntity;

      if (current[item.contact]) {
        inst = current[item.contact];
        delete current[item.contact];
      } else {
        inst = new User2userContactEntity();
        inst.verify = false;
        inst.verifyCode = '123123'
      }

      inst.parent = beforeItem;
      inst.contact = await contactRepo.findOne({ where: { id: item.contact } });
      inst.value = item.value;

      await this.trans.save(inst);
    }

    for (const contact of Object.values(current)) {
      await this.trans.delete(User2userContactEntity, contact.id);
    }
  }
}