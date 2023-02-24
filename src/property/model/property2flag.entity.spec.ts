import { DataSource } from 'typeorm/data-source/DataSource';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../createConnectionOptions';
import { PropertyEntity } from './property.entity';
import { FlagEntity } from '../../flag/model/flag.entity';
import { Property2flagEntity } from './property2flag.entity';

let source: DataSource;

beforeAll(async () => {
  source = await createConnection(createConnectionOptions());
});

beforeEach(() => source.synchronize(true));
afterAll(() => source.destroy());

describe('Property2flag entity', () => {
  describe('Property with flag', () => {
    test('Should create property with flag', async () => {
      const propRepo = source.getRepository(PropertyEntity);

      const flag = await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();
      const parent = await Object.assign(new PropertyEntity(), { id: 'VALUE' }).save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      await Object.assign(new Property2flagEntity(), { parent, flag, property }).save();

      const inst = await propRepo.findOne({
        where: { id: 'VALUE' },
        relations: { flag: { flag: true } },
      });

      expect(inst.flag).toHaveLength(1);
      expect(inst.flag[0].flag.id).toBe('ACTIVE');
    });
  });
});