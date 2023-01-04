import { Test } from '@nestjs/testing';
import { UserGroupResolver } from './user-group.resolver';
import { AppModule } from "../../../app.module";
import { createConnection } from "typeorm";
import { UserEntity } from "../../model/user.entity";
import { User2stringEntity } from "../../model/user2string.entity";
import { PropertyEntity } from "../../../property/model/property.entity";
import { gql } from "apollo-server-express";
import request from "supertest-graphql";
import { createConnectionOptions } from "../../../createConnectionOptions";



describe('UserGroupResolver', () => {
  let source;
  let app;

  beforeAll(async () => {
    const moduleBuilder = await Test.createTestingModule({ imports: [ AppModule ] }).compile();
    app = moduleBuilder.createNestApplication();
    app.init()

    source = await createConnection(createConnectionOptions());
  });

  beforeEach(() => source.synchronize(true));

  it('Should get with list of properties', async () => {
  });
});
