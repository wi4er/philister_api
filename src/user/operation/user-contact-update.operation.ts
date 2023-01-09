import { EntityManager } from "typeorm";
import { PropertyEntity } from "../../property/model/property.entity";
import { User2stringEntity } from "../model/user2string.entity";
import { UserContactEntity } from "../model/user-contact.entity";
import { UserContact2stringEntity } from "../model/user-contact2string.entity";
import { UserContactInputSchema } from "../schema/user-contact/user-contact-input.schema";
import { FlagEntity } from "../../flag/model/flag.entity";
import { LangFlagEntity } from "../../lang/model/lang-flag.entity";
import { UserContact2flagEntity } from "../model/user-contact2flag.entity";
import { UpdateOperation } from "../../common/operation/update-operation";

export class UserContactUpdateOperation extends UpdateOperation<UserContactEntity>{

  beforeItem: UserContactEntity;

  manager: EntityManager;

  constructor(
    protected input: UserContactInputSchema,
  ) {
    super();
  }

  async save(manager: EntityManager): Promise<UserContactEntity> {
    this.manager = manager;
    const langRepo = this.manager.getRepository(UserContactEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      this.beforeItem = await langRepo.findOne({
        where: { id: this.input.id },
        relations: {
          string: { property: true },
          flag: {flag: true},
        },
      });

      this.beforeItem.type = this.input.type;
      await this.addString(trans, UserContact2stringEntity);
      await this.addFlag(trans, UserContact2flagEntity);

      await this.beforeItem.save();
    });

    return langRepo.findOne({
      where: { id: this.input.id },
      loadRelationIds: true,
    });
  }

}