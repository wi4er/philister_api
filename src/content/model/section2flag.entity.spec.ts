import { DataSource } from 'typeorm/data-source/DataSource';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../createConnectionOptions';
import { Section2flagEntity } from './section2flag.entity';
import { BlockEntity } from './block.entity';
import { SectionEntity } from './section.entity';
import { FlagEntity } from '../../flag/model/flag.entity';

describe('Section2Flag entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('Section flag fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(Section2flagEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });

    test('Should get list', async () => {
      const block = await new BlockEntity().save();
      const parent = await Object.assign(new SectionEntity(), { block }).save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      await Object.assign(new Section2flagEntity(), { parent, flag }).save();

      const repo = source.getRepository(Section2flagEntity);
      const list = await repo.find();

      expect(list).toHaveLength(1);
      expect(list[0].id).toBe(1);
    });
  });

  describe('Section with flags', () => {
    test('Shouldn`t have duplicate flag', async () => {
      const block = await new BlockEntity().save();
      const parent = await Object.assign(new SectionEntity(), { block }).save();
      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

      await Object.assign(new Section2flagEntity(), { parent, flag }).save();
      await expect(
        Object.assign(new Section2flagEntity(), { parent, flag }).save()
      ).rejects.toThrow();
    });
  });
});