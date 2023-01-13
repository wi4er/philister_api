import { EntityManager } from "typeorm";
import { UserGroupEntity } from "../model/user-group.entity";
import { UserGroupInputSchema } from "../schema/user-group/user-group-input.schema";
import { UserGroup2stringEntity } from "../model/user-group2string.entity";
import { UserGroup2flagEntity } from "../model/user-group2flag.entity";
import { PropertyInsertOperation } from "../../common/operation/property-insert.operation";
import { FlagInsertOperation } from "../../common/operation/flag-insert.operation";

export class UserGroupInsertOperation {

  created: UserGroupEntity;

  constructor(
    private manager: EntityManager,
  ) {
    this.created = new UserGroupEntity();
  }

  async save(input: UserGroupInputSchema): Promise<UserGroupEntity> {
    const groupRepo = this.manager.getRepository(UserGroupEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      this.created.parent = await groupRepo.findOne({ where: { id: input.parent } });
      this.created.id = input.id;

      await trans.save(this.created);

      await new PropertyInsertOperation(trans, UserGroup2stringEntity).save(this.created, input);
      await new FlagInsertOperation(trans, UserGroup2flagEntity).save(this.created, input);
    });

    return groupRepo.findOne({
      where: { id: this.created.id },
      loadRelationIds: true,
    });
  }

}