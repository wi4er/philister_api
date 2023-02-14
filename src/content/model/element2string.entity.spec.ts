import { DataSource } from 'typeorm/data-source/DataSource';
import { createConnection } from 'typeorm';
import { createConnectionOptions } from '../../createConnectionOptions';
import { ElementEntity } from './element.entity';
import { Element2stringEntity } from './element2string.entity';
import { PropertyEntity } from '../../property/model/property.entity';
import { BlockEntity } from './block.entity';

describe('ElementString entity', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());

  describe('ElementString fields', () => {
    test('Should get empty list', async () => {
      const repo = source.getRepository(Element2stringEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });

    test('Shouldn`t create without parent', async () => {
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();

      await expect(
        Object.assign(new Element2stringEntity(), { string: 'VALUE', property }).save(),
      ).rejects.toThrow();
    });

    test('Shouldn`t create without property', async () => {
      const block = await new BlockEntity().save();
      const parent = await Object.assign(new ElementEntity(), { block }).save();

      await expect(
        Object.assign(new Element2stringEntity(), { string: 'VALUE', parent }).save(),
      ).rejects.toThrow();
    });
  });

  describe('Element with strings', () => {
    test('Should create element with strings', async () => {
      const repo = source.getRepository(ElementEntity);

      const block = await new BlockEntity().save();
      const property = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const parent = await Object.assign(new ElementEntity(), { block }).save();

      await Object.assign(new Element2stringEntity(), { string: 'VALUE', parent, property }).save();

      const inst = await repo.findOne({
        where: { id: parent.id },
        relations: { string: true },
      });

      expect(inst.string).toHaveLength(1);
      expect(inst.string[0].string).toBe('VALUE');
    });

    test('Should find with string sort', async () => {
      const block = await new BlockEntity().save();
      const name = await Object.assign(new PropertyEntity(), { id: 'NAME' }).save();
      const gender = await Object.assign(new PropertyEntity(), { id: 'GENDER' }).save();

      for (let i = 0; i < 10; i++) {
        const parent = await Object.assign(new ElementEntity, { block }).save();
        await Object.assign(
          new Element2stringEntity(),
          { parent, property: name, string: `VALUE_${(Math.random()*10>>0).toString().padStart(2, '0')}` }
        ).save();
        await Object.assign(
          new Element2stringEntity(),
          { parent, property: gender, string: `GENDER_${i.toString().padStart(2, '0')}` }
        ).save();
      }

      const query = source.createQueryBuilder();


      query.select('*');
      query.from(ElementEntity, 'ce');
      query.orderBy()

      const res = await query.getRawMany();

      console.log(res);


    });
  });
});