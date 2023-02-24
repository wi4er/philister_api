import { DataSource } from 'typeorm/data-source/DataSource';
import { createConnection } from 'typeorm';
import { PropertyEntity } from './property.entity';
import { Property2stringEntity } from './property2string.entity';
import { createConnectionOptions } from '../../createConnectionOptions';

describe('Property property entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('Property entity', () => {
    test('Should create property property', async () => {
      const value = new PropertyEntity();
      value.id = 'VALUE';

      const inst = await value.save();
      expect(inst.id).toBe('VALUE');
    });

    test('Should get property string', async () => {
      const repo = source.getRepository(PropertyEntity);
      await Object.assign(new PropertyEntity(), { id: 'VALUE' }).save();

      const inst = await repo.findOne({ where: { id: 'VALUE' } });
      expect(inst.id).toBe('VALUE');
    });

    test('Should add property with string', async () => {
      const repo = source.getRepository(PropertyEntity);

      const property = await Object.assign(new PropertyEntity(), { id: 'VALUE' }).save();
      const parent = await Object.assign(new PropertyEntity(), { id: 'PROPERTY' }).save();
      await Object.assign(new Property2stringEntity(), { string: 'VALUE', property, parent }).save();

      const item = await repo.findOne({ where: { id: 'PROPERTY' }, relations: { string: true } });

      expect(item.string[0].string).toBe('VALUE');
    });

    test('Should add property with property id', async () => {
      const repo = source.getRepository(PropertyEntity);

      await Object.assign(new PropertyEntity(), { id: 'VALUE' }).save();
      await Object.assign(new PropertyEntity(), { id: 'PROPERTY' }).save();
      await Object.assign(new Property2stringEntity(), { string: 'VALUE', property: 'VALUE', parent: 'PROPERTY' }).save();

      const item = await repo.findOne({ where: { id: 'PROPERTY' }, relations: { string: true } });

      expect(item.string[0].string).toBe('VALUE');
    });
  });
});