import { EntityManager, In } from 'typeorm';
import { ElementEntity } from '../model/element.entity';

export class ElementDeleteOperation {

  constructor(
    private manager: EntityManager,
  ) {
  }

  async save(id: number[]) {
    const elementRepo = this.manager.getRepository(ElementEntity);

    const result = [];
    const list = await elementRepo.find({ where: { id: In(id) } });

    for (const item of list) {
      await elementRepo.delete(item.id);
      result.push(item.id);
    }

    return result;
  }

}