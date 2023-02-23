import { EntityManager } from 'typeorm';
import { DirectoryEntity } from '../model/directory.entity';
import { DirectoryInputSchema } from '../schema/directory-input.schema';
import { ValueEntity } from '../model/value.entity';

export class ValueUpdateOperation {

  constructor(
    private manager: EntityManager,
  ) {
  }

  async save(beforeItem: DirectoryEntity, input: DirectoryInputSchema) {
    const current: Array<string> = beforeItem.value.map(it => it.id);

    for (const item of input.value ?? []) {
      if (current.includes(item)) {
        current.splice(current.indexOf(item), 1);
      } else {
        const inst = new ValueEntity();
        inst.id = item;
        inst.directory = beforeItem;

        await this.manager.save(inst);
      }
    }

    for (const item of current) {
      await this.manager.delete(ValueEntity, { id: item });
    }
  }

}