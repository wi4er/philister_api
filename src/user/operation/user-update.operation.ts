import { UserEntity } from "../model/user.entity";
import { EntityManager } from "typeorm";
import { UserInputSchema } from "../schema/user-input.schema";
import { User2stringEntity } from "../model/user2string.entity";
import { PropertyUpdateOperation } from "../../common/operation/property-update.operation";
import { FlagUpdateOperation } from "../../common/operation/flag-update.operation";
import { User2flagEntity } from "../model/user2flag.entity";
import { User2userContactUpdateOperation } from "./user2user-contact-update.operation";

export class UserUpdateOperation {

  beforeItem: UserEntity;

  constructor(
    private manager: EntityManager
  ) {
  }

  async save(input: UserInputSchema): Promise<UserEntity> {
    const userRepo = this.manager.getRepository(UserEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      this.beforeItem = await userRepo.findOne({
        where: { id: input.id },
        relations: {
          string: { property: true },
          flag: { flag: true },
          contact: { contact: true },
        },
      });

      this.beforeItem.login = input.login;
      await this.beforeItem.save();

      await new PropertyUpdateOperation(trans, User2stringEntity).save(this.beforeItem, input);
      await new FlagUpdateOperation(trans, User2flagEntity).save(this.beforeItem, input);
      await new User2userContactUpdateOperation(trans).save(this.beforeItem, input);

    });

    return userRepo.findOne({
      where: { id: input.id },
      loadRelationIds: true,
    });
  }

}