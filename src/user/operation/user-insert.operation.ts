import { EntityManager } from "typeorm";
import { UserInputSchema } from "../schema/user-input.schema";
import { UserEntity } from "../model/user.entity";
import { User2stringEntity } from "../model/user2string.entity";
import { InsertOperation } from "../../common/operation/insert-operation";
import { User2flagEntity } from "../model/user2flag.entity";

export class UserInsertOperation extends InsertOperation<UserEntity> {

  created: UserEntity;
  manager: EntityManager;

  constructor(
    protected input: UserInputSchema
  ) {
    super();

    this.created = new UserEntity();
    this.created.id = input.id;
    this.created.login = input.login;
  }

  async save(manager: EntityManager): Promise<UserEntity> {
    this.manager = manager;
    const userRepo = this.manager.getRepository(UserEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      await trans.save(this.created);

      await this.addString(trans, User2stringEntity);
      await this.addFlag(trans, User2flagEntity);
    });

    return userRepo.findOne({
      where: { id: this.input.id },
      loadRelationIds: true,
    });
  }

}