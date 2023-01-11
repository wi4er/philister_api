import { EntityManager } from "typeorm";
import { UserEntity } from "../model/user.entity";
import { UserInputSchema } from "../schema/user-input.schema";
import { UserContactEntity } from "../model/user-contact.entity";
import { User2userContactEntity } from "../model/user2user-contact.entity";

export class User2userContactInsertOperation {

  constructor(
    private trans: EntityManager,
  ) {

  }

  async save(created: UserEntity, input: UserInputSchema) {
    const contactRepo = this.trans.getRepository(UserContactEntity);

    for (const item of input.contact ?? []) {
      const inst = new User2userContactEntity();
      inst.parent = created;
      inst.contact = await contactRepo.findOne({ where: { id: item.contact } });
      inst.value = item.value;
      inst.verify = false;
      inst.verifyCode = 'qwerty';

      await this.trans.save(inst);
    }
  }

}