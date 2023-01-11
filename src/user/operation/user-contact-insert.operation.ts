import { EntityManager } from "typeorm";
import { UserContactEntity } from "../model/user-contact.entity";
import { UserContact2stringEntity } from "../model/user-contact2string.entity";
import { UserContactInputSchema } from "../schema/user-contact/user-contact-input.schema";
import { UserContact2flagEntity } from "../model/user-contact2flag.entity";
import { PropertyInsertOperation } from "../../common/operation/property-insert.operation";
import { FlagInsertOperation } from "../../common/operation/flag-insert.operation";

export class UserContactInsertOperation {

  created: UserContactEntity;

  protected manager: EntityManager;

  constructor(
    protected input: UserContactInputSchema
  ) {
    this.created = new UserContactEntity();
    this.created.id = this.input.id;
    this.created.type = this.input.type;
  }

  async save(manager: EntityManager): Promise<UserContactEntity> {
    this.manager = manager;
    const contactRepo = this.manager.getRepository(UserContactEntity);

    await this.manager.transaction(async (trans: EntityManager) => {
      await trans.save(this.created);

      await new PropertyInsertOperation(trans, UserContact2stringEntity).save(this.created, this.input);
      await new FlagInsertOperation(trans, UserContact2flagEntity).save(this.created, this.input);
    });

    return contactRepo.findOne({
      where: { id: this.created.id },
      loadRelationIds: true,
    });
  }

}