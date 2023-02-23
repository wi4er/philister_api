import { EntityManager } from 'typeorm';
import { DirectoryEntity } from '../model/directory.entity';
import { ValueEntity } from '../model/value.entity';
import { DirectoryInputSchema } from '../schema/directory-input.schema';

export class ValueInsertOperation {

  constructor(
    private trans: EntityManager,
  ) {
  }

  async save(created: DirectoryEntity, input: DirectoryInputSchema) {
    for (const item of input.value ?? []) {
      const inst = new ValueEntity();
      inst.id = item;
      inst.directory = created;

      await this.trans.save(inst);
    }
  }

}