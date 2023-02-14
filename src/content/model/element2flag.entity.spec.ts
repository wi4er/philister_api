import { DataSource } from 'typeorm/data-source/DataSource';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../createConnectionOptions';
import { Element2flagEntity } from './element2flag.entity';
import { ElementEntity } from './element.entity';
import { BlockEntity } from './block.entity';
import { FlagEntity } from '../../flag/model/flag.entity';

describe('Element2Flag entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('Element flag fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(Element2flagEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });
  });

  describe('Element with flags', () => {
    test('Should create element with flag', async () => {
      const repo = source.getRepository(ElementEntity);

      const block = await new BlockEntity().save();
      const parent = await Object.assign(new ElementEntity(), { block }).save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      await Object.assign(new Element2flagEntity(), { flag, parent }).save();

      const inst = await repo.findOne({ where: { id: 1 }, relations: { flag: { flag: true } } });

      expect(inst.flag).toHaveLength(1);
      expect(inst.flag[0].flag.id).toBe('ACTIVE');
    });
  });
});