import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { BlockEntity } from "./block.entity";
import { ElementEntity } from "./element.entity";
import { PropertyEntity } from "../../property/model/property.entity";
import { Element2elementEntity } from "./element2element.entity";

describe("ElementElement entity", () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));
  afterAll(() => source.destroy());
  
  describe('ElementElement fields', () => {
    test("Should create element value", async () => {
      const block = await new BlockEntity().save();
      const parent = await Object.assign(new ElementEntity(), { block }).save();
      const property = await Object.assign(new PropertyEntity(), { id: 'CURRENT' }).save();
      const element = await Object.assign(new ElementEntity(), { block }).save();

      const inst = await Object.assign(new Element2elementEntity(), { parent, property, element }).save();

      expect(inst.id).toBe(1);
    });

    test('Should get empty list', async () => {
      const repo = source.getRepository(Element2elementEntity);
      const list = await repo.find();

      expect(list).toHaveLength(0);
    });
  });
});