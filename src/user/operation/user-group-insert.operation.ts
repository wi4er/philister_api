import { EntityManager } from "typeorm";
import { PropertyEntity } from "../../property/model/property.entity";
import { UserContactEntity } from "../model/user-contact.entity";
import { UserContact2stringEntity } from "../model/user-contact2string.entity";
import { UserContactInputSchema } from "../schema/user-contact/user-contact-input.schema";
import { FlagEntity } from "../../flag/model/flag.entity";
import { LangFlagEntity } from "../../lang/model/lang-flag.entity";
import { UserContact2flagEntity } from "../model/user-contact2flag.entity";
import { UserGroupEntity } from "../model/user-group.entity";
import { UserGroupInputSchema } from "../schema/user-group/user-group-input.schema";
import { UserGroup2stringEntity } from "../model/user-group2string.entity";
import { UserGroup2flagEntity } from "../model/user-group2flag.entity";
import { InsertOperation } from "../../common/operation/insert-operation";

export class UserGroupInsertOperation extends InsertOperation<UserGroupEntity> {

  created: UserGroupEntity;

  constructor(
    protected input: UserGroupInputSchema
  ) {
    super();

    this.created = new UserGroupEntity();
    this.created.id = this.input.id;
  }

  async save(manager: EntityManager): Promise<UserGroupEntity> {
    this.manager = manager;
    const groupRepo = this.manager.getRepository(UserGroupEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      await trans.save(this.created);

      await this.addString(trans, UserGroup2stringEntity);
      await this.addFlag(trans, UserGroup2flagEntity);
    });

    return groupRepo.findOne({
      where: { id: this.created.id },
      loadRelationIds: true,
    });
  }

}