import { EntityManager } from "typeorm";
import { UserInputSchema } from "../schema/user-input.schema";
import { UserEntity } from "../model/user.entity";
import { User2stringEntity } from "../model/user2string.entity";
import { User2flagEntity } from "../model/user2flag.entity";
import { PropertyInsertOperation } from "../../common/operation/property-insert.operation";
import { FlagInsertOperation } from "../../common/operation/flag-insert.operation";
import { User2userContactInsertOperation } from "./user2user-contact-insert.operation";

export class UserInsertOperation {

  created: UserEntity;
  protected manager: EntityManager;

  constructor(
    protected input: UserInputSchema,
  ) {
    this.created = new UserEntity();
    this.created.login = input.login;
  }

  async save(manager: EntityManager): Promise<UserEntity> {
    this.manager = manager;
    const userRepo = this.manager.getRepository(UserEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      await trans.save(this.created);

      await new PropertyInsertOperation(trans, User2stringEntity).save(this.created, this.input);
      await new FlagInsertOperation(trans, User2flagEntity).save(this.created, this.input);
      await new User2userContactInsertOperation(trans).save(this.created, this.input);
    });

    return userRepo.findOne({
      where: { id: this.created.id },
      loadRelationIds: true,
    });
  }

}