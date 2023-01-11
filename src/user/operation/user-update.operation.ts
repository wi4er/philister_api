import { UserEntity } from "../model/user.entity";
import { EntityManager } from "typeorm";
import { UserInputSchema } from "../schema/user-input.schema";
import { User2stringEntity } from "../model/user2string.entity";
import { PropertyUpdateOperation } from "../../common/operation/property-update.operation";

export class UserUpdateOperation {

  beforeItem: UserEntity;
  manager: EntityManager;

  constructor(
    private input: UserInputSchema
  ) {
  }

  async save(manager: EntityManager): Promise<UserEntity> {
    this.manager = manager;
    const userRepo = this.manager.getRepository(UserEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      this.beforeItem = await userRepo.findOne({
        where: { id: this.input.id },
        relations: {
          string: { property: true },
          flag: { flag: true },
        },
      });

      this.beforeItem.login = this.input.login;
      await this.beforeItem.save();

      await new PropertyUpdateOperation(trans, User2stringEntity).save(this.beforeItem, this.input);
    });

    return userRepo.findOne({
      where: { id: this.input.id },
      loadRelationIds: true,
    });
  }

}