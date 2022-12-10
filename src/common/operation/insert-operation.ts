import { EntityManager } from "typeorm";
import { PropertyEntity } from "../../property/model/property.entity";
import { LangEntity } from "../../lang/model/lang.entity";
import { DirectoryStringEntity } from "../../directory/model/directory-string.entity";
import { DirectoryEntity } from "../../directory/model/directory.entity";
import { DirectoryInputSchema } from "../../directory/schema/directory-input.schema";

export abstract class InsertOperation<T> {

  created: T;
  manager: EntityManager;

  private operations: (trans: EntityManager) => void;

  protected constructor(
    private item: DirectoryInputSchema
  ) {

  }

  setInst(created: T) {
    this.created = created;
  }

  setProperty() {
    return this;
  }

  async addProperty(trans: EntityManager) {

  }

}