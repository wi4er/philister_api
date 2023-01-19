import { DataSource } from "typeorm/data-source/DataSource";
import { createConnection } from "typeorm";
import { createConnectionOptions } from "../../createConnectionOptions";
import { UserGroupInsertOperation } from "./user-group-insert.operation";
import { FlagEntity } from "../../flag/model/flag.entity";
import { UserGroupEntity } from "../model/user-group.entity";

describe('UserGroup insert operation', () => {
  let source: DataSource;

  beforeAll(async () => {
    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  test('Should insert', async () => {
    const operation = new UserGroupInsertOperation(source.manager)

    const inst = await operation.save({
      parent: null,
      flag: [],
      property: [],
    });

    expect(inst.id).toBe(1);
    expect(inst.parent).toBe(null);
    expect(inst.flag).toEqual([]);
    expect(inst.string).toEqual([]);
    expect(inst.user).toEqual([]);
  });

  test('Should insert with flag', async () => {
    await Object.assign(new FlagEntity(), { id: 'ACTIVE' }).save();

    const operation = new UserGroupInsertOperation(source.manager)

    const inst = await operation.save({
      parent: null,
      flag: [ 'ACTIVE' ],
      property: [],
    });

    expect(inst.flag).toEqual([ 1 ]);
  });

  test('Should insert with parent', async () => {
    await new UserGroupEntity().save();

    const operation = new UserGroupInsertOperation(source.manager)

    const inst = await operation.save({
      parent: 1,
      flag: [],
      property: [],
    });

    expect(inst.parent).toBe(1);
  });
});