import { EntityManager } from "typeorm";
import { UserContactEntity } from "../model/user-contact.entity";
import { UserContact2stringEntity } from "../model/user-contact2string.entity";
import { UserContactInputSchema } from "../schema/user-contact/user-contact-input.schema";
import { UserContact2flagEntity } from "../model/user-contact2flag.entity";
import { InsertOperation } from "../../common/operation/insert-operation";

export class UserContactInsertOperation  extends InsertOperation<UserContactEntity>{

  created: UserContactEntity;

  constructor(
    protected input: UserContactInputSchema
  ) {
    super();

    this.created = new UserContactEntity();
    this.created.id = this.input.id;
    this.created.type = this.input.type;
  }

  async save(manager: EntityManager): Promise<UserContactEntity> {
    this.manager = manager;
    const contactRepo = this.manager.getRepository(UserContactEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      await trans.save(this.created);

      await this.addString(trans, UserContact2stringEntity);
      await this.addFlag(trans, UserContact2flagEntity);
    });

    return contactRepo.findOne({
      where: { id: this.input.id },
      loadRelationIds: true,
    });
  }

}