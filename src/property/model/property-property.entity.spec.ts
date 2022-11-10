import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { PropertyEntity } from "./property.entity";
import { PropertyPropertyEntity } from "./property-property.entity";
import { createConnectionOptions } from "../../createConnectionOptions";

describe('Property property entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  describe('Property property', () => {
    test('Should create property property', async () => {
      const value = new PropertyEntity();
      value.id = 'VALUE';

      const inst = await value.save();
      expect(inst.id).toBe('VALUE');
    });

    test('Should get property property', async () => {
      const repo = source.getRepository(PropertyEntity);
      await Object.assign(new PropertyEntity(), { id: 'VALUE' }).save();

      const inst = await repo.findOne({ where: { id: 'VALUE' } });
      expect(inst.id).toBe('VALUE');
    });

    test('Should add property with property', async () => {
      const name = await Object.assign(new PropertyEntity(), { id: 'VALUE' }).save();
      const prop = await Object.assign(new PropertyEntity(), {
        id: 'PROPERTY',
        property: [
          await Object.assign(new PropertyPropertyEntity(), { value: 'VALUE', property: name }).save()
        ]
      }).save();

      expect(prop.property).toHaveLength(1);
      expect(prop.property[0].value).toBe('VALUE');
    });

    test('Should add property with property id', async () => {
      const repo = source.getRepository(PropertyEntity);

      await Object.assign(new PropertyEntity(), { id: 'VALUE' }).save();
      await Object.assign(new PropertyEntity(), {
        id: 'PROPERTY',
        property: [
          await Object.assign(new PropertyPropertyEntity(), { value: 'VALUE', property: 'VALUE' }).save()
        ]
      }).save();

      const item = await repo.findOne({where: {id: 'PROPERTY'}, relations: {property: true}});

      expect(item.property[0].value).toBe('VALUE');
    });
  });
});