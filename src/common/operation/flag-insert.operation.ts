import { BaseEntity, EntityManager } from 'typeorm';
import { CommonFlagEntity } from '../model/common-flag.entity';
import { FlagEntity } from '../../flag/model/flag.entity';
import { WithFlagInputSchema } from '../schema/with-flag.input.schema';

export class FlagInsertOperation<T extends BaseEntity> {

  constructor(
    private trans: EntityManager,
    private entity: new() => CommonFlagEntity<T>,
  ) {
  }

  async save(created: T, input: WithFlagInputSchema) {
    const flagRepo = this.trans.getRepository(FlagEntity);

    for (const item of input.flag ?? []) {
      const inst = new this.entity();
      inst.parent = created;
      inst.flag = await flagRepo.findOne({ where: { id: item } });

      await this.trans.save(inst);
    }
  }

}