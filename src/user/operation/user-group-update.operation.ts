import { EntityManager } from "typeorm";
import { UserGroupEntity } from "../model/user-group.entity";
import { UserGroupInputSchema } from "../schema/user-group/user-group-input.schema";
import { UserGroup2stringEntity } from "../model/user-group2string.entity";
import { UserGroup2flagEntity } from "../model/user-group2flag.entity";
import { UpdateOperation } from "../../common/operation/update-operation";

export class UserGroupUpdateOperation extends UpdateOperation<UserGroupEntity> {

  beforeItem: UserGroupEntity;

  manager: EntityManager;

  constructor(
    protected input: UserGroupInputSchema,
  ) {
    super();
  }

  async save(manager: EntityManager): Promise<UserGroupEntity> {
    this.manager = manager;
    const langRepo = this.manager.getRepository(UserGroupEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      this.beforeItem = await langRepo.findOne({
        where: { id: this.input.id },
        relations: {
          string: { property: true },
          flag: {flag: true},
        },
      });

      await this.addString(trans, UserGroup2stringEntity);
      await this.addFlag(trans, UserGroup2flagEntity);

      await this.beforeItem.save();
    });

    return langRepo.findOne({
      where: { id: this.input.id },
      loadRelationIds: true,
    });
  }

}