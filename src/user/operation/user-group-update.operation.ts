import { EntityManager } from "typeorm";
import { UserGroupEntity } from "../model/user-group.entity";
import { UserGroupInputSchema } from "../schema/user-group/user-group-input.schema";
import { UserGroup2stringEntity } from "../model/user-group2string.entity";
import { UserGroup2flagEntity } from "../model/user-group2flag.entity";
import { PropertyUpdateOperation } from "../../common/operation/property-update.operation";
import { FlagUpdateOperation } from "../../common/operation/flag-update.operation";

export class UserGroupUpdateOperation {

  beforeItem: UserGroupEntity;

  manager: EntityManager;

  constructor(
    protected input: UserGroupInputSchema,
  ) {

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

      await new PropertyUpdateOperation(trans, UserGroup2stringEntity).save(this.beforeItem, this.input);
      await new FlagUpdateOperation(trans, UserGroup2flagEntity).save(this.beforeItem, this.input);

      await this.beforeItem.save();
    });

    return langRepo.findOne({
      where: { id: this.input.id },
      loadRelationIds: true,
    });
  }

}