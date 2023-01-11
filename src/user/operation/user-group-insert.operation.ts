import { EntityManager } from "typeorm";
import { UserGroupEntity } from "../model/user-group.entity";
import { UserGroupInputSchema } from "../schema/user-group/user-group-input.schema";
import { UserGroup2stringEntity } from "../model/user-group2string.entity";
import { UserGroup2flagEntity } from "../model/user-group2flag.entity";
import { PropertyInsertOperation } from "../../common/operation/property-insert.operation";
import { FlagInsertOperation } from "../../common/operation/flag-insert.operation";

export class UserGroupInsertOperation {

  created: UserGroupEntity;

  protected manager: EntityManager;

  constructor(
    protected input: UserGroupInputSchema
  ) {
    this.created = new UserGroupEntity();
    this.created.id = this.input.id;
  }

  async save(manager: EntityManager): Promise<UserGroupEntity> {
    this.manager = manager;
    const groupRepo = this.manager.getRepository(UserGroupEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      await trans.save(this.created);

      await new PropertyInsertOperation(trans, UserGroup2stringEntity).save(this.created, this.input);
      await new FlagInsertOperation(trans, UserGroup2flagEntity).save(this.created, this.input);
    });

    return groupRepo.findOne({
      where: { id: this.created.id },
      loadRelationIds: true,
    });
  }

}